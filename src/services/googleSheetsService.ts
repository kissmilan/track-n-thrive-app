
import { WorkoutSheet, WorkoutExercise, UserProgress } from '@/types/workout';
import { MealOption, DailyMeals, ShoppingListItem } from '@/types/meal';
import { WeightEntry, Supplement } from '@/types/tracking';
import { generateShoppingList } from './utils/shoppingListUtils';
import { enhancedGoogleSheetsService } from './enhancedGoogleSheetsService';

export class GoogleSheetsService {
  private accessToken: string | null = null;
  private clientSheetId: string | null = null;

  constructor() {
    this.accessToken = localStorage.getItem('google_access_token');
    this.clientSheetId = localStorage.getItem('client_sheet_id');
    
    console.warn('GoogleSheetsService is deprecated. Use enhancedGoogleSheetsService instead.');
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
    return enhancedGoogleSheetsService.getUserProgress();
  }

  async getWorkoutSheets(): Promise<WorkoutSheet[]> {
    return enhancedGoogleSheetsService.getWorkoutSheets();
  }

  async saveWorkoutData(sheetName: string, weekNumber: number, exercises: WorkoutExercise[]): Promise<boolean> {
    return enhancedGoogleSheetsService.saveWorkoutData(sheetName, weekNumber, exercises);
  }

  async getMealOptions(): Promise<Record<string, MealOption[]>> {
    return enhancedGoogleSheetsService.getMealOptions();
  }

  async getTodaysMeals(): Promise<DailyMeals> {
    return enhancedGoogleSheetsService.getTodaysMeals();
  }

  generateShoppingList(selectedMeals: { option: MealOption; quantity: number }[]): ShoppingListItem[] {
    return generateShoppingList(selectedMeals);
  }

  async getWeightEntries(): Promise<WeightEntry[]> {
    return enhancedGoogleSheetsService.getWeightEntries();
  }

  async saveWeightEntry(entry: Omit<WeightEntry, 'date'>): Promise<boolean> {
    return enhancedGoogleSheetsService.saveWeightEntry(entry);
  }

  async getSupplements(): Promise<Supplement[]> {
    return enhancedGoogleSheetsService.getSupplements();
  }

  getSavedWorkouts() {
    return enhancedGoogleSheetsService.getSavedWorkouts();
  }

  getSavedWeightEntries() {
    return enhancedGoogleSheetsService.getSavedWeightEntries();
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
