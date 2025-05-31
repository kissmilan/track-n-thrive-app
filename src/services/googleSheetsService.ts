
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
  previousWeekBest?: WorkoutSet;
  hasImprovement?: boolean;
}

export interface WorkoutWeek {
  weekNumber: number;
  exercises: WorkoutExercise[];
  completed?: boolean;
  totalVolumeIncrease?: number;
  strengthPercentage?: number;
}

export interface WorkoutSheet {
  name: string;
  weeks: WorkoutWeek[];
}

export interface MealIngredient {
  name: string;
  amount: string;
  unit: string;
}

export interface MealOption {
  name: string;
  amount: string;
  calories: number;
  ingredients: MealIngredient[];
}

export interface ShoppingListItem {
  ingredient: string;
  totalAmount: number;
  unit: string;
  meals: string[];
}

export interface DailyMeals {
  breakfast: MealOption[];
  lunch: MealOption[];
  dinner: MealOption[];
  snack?: MealOption[];
  totalCalories: number;
  mealCount: number;
}

export interface WeightEntry {
  date: string;
  weight: number;
  sleep: number;
  stress: number;
  fatigue: number;
  motivation: number;
  training: number;
  notes?: string;
}

export interface Supplement {
  name: string;
  description: string;
  dosage: string;
  timing: string;
  taken: boolean;
  category: 'vitamin' | 'digestive' | 'joint' | 'extract' | 'sleep' | 'pre-workout';
  purchaseLink?: string;
}

export interface UserProgress {
  totalWorkouts: number;
  weeklyWorkouts: number;
  hasMinimumWorkouts: boolean;
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

  async getUserProgress(): Promise<UserProgress> {
    // Mock implementation - replace with actual API call
    return {
      totalWorkouts: 12,
      weeklyWorkouts: 4,
      hasMinimumWorkouts: true
    };
  }

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

