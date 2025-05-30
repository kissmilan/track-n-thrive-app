
// Google Sheets API service for client-specific data integration
export interface WorkoutData {
  exercise: string;
  sets: Array<{
    reps: number;
    weight: number;
  }>;
  date: string;
}

export interface MealData {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Array<{
    name: string;
    amount: string;
    calories?: number;
  }>;
  date: string;
}

export interface WeightData {
  weight: number;
  date: string;
}

export class GoogleSheetsService {
  private accessToken: string | null = null;
  private clientSheetId: string | null = null;

  constructor() {
    // Initialize with stored access token if available
    this.accessToken = localStorage.getItem('google_access_token');
    this.clientSheetId = localStorage.getItem('client_sheet_id');
  }

  // Set the client's specific Google Sheet ID
  setClientSheetId(sheetId: string) {
    this.clientSheetId = sheetId;
    localStorage.setItem('client_sheet_id', sheetId);
  }

  // Set access token from Google OAuth
  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('google_access_token', token);
  }

  // Read workout exercises from Google Sheets
  async getWorkoutExercises(): Promise<string[]> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return ['Guggolás', 'Fekvenyomás', 'Húzódzkodás']; // Fallback data
    }

    try {
      // This would make an actual API call to Google Sheets
      // For now, returning mock data
      console.log('Fetching workout exercises from Google Sheets...');
      return ['Guggolás', 'Fekvenyomás', 'Húzódzkodás', 'Deadlift', 'Vállnyomás'];
    } catch (error) {
      console.error('Error fetching workout exercises:', error);
      return ['Guggolás', 'Fekvenyomás', 'Húzódzkodás']; // Fallback
    }
  }

  // Save workout data to Google Sheets
  async saveWorkoutData(workoutData: WorkoutData[]): Promise<boolean> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return false;
    }

    try {
      console.log('Saving workout data to Google Sheets:', workoutData);
      // This would make an actual API call to append data to the workout sheet
      // For now, just logging and returning success
      return true;
    } catch (error) {
      console.error('Error saving workout data:', error);
      return false;
    }
  }

  // Get today's meal plan from Google Sheets
  async getTodaysMeals(): Promise<any> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return this.getMockMealData();
    }

    try {
      console.log('Fetching today\'s meals from Google Sheets...');
      // This would make an actual API call to read meal data
      return this.getMockMealData(); // For now, return mock data
    } catch (error) {
      console.error('Error fetching meals:', error);
      return this.getMockMealData();
    }
  }

  // Save weight data to Google Sheets
  async saveWeightData(weightData: WeightData): Promise<boolean> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return false;
    }

    try {
      console.log('Saving weight data to Google Sheets:', weightData);
      // This would make an actual API call to append weight data
      return true;
    } catch (error) {
      console.error('Error saving weight data:', error);
      return false;
    }
  }

  // Get weight history from Google Sheets
  async getWeightHistory(): Promise<Array<{date: string, weight: number}>> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return this.getMockWeightData();
    }

    try {
      console.log('Fetching weight history from Google Sheets...');
      return this.getMockWeightData(); // For now, return mock data
    } catch (error) {
      console.error('Error fetching weight history:', error);
      return this.getMockWeightData();
    }
  }

  // Mock data methods (to be replaced with actual API calls)
  private getMockMealData() {
    return {
      breakfast: {
        time: "07:00",
        foods: [
          { name: "Zabpehely", amount: "50g", calories: 185 },
          { name: "Banán", amount: "1 db", calories: 89 },
          { name: "Mandula", amount: "20g", calories: 116 }
        ],
        totalCalories: 390
      },
      lunch: {
        time: "12:30",
        foods: [
          { name: "Csirkemell", amount: "150g", calories: 231 },
          { name: "Barnarizi", amount: "80g", calories: 278 },
          { name: "Brokkoli", amount: "100g", calories: 34 }
        ],
        totalCalories: 543
      },
      dinner: {
        time: "18:00",
        foods: [
          { name: "Lazac", amount: "120g", calories: 248 },
          { name: "Édesburgonya", amount: "100g", calories: 86 },
          { name: "Zöld saláta", amount: "50g", calories: 10 }
        ],
        totalCalories: 344
      }
    };
  }

  private getMockWeightData() {
    return [
      { date: "01.15", weight: 76.2 },
      { date: "01.16", weight: 76.0 },
      { date: "01.17", weight: 75.8 },
      { date: "01.18", weight: 75.5 },
      { date: "01.19", weight: 75.3 },
      { date: "01.20", weight: 75.2 },
      { date: "01.21", weight: 75.2 },
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();
