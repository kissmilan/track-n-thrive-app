import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, ChefHat, Calendar, ShoppingCart, Trash2, ExternalLink, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService, MealOption, ShoppingListItem } from "@/services/googleSheetsService";

interface SelectedMeal {
  id: string;
  mealType: string;
  option: MealOption;
}

const MealPlanner = () => {
  const [mealOptions, setMealOptions] = useState<Record<string, MealOption[]>>({});
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([]);
  const [weekQuantity, setWeekQuantity] = useState<number>(1);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Mock recept linkek - ezeket lecserélheted valódi Google Docs linkekre
  const getRecipeLink = (mealName: string): string => {
    // Alapértelmezett recept link struktúra
    const baseUrl = "https://docs.google.com/document/d/";
    const recipeLinks: Record<string, string> = {
      "Zabpehely gyümölccsel": `${baseUrl}1abc123/edit`,
      "Tojásrántotta": `${baseUrl}2def456/edit`,
      "Müzli joghurttal": `${baseUrl}3ghi789/edit`,
      "Csirkemell salátával": `${baseUrl}4jkl012/edit`,
      "Brokkolileves": `${baseUrl}5mno345/edit`,
      "Quinoa tál": `${baseUrl}6pqr678/edit`,
      "Sült hal zöldségekkel": `${baseUrl}7stu901/edit`,
      "Fehérjés smoothie": `${baseUrl}8vwx234/edit`,
      "Omlette": `${baseUrl}9yzab567/edit`
    };

    return recipeLinks[mealName] || `${baseUrl}example/edit`;
  };

  useEffect(() => {
    const loadMealOptions = async () => {
      setLoading(true);
      const options = await googleSheetsService.getMealOptions();
      setMealOptions(options);
      setLoading(false);
    };
    
    loadMealOptions();
  }, []);

  // Automatically detect meal types from available options
  const detectedMealTypes = Object.keys(mealOptions).reduce((acc, key) => {
    if (mealOptions[key] && mealOptions[key].length > 0) {
      const mealTypeNames: Record<string, string> = {
        breakfast: "Reggeli",
        lunch: "Ebéd", 
        dinner: "Vacsora",
        snack: "Snack"
      };
      acc[key] = mealTypeNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }
    return acc;
  }, {} as Record<string, string>);

  const addMeal = (mealType: string, optionIndex: number) => {
    const option = mealOptions[mealType]?.[optionIndex];
    if (!option) return;

    const meal: SelectedMeal = {
      id: Date.now().toString(),
      mealType,
      option
    };

    setSelectedMeals([...selectedMeals, meal]);
  };

  const removeMeal = (id: string) => {
    setSelectedMeals(selectedMeals.filter(meal => meal.id !== id));
  };

  const generateShoppingList = () => {
    if (selectedMeals.length === 0) {
      toast({
        title: "Hiba",
        description: "Adj hozzá legalább egy ételt a bevásárló lista generálásához!",
        variant: "destructive",
      });
      return;
    }

    const mealsWithQuantity = selectedMeals.map(meal => ({
      option: meal.option,
      quantity: weekQuantity
    }));

    const list = googleSheetsService.generateShoppingList(mealsWithQuantity);
    setShoppingList(list);
    setShowShoppingList(true);
  };

  const saveMealPlan = () => {
    if (selectedMeals.length === 0) {
      toast({
        title: "Hiba",
        description: "Adj hozzá legalább egy ételt!",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Étrend mentve!",
      description: `${selectedMeals.length} étkezés sikeresen mentve ${weekQuantity} hétre.`,
    });
  };

  const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.option.calories, 0);
  const weeklyCalories = totalCalories * weekQuantity;

  const groupedMeals = selectedMeals.reduce((acc, meal) => {
    if (!acc[meal.mealType]) {
      acc[meal.mealType] = [];
    }
    acc[meal.mealType].push(meal);
    return acc;
  }, {} as Record<string, SelectedMeal[]>);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <p>Étrend opciók betöltése...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5" />
            Étrend tervezés
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Hetek száma</Label>
              <Input
                type="number"
                min="1"
                max="4"
                value={weekQuantity}
                onChange={(e) => setWeekQuantity(parseInt(e.target.value) || 1)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={generateShoppingList}
                className="bg-green-600 hover:bg-green-700 text-white w-full"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Bevásárló lista generálás
              </Button>
            </div>
          </div>

          {(totalCalories > 0 || weeklyCalories > 0) && (
            <div className="p-4 bg-yellow-400/20 border border-yellow-400 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="text-yellow-400 font-semibold">
                  Napi kalória összesen: {totalCalories} kcal
                </div>
                <div className="text-yellow-400 font-semibold">
                  {weekQuantity} hét kalória: {weeklyCalories} kcal
                </div>
              </div>
              <div className="mt-2 text-yellow-300 text-sm">
                Automatikusan felismert étkezések: {Object.keys(detectedMealTypes).length} típus
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(detectedMealTypes).map(([key, name]) => (
              <div key={key} className="space-y-2">
                <h3 className="font-semibold text-white">{name}</h3>
                <Select onValueChange={(value) => addMeal(key, parseInt(value))}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Válassz ételt" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    {mealOptions[key]?.map((option, index) => (
                      <SelectItem key={index} value={index.toString()} className="text-white">
                        {option.name} ({option.calories} kcal)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showShoppingList && shoppingList.length > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ShoppingCart className="w-5 h-5" />
              Bevásárló lista ({weekQuantity} hét)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {shoppingList.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <span className="font-medium text-white">{item.ingredient}</span>
                    <div className="text-sm text-gray-400">
                      Étkezések: {item.meals.join(", ")}
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white">
                    {item.totalAmount} {item.unit}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Frissített étkezések listája recept linkekkel */}
      {Object.entries(groupedMeals).map(([mealType, meals]) => (
        <Card key={mealType} className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ChefHat className="w-5 h-5" />
              {detectedMealTypes[mealType]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal.id} className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <div>
                      <span className="font-medium text-white">{meal.option.name}</span>
                      <div className="text-sm text-gray-400">
                        {meal.option.amount} • {meal.option.calories} kcal
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {meal.option.ingredients.map(ing => ing.name).join(", ")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(getRecipeLink(meal.option.name), '_blank')}
                        className="text-blue-400 hover:text-blue-300 border-gray-600 hover:bg-blue-900/20"
                      >
                        <FileText className="w-4 h-4 mr-1" />
                        Recept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMeal(meal.id)}
                        className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {selectedMeals.length > 0 && (
        <Button onClick={saveMealPlan} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
          <Save className="w-4 h-4 mr-2" />
          Étrend mentése
        </Button>
      )}
    </div>
  );
};

export default MealPlanner;
