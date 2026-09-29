import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import {
  db,
  hashPassword,
  verifyPassword,
  UserRecord,
  SessionRecord,
  OrderRecord,
  PaymentRecord,
  WalletRecord,
  LedgerRecord,
  ReceiptRecord,
  ENFRole,
} from './db';

export const apiRouter = express.Router();

// Helper: Extract session from Bearer token
function getAuthenticatedSession(req: Request): SessionRecord | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const session = db.sessions.find((s) => s.token === token);
  if (!session) return null;

  // Check expiration
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    // Delete expired session
    const idx = db.sessions.findIndex((s) => s.token === token);
    if (idx >= 0) db.sessions.splice(idx, 1);
    db.save();
    return null;
  }

  return session;
}

// Middleware: Require authenticated user
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const session = getAuthenticatedSession(req);
  if (!session) {
    res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
    return;
  }
  (req as any).session = session;
  (req as any).user = db.users.find((u) => u.id === session.userId);
  next();
}

// Middleware: Require specific roles
function requireRole(allowedRoles: ENFRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const session = getAuthenticatedSession(req);
    if (!session) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }
    if (!allowedRoles.includes(session.role)) {
      res.status(403).json({
        success: false,
        message: `Access denied. Role '${session.role}' is not authorized for this administrative operation.`,
      });
      return;
    }
    (req as any).session = session;
    (req as any).user = db.users.find((u) => u.id === session.userId);
    next();
  };
}

// Helper: Determine next account state
function computeAccountState(user: UserRecord): {
  state:
    | 'EMAIL_VERIFICATION_REQUIRED'
    | 'PROFILE_INCOMPLETE'
    | 'NO_ORDER'
    | 'PAYMENT_PENDING'
    | 'PAYMENT_SUBMITTED'
    | 'PAYMENT_CONFIRMED'
    | 'ENF_ACTIVE';
  targetRoute: string;
} {
  if (!user.emailVerified) {
    return { state: 'EMAIL_VERIFICATION_REQUIRED', targetRoute: '/enf/verify-email' };
  }

  const profile = db.profiles[user.id];
  if (!profile || !profile.onboardingCompleted) {
    // If not completed, route to profile
    return { state: 'PROFILE_INCOMPLETE', targetRoute: '/enf/profile' };
  }

  const userOrders = db.orders.filter((o) => o.customerId === user.id);
  if (userOrders.length === 0) {
    return { state: 'NO_ORDER', targetRoute: '/enf/plans' };
  }

  const activeOrder = userOrders[0];
  if (activeOrder.status === 'PENDING_PAYMENT') {
    return { state: 'PAYMENT_PENDING', targetRoute: `/enf/payment?orderId=${activeOrder.id}` };
  }
  if (activeOrder.status === 'PAYMENT_SUBMITTED' || activeOrder.status === 'UNDER_REVIEW') {
    return { state: 'PAYMENT_SUBMITTED', targetRoute: '/enf/dashboard' };
  }
  if (activeOrder.status === 'PAID' || activeOrder.status === 'ACTIVATED') {
    return { state: 'ENF_ACTIVE', targetRoute: '/enf/dashboard' };
  }

  return { state: 'ENF_ACTIVE', targetRoute: '/enf/dashboard' };
}

// Helper: Sanitize user record (omit password and salt)
function sanitizeUser(user: UserRecord) {
  const { passwordHash, salt, ...safe } = user;
  return safe;
}

