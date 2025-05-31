
import { MealOption, ShoppingListItem } from '@/types/meal';

export const generateShoppingList = (selectedMeals: { option: MealOption; quantity: number }[]): ShoppingListItem[] => {
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
};
