/**
 * JuriMbrella Assistant Credit Ledger
 * Manages daily and monthly credit allowances, rate limiting, and consumption tracking.
 */

import { UserCreditProfile, UserCreditTier } from '../../types/jurimbrella-assistant';

const STORAGE_KEY = 'jurimbrella_demo_credits';

const DEFAULT_LIMITS: Record<UserCreditTier, number> = {
  GUEST: 3,
  REGISTERED: 10,
  SUBSCRIBER: 50,
  ADMINISTRATOR: 100,
};

export class CreditLedgerService {
  private static getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  public static getCreditStatus(tier: UserCreditTier = 'GUEST'): UserCreditProfile {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const today = this.getTodayStr();

      if (stored) {
        const parsed: UserCreditProfile = JSON.parse(stored);
        // Reset if new day
        if (parsed.lastResetDate !== today) {
          const fresh: UserCreditProfile = {
            tier,
            dailyAllowance: DEFAULT_LIMITS[tier],
            dailyQuestionsUsed: 0,
            monthlyQuestionsUsed: parsed.monthlyQuestionsUsed,
            questionsRemaining: DEFAULT_LIMITS[tier],
            isExhausted: false,
            lastResetDate: today,
          };
          this.saveCreditStatus(fresh);
          return fresh;
        }
        return parsed;
      }
    } catch {
      // Fallback
    }

    const today = this.getTodayStr();
    const initial: UserCreditProfile = {
      tier,
      dailyAllowance: DEFAULT_LIMITS[tier],
      dailyQuestionsUsed: 0,
      monthlyQuestionsUsed: 0,
      questionsRemaining: DEFAULT_LIMITS[tier],
      isExhausted: false,
      lastResetDate: today,
    };
    this.saveCreditStatus(initial);
    return initial;
  }

  public static consumeCredit(tier: UserCreditTier = 'GUEST'): { success: boolean; status: UserCreditProfile } {
    const current = this.getCreditStatus(tier);

    if (current.questionsRemaining <= 0) {
      current.isExhausted = true;
      this.saveCreditStatus(current);
      return { success: false, status: current };
    }

    current.dailyQuestionsUsed += 1;
    current.monthlyQuestionsUsed += 1;
    current.questionsRemaining = Math.max(0, current.dailyAllowance - current.dailyQuestionsUsed);
    current.isExhausted = current.questionsRemaining <= 0;

    this.saveCreditStatus(current);
    return { success: true, status: current };
  }

  public static resetCreditsForTesting(tier: UserCreditTier = 'GUEST'): UserCreditProfile {
    const today = this.getTodayStr();
    const resetProfile: UserCreditProfile = {
      tier,
      dailyAllowance: DEFAULT_LIMITS[tier],
      dailyQuestionsUsed: 0,
      monthlyQuestionsUsed: 0,
      questionsRemaining: DEFAULT_LIMITS[tier],
      isExhausted: false,
      lastResetDate: today,
    };
    this.saveCreditStatus(resetProfile);
    return resetProfile;
  }

  private static saveCreditStatus(profile: UserCreditProfile): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Could not save credit status to localStorage', e);
    }
  }
}
