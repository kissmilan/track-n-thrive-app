
// Real Google Auth implementation for web platform
interface GoogleAuthResult {
  authentication?: {
    accessToken: string;
  };
  serverAuthCode?: string;
  user?: any;
}

declare global {
  interface Window {
    google?: any;
    gapi?: any;
  }
}

class WebGoogleAuth {
  private static clientId = '1070518728039-4l0ambas9mhvoom8ssl1lj9hl0tb5irj.apps.googleusercontent.com';
  private static isInitialized = false;

  static async initialize() {
    if (this.isInitialized) return;

    // Load Google APIs
    await this.loadGoogleAPIs();
    
    // Initialize Google Auth
    await new Promise((resolve) => {
      window.gapi.load('auth2', async () => {
        await window.gapi.auth2.init({
          client_id: this.clientId,
          scope: 'profile email https://www.googleapis.com/auth/spreadsheets'
        });
        resolve(true);
      });
    });

    this.isInitialized = true;
  }

  static loadGoogleAPIs(): Promise<void> {
    return new Promise((resolve) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  static async signIn(): Promise<GoogleAuthResult> {
    const authInstance = window.gapi.auth2.getAuthInstance();
    const googleUser = await authInstance.signIn();
    
    const authResponse = googleUser.getAuthResponse();
    const profile = googleUser.getBasicProfile();
    
    return {
      authentication: {
        accessToken: authResponse.access_token
      },
      serverAuthCode: authResponse.code,
      user: {
        email: profile.getEmail(),
        name: profile.getName(),
        imageUrl: profile.getImageUrl()
      }
    };
  }

  static async signOut() {
    const authInstance = window.gapi.auth2.getAuthInstance();
    await authInstance.signOut();
  }
}

export class GoogleAuthService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      await WebGoogleAuth.initialize();
      this.isInitialized = true;
    } catch (error) {
      console.error('Google Auth initialization error:', error);
      throw error;
    }
  }

  async signIn() {
    try {
      await this.initialize();
      const result = await WebGoogleAuth.signIn();
      
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
      await WebGoogleAuth.signOut();
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
