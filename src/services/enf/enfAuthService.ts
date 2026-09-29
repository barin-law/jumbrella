/**
 * JuriMbrella — ENF Platform Production Authentication Service
 * 
 * Interacts with authoritative server-side /api/auth endpoints:
 * - Scrypt password hashing on server
 * - Server-issued session tokens with 24-hour expiration
 * - Real email verification enforcement
 * - Password reset workflows
 * - Role-Based Access Control verified server-side
 */

import { ApiClient, ApiUser } from '../apiClient';
import { EnfStorageService } from './enfStorageService';

export type ENFRole =
  | 'CLIENT'
  | 'ENF_OWNER'
  | 'NOTARY'
  | 'STAFF'
  | 'SUPPORT'
  | 'ENF_MANAGER'
  | 'FINANCE'
  | 'ADMIN'
  | 'SUPER_ADMIN';

export interface ENFAuthUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: ENFRole;
  organization?: string;
  professionalInfo?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export type SafeENFAuthUser = ENFAuthUser;

export interface ENFAuthSession {
  token: string;
  userId: string;
  email: string;
  role: ENFRole;
  fullName: string;
  createdAt: string;
  expiresAt: string;
}

const STORAGE_KEYS = {
  USERS: 'jurimbrella_enf_users_v2',
  SESSION: 'jurimbrella_enf_session_v2',
};

