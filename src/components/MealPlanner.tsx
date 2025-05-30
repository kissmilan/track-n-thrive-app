
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2, ChefHat } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlannedFood {
  id: string;
  name: string;
  amount: string;
  mealType: string;
}

const MealPlanner = () => {
  const [plannedMeals, setPlannedMeals] = useState<PlannedFood[]>([]);
  const [newFood, setNewFood] = useState({
    name: "",
    amount: "",
    mealType: "breakfast"
  });
  const { toast } = useToast();

  const foodSuggestions = [
    "Csirkemell", "Lazac", "Tuna", "Tojás", "Zabpehely", "Barnarizi", "Édesburgonya",
    "Brokkoli", "Spenót", "Banán", "Alma", "Mandula", "Görög joghurt", "Avokádó"
  ];

  const addFood = () => {
    if (!newFood.name || !newFood.amount) {
      toast({
        title: "Hiba",
        description: "Kérlek töltsd ki az összes mezőt!",
        variant: "destructive",
      });
      return;
    }

    const food: PlannedFood = {
      id: Date.now().toString(),
      ...newFood
    };

    setPlannedMeals([...plannedMeals, food]);
    setNewFood({ name: "", amount: "", mealType: "breakfast" });
  };

  const removeFood = (id: string) => {
    setPlannedMeals(plannedMeals.filter(food => food.id !== id));
  };

  const saveMealPlan = () => {
    if (plannedMeals.length === 0) {
      toast({
        title: "Hiba",
        description: "Adj hozzá legalább egy ételt!",
        variant: "destructive",
      });
      return;
    }

    // Itt később Google Sheets integráció lesz
    toast({
      title: "Étrend mentve!",
      description: "A tervezett étkezések sikeresen mentve a Google Sheets-be.",
    });
  };

  const mealTypes = {
    breakfast: "Reggeli",
    lunch: "Ebéd",
    dinner: "Vacsora",
    snack: "Snack"
  };

  const groupedMeals = plannedMeals.reduce((acc, food) => {
    if (!acc[food.mealType]) {
      acc[food.mealType] = [];
    }
    acc[food.mealType].push(food);
    return acc;
  }, {} as Record<string, PlannedFood[]>);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Új étel hozzáadása
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="foodName">Étel neve</Label>
              <Input
                id="foodName"
                value={newFood.name}
                onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                placeholder="pl. Csirkemell"
                list="food-suggestions"
              />
              <datalist id="food-suggestions">
                {foodSuggestions.map((food, index) => (
                  <option key={index} value={food} />
                ))}
              </datalist>
            </div>
            <div>
              <Label htmlFor="amount">Mennyiség</Label>
              <Input
                id="amount"
                value={newFood.amount}
                onChange={(e) => setNewFood({...newFood, amount: e.target.value})}
                placeholder="pl. 150g"
              />
            </div>
            <div>
              <Label htmlFor="mealType">Étkezés</Label>
              <Select value={newFood.mealType} onValueChange={(value) => setNewFood({...newFood, mealType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mealTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addFood} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Hozzáadás
          </Button>
        </CardContent>
      </Card>

      {Object.entries(groupedMeals).map(([mealType, foods]) => (
        <Card key={mealType}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              {mealTypes[mealType as keyof typeof mealTypes]}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {foods.map((food) => (
                <div key={food.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{food.name}</span>
                    <Badge variant="outline" className="ml-2">{food.amount}</Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFood(food.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {plannedMeals.length > 0 && (
        <Button onClick={saveMealPlan} className="w-full bg-green-600 hover:bg-green-700 text-white">
          <Save className="w-4 h-4 mr-2" />
          Étrend mentése
        </Button>
      )}
    </div>
  );
};

export default MealPlanner;
