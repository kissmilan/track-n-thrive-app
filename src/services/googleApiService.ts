import { googleAuthService } from './googleAuthService';

export class GoogleApiService {
  private static readonly SCOPES = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets.readonly',
    'https://www.googleapis.com/auth/documents.readonly'
  ];

  async findClientFiles(clientEmail: string, manualLinks?: { sheetsUrl?: string; docsUrl?: string }) {
    try {
      console.log('Finding client files for:', clientEmail);
      
      // If manual links provided, extract IDs and return
      if (manualLinks?.sheetsUrl || manualLinks?.docsUrl) {
        return {
          sheetsUrl: manualLinks.sheetsUrl || null,
          docsUrl: manualLinks.docsUrl || null,
          sheetsId: manualLinks.sheetsUrl ? this.extractFileId(manualLinks.sheetsUrl) : null,
          docsId: manualLinks.docsUrl ? this.extractFileId(manualLinks.docsUrl) : null
        };
      }

      // Try to get access token, but don't fail if not available
      let accessToken;
      try {
        accessToken = await googleAuthService.getAccessToken();
      } catch (error) {
        console.log('No Google auth token available, using manual links only');
        return { sheetsUrl: null, docsUrl: null, sheetsId: null, docsId: null };
      }

      if (!accessToken) {
        console.log('No access token available');
        return { sheetsUrl: null, docsUrl: null, sheetsId: null, docsId: null };
      }

      // Search for existing files by email in name or content
      const searchQueries = [
        `name contains '${clientEmail}'`,
        `fullText contains '${clientEmail}'`,
        `name contains '${clientEmail.split('@')[0]}'`
      ];

      let sheetsFile = null;
      let docsFile = null;

      for (const query of searchQueries) {
        const fullQuery = `${query} and (mimeType='application/vnd.google-apps.spreadsheet' or mimeType='application/vnd.google-apps.document')`;
        
        const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(fullQuery)}&fields=files(id,name,mimeType)`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (!sheetsFile) {
            sheetsFile = data.files?.find((file: any) => 
              file.mimeType === 'application/vnd.google-apps.spreadsheet'
            );
          }
          
          if (!docsFile) {
            docsFile = data.files?.find((file: any) => 
              file.mimeType === 'application/vnd.google-apps.document'
            );
          }

          if (sheetsFile && docsFile) break;
        }
      }

      return {
        sheetsUrl: sheetsFile ? `https://docs.google.com/spreadsheets/d/${sheetsFile.id}` : null,
        docsUrl: docsFile ? `https://docs.google.com/document/d/${docsFile.id}` : null,
        sheetsId: sheetsFile?.id || null,
        docsId: docsFile?.id || null
      };
    } catch (error) {
      console.error('Hiba a fájlok keresésekor:', error);
      return { sheetsUrl: null, docsUrl: null, sheetsId: null, docsId: null };
    }
  }

  async analyzeWorkoutStructure(sheetsId: string) {
    try {
      // Use Google Sheets API with API key instead of OAuth
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.error('No Google API key available');
        return { frequency: 2, sheets: [] };
      }

      // Get all sheets in the spreadsheet using API key
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}?fields=sheets.properties&key=${apiKey}`);

      if (!response.ok) {
        console.error(`Sheets API hiba: ${response.statusText}`);
        return { frequency: 2, sheets: [] };
      }

      const data = await response.json();
      const sheets = data.sheets || [];
      
      // Analyze sheet names to determine workout structure
      const workoutSheets = sheets.filter((sheet: any) => {
        const name = sheet.properties.title.toLowerCase();
        return name.includes('felső') || name.includes('láb') || name.includes('post') || 
               name.includes('push') || name.includes('pull') || name.includes('edzés') ||
               /\d+\.\s*hét/i.test(name) || /hét\s*\d+/i.test(name) ||
               name.includes('felsőtest') || name.includes('alsótest');
      });

      // Determine workout frequency based on sheet patterns
      let workoutFrequency = 2; // default
      if (workoutSheets.length >= 4) {
        workoutFrequency = 4;
      } else if (workoutSheets.length >= 3) {
        workoutFrequency = 3;
      }

      console.log('Detected workout structure:', {
        totalSheets: sheets.length,
        workoutSheets: workoutSheets.length,
        frequency: workoutFrequency,
        sheetNames: workoutSheets.map((s: any) => s.properties.title)
      });

      return {
        frequency: workoutFrequency,
        sheets: workoutSheets.map((sheet: any) => ({
          id: sheet.properties.sheetId,
          name: sheet.properties.title
        }))
      };
    } catch (error) {
      console.error('Hiba az edzésstruktúra elemzésénél:', error);
      return { frequency: 2, sheets: [] };
    }
  }

  async importWorkoutData(sheetsId: string, sheetName: string) {
    try {
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.error('No Google API key available');
        return [];
      }

      // Import data from specific sheet using API key
      const range = `'${sheetName}'!A:Z`; // Get all data from the sheet
      const response = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${encodeURIComponent(range)}?key=${apiKey}`
      );

      if (!response.ok) {
        console.error(`Sheets API hiba: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const values = data.values || [];

      // Parse workout data from the sheet
      return this.parseWorkoutData(values, sheetName);
    } catch (error) {
      console.error('Hiba az edzésadatok importálásánál:', error);
      return [];
    }
  }

  async importMealData(sheetsId: string) {
    try {
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.error('No Google API key available');
        return null;
      }

      // Try to find meal-related sheets using API key
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}?fields=sheets.properties&key=${apiKey}`);

      if (!response.ok) {
        console.error(`Sheets API hiba: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      const sheets = data.sheets || [];
      
      const mealSheets = sheets.filter((sheet: any) => {
        const name = sheet.properties.title.toLowerCase();
        return name.includes('étrend') || name.includes('meal') || name.includes('étel') || 
               name.includes('kalória') || name.includes('bevásárl');
      });

      console.log('Found meal sheets:', mealSheets.map((s: any) => s.properties.title));

      // Import data from the first meal sheet found
      if (mealSheets.length > 0) {
        const sheetName = mealSheets[0].properties.title;
        const range = `'${sheetName}'!A:Z`;
        
        const dataResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${encodeURIComponent(range)}?key=${apiKey}`
        );

        if (dataResponse.ok) {
          const mealData = await dataResponse.json();
          return this.parseMealData(mealData.values || []);
        }
      }

      return null;
    } catch (error) {
      console.error('Hiba az étrendadatok importálásánál:', error);
      return null;
    }
  }

  async importWeightData(sheetsId: string) {
    try {
      const apiKey = await this.getApiKey();
      if (!apiKey) {
        console.error('No Google API key available');
        return [];
      }

      // Find weight/stress sheet using API key
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}?fields=sheets.properties&key=${apiKey}`);

      if (!response.ok) {
        console.error(`Sheets API hiba: ${response.statusText}`);
        return [];
      }

      const data = await response.json();
      const sheets = data.sheets || [];
      
      const weightSheet = sheets.find((sheet: any) => {
        const name = sheet.properties.title.toLowerCase();
        return name.includes('súly') || name.includes('weight') || name.includes('stress');
      });

      if (weightSheet) {
        const sheetName = weightSheet.properties.title;
        const range = `'${sheetName}'!A:Z`;
        
        const dataResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/${encodeURIComponent(range)}?key=${apiKey}`
        );

        if (dataResponse.ok) {
          const weightData = await dataResponse.json();
          return this.parseWeightData(weightData.values || []);
        }
      }

      return [];
    } catch (error) {
      console.error('Hiba a súlyadatok importálásánál:', error);
      return [];
    }
  }

  private async getApiKey(): Promise<string | null> {
    try {
      // Try to get API key from Supabase secrets
      const response = await fetch('/api/get-google-api-key');
      if (response.ok) {
        const data = await response.json();
        return data.apiKey;
      }
    } catch (error) {
      console.error('Error getting API key:', error);
    }
    
    // Fallback to environment or return null
    return null;
  }

  private parseWorkoutData(values: any[][], sheetName: string) {
    const exercises = [];
    let currentExercise = null;

    for (let i = 0; i < values.length; i++) {
      const row = values[i] || [];
      
      // Look for exercise names (usually in first column and not empty)
      if (row[0] && typeof row[0] === 'string' && row[0].trim() !== '') {
        const exerciseName = row[0].trim();
        
        // Skip header rows
        if (exerciseName.toLowerCase().includes('gyakorlat') || 
            exerciseName.toLowerCase().includes('exercise') ||
            exerciseName.toLowerCase() === 'név' ||
            exerciseName.toLowerCase() === 'name') {
          continue;
        }

        // Create new exercise
        currentExercise = {
          name: exerciseName,
          sets: [],
          workSets: 3, // default
          repRange: '8-12', // default
          completed: false
        };

        // Look for rep range and work sets info in adjacent cells
        if (row[1]) currentExercise.repRange = row[1].toString();
        if (row[2] && !isNaN(parseInt(row[2]))) currentExercise.workSets = parseInt(row[2]);

        exercises.push(currentExercise);
      }
    }

    return exercises;
  }

  private parseMealData(values: any[][]) {
    const meals = {
      breakfast: [],
      lunch: [],
      dinner: [],
      snack: []
    };

    let currentMealType = 'breakfast';
    
    for (const row of values) {
      if (!row || row.length === 0) continue;
      
      const firstCell = row[0]?.toString().toLowerCase() || '';
      
      // Detect meal type headers
      if (firstCell.includes('reggeli') || firstCell.includes('breakfast')) {
        currentMealType = 'breakfast';
        continue;
      } else if (firstCell.includes('ebéd') || firstCell.includes('lunch')) {
        currentMealType = 'lunch';
        continue;
      } else if (firstCell.includes('vacsora') || firstCell.includes('dinner')) {
        currentMealType = 'dinner';
        continue;
      } else if (firstCell.includes('snack') || firstCell.includes('tízórai')) {
        currentMealType = 'snack';
        continue;
      }

      // Parse meal items
      if (row[0] && row[1]) {
        const mealItem = {
          name: row[0].toString(),
          amount: row[1]?.toString() || '1 adag',
          calories: parseInt(row[2]?.toString()) || 0,
          ingredients: []
        };

        meals[currentMealType].push(mealItem);
      }
    }

    return meals;
  }

  private parseWeightData(values: any[][]) {
    const weightEntries = [];
    
    for (let i = 1; i < values.length; i++) { // Skip header row
      const row = values[i] || [];
      
      if (row[0] && row[1]) {
        try {
          const date = new Date(row[0]).toLocaleDateString('hu-HU');
          const weight = parseFloat(row[1]);
          const bodyFat = parseFloat(row[2]) || 0;
          const muscleMass = parseFloat(row[3]) || 0;
          
          if (!isNaN(weight)) {
            weightEntries.push({
              date,
              weight,
              bodyFat,
              muscleMass,
              notes: row[4]?.toString() || ''
            });
          }
        } catch (error) {
          console.warn('Skipping invalid weight entry:', row);
        }
      }
    }

    return weightEntries;
  }

  private extractFileId(url: string): string | null {
    const matches = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    return matches ? matches[1] : null;
  }

  // Keep existing createClientFiles method for backward compatibility but mark as deprecated
  async createClientFiles(clientName: string, clientEmail: string) {
    console.warn('createClientFiles is deprecated. Use findClientFiles instead.');
    return this.findClientFiles(clientEmail);
  }
}

export const googleApiService = new GoogleApiService();
