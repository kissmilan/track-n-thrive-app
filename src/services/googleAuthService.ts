
// Temporary mock implementation until proper Google Auth setup
interface GoogleAuthResult {
  authentication?: {
    accessToken: string;
  };
  serverAuthCode?: string;
  user?: any;
}

class MockGoogleAuth {
  static async initialize(config: any) {
    console.log('Mock Google Auth initialized with config:', config);
  }

  static async signIn(): Promise<GoogleAuthResult> {
    // Mock successful sign-in for development
    return {
      authentication: {
        accessToken: 'mock_access_token_' + Date.now()
      },
      serverAuthCode: 'mock_server_auth_code',
      user: {
        email: 'demo@example.com',
        name: 'Demo User'
      }
    };
  }

  static async signOut() {
    console.log('Mock Google Auth sign out');
  }
}

export class GoogleAuthService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    // Mock initialization for web platform
    await MockGoogleAuth.initialize({
      clientId: '1070518728039-4l0ambas9mhvoom8ssl1lj9hl0tb5irj.apps.googleusercontent.com',
      scopes: ['profile', 'email', 'https://www.googleapis.com/auth/spreadsheets'],
      grantOfflineAccess: true
    });

    this.isInitialized = true;
  }

  async signIn() {
    try {
      await this.initialize();
      const result = await MockGoogleAuth.signIn();
      
      if (result.authentication?.accessToken) {
        // Tároljuk el a tokent
        localStorage.setItem('google_access_token', result.authentication.accessToken);
        
        // Ha van refresh token, azt is tároljuk
        if (result.serverAuthCode) {
          localStorage.setItem('google_refresh_token', result.serverAuthCode);
        }
        
        return {
          user: result,
          accessToken: result.authentication.accessToken
        };
      }
      
      throw new Error('Nem sikerült beszerezni az access tokent');
    } catch (error) {
      console.error('Google bejelentkezési hiba:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await MockGoogleAuth.signOut();
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
      localStorage.removeItem('client_sheet_id');
    } catch (error) {
      console.error('Google kijelentkezési hiba:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem('google_access_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('google_access_token');
  }
}

export const googleAuthService = new GoogleAuthService();
