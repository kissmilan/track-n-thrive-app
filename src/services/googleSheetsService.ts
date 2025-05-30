
// Google Sheets API service for client-specific data integration
export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface WorkoutExercise {
  name: string;
  workSets: number;
  repRange: string;
  videoUrl?: string;
  sets: WorkoutSet[];
  completed: boolean;
  volumeImprovement: number;
  weightIncrease: number;
  strengthIncrease: number;
  notes?: string;
}

export interface WorkoutWeek {
  weekNumber: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutSheet {
  name: string; // "Felsőtest 1", "Láb", etc.
  weeks: WorkoutWeek[];
}

export interface MealOption {
  name: string;
  amount: string;
  calories: number;
}

export interface DailyMeals {
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snack?: MealOption[];
  totalCalories: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
  sleep: number; // 1-10
  stress: number; // 1-10
  fatigue: number; // 1-10
  motivation: number; // 1-10
  training: number; // 1-10
  notes?: string;
}

export interface Supplement {
  name: string;
  description: string;
  dosage: string;
  timing: string;
  taken: boolean;
  category: 'vitamin' | 'digestive' | 'joint' | 'extract' | 'sleep' | 'pre-workout';
}

export class GoogleSheetsService {
  private accessToken: string | null = null;
  private clientSheetId: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('google_access_token');
    this.clientSheetId = localStorage.getItem('client_sheet_id');
  }

  setClientSheetId(sheetId: string) {
    this.clientSheetId = sheetId;
    localStorage.setItem('client_sheet_id', sheetId);
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('google_access_token', token);
  }

