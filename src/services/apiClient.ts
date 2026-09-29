/**
 * JuriMbrella — Client API Transport Service
 * Interacts with authoritative server-side /api endpoints.
 */

const TOKEN_KEY = 'jurimbrella_auth_token_v2';
const USER_KEY = 'jurimbrella_auth_user_v2';

export interface ApiUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  organization: string;
  professionalInfo?: string;
  emailVerified: boolean;
  accountStatus: string;
  createdAt: string;
}

export class ApiClient {
  public static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public static setSession(token: string, user: ApiUser): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to store session in storage:', e);
    }
  }

  public static clearSession(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch (e) {
      console.warn('Failed to clear session:', e);
    }
  }

  public static getStoredUser(): ApiUser | null {
    try {
      const data = localStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  public static async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; message?: string; status: number }> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const baseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
    const url = `${baseUrl}/api${endpoint}`;

    try {
      const res = await fetch(url, {
        ...options,
        headers,
      });

      const json = await res.json().catch(() => ({}));

      if (res.status === 401) {
        this.clearSession();
      }

      if (!res.ok) {
        return {
          success: false,
          message: json.message || `Request failed with status ${res.status}`,
          status: res.status,
          data: json,
        };
      }

      return {
        success: true,
        data: json,
        message: json.message,
        status: res.status,
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Network error connecting to JuriMbrella server.',
        status: 0,
      };
    }
  }

  // Convenience methods
  public static get<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  public static post<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static put<T = any>(endpoint: string, body?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public static delete<T = any>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