// Seed users for offline fallback
const DEFAULT_USERS_SEED: ENFAuthUser[] = [
  {
    id: 'user-santos-1',
    fullName: 'Atty. Maria Elena Santos, En.P.',
    email: 'atty.santos@santoslaw.ph',
    phone: '+63 917 555 4921',
    role: 'ENF_OWNER',
    emailVerified: true,
    twoFactorEnabled: false,
    organization: 'Santos & Associates Law Chambers',
    professionalInfo: 'Roll No. 67890 / IBP Makati / Notarial Commission No. 2026-042',
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'user-admin-1',
    fullName: 'JuriMbrella Platform Administrator',
    email: 'admin@jurimbrella.ph',
    phone: '+63 2 8892 4821',
    role: 'ADMIN',
    emailVerified: true,
    twoFactorEnabled: true,
    organization: 'JuriMbrella Platform Operations',
    professionalInfo: 'Roll No. 58190 / Supreme Court ENF Oversight',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-finance-1',
    fullName: 'Rowena Garcia (Treasury & Finance Officer)',
    email: 'finance@jurimbrella.ph',
    phone: '+63 2 8892 4822',
    role: 'FINANCE',
    emailVerified: true,
    twoFactorEnabled: true,
    organization: 'JuriMbrella Treasury & Finance',
    professionalInfo: 'CPA Reg No. 109284 / Financial Verification Desk',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'user-superadmin-1',
    fullName: 'JuriMbrella Executive Director',
    email: 'superadmin@jurimbrella.ph',
    phone: '+63 2 8892 4820',
    role: 'SUPER_ADMIN',
    emailVerified: true,
    twoFactorEnabled: true,
    organization: 'JuriMbrella Legal Technology Corp.',
    professionalInfo: 'Roll No. 41920 / Board of Directors',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

export class EnfAuthService {
  /**
   * Retrieves current session.
   */
  public static getCurrentSession(): ENFAuthSession | null {
    try {
      const token = ApiClient.getToken();
      if (!token) return null;

      const item = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!item) return null;
      const session = JSON.parse(item) as ENFAuthSession;
      if (new Date(session.expiresAt).getTime() < Date.now()) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  public static getCurrentUser(): SafeENFAuthUser | null {
    const stored = ApiClient.getStoredUser();
    if (stored) {
      return {
        id: stored.id,
        fullName: stored.fullName,
        email: stored.email,
        phone: stored.phone,
        role: stored.role as ENFRole,
        organization: stored.organization,
        professionalInfo: stored.professionalInfo,
        emailVerified: stored.emailVerified,
        twoFactorEnabled: false,
        createdAt: stored.createdAt,
      };
    }

    const session = this.getCurrentSession();
    if (!session) return null;
    return DEFAULT_USERS_SEED.find((u) => u.id === session.userId) || null;
  }

  public static isAuthenticated(): boolean {
    return this.getCurrentSession() !== null;
  }

  public static hasRole(allowedRoles: ENFRole[]): boolean {
    const session = this.getCurrentSession();
    if (!session) return false;
    return allowedRoles.includes(session.role);
  }

  /**
   * Synchronize current user with server /api/auth/me
   */
  public static async fetchCurrentUser(): Promise<SafeENFAuthUser | null> {
    const res = await ApiClient.get('/auth/me');
    if (res.success && res.data?.user) {
      const u = res.data.user;
      ApiClient.setSession(res.data.session?.token || ApiClient.getToken() || '', u);
      return u;
    }
    return this.getCurrentUser();
  }

  /**
   * Sign In via backend
   */
  public static async login(
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    message: string;
    session?: ENFAuthSession;
    user?: SafeENFAuthUser;
    accountState?: string;
    targetRoute?: string;
  }> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) {
      return { success: false, message: 'Email and password are required.' };
    }

    // Call server API
    const res = await ApiClient.post('/auth/login', {
      email: cleanEmail,
      password,
    });

    if (res.success && res.data?.session) {
      const serverSession = res.data.session;
      const serverUser = serverSession.user;

      const authSession: ENFAuthSession = {
        token: serverSession.token,
        userId: serverUser.id,
        email: serverUser.email,
        role: serverUser.role,
        fullName: serverUser.fullName,
        createdAt: new Date().toISOString(),
        expiresAt: serverSession.expiresAt,
      };

      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(authSession));
      } catch (e) {
        console.warn('Failed to store session:', e);
      }

      ApiClient.setSession(serverSession.token, serverUser);

      return {
        success: true,
        message: res.data.message || 'Signed in successfully.',
        session: authSession,
        user: serverUser,
        accountState: res.data.accountState,
        targetRoute: res.data.targetRoute,
      };
    }

    return {
      success: false,
      message: res.message || 'Invalid email or password.',
    };
  }

  /**
   * Real Sign Up via backend
   */
  public static async register(data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword?: string;
    mobileNumber?: string;
    phone?: string;
    organization?: string;
    professionalInfo?: string;
    termsAccepted?: boolean;
    role?: ENFRole;
  }): Promise<{
    success: boolean;
    message: string;
    userId?: string;
    email?: string;
    verificationCode?: string;
    deploymentNotice?: string;
  }> {
    const res = await ApiClient.post('/auth/register', {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      mobileNumber: data.mobileNumber || data.phone,
      organization: data.organization,
      professionalInfo: data.professionalInfo,
      termsAccepted: data.termsAccepted,
    });

    if (res.success && res.data) {
      return {
        success: true,
        message: res.data.message || 'Account created successfully. Please verify your email.',
        userId: res.data.userId,
        email: res.data.email,
        verificationCode: res.data.verificationCode,
        deploymentNotice: res.data.deploymentNotice,
      };
    }

    return {
      success: false,
      message: res.message || 'Failed to create account.',
    };
  }

  /**
   * Verify email via backend
   */
  public static async verifyEmail(
    code: string,
    email?: string
  ): Promise<{ success: boolean; message: string; session?: ENFAuthSession; nextRoute?: string }> {
    const targetEmail = email || this.getCurrentUser()?.email;
    if (!targetEmail) {
      return { success: false, message: 'Please provide the registered email address.' };
    }

    const res = await ApiClient.post('/auth/verify-email', {
      email: targetEmail,
      code: code.trim(),
    });

    if (res.success && res.data?.session) {
      const serverSession = res.data.session;
      const authSession: ENFAuthSession = {
        token: serverSession.token,
        userId: serverSession.user.id,
        email: serverSession.user.email,
        role: serverSession.user.role,
        fullName: serverSession.user.fullName,
        createdAt: new Date().toISOString(),
        expiresAt: serverSession.expiresAt,
      };

      try {
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(authSession));
      } catch (e) {
        console.warn('Failed to store session:', e);
      }

      ApiClient.setSession(serverSession.token, serverSession.user);

      return {
        success: true,
        message: res.data.message || 'Email verified successfully.',
        session: authSession,
        nextRoute: res.data.nextRoute,
      };
    }

    return {
      success: false,
      message: res.message || 'Invalid or expired verification code.',
    };
  }

  /**
   * Sign out (invalidates token on server and removes client state)
   */
  public static async logout(): Promise<void> {
    try {
      await ApiClient.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    } finally {
      ApiClient.clearSession();
      try {
        localStorage.removeItem(STORAGE_KEYS.SESSION);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Password Reset
   */
  public static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string; token?: string }> {
    const res = await ApiClient.post('/auth/forgot-password', { email });
    return {
      success: res.success,
      message: res.message || 'If this email is registered, password reset instructions have been issued.',
      token: res.data?.resetToken,
    };
  }

  public static async resetPassword(token: string, newPassword: string, confirmPassword?: string): Promise<{ success: boolean; message: string }> {
    const res = await ApiClient.post('/auth/reset-password', {
      resetToken: token,
      newPassword,
      confirmPassword,
    });
    return {
      success: res.success,
      message: res.message || 'Failed to reset password.',
    };
  }
}
