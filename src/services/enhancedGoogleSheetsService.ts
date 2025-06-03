
import { googleApiService } from './googleApiService';
import { WorkoutSheet, WorkoutExercise, UserProgress } from '@/types/workout';
import { MealOption, DailyMeals } from '@/types/meal';
import { WeightEntry, Supplement } from '@/types/tracking';
import { getMockWorkoutSheets, getMockUserProgress } from './mockData/workoutMockData';
import { getMockMealOptions, getMockDailyMeals } from './mockData/mealMockData';
import { getMockWeightEntries, getMockSupplements } from './mockData/trackingMockData';

export class EnhancedGoogleSheetsService {
  private clientSheetsId: string | null = null;
  private clientDocsId: string | null = null;
  private workoutStructure: any = null;

  async initializeClient(clientEmail: string, manualLinks?: { sheetsUrl?: string; docsUrl?: string }) {
    try {
      console.log('Initializing client:', clientEmail);
      
      const files = await googleApiService.findClientFiles(clientEmail, manualLinks);
      
      this.clientSheetsId = files.sheetsId;
      this.clientDocsId = files.docsId;
      
      if (this.clientSheetsId) {
        this.workoutStructure = await googleApiService.analyzeWorkoutStructure(this.clientSheetsId);
        console.log('Workout structure analyzed:', this.workoutStructure);
      }
      
      return {
        sheetsUrl: files.sheetsUrl,
        docsUrl: files.docsUrl,
        hasSheets: !!files.sheetsId,
        hasDocs: !!files.docsId,
        workoutFrequency: this.workoutStructure?.frequency || 2
      };
    } catch (error) {
      console.error('Error initializing client:', error);
      return {
        sheetsUrl: null,
        docsUrl: null,
        hasSheets: false,
        hasDocs: false,
        workoutFrequency: 2
      };
    }
  }

  async getWorkoutSheets(): Promise<WorkoutSheet[]> {
    if (!this.clientSheetsId || !this.workoutStructure) {
      console.log('No sheets ID or workout structure, returning mock data');
      return getMockWorkoutSheets();
    }

    try {
      const workoutSheets = [];
      
      for (const sheet of this.workoutStructure.sheets) {
        const exercises = await googleApiService.importWorkoutData(this.clientSheetsId, sheet.name);
        
        const workoutSheet: WorkoutSheet = {
          name: sheet.name,
          weeks: Array.from({length: 12}, (_, i) => ({
            weekNumber: i + 1,
            exercises: exercises.map(ex => ({
              ...ex,
              sets: ex.sets.length > 0 ? ex.sets : [{ weight: 0, reps: 0 }]
            }))
          }))
        };
        
        workoutSheets.push(workoutSheet);
      }
      
      return workoutSheets.length > 0 ? workoutSheets : getMockWorkoutSheets();
    } catch (error) {
      console.error('Error getting workout sheets:', error);
      return getMockWorkoutSheets();
    }
  }

  async getTodaysMeals(): Promise<DailyMeals> {
    if (!this.clientSheetsId) {
      console.log('No sheets ID available for meals');
      return getMockDailyMeals();
    }

    try {
      const mealData = await googleApiService.importMealData(this.clientSheetsId);
      
      if (mealData) {
        const totalCalories = Object.values(mealData).flat().reduce((sum: number, meal: any) => sum + (meal.calories || 0), 0);
        const mealCount = Object.values(mealData).flat().length;
        
        return {
          ...mealData,
          totalCalories,
          mealCount
        };
      }
      
      return getMockDailyMeals();
    } catch (error) {
      console.error('Error getting meals:', error);
      return getMockDailyMeals();
    }
  }

  async getWeightEntries(): Promise<WeightEntry[]> {
    if (!this.clientSheetsId) {
      console.log('No sheets ID available for weight entries');
      return getMockWeightEntries();
    }

    try {
      const weightData = await googleApiService.importWeightData(this.clientSheetsId);
      return weightData.length > 0 ? weightData : getMockWeightEntries();
    } catch (error) {
      console.error('Error getting weight entries:', error);
      return getMockWeightEntries();
    }
  }

  async getMealOptions(): Promise<Record<string, MealOption[]>> {
    // This could be extended to import meal options from sheets
    return getMockMealOptions();
  }

  async getSupplements(): Promise<Supplement[]> {
    // This could be extended to import supplements from sheets/docs
    return getMockSupplements();
  }

  async getUserProgress(): Promise<UserProgress> {
    // Enhanced with actual data if available
    const baseProgress = getMockUserProgress();
    
    if (this.workoutStructure) {
      baseProgress.weeklyWorkouts = Math.min(this.workoutStructure.frequency, 6);
    }
    
    return baseProgress;
  }

  // Legacy methods for compatibility
  async saveWorkoutData(sheetName: string, weekNumber: number, exercises: WorkoutExercise[]): Promise<boolean> {
    console.log(`Saving workout data: ${sheetName}, week ${weekNumber}`, exercises);
    
    try {
      const workoutData = {
        sheetName,
        weekNumber,
        exercises,
        timestamp: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('user_data') || '{}')
      };
      
      const existingWorkouts = JSON.parse(localStorage.getItem('saved_workouts') || '[]');
      existingWorkouts.push(workoutData);
      localStorage.setItem('saved_workouts', JSON.stringify(existingWorkouts));
      
      console.log('Workout saved to localStorage:', workoutData);
      return true;
    } catch (error) {
      console.error('Error saving workout data:', error);
      return false;
    }
  }

  async saveWeightEntry(entry: Omit<WeightEntry, 'date'>): Promise<boolean> {
    try {
      const today = new Date().toLocaleDateString('hu-HU');
      const fullEntry = { ...entry, date: today };
      
      const existingEntries = JSON.parse(localStorage.getItem('saved_weight_entries') || '[]');
      existingEntries.push(fullEntry);
      localStorage.setItem('saved_weight_entries', JSON.stringify(existingEntries));
      
      console.log('Weight entry saved:', fullEntry);
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  }

  getSavedWorkouts() {
    try {
      return JSON.parse(localStorage.getItem('saved_workouts') || '[]');
    } catch (error) {
      console.error('Error getting saved workouts:', error);
      return [];
    }
  }

  getSavedWeightEntries() {
    try {
      return JSON.parse(localStorage.getItem('saved_weight_entries') || '[]');
    } catch (error) {
      console.error('Error getting saved weight entries:', error);
      return [];
    }
  }
}

export const enhancedGoogleSheetsService = new EnhancedGoogleSheetsService();
