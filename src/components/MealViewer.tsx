
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink, Apple, Utensils } from "lucide-react";

const MealViewer = () => {
  // Példa adatok - később Google Sheets-ből jönnek
  const todayMeals = {
    breakfast: {
      time: "07:00",
      foods: [
        { name: "Zabpehely", amount: "50g", calories: 185 },
        { name: "Banán", amount: "1 db", calories: 89 },
        { name: "Mandula", amount: "20g", calories: 116 }
      ],
      totalCalories: 390
    },
    lunch: {
      time: "12:30",
      foods: [
        { name: "Csirkemell", amount: "150g", calories: 231 },
        { name: "Barnarizi", amount: "80g", calories: 278 },
        { name: "Brokkoli", amount: "100g", calories: 34 }
      ],
      totalCalories: 543
    },
    dinner: {
      time: "18:00",
      foods: [
        { name: "Lazac", amount: "120g", calories: 248 },
        { name: "Édesburgonya", amount: "100g", calories: 86 },
        { name: "Zöld saláta", amount: "50g", calories: 10 }
      ],
      totalCalories: 344
    }
  };

  const totalDailyCalories = Object.values(todayMeals).reduce((sum, meal) => sum + meal.totalCalories, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Mai étkezések</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Teljes étrend (Google Docs)
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Napi összesítő
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalDailyCalories} kcal</div>
          <p className="text-green-100">2,200 kcal célból</p>
          <div className="w-full bg-green-300 rounded-full h-2 mt-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300" 
              style={{width: `${Math.min((totalDailyCalories / 2200) * 100, 100)}%`}}
            ></div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {Object.entries(todayMeals).map(([mealType, meal]) => {
          const mealNames = {
            breakfast: "Reggeli",
            lunch: "Ebéd", 
            dinner: "Vacsora"
          };
          
          return (
            <Card key={mealType}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    {mealNames[mealType as keyof typeof mealNames]}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meal.time}
                    </Badge>
                    <Badge className="bg-orange-500">
                      {meal.totalCalories} kcal
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {meal.foods.map((food, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{food.name}</span>
                        <span className="text-gray-600 ml-2">({food.amount})</span>
                      </div>
                      <Badge variant="secondary">{food.calories} kcal</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MealViewer;
