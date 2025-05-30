
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, ChefHat, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService, MealOption } from "@/services/googleSheetsService";

interface SelectedMeal {
  id: string;
  mealType: string;
  option: MealOption;
}

const MealPlanner = () => {
  const [mealOptions, setMealOptions] = useState<Record<string, MealOption[]>>({});
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadMealOptions = async () => {
      setLoading(true);
      const options = await googleSheetsService.getMealOptions();
      setMealOptions(options);
      setLoading(false);
    };
    
    loadMealOptions();
  }, []);

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
      description: "A tervezett étkezések sikeresen mentve.",
    });
  };

  const mealTypes = {
    breakfast: "Reggeli",
    lunch: "Ebéd",
    dinner: "Vacsora"
  };

  const totalCalories = selectedMeals.reduce((sum, meal) => sum + meal.option.calories, 0);

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
            Napi étrend tervezés
          </CardTitle>
        </CardHeader>
        <CardContent>
          {totalCalories > 0 && (
            <div className="mb-4 p-4 bg-yellow-400/20 border border-yellow-400 rounded-lg">
              <div className="text-yellow-400 font-semibold">
                Napi kalória összesen: {totalCalories} kcal
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(mealTypes).map(([key, name]) => (
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

      {Object.entries(groupedMeals).map(([mealType, meals]) => (
        <Card key={mealType} className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ChefHat className="w-5 h-5" />
              {mealTypes[mealType as keyof typeof mealTypes]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {meals.map((meal) => (
                <div key={meal.id} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                  <div>
                    <span className="font-medium text-white">{meal.option.name}</span>
                    <div className="text-sm text-gray-400">
                      {meal.option.amount} • {meal.option.calories} kcal
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeMeal(meal.id)}
                    className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-red-900/20"
                  >
                    Eltávolítás
                  </Button>
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