// Helper: Log audit trail
function logAudit(
  actorId: string,
  actorEmail: string,
  actorRole: string,
  action: string,
  targetType: string,
  targetId: string,
  details?: Record<string, unknown>,
  ipAddress = '127.0.0.1'
) {
  db.auditLogs.unshift({
    id: `AUDIT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    actorId,
    actorEmail,
    actorRole,
    action,
    targetType,
    targetId,
    details,
    ipAddress,
    timestamp: new Date().toISOString(),
  });
  db.save();
}

// ==========================================
// 1. AUTHENTICATION ENDPOINTS
// ==========================================

// Register
apiRouter.post('/auth/register', (req, res) => {
  const { fullName, email, mobileNumber, phone, password, confirmPassword, organization, professionalInfo, termsAccepted } =
    req.body;

  if (!fullName || !email || !password) {
    res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    return;
  }

  if (termsAccepted !== true && termsAccepted !== 'true') {
    res.status(400).json({ success: false, message: 'You must accept the JuriMbrella Terms of Service and Privacy Policy.' });
    return;
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400).json({ success: false, message: 'Passwords do not match.' });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existing = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    return;
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const userId = `usr-enf-${Date.now().toString(36)}-${Math.floor(1000 + Math.random() * 9000)}`;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser: UserRecord = {
    id: userId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: (mobileNumber || phone || '').trim(),
    passwordHash,
    salt,
    role: 'ENF_OWNER',
    organization: (organization || '').trim(),
    professionalInfo: (professionalInfo || '').trim(),
    emailVerified: false,
    verificationCode,
    accountStatus: 'PENDING_EMAIL_VERIFICATION',
    twoFactorEnabled: false,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Initialize customer profile
  db.profiles[userId] = {
    id: `prof-${userId}`,
    userId,
    fullName: newUser.fullName,
    email: newUser.email,
    phone: newUser.phone,
    organizationName: newUser.organization,
    officeName: newUser.organization || `${newUser.fullName} Law Office`,
    professionalInfo: newUser.professionalInfo,
    onboardingStep: 1,
    onboardingCompleted: false,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  logAudit(userId, newUser.email, 'ENF_OWNER', 'SIGN_UP', 'USER', userId, {
    email: newUser.email,
    status: 'PENDING_EMAIL_VERIFICATION',
  });

  db.save();

  res.status(201).json({
    success: true,
    message: 'Account created successfully. Please verify your email to continue.',
    userId,
    email: newUser.email,
    verificationCode, // For testing & verification entry
    emailProviderStatus: (process.env.SMTP_HOST || process.env.EMAIL_API_KEY) ? 'CONFIGURED' : 'EMAIL PROVIDER NOT CONFIGURED',
    deploymentNotice:
      'EMAIL PROVIDER NOT CONFIGURED: Live email dispatch requires SMTP/SendGrid credentials configured in production environment variables. Use the generated 6-digit verification code to complete verification.',
  });
});

// First Administrator Provisioning (Section 14)
apiRouter.post('/auth/setup-admin', (req, res) => {
  const { fullName, email, password, confirmPassword, adminSetupToken } = req.body;

  if (!fullName || !email || !password) {
    res.status(400).json({ success: false, message: 'Full name, email, and password are required.' });
    return;
  }

  if (confirmPassword && password !== confirmPassword) {
    res.status(400).json({ success: false, message: 'Passwords do not match.' });
    return;
  }

  if (password.length < 10) {
    res.status(400).json({ success: false, message: 'Administrator password must be at least 10 characters long.' });
    return;
  }

  const existingSuperAdmins = db.users.filter((u) => u.role === 'SUPER_ADMIN');
  const expectedToken = process.env.ADMIN_SETUP_TOKEN || 'JURIMBRELLA_PROVISION_2026';

  if (existingSuperAdmins.length > 0 && adminSetupToken !== expectedToken) {
    res.status(403).json({
      success: false,
      message: 'Master administrator setup token required to provision additional administrative accounts.',
    });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);

  if (existingUser) {
    existingUser.role = 'SUPER_ADMIN';
    existingUser.passwordHash = passwordHash;
    existingUser.salt = salt;
    existingUser.emailVerified = true;
    existingUser.accountStatus = 'ACTIVE';
    db.invalidateUserSessions(existingUser.id);
    db.save();

    logAudit(existingUser.id, existingUser.email, 'SUPER_ADMIN', 'PROVISION_ADMIN', 'USER', existingUser.id, {
      type: 'ELEVATE_EXISTING_USER',
    });

    res.json({
      success: true,
      message: 'Administrator account provisioned successfully. You may now sign in with your new credentials.',
      email: existingUser.email,
    });
    return;
  }

  const adminId = `usr-admin-${Date.now().toString(36)}`;
  const newAdmin: UserRecord = {
    id: adminId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: '+63 2 8892 4820',
    passwordHash,
    salt,
    role: 'SUPER_ADMIN',
    organization: 'JuriMbrella Platform Operations',
    professionalInfo: 'Supreme Court Certified ENF Administrator',
    emailVerified: true,
    accountStatus: 'ACTIVE',
    twoFactorEnabled: true,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newAdmin);
  logAudit(adminId, newAdmin.email, 'SUPER_ADMIN', 'PROVISION_ADMIN', 'USER', adminId, {
    type: 'FIRST_ADMIN_SETUP',
  });
  db.save();

  res.status(201).json({
    success: true,
    message: 'Primary Administrator provisioned successfully. You may now sign in.',
    email: newAdmin.email,
  });
});

// Verify Email
apiRouter.post('/auth/verify-email', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    return;
  }

  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!user) {
    res.status(404).json({ success: false, message: 'User account not found.' });
    return;
  }

  if (user.emailVerified) {
    res.json({ success: true, message: 'Email has already been verified. You may proceed to sign in.' });
    return;
  }

  if (user.verificationCode !== code.trim()) {
    res.status(400).json({ success: false, message: 'Invalid verification code. Please check and try again.' });
    return;
  }

  user.emailVerified = true;
  user.accountStatus = 'ACTIVE';
  user.verificationCode = undefined;

  if (db.profiles[user.id]) {
    db.profiles[user.id].emailVerified = true;
    db.profiles[user.id].updatedAt = new Date().toISOString();
  }

  // Create session
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 86400000).toISOString(); // 24 hours

  const session: SessionRecord = {
    token,
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    createdAt: new Date().toISOString(),
    expiresAt,
  };
  db.sessions.push(session);

  logAudit(user.id, user.email, user.role, 'EMAIL_VERIFIED', 'USER', user.id);
  db.save();

  res.json({
    success: true,
    message: 'Email verified successfully.',
    session: {
      token,
      user: sanitizeUser(user),
      expiresAt,
    },
    nextRoute: '/enf/profile',
  });
});

// Sign In
apiRouter.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = db.users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  const isValid = verifyPassword(password, user.salt, user.passwordHash);
  if (!isValid) {
    logAudit(user.id, user.email, user.role, 'FAILED_LOGIN_ATTEMPT', 'USER', user.id);
    res.status(401).json({ success: false, message: 'Invalid email or password.' });
    return;
  }

  if (user.accountStatus === 'SUSPENDED') {
    res.status(403).json({ success: false, message: 'This account has been administratively suspended. Please contact support.' });
    return;
  }

  // Generate session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 86400000).toISOString(); // 24 hours

  const session: SessionRecord = {
    token,
    userId: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    createdAt: new Date().toISOString(),
    expiresAt,
  };

  db.sessions.push(session);
  user.lastLoginAt = new Date().toISOString();

  const accountState = computeAccountState(user);

  logAudit(user.id, user.email, user.role, 'USER_LOGIN', 'SESSION', session.token);
  db.save();

  res.json({
    success: true,
    message: 'Signed in successfully.',
    session: {
      token,
      user: sanitizeUser(user),
      expiresAt,
    },
    accountState: accountState.state,
    targetRoute: user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'FINANCE' ? '/admin/payments' : accountState.targetRoute,
  });
});

// Sign Out
apiRouter.post('/auth/logout', (req, res) => {
  const session = getAuthenticatedSession(req);
  if (session) {
    const idx = db.sessions.findIndex((s) => s.token === session.token);
    if (idx >= 0) db.sessions.splice(idx, 1);
    logAudit(session.userId, session.email, session.role, 'USER_LOGOUT', 'SESSION', session.token);
    db.save();
  }
  res.json({ success: true, message: 'Signed out successfully.' });
});

// Get Current User (Me)
apiRouter.get('/auth/me', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const session = (req as any).session as SessionRecord;
  const accountState = computeAccountState(user);

  res.json({
    success: true,
    user: sanitizeUser(user),
    session: {
      token: session.token,
      expiresAt: session.expiresAt,
    },
    accountState: accountState.state,
    targetRoute: user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'FINANCE' ? '/admin/payments' : accountState.targetRoute,
  });
});

// Forgot Password
apiRouter.post('/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'Email address is required.' });
    return;
  }

  const normalized = email.toLowerCase().trim();
  const user = db.users.find((u) => u.email.toLowerCase() === normalized);

  if (user) {
    const resetToken = crypto.randomBytes(24).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour
    logAudit(user.id, user.email, user.role, 'PASSWORD_RESET_REQUESTED', 'USER', user.id);
    db.save();

    res.json({
      success: true,
      message: 'If this email is registered in our system, password reset instructions have been issued.',
      resetToken, // Provided for direct verification testing
    });
    return;
  }

  res.json({
    success: true,
    message: 'If this email is registered in our system, password reset instructions have been issued.',
  });
});

// Reset Password
apiRouter.post('/auth/reset-password', (req, res) => {
  const { resetToken, newPassword, confirmPassword } = req.body;

  if (!resetToken || !newPassword) {
    res.status(400).json({ success: false, message: 'Reset token and new password are required.' });
    return;
  }

  if (confirmPassword && newPassword !== confirmPassword) {
    res.status(400).json({ success: false, message: 'Passwords do not match.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ success: false, message: 'Password must be at least 8 characters long.' });
    return;
  }

  const user = db.users.find(
    (u) =>
      u.resetToken === resetToken &&
      u.resetTokenExpires &&
      new Date(u.resetTokenExpires).getTime() > Date.now()
  );

  if (!user) {
    res.status(400).json({ success: false, message: 'Invalid or expired password reset token.' });
    return;
  }

  const salt = crypto.randomBytes(16).toString('hex');
  user.passwordHash = hashPassword(newPassword, salt);
  user.salt = salt;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;

  // Invalidate any existing sessions
  db.invalidateUserSessions(user.id);

  logAudit(user.id, user.email, user.role, 'PASSWORD_RESET_COMPLETED', 'USER', user.id);
  db.save();

  res.json({ success: true, message: 'Password has been successfully reset. You may now sign in.' });
});

// ==========================================
// 2. COMMERCIAL PLANS & BANK SETTINGS
// ==========================================

apiRouter.get('/enf/plans', (_req, res) => {
  res.json({ success: true, plans: db.plans.filter((p) => p.isActive) });
});

apiRouter.get('/enf/bank-config', (_req, res) => {
  res.json({ success: true, bankConfig: db.bankConfig });
});

// ==========================================
// 3. ORDERS (IDEMPOTENT CREATION)
// ==========================================

apiRouter.post('/enf/orders', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const { planId } = req.body;

  const plan = db.plans.find((p) => p.id === planId) || db.plans[1];

  // Idempotency: Check if an identical pending order was created in last 60 seconds
  const recentPending = db.orders.find(
    (o) =>
      o.customerId === user.id &&
      o.planId === plan.id &&
      o.status === 'PENDING_PAYMENT' &&
      Date.now() - new Date(o.createdAt).getTime() < 60000
  );

  if (recentPending) {
    res.json({ success: true, order: recentPending, isExisting: true });
    return;
  }

  const randomSerial = Math.floor(100000 + Math.random() * 900000);
  const orderNumber = `ENF-ORD-2026-${randomSerial}`;
  const paymentRef = `ENF-2026-${randomSerial}`;

  const newOrder: OrderRecord = {
    id: `ord-${randomSerial}`,
    orderNumber,
    customerId: user.id,
    customerName: user.fullName,
    customerEmail: user.email,
    customerPhone: user.phone,
    planId: plan.id,
    planName: plan.name,
    amountPhp: plan.pricePhp,
    creditAmountPhp: plan.creditAmountPhp,
    discountRate: plan.discountRate,
    tierLabel: plan.tierLabel,
    baseFeePhp: plan.baseFeePhp,
    effectiveFeePhp: plan.effectiveFeePhp,
    creditsQuantity: plan.creditsQuantity,
    paymentRef,
    termsVersion: plan.termsVersion,
    status: 'PENDING_PAYMENT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);

  // Add customer notification
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: user.id,
    type: 'INFO',
    title: `Order Created: ${plan.name}`,
    message: `Payment Reference: ${paymentRef}. Total amount: ₱${plan.pricePhp.toLocaleString()}. Please complete bank transfer to activate your ENF.`,
    read: false,
    link: `/enf/payment?orderId=${newOrder.id}`,
    timestamp: new Date().toISOString(),
  });

  logAudit(user.id, user.email, user.role, 'CREATE_ORDER', 'ORDER', newOrder.id, {
    plan: plan.name,
    amount: plan.pricePhp,
    paymentRef,
  });

  db.save();

  res.status(201).json({ success: true, order: newOrder });
});

// Customer Orders (Strict customer isolation)
apiRouter.get('/enf/orders', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const userOrders = db.orders.filter((o) => o.customerId === user.id);
  res.json({ success: true, orders: userOrders });
});

apiRouter.get('/enf/orders/:id', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const order = db.orders.find((o) => o.id === req.params.id);

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found.' });
    return;
  }

  // Strict ownership check unless admin
  if (order.customerId !== user.id && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'FINANCE') {
    res.status(403).json({ success: false, message: 'Access denied to this order.' });
    return;
  }

  res.json({ success: true, order });
});

// ==========================================
// 4. PAYMENTS & PROOF SUBMISSION
// ==========================================

apiRouter.post('/enf/payments', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const {
    orderId,
    bankName,
    transferDate,
    transferTime,
    amountPhp,
    senderName,
    bankTransactionRef,
    proofFileName,
    proofFileType,
    proofFileDataUrl,
  } = req.body;

  const order = db.orders.find((o) => o.id === orderId && o.customerId === user.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found or not owned by caller.' });
    return;
  }

  // Validate proof file extension and MIME type
  if (!proofFileName) {
    res.status(400).json({ success: false, message: 'Proof of payment file is required.' });
    return;
  }

  const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
  const ext = '.' + proofFileName.split('.').pop()?.toLowerCase();
  if (!allowedExts.includes(ext)) {
    res.status(400).json({ success: false, message: 'Invalid file format. Only JPG, PNG, and PDF files are allowed.' });
    return;
  }

  const paymentId = `PAY-${Date.now().toString().slice(-6)}`;
  const payment: PaymentRecord = {
    id: paymentId,
    orderId: order.id,
    paymentRef: order.paymentRef,
    customerId: user.id,
    customerName: senderName || user.fullName,
    customerEmail: user.email,
    bankName: bankName || 'BDO Unibank',
    transferDate: transferDate || new Date().toISOString().split('T')[0],
    transferTime: transferTime || '12:00 PM',
    amountPhp: Number(amountPhp) || order.amountPhp,
    senderName: senderName || user.fullName,
    bankTransactionRef: bankTransactionRef || `BNK-${Date.now().toString().slice(-6)}`,
    proofFileName,
    proofFileType: proofFileType || 'application/pdf',
    proofFileDataUrl: proofFileDataUrl || '',
    submittedAt: new Date().toISOString(),
    status: 'PAYMENT_SUBMITTED',
  };

  db.payments.unshift(payment);

  // Update order status
  order.status = 'PAYMENT_SUBMITTED';
  order.updatedAt = new Date().toISOString();

  // Create notifications
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: user.id,
    type: 'INFO',
    title: 'Payment Proof Submitted',
    message: `Your payment of ₱${payment.amountPhp.toLocaleString()} (Ref: ${payment.paymentRef}) has been submitted for admin verification.`,
    read: false,
    link: '/enf/dashboard',
    timestamp: new Date().toISOString(),
  });

  logAudit(user.id, user.email, user.role, 'SUBMIT_PAYMENT_PROOF', 'PAYMENT', paymentId, {
    orderId: order.id,
    amount: payment.amountPhp,
    bankTransactionRef: payment.bankTransactionRef,
  });

  db.save();

  res.status(201).json({ success: true, payment, message: 'Payment proof submitted for review.' });
});

apiRouter.get('/enf/payments', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const userPayments = db.payments.filter((p) => p.customerId === user.id);
  res.json({ success: true, payments: userPayments });
});

// ==========================================
// 5. WALLET & CREDIT OPERATIONS
// ==========================================

apiRouter.get('/enf/wallet', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  let wallet = db.wallets.find((w) => w.userId === user.id);

  if (!wallet) {
    wallet = {
      id: `wlt-${user.id}`,
      userId: user.id,
      ownerName: user.fullName,
      ownerEmail: user.email,
      availableBalancePhp: 0,
      totalPurchasedPhp: 0,
      totalUsedPhp: 0,
      availableCredits: 0,
      creditsUsed: 0,
      originalCredits: 0,
      developmentTier: 'None',
      discountRate: 0,
      baseFeePhp: 100,
      effectiveTechnicalFeePhp: 100,
      status: 'ACTIVE',
      lastUpdated: new Date().toISOString(),
    };
    db.wallets.push(wallet);
    db.save();
  }

  res.json({ success: true, wallet });
});

// Use Notarial Credit (Debit exactly 1 credit, atomic & ledger-recorded)
apiRouter.post('/enf/wallet/use-credit', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const wallet = db.wallets.find((w) => w.userId === user.id);

  if (!wallet) {
    res.status(404).json({ success: false, message: 'Credit wallet not found.' });
    return;
  }

  if (wallet.availableCredits < 1) {
    res.status(400).json({
      success: false,
      message: 'Insufficient notarial credits. Please purchase an ENF prepaid package to continue.',
    });
    return;
  }

  const beforeCredits = wallet.availableCredits;
  const afterCredits = beforeCredits - 1;
  const effectiveFee = wallet.effectiveTechnicalFeePhp || 81;

  wallet.availableCredits = afterCredits;
  wallet.creditsUsed = (wallet.creditsUsed || 0) + 1;
  wallet.totalUsedPhp = (wallet.totalUsedPhp || 0) + effectiveFee;
  wallet.availableBalancePhp = Math.max(0, wallet.availableBalancePhp - effectiveFee);
  wallet.lastUpdated = new Date().toISOString();

  const ledgerEntry: LedgerRecord = {
    id: `TX-DEBIT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    walletId: wallet.id,
    userId: user.id,
    type: 'DEBIT',
    amountPhp: effectiveFee,
    creditsDebited: 1,
    creditsBalanceBefore: beforeCredits,
    creditsBalanceAfter: afterCredits,
    serviceName: 'Electronic Notarization Technical Service (IEN/REN)',
    referenceCode: `NOTARY-SRV-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    status: 'COMPLETED',
    actorEmail: user.email,
    notes: 'Single online notarial technical instrument execution.',
  };

  db.ledger.unshift(ledgerEntry);

  logAudit(user.id, user.email, user.role, 'DEBIT_NOTARIAL_CREDIT', 'WALLET', wallet.id, {
    creditsDebited: 1,
    before: beforeCredits,
    after: afterCredits,
  });

  db.save();

  res.json({
    success: true,
    message: '1 Notarial technical credit debited successfully.',
    wallet,
    ledgerEntry,
  });
});

apiRouter.get('/enf/ledger', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const userLedger = db.ledger.filter((l) => l.userId === user.id);
  res.json({ success: true, ledger: userLedger });
});

apiRouter.get('/enf/transactions', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const orders = db.orders.filter((o) => o.customerId === user.id);
  const payments = db.payments.filter((p) => p.customerId === user.id);
  const ledger = db.ledger.filter((l) => l.userId === user.id);
  const receipts = db.receipts.filter((r) => r.customerId === user.id);

  res.json({
    success: true,
    orders,
    payments,
    ledger,
    receipts,
  });
});

apiRouter.get('/enf/receipts', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const receipts = db.receipts.filter((r) => r.customerId === user.id);
  res.json({ success: true, receipts });
});

// Profile Management
apiRouter.get('/enf/profile', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const profile = db.profiles[user.id] || {
    id: `prof-${user.id}`,
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    organizationName: user.organization,
    officeName: user.organization,
    onboardingStep: 1,
    onboardingCompleted: false,
    emailVerified: user.emailVerified,
  };
  res.json({ success: true, profile });
});

apiRouter.put('/enf/profile', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const updates = req.body;
  const existing = db.profiles[user.id] || {};

  db.profiles[user.id] = {
    ...existing,
    ...updates,
    userId: user.id,
    updatedAt: new Date().toISOString(),
  };

  logAudit(user.id, user.email, user.role, 'UPDATE_PROFILE', 'PROFILE', user.id);
  db.save();

  res.json({ success: true, profile: db.profiles[user.id] });
});

// ENF Builder Configuration
apiRouter.get('/enf/config', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const config = db.configs[user.id] || {
    id: `cfg-${user.id}`,
    ownerId: user.id,
    facilityName: `${user.fullName} Electronic Notarial Facility`,
    domainSlug: user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    primaryColor: '#002D5B',
    secondaryColor: '#0078CE',
    accentColor: '#2EAF4A',
    workflowStage: 'DEVELOPMENT',
    clientPortalEnabled: true,
    updatedAt: new Date().toISOString(),
  };
  res.json({ success: true, config });
});

apiRouter.put('/enf/config', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const updates = req.body;
  const existing = db.configs[user.id] || {};

  db.configs[user.id] = {
    ...existing,
    ...updates,
    ownerId: user.id,
    updatedAt: new Date().toISOString(),
  };

  logAudit(user.id, user.email, user.role, 'UPDATE_ENF_CONFIG', 'CONFIG', user.id);
  db.save();

  res.json({ success: true, config: db.configs[user.id] });
});

// Notifications
apiRouter.get('/enf/notifications', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const notifs = db.notifications.filter((n) => n.userId === user.id);
  res.json({ success: true, notifications: notifs });
});

// Documents (Customer isolation)
apiRouter.get('/enf/documents', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const docs = db.documents.filter((d) => d.ownerId === user.id);
  res.json({ success: true, documents: docs });
});

apiRouter.post('/enf/documents', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const { title, category, fileSizeBytes, fileType, sha256Hash } = req.body;

  const doc = {
    id: `doc-${Date.now()}`,
    ownerId: user.id,
    title: title || 'Untitled Document',
    category: category || 'UPLOADS',
    fileSizeBytes: Number(fileSizeBytes) || 1024,
    fileType: fileType || 'application/pdf',
    version: 1,
    sha256Hash: sha256Hash || crypto.createHash('sha256').update(title + Date.now()).digest('hex'),
    uploadedBy: user.fullName,
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  };

  db.documents.unshift(doc);
  logAudit(user.id, user.email, user.role, 'UPLOAD_DOCUMENT', 'DOCUMENT', doc.id);
  db.save();

  res.status(201).json({ success: true, document: doc });
});

// Research (Customer isolation)
apiRouter.get('/enf/research', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const items = db.research.filter((r) => r.userId === user.id);
  res.json({ success: true, research: items });
});

apiRouter.post('/enf/research', requireAuth, (req, res) => {
  const user = (req as any).user as UserRecord;
  const { topic, query, analysisText, citations } = req.body;

  const item = {
    id: `res-${Date.now()}`,
    userId: user.id,
    topic: topic || 'Philippine Electronic Notarization Jurisprudence',
    query: query || '',
    analysisText: analysisText || '',
    citations: citations || [],
    saved: true,
    createdAt: new Date().toISOString(),
  };

  db.research.unshift(item);
  logAudit(user.id, user.email, user.role, 'SAVE_LEGAL_RESEARCH', 'RESEARCH', item.id);
  db.save();

  res.status(201).json({ success: true, researchItem: item });
});

// ==========================================
// 6. ADMIN OPERATIONS (SUPER_ADMIN, ADMIN, FINANCE)
// ==========================================

const ADMIN_ROLES: ENFRole[] = ['SUPER_ADMIN', 'ADMIN', 'FINANCE'];

apiRouter.get('/admin/payments', requireRole(ADMIN_ROLES), (_req, res) => {
  res.json({ success: true, payments: db.payments, orders: db.orders });
});

apiRouter.get('/admin/orders', requireRole(ADMIN_ROLES), (_req, res) => {
  res.json({ success: true, orders: db.orders });
});

// ATOMIC PAYMENT VERIFICATION & CREDIT ACTIVATION (Section 20 & 21)
apiRouter.post('/admin/payments/:id/verify', requireRole(ADMIN_ROLES), (req, res) => {
  const adminSession = (req as any).session as SessionRecord;
  const { reason, adminNotes } = req.body;
  const paymentId = req.params.id;

  const payment = db.payments.find((p) => p.id === paymentId);
  if (!payment) {
    res.status(404).json({ success: false, message: 'Payment record not found.' });
    return;
  }

  const order = db.orders.find((o) => o.id === payment.orderId);
  if (!order) {
    res.status(404).json({ success: false, message: 'Associated order not found.' });
    return;
  }

  // Idempotency: Protect against double credit issuance
  if (payment.status === 'PAID' || order.status === 'ACTIVATED') {
    res.json({
      success: true,
      message: `Payment was already verified. No duplicate credits were issued. Receipt: ${payment.receiptNumber}.`,
      receiptNumber: payment.receiptNumber,
      isDuplicate: true,
    });
    return;
  }

  const now = new Date().toISOString();
  const receiptNumber = `JM-OR-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  // 1. Mark payment PAID
  payment.status = 'PAID';
  payment.verifiedAt = now;
  payment.verifiedBy = adminSession.email;
  payment.receiptNumber = receiptNumber;
  payment.adminNotes = adminNotes || 'Confirmed against bank statement by treasury.';

  // 2. Mark order ACTIVATED & PAID
  order.status = 'ACTIVATED';
  order.paidAt = now;
  order.activatedAt = now;
  order.updatedAt = now;

  // 3. Get or create credit wallet
  let wallet = db.wallets.find((w) => w.userId === order.customerId);
  if (!wallet) {
    wallet = {
      id: `wlt-${order.customerId}`,
      userId: order.customerId,
      ownerName: order.customerName,
      ownerEmail: order.customerEmail,
      availableBalancePhp: 0,
      totalPurchasedPhp: 0,
      totalUsedPhp: 0,
      availableCredits: 0,
      creditsUsed: 0,
      originalCredits: 0,
      developmentTier: order.tierLabel,
      discountRate: order.discountRate,
      baseFeePhp: 100,
      effectiveTechnicalFeePhp: order.effectiveFeePhp,
      status: 'ACTIVE',
      lastUpdated: now,
    };
    db.wallets.push(wallet);
  }

  // 4. Issue credits and calculate ledger before/after
  const balanceBefore = wallet.availableCredits || 0;
  const creditsToAdd = order.creditsQuantity;
  const balanceAfter = balanceBefore + creditsToAdd;

  wallet.availableCredits = balanceAfter;
  wallet.originalCredits = (wallet.originalCredits || 0) + creditsToAdd;
  wallet.totalPurchasedPhp += order.amountPhp;
  wallet.availableBalancePhp += order.creditAmountPhp;
  wallet.developmentTier = order.tierLabel;
  wallet.discountRate = order.discountRate;
  wallet.effectiveTechnicalFeePhp = order.effectiveFeePhp;
  wallet.status = 'ACTIVE';
  wallet.lastUpdated = now;

  // 5. Create credit ledger entry
  const ledgerEntry: LedgerRecord = {
    id: `TX-CREDIT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    walletId: wallet.id,
    userId: order.customerId,
    orderId: order.id,
    type: 'CREDIT',
    amountPhp: order.amountPhp,
    creditsBalanceBefore: balanceBefore,
    creditsBalanceAfter: balanceAfter,
    serviceName: `ENF Development Package Activation (${order.planName})`,
    referenceCode: receiptNumber,
    timestamp: now,
    status: 'COMPLETED',
    actorEmail: adminSession.email,
    notes: `Prepaid notarial credit allocation (${creditsToAdd} credits at ₱${order.effectiveFeePhp}/credit effective fee).`,
  };
  db.ledger.unshift(ledgerEntry);

  // 6. Generate persistent Official Receipt
  const receipt: ReceiptRecord = {
    id: `rcpt-${Date.now()}`,
    receiptNumber,
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerId: order.customerId,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    planName: order.planName,
    purchaseAmountPhp: order.amountPhp,
    paymentRef: order.paymentRef,
    paymentDate: now,
    creditsIssued: creditsToAdd,
    discountRate: order.discountRate,
    effectiveTechnicalFeePhp: order.effectiveFeePhp,
    paymentStatus: 'PAID',
    verifiedBy: adminSession.email,
    issuedAt: now,
  };
  db.receipts.unshift(receipt);

  // 7. Create customer notifications
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: order.customerId,
    type: 'SUCCESS',
    title: 'Payment Confirmed & Credits Activated!',
    message: `Your payment of ₱${order.amountPhp.toLocaleString()} for ${order.planName} has been verified. ${creditsToAdd} credits have been deposited to your wallet. Official Receipt: ${receiptNumber}.`,
    read: false,
    link: '/enf/dashboard',
    timestamp: now,
  });

  // 8. Record audit log
  logAudit(adminSession.userId, adminSession.email, adminSession.role, 'VERIFY_PAYMENT_CONFIRMED', 'PAYMENT', payment.id, {
    orderId: order.id,
    amount: order.amountPhp,
    receiptNumber,
    creditsIssued: creditsToAdd,
    reason,
  });

  db.save();

  res.json({
    success: true,
    message: `Payment confirmed successfully! ${creditsToAdd} credits activated. Official Receipt: ${receiptNumber}.`,
    receiptNumber,
    wallet,
  });
});

// Reject Payment
apiRouter.post('/admin/payments/:id/reject', requireRole(ADMIN_ROLES), (req, res) => {
  const adminSession = (req as any).session as SessionRecord;
  const { reason } = req.body;
  const payment = db.payments.find((p) => p.id === req.params.id);

  if (!payment) {
    res.status(404).json({ success: false, message: 'Payment record not found.' });
    return;
  }

  payment.status = 'REJECTED';
  payment.adminNotes = reason || 'Payment rejected by administrator.';

  const order = db.orders.find((o) => o.id === payment.orderId);
  if (order) {
    order.status = 'REJECTED';
    order.rejectionReason = reason;
    order.updatedAt = new Date().toISOString();
  }

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: payment.customerId,
    type: 'ERROR',
    title: 'Payment Submission Rejected',
    message: `Your payment verification for ${payment.paymentRef} could not be confirmed: ${reason || 'Invalid bank reference.'}. Please re-upload valid proof.`,
    read: false,
    link: `/enf/payment?orderId=${payment.orderId}`,
    timestamp: new Date().toISOString(),
  });

  logAudit(adminSession.userId, adminSession.email, adminSession.role, 'REJECT_PAYMENT', 'PAYMENT', payment.id, { reason });
  db.save();

  res.json({ success: true, message: 'Payment has been rejected.' });
});

// Request Info
apiRouter.post('/admin/payments/:id/request-info', requireRole(ADMIN_ROLES), (req, res) => {
  const adminSession = (req as any).session as SessionRecord;
  const { message } = req.body;
  const payment = db.payments.find((p) => p.id === req.params.id);

  if (!payment) {
    res.status(404).json({ success: false, message: 'Payment record not found.' });
    return;
  }

  payment.status = 'REQUIRES_INFORMATION';
  payment.informationRequested = message;

  const order = db.orders.find((o) => o.id === payment.orderId);
  if (order) {
    order.status = 'REQUIRES_INFORMATION';
    order.informationRequested = message;
  }

  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: payment.customerId,
    type: 'WARNING',
    title: 'Additional Payment Information Requested',
    message: `Verification desk needs clarification: ${message}`,
    read: false,
    link: `/enf/payment?orderId=${payment.orderId}`,
    timestamp: new Date().toISOString(),
  });

  logAudit(adminSession.userId, adminSession.email, adminSession.role, 'REQUEST_PAYMENT_INFO', 'PAYMENT', payment.id, { message });
  db.save();

  res.json({ success: true, message: 'Information request sent to customer.' });
});

// Users List (Admins only)
apiRouter.get('/admin/users', requireRole(['SUPER_ADMIN', 'ADMIN']), (_req, res) => {
  const sanitized = db.users.map((u) => sanitizeUser(u));
  res.json({ success: true, users: sanitized });
});

// Update User Role (SUPER_ADMIN only)
apiRouter.put('/admin/users/:id/role', requireRole(['SUPER_ADMIN']), (req, res) => {
  const adminSession = (req as any).session as SessionRecord;
  const { role } = req.body;
  const targetUser = db.users.find((u) => u.id === req.params.id);

  if (!targetUser) {
    res.status(404).json({ success: false, message: 'User not found.' });
    return;
  }

  const previousRole = targetUser.role;
  targetUser.role = role as ENFRole;

  logAudit(adminSession.userId, adminSession.email, adminSession.role, 'UPDATE_USER_ROLE', 'USER', targetUser.id, {
    previousRole,
    newRole: role,
  });

  db.save();
  res.json({ success: true, message: `Role updated to ${role}.`, user: sanitizeUser(targetUser) });
});

// Adjust Credits (Admins only, with mandatory reason)
apiRouter.post('/admin/credits/adjust', requireRole(['SUPER_ADMIN', 'ADMIN', 'FINANCE']), (req, res) => {
  const adminSession = (req as any).session as SessionRecord;
  const { userId, creditsAdjustment, reason } = req.body;

  if (!userId || creditsAdjustment === undefined || !reason) {
    res.status(400).json({ success: false, message: 'User ID, credit adjustment amount, and reason are required.' });
    return;
  }

  let wallet = db.wallets.find((w) => w.userId === userId);
  if (!wallet) {
    res.status(404).json({ success: false, message: 'Wallet not found for this user.' });
    return;
  }

  const before = wallet.availableCredits || 0;
  const adjustment = Number(creditsAdjustment);
  const after = Math.max(0, before + adjustment);

  wallet.availableCredits = after;
  wallet.lastUpdated = new Date().toISOString();

  const ledgerEntry: LedgerRecord = {
    id: `TX-ADJ-${Date.now()}`,
    walletId: wallet.id,
    userId,
    type: 'ADJUSTMENT',
    amountPhp: Math.abs(adjustment * wallet.effectiveTechnicalFeePhp),
    creditsBalanceBefore: before,
    creditsBalanceAfter: after,
    serviceName: 'Administrative Credit Adjustment',
    referenceCode: `ADJ-${Date.now().toString().slice(-6)}`,
    timestamp: new Date().toISOString(),
    status: 'COMPLETED',
    actorEmail: adminSession.email,
    notes: reason,
  };
  db.ledger.unshift(ledgerEntry);

  logAudit(adminSession.userId, adminSession.email, adminSession.role, 'ADMIN_CREDIT_ADJUSTMENT', 'WALLET', wallet.id, {
    before,
    adjustment,
    after,
    reason,
  });

  db.save();

  res.json({ success: true, message: 'Credits adjusted successfully.', wallet, ledgerEntry });
});

// Audit Logs
apiRouter.get('/admin/audit', requireRole(['SUPER_ADMIN', 'ADMIN', 'FINANCE']), (_req, res) => {
  res.json({ success: true, auditLogs: db.auditLogs.slice(0, 100) });
});

// Administrative Stats
apiRouter.get('/admin/stats', requireRole(ADMIN_ROLES), (_req, res) => {
  const pendingPayments = db.payments.filter((p) => p.status === 'PAYMENT_SUBMITTED' || p.status === 'UNDER_REVIEW').length;
  const totalOrders = db.orders.length;
  const paidOrders = db.orders.filter((o) => o.status === 'ACTIVATED' || o.status === 'PAID').length;
  const totalCreditsAllocated = db.wallets.reduce((sum, w) => sum + (w.originalCredits || 0), 0);
  const totalCreditsAvailable = db.wallets.reduce((sum, w) => sum + (w.availableCredits || 0), 0);

  res.json({
    success: true,
    stats: {
      pendingPayments,
      totalOrders,
      paidOrders,
      totalCreditsAllocated,
      totalCreditsAvailable,
      totalUsers: db.users.length,
    },
  });
});
