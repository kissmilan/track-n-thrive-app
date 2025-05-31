
import { MealOption, DailyMeals } from '@/types/meal';

export const getMockMealOptions = (): Record<string, MealOption[]> => {
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
};

export const getMockDailyMeals = (): DailyMeals => {
  const mockOptions = getMockMealOptions();
  return {
    breakfast: [mockOptions.breakfast[0]],
    lunch: [mockOptions.lunch[0]],
    dinner: [mockOptions.dinner[0]],
    totalCalories: 1180,
    mealCount: 3
  };
};