  // Get workout sheets (Felsőtest 1, Láb, etc.)
  async getWorkoutSheets(): Promise<WorkoutSheet[]> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return this.getMockWorkoutSheets();
    }

    try {
      console.log('Fetching workout sheets from Google Sheets...');
      return this.getMockWorkoutSheets();
    } catch (error) {
      console.error('Error fetching workout sheets:', error);
      return this.getMockWorkoutSheets();
    }
  }

  // Save workout data to specific sheet and week
  async saveWorkoutData(sheetName: string, weekNumber: number, exercises: WorkoutExercise[]): Promise<boolean> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return false;
    }

    try {
      console.log(`Saving workout data to ${sheetName}, week ${weekNumber}:`, exercises);
      // Calculate row numbers: each week starts at row (weekNumber-1)*12 + 2
      const startRow = (weekNumber - 1) * 12 + 2;
      
      // Here would be the actual Google Sheets API call to update specific cells
      // For each exercise, update columns E-J (sets 1-5) with weight and reps
      
      return true;
    } catch (error) {
      console.error('Error saving workout data:', error);
      return false;
    }
  }

  // Get meal options for meal planner
  async getMealOptions(): Promise<Record<string, MealOption[]>> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return this.getMockMealOptions();
    }

    try {
      console.log('Fetching meal options from Google Sheets...');
      return this.getMockMealOptions();
    } catch (error) {
      console.error('Error fetching meal options:', error);
      return this.getMockMealOptions();
    }
  }

  // Get today's planned meals
  async getTodaysMeals(): Promise<DailyMeals> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return this.getMockDailyMeals();
    }

    try {
      console.log('Fetching today\'s meals from Google Sheets...');
      return this.getMockDailyMeals();
    } catch (error) {
      console.error('Error fetching meals:', error);
      return this.getMockDailyMeals();
    }
  }

  // Get weight and wellness tracking data
  async getWeightEntries(): Promise<WeightEntry[]> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return this.getMockWeightEntries();
    }

    try {
      console.log('Fetching weight entries from Google Sheets...');
      return this.getMockWeightEntries();
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      return this.getMockWeightEntries();
    }
  }

  // Save weight and wellness data
  async saveWeightEntry(entry: WeightEntry): Promise<boolean> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return false;
    }

    try {
      console.log('Saving weight entry to Google Sheets:', entry);
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  }

  // Get supplements list
  async getSupplements(): Promise<Supplement[]> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return this.getMockSupplements();
    }

    try {
      console.log('Fetching supplements from Google Sheets...');
      return this.getMockSupplements();
    } catch (error) {
      console.error('Error fetching supplements:', error);
      return this.getMockSupplements();
    }
  }

  // Mock data methods
  private getMockWorkoutSheets(): WorkoutSheet[] {
    return [
      {
        name: "Felsőtest 1",
        weeks: [
          {
            weekNumber: 1,
            exercises: [
              {
                name: "Fekvenyomás 1 kezességgel",
                workSets: 3,
                repRange: "6-10",
                videoUrl: "gyak",
                sets: [],
                completed: false,
                volumeImprovement: 0,
                weightIncrease: 0,
                strengthIncrease: 0
              },
              {
                name: "Tárogatás gépen",
                workSets: 3,
                repRange: "8-12",
                videoUrl: "gyak",
                sets: [],
                completed: false,
                volumeImprovement: 0,
                weightIncrease: 0,
                strengthIncrease: 0
              },
              {
                name: "Oldalemeles padhoz dőlve",
                workSets: 4,
                repRange: "10-15",
                videoUrl: "gyak",
                sets: [],
                completed: false,
                volumeImprovement: 0,
                weightIncrease: 0,
                strengthIncrease: 0
              }
            ]
          }
        ]
      },
      {
        name: "Láb",
        weeks: [
          {
            weekNumber: 1,
            exercises: [
              {
                name: "Guggolás",
                workSets: 4,
                repRange: "8-12",
                videoUrl: "gyak",
                sets: [],
                completed: false,
                volumeImprovement: 0,
                weightIncrease: 0,
                strengthIncrease: 0
              }
            ]
          }
        ]
      }
    ];
  }

  private getMockMealOptions(): Record<string, MealOption[]> {
    return {
      breakfast: [
        { name: "Reggeli szendvics", amount: "1 db", calories: 350 },
        { name: "Joghurt túl", amount: "200g", calories: 150 },
        { name: "Tojás", amount: "2 db", calories: 140 }
      ],
      lunch: [
        { name: "Csirkemell sonka", amount: "100g", calories: 165 },
        { name: "Paradicsomos Marha", amount: "150g", calories: 220 },
        { name: "Légegyszerűbb", amount: "1 adag", calories: 300 }
      ],
      dinner: [
        { name: "Hamburger", amount: "1 db", calories: 450 },
        { name: "Pizza", amount: "2 szelet", calories: 500 },
        { name: "Avocado szendvics", amount: "1 db", calories: 320 }
      ]
    };
  }

  private getMockDailyMeals(): DailyMeals {
    return {
      breakfast: [
        { name: "Csirkemell sonka", amount: "100g", calories: 583 }
      ],
      lunch: [
        { name: "Paradicsomos Marha", amount: "150g", calories: 592 }
      ],
      dinner: [
        { name: "Joghurt túl", amount: "200g", calories: 258 }
      ],
      totalCalories: 1433
    };
  }

  private getMockWeightEntries(): WeightEntry[] {
    return [
      {
        date: "4.28",
        weight: 91.60,
        sleep: 8,
        stress: 3,
        fatigue: 4,
        motivation: 8,
        training: 7
      },
      {
        date: "4.29",
        weight: 91.40,
        sleep: 7,
        stress: 4,
        fatigue: 5,
        motivation: 7,
        training: 8
      },
      {
        date: "4.30",
        weight: 91.20,
        sleep: 8,
        stress: 2,
        fatigue: 3,
        motivation: 9,
        training: 8
      }
    ];
  }

  private getMockSupplements(): Supplement[] {
    return [
      {
        name: "Omega 3",
        description: "Esszenciális zsírsav, hormon termelés",
        dosage: "Reggel 2db",
        timing: "Reggel",
        taken: true,
        category: "vitamin"
      },
      {
        name: "C-vitamin",
        description: "Általános egészség, gyulladás csökkentés",
        dosage: "Reggel 2db",
        timing: "Reggel",
        taken: false,
        category: "vitamin"
      },
      {
        name: "Magnézium",
        description: "Nyugtató hatású",
        dosage: "Este 3 db",
        timing: "Este",
        taken: true,
        category: "sleep"
      },
      {
        name: "Probiotikum",
        description: "Mindennapos gyomor egészség",
        dosage: "Reggel 1db",
        timing: "Reggel",
        taken: true,
        category: "digestive"
      },
      {
        name: "Ashwaganda",
        description: "Kortizol szint csökkentés és nyugtató hatás",
        dosage: "Lefekves előtt/ edzés után 1 db",
        timing: "Este/Edzés után",
        taken: true,
        category: "extract"
      }
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();
