
import { googleAuthService } from './googleAuthService';

export class GoogleApiService {
  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/documents'
  ];

  async createClientFiles(clientName: string, clientEmail: string) {
    try {
      const accessToken = await googleAuthService.getAccessToken();
      if (!accessToken) {
        throw new Error('Nincs érvényes access token');
      }

      // Google Sheet létrehozása
      const sheetResponse = await this.createGoogleSheet(clientName, accessToken);
      const sheetId = sheetResponse.spreadsheetId;
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;

      // Google Docs létrehozása
      const docResponse = await this.createGoogleDoc(clientName, accessToken);
      const docId = docResponse.documentId;
      const docUrl = `https://docs.google.com/document/d/${docId}`;

      return {
        sheetsUrl: sheetUrl,
        docsUrl: docUrl
      };
    } catch (error) {
      console.error('Hiba a fájlok létrehozásánál:', error);
      throw error;
    }
  }

  private async createGoogleSheet(clientName: string, accessToken: string) {
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: `${clientName} - Edzésnapló`
        },
        sheets: [{
          properties: {
            title: 'Edzések',
            gridProperties: {
              rowCount: 100,
              columnCount: 10
            }
          }
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Sheets API hiba: ${response.statusText}`);
    }

    return await response.json();
  }

  private async createGoogleDoc(clientName: string, accessToken: string) {
    const response = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `${clientName} - Étrend és Terv`
      })
    });

    if (!response.ok) {
      throw new Error(`Docs API hiba: ${response.statusText}`);
    }

    return await response.json();
  }

  async findExistingFiles(clientEmail: string) {
    try {
      const accessToken = await googleAuthService.getAccessToken();
      if (!accessToken) {
        throw new Error('Nincs érvényes access token');
      }

      // Keresés a Drive-ban
      const searchQuery = `name contains '${clientEmail}' and (mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.document')`;
      
      const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      });

      if (!response.ok) {
        throw new Error(`Drive API hiba: ${response.statusText}`);
      }

      const data = await response.json();
      
      const sheets = data.files?.filter((file: any) => 
        file.mimeType === 'application/vnd.google-apps.spreadsheet'
      ) || [];
      
      const docs = data.files?.filter((file: any) => 
        file.mimeType === 'application/vnd.google-apps.document'
      ) || [];

      return {
        sheetsUrl: sheets.length > 0 ? `https://docs.google.com/spreadsheets/d/${sheets[0].id}` : null,
        docsUrl: docs.length > 0 ? `https://docs.google.com/document/d/${docs[0].id}` : null
      };
    } catch (error) {
      console.error('Hiba a fájlok keresésekor:', error);
      return { sheetsUrl: null, docsUrl: null };
    }
  }
}

export const googleApiService = new GoogleApiService();
