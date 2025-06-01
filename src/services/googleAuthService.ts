
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
  private static authInstance: any = null;

  static async initialize() {
    if (this.isInitialized && this.authInstance) return;

    try {
      // Load Google APIs
      await this.loadGoogleAPIs();
      
      // Initialize Google Auth
      await new Promise((resolve, reject) => {
        window.gapi.load('auth2', async () => {
          try {
            this.authInstance = await window.gapi.auth2.init({
              client_id: this.clientId,
              scope: 'profile email https://www.googleapis.com/auth/spreadsheets'
            });
            this.isInitialized = true;
            resolve(true);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error('Google Auth initialization failed:', error);
      throw error;
    }
  }

  static loadGoogleAPIs(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google APIs'));
      document.head.appendChild(script);
    });
  }

  static async signIn(): Promise<GoogleAuthResult> {
    if (!this.authInstance) {
      await this.initialize();
    }

    const googleUser = await this.authInstance.signIn();
    const authResponse = googleUser.getAuthResponse();
    const profile = googleUser.getBasicProfile();
    
    return {
      authentication: {
        accessToken: authResponse.access_token
      },
      serverAuthCode: authResponse.code,
      user: {
        user: {
          email: profile.getEmail(),
          name: profile.getName(),
          imageUrl: profile.getImageUrl()
        }
      }
    };
  }

  static async signOut() {
    if (!this.authInstance) {
      await this.initialize();
    }
    await this.authInstance.signOut();
  }

  static isSignedIn(): boolean {
    return this.authInstance?.isSignedIn?.get() || false;
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
        localStorage.setItem('google_auth_user', JSON.stringify(result.user));
        
        // Ha van refresh token, azt is tároljuk
        if (result.serverAuthCode) {
          localStorage.setItem('google_refresh_token', result.serverAuthCode);
        }
        
        console.log('Sikeres bejelentkezés:', result);
        
        return {
          user: result.user,
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
      await this.initialize();
      await WebGoogleAuth.signOut();
      
      // Töröljük a tárolt adatokat
      localStorage.removeItem('google_access_token');
      localStorage.removeItem('google_refresh_token');
      localStorage.removeItem('google_auth_user');
      localStorage.removeItem('client_sheet_id');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_data');
      
      console.log('Sikeres kijelentkezés');
    } catch (error) {
      console.error('Google kijelentkezési hiba:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem('google_access_token');
  }

  isAuthenticated(): boolean {
    const hasToken = !!localStorage.getItem('google_access_token');
    const hasUser = !!localStorage.getItem('google_auth_user');
    return hasToken && hasUser && WebGoogleAuth.isSignedIn();
  }

  getCurrentUser() {
    const userData = localStorage.getItem('google_auth_user');
    return userData ? JSON.parse(userData) : null;
  }
}

export const googleAuthService = new GoogleAuthService();
