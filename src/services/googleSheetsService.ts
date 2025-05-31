
import { WorkoutSheet, WorkoutExercise, UserProgress } from '@/types/workout';
import { MealOption, DailyMeals, ShoppingListItem } from '@/types/meal';
import { WeightEntry, Supplement } from '@/types/tracking';
import { getMockWorkoutSheets, getMockUserProgress } from './mockData/workoutMockData';
import { getMockMealOptions, getMockDailyMeals } from './mockData/mealMockData';
import { getMockWeightEntries, getMockSupplements } from './mockData/trackingMockData';
import { generateShoppingList } from './utils/shoppingListUtils';

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
    return getMockUserProgress();
  }

  async getWorkoutSheets(): Promise<WorkoutSheet[]> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available, returning mock data');
      return getMockWorkoutSheets();
    }

    try {
      console.log('Fetching workout sheets from Google Sheets...');
      // Ha van access token, itt lehetne valódi API hívás
      return getMockWorkoutSheets();
    } catch (error) {
      console.error('Error fetching workout sheets:', error);
      return getMockWorkoutSheets();
    }
  }

  async saveWorkoutData(sheetName: string, weekNumber: number, exercises: WorkoutExercise[]): Promise<boolean> {
    console.log(`Mentés kezdeményezve: ${sheetName}, hét ${weekNumber}`, exercises);
    
    if (!this.accessToken) {
      console.error('Nincs access token az edzés mentéséhez');
      return false;
    }

    try {
      // Ideiglenesen localStorage-ban tároljuk
      const workoutData = {
        sheetName,
        weekNumber,
        exercises,
        timestamp: new Date().toISOString(),
        user: JSON.parse(localStorage.getItem('user_data') || '{}')
      };
      
      // Mentjük localStorage-ba
      const existingWorkouts = JSON.parse(localStorage.getItem('saved_workouts') || '[]');
      existingWorkouts.push(workoutData);
      localStorage.setItem('saved_workouts', JSON.stringify(existingWorkouts));
      
      console.log('Edzés sikeresen mentve localStorage-ba:', workoutData);
      return true;
    } catch (error) {
      console.error('Error saving workout data:', error);
      return false;
    }
  }

  async getMealOptions(): Promise<Record<string, MealOption[]>> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available for meals');
      return getMockMealOptions();
    }

    try {
      console.log('Fetching meal options from Google Sheets...');
      return getMockMealOptions();
    } catch (error) {
      console.error('Error fetching meal options:', error);
      return getMockMealOptions();
    }
  }

  async getTodaysMeals(): Promise<DailyMeals> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available for today\'s meals');
      return getMockDailyMeals();
    }

    try {
      console.log('Fetching today\'s meals from Google Sheets...');
      return getMockDailyMeals();
    } catch (error) {
      console.error('Error fetching meals:', error);
      return getMockDailyMeals();
    }
  }

  generateShoppingList(selectedMeals: { option: MealOption; quantity: number }[]): ShoppingListItem[] {
    return generateShoppingList(selectedMeals);
  }

  async getWeightEntries(): Promise<WeightEntry[]> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available for weight entries');
      return getMockWeightEntries();
    }

    try {
      console.log('Fetching weight entries from Google Sheets...');
      return getMockWeightEntries();
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      return getMockWeightEntries();
    }
  }

  async saveWeightEntry(entry: Omit<WeightEntry, 'date'>): Promise<boolean> {
    if (!this.accessToken) {
      console.error('Nincs access token a testsúly mentéséhez');
      return false;
    }

    try {
      const today = new Date().toLocaleDateString('hu-HU');
      const fullEntry = { ...entry, date: today };
      
      // Mentjük localStorage-ba
      const existingEntries = JSON.parse(localStorage.getItem('saved_weight_entries') || '[]');
      existingEntries.push(fullEntry);
      localStorage.setItem('saved_weight_entries', JSON.stringify(existingEntries));
      
      console.log('Testsúly bejegyzés sikeresen mentve:', fullEntry);
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  }

  async getSupplements(): Promise<Supplement[]> {
    if (!this.accessToken || !this.clientSheetId) {
      console.log('No access token or sheet ID available for supplements');
      return getMockSupplements();
    }

    try {
      console.log('Fetching supplements from Google Sheets...');
      return getMockSupplements();
    } catch (error) {
      console.error('Error fetching supplements:', error);
      return getMockSupplements();
    }
  }

  // Új funkció: mentett edzések lekérése
  getSavedWorkouts() {
    try {
      return JSON.parse(localStorage.getItem('saved_workouts') || '[]');
    } catch (error) {
      console.error('Error getting saved workouts:', error);
      return [];
    }
  }

  // Új funkció: mentett testsúly bejegyzések lekérése  
  getSavedWeightEntries() {
    try {
      return JSON.parse(localStorage.getItem('saved_weight_entries') || '[]');
    } catch (error) {
      console.error('Error getting saved weight entries:', error);
      return [];
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();

// Re-export types for backward compatibility
export type {
  WorkoutSet,
  WorkoutExercise,
  WorkoutWeek,
  WorkoutSheet,
  UserProgress
} from '@/types/workout';

export type {
  MealIngredient,
  MealOption,
  ShoppingListItem,
  DailyMeals
} from '@/types/meal';

export type {
  WeightEntry,
  Supplement
} from '@/types/tracking';
