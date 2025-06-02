
interface GoogleAuthResult {
  accessToken?: string;
  user?: any;
}

export class GoogleAuthService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;
  }

  async signIn(): Promise<GoogleAuthResult> {
    // Ezt a metódust most nem használjuk, mert a GoogleLoginButton kezeli a bejelentkezést
    return { accessToken: '', user: null };
  }

  async signOut() {
    try {
      localStorage.removeItem('google_id_token');
      localStorage.removeItem('google_auth_user');
      localStorage.removeItem('user_type');
      
      console.log('Sikeres kijelentkezés');
    } catch (error) {
      console.error('Google kijelentkezési hiba:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem('google_id_token');
  }

  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem('google_id_token');
    const hasUser = !!localStorage.getItem('google_auth_user');
    return hasToken && hasUser;
  }

  getCurrentUser() {
    const userData = localStorage.getItem('google_auth_user');
    return userData ? JSON.parse(userData) : null;
  }
}

export const googleAuthService = new GoogleAuthService();
