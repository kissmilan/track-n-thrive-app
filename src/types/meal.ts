
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