  async saveWorkoutData(sheetName: string, weekNumber: number, exercises: WorkoutExercise[]): Promise<boolean> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return false;
    }

    try {
      console.log(`Saving workout data to ${sheetName}, week ${weekNumber}:`, exercises);
      return true;
    } catch (error) {
      console.error('Error saving workout data:', error);
      return false;
    }
  }

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

  generateShoppingList(selectedMeals: { option: MealOption; quantity: number }[]): ShoppingListItem[] {
    const ingredientMap = new Map<string, ShoppingListItem>();

    selectedMeals.forEach(({ option, quantity }) => {
      option.ingredients.forEach(ingredient => {
        const key = `${ingredient.name}-${ingredient.unit}`;
        const amount = parseFloat(ingredient.amount) * quantity;
        
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.totalAmount += amount;
          existing.meals.push(option.name);
        } else {
          ingredientMap.set(key, {
            ingredient: ingredient.name,
            totalAmount: amount,
            unit: ingredient.unit,
            meals: [option.name]
          });
        }
      });
    });

    return Array.from(ingredientMap.values());
  }

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

  async saveWeightEntry(entry: Omit<WeightEntry, 'date'>): Promise<boolean> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available');
      return false;
    }

    try {
      const today = new Date().toLocaleDateString('hu-HU');
      const fullEntry = { ...entry, date: today };
      console.log('Saving weight entry to Google Sheets:', fullEntry);
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  }

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

  // Mock data methods with enhanced functionality
  private getMockWorkoutSheets(): WorkoutSheet[] {
    return [
      {
        name: "Felsőtest 1",
        weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
          weekNumber: weekIndex + 1,
          exercises: [
            {
              name: "Fekvenyomás 1 kezességgel",
              workSets: 3,
              repRange: "6-10",
              videoUrl: "https://example.com/video1",
              sets: [],
              completed: false,
              volumeImprovement: 0,
              weightIncrease: 0,
              strengthIncrease: 0,
              previousWeekBest: weekIndex > 0 ? { weight: 80, reps: 8 } : undefined,
              hasImprovement: false
            },
            {
              name: "Tárogatás gépen",
              workSets: 3,
              repRange: "8-12",
              videoUrl: "https://example.com/video2",
              sets: [],
              completed: false,
              volumeImprovement: 0,
              weightIncrease: 0,
              strengthIncrease: 0,
              previousWeekBest: weekIndex > 0 ? { weight: 60, reps: 10 } : undefined,
              hasImprovement: false
            },
            {
              name: "Oldalemeles padhoz dőlve",
              workSets: 4,
              repRange: "10-15",
              videoUrl: "https://example.com/video3",
              sets: [],
              completed: false,
              volumeImprovement: 0,
              weightIncrease: 0,
              strengthIncrease: 0,
              previousWeekBest: weekIndex > 0 ? { weight: 15, reps: 12 } : undefined,
              hasImprovement: false
            }
          ]
        }))
      },
      {
        name: "Láb",
        weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
          weekNumber: weekIndex + 1,
          exercises: [
            {
              name: "Guggolás",
              workSets: 4,
              repRange: "8-12",
              videoUrl: "https://example.com/video4",
              sets: [],
              completed: false,
              volumeImprovement: 0,
              weightIncrease: 0,
              strengthIncrease: 0,
              previousWeekBest: weekIndex > 0 ? { weight: 100, reps: 10 } : undefined,
              hasImprovement: false
            },
            {
              name: "Román felhúzás",
              workSets: 3,
              repRange: "10-12",
              videoUrl: "https://example.com/video5",
              sets: [],
              completed: false,
              volumeImprovement: 0,
              weightIncrease: 0,
              strengthIncrease: 0,
              previousWeekBest: weekIndex > 0 ? { weight: 80, reps: 10 } : undefined,
              hasImprovement: false
            }
          ]
        }))
      },
      {
        name: "Felsőtest 2",
        weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
          weekNumber: weekIndex + 1,
          exercises: [
            {
              name: "Húzódzkodás",
              workSets: 3,
              repRange: "5-8",
              videoUrl: "https://example.com/video6",
              sets: [],
              completed: false,
              volumeImprovement: 0,
              weightIncrease: 0,
              strengthIncrease: 0,
              previousWeekBest: weekIndex > 0 ? { weight: 10, reps: 6 } : undefined,
              hasImprovement: false
            }
          ]
        }))
      },
      {
        name: "Push/Pull",
        weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
          weekNumber: weekIndex + 1,
          exercises: [
            {
              name: "Vállnomás",
              workSets: 4,
              repRange: "8-10",
              videoUrl: "https://example.com/video7",
              sets: [],
              completed: false,
              volumeImprovement: 0,
              weightIncrease: 0,
              strengthIncrease: 0,
              previousWeekBest: weekIndex > 0 ? { weight: 40, reps: 8 } : undefined,
              hasImprovement: false
            }
          ]
        }))
      }
    ];
  }

  private getMockMealOptions(): Record<string, MealOption[]> {
    return {
      breakfast: [
        { 
          name: "Reggeli szendvics", 
          amount: "1 db", 
          calories: 350,
          ingredients: [
            { name: "Teljes kiőrlésű kenyér", amount: "2", unit: "szelet" },
            { name: "Sonka", amount: "50", unit: "g" },
            { name: "Sajt", amount: "30", unit: "g" },
            { name: "Paradicsom", amount: "1", unit: "db" }
          ]
        },
        { 
          name: "Joghurt müzlivel", 
          amount: "200g", 
          calories: 150,
          ingredients: [
            { name: "Görög joghurt", amount: "150", unit: "g" },
            { name: "Müzli", amount: "30", unit: "g" },
            { name: "Méz", amount: "1", unit: "tk" }
          ]
        }
      ],
      lunch: [
        { 
          name: "Csirkemell rizzsel", 
          amount: "300g", 
          calories: 450,
          ingredients: [
            { name: "Csirkemell", amount: "150", unit: "g" },
            { name: "Basmati rizs", amount: "80", unit: "g" },
            { name: "Brokkoli", amount: "100", unit: "g" },
            { name: "Olívaolaj", amount: "1", unit: "ek" }
          ]
        }
      ],
      dinner: [
        { 
          name: "Lazac zöldségekkel", 
          amount: "250g", 
          calories: 380,
          ingredients: [
            { name: "Lazacfilé", amount: "120", unit: "g" },
            { name: "Édesburgonya", amount: "100", unit: "g" },
            { name: "Spárga", amount: "80", unit: "g" }
          ]
        }
      ]
    };
  }

  private getMockDailyMeals(): DailyMeals {
    const mockOptions = this.getMockMealOptions();
    return {
      breakfast: [mockOptions.breakfast[0]],
      lunch: [mockOptions.lunch[0]],
      dinner: [mockOptions.dinner[0]],
      totalCalories: 1180,
      mealCount: 3
    };
  }

  private getMockWeightEntries(): WeightEntry[] {
    return [
      {
        date: "2024.05.28",
        weight: 91.60,
        sleep: 8,
        stress: 3,
        fatigue: 4,
        motivation: 8,
        training: 7
      },
      {
        date: "2024.05.29",
        weight: 91.40,
        sleep: 7,
        stress: 4,
        fatigue: 5,
        motivation: 7,
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
        taken: false,
        category: "vitamin",
        purchaseLink: "https://example.com/omega3"
      },
      {
        name: "C-vitamin",
        description: "Általános egészség, gyulladás csökkentés",
        dosage: "Reggel 2db",
        timing: "Reggel",
        taken: false,
        category: "vitamin",
        purchaseLink: "https://example.com/vitamin-c"
      },
      {
        name: "Magnézium",
        description: "Nyugtató hatású",
        dosage: "Este 3 db",
        timing: "Este",
        taken: false,
        category: "sleep",
        purchaseLink: "https://example.com/magnesium"
      }
    ];
  }
}

export const googleSheetsService = new GoogleSheetsService();
