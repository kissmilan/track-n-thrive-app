import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Apple, Utensils, FileText, ChefHat } from "lucide-react";
import { googleSheetsService, DailyMeals } from "@/services/googleSheetsService";

const MealViewer = () => {
  const [todayMeals, setTodayMeals] = useState<DailyMeals | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock recept linkek - ezeket lecserélheted valódi Google Docs linkekre
  const getRecipeLink = (mealName: string): string => {
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
    const loadTodaysMeals = async () => {
      setLoading(true);
      const meals = await googleSheetsService.getTodaysMeals();
      setTodayMeals(meals);
      setLoading(false);
    };
    
    loadTodaysMeals();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <p>Étkezések betöltése...</p>
        </div>
      </div>
    );
  }

  if (!todayMeals) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <p>Nem található mai étrend</p>
        </div>
      </div>
    );
  }

  const mealTypes = [
    { key: 'breakfast', name: 'Reggeli', meals: todayMeals.breakfast },
    { key: 'lunch', name: 'Ebéd', meals: todayMeals.lunch },
    { key: 'dinner', name: 'Vacsora', meals: todayMeals.dinner },
    ...(todayMeals.snack ? [{ key: 'snack', name: 'Snack', meals: todayMeals.snack }] : [])
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Mai étkezések</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          onClick={() => window.open('https://docs.google.com/document/d/example', '_blank')}
        >
          <FileText className="w-4 h-4" />
          Receptek (Google Docs)
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5" />
            Napi összesítő
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{todayMeals.totalCalories} kcal</div>
          <p className="text-black/70">2,200 kcal célból</p>
          <div className="w-full bg-black/20 rounded-full h-2 mt-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-300" 
              style={{width: `${Math.min((todayMeals.totalCalories / 2200) * 100, 100)}%`}}
            />
          </div>
          <div className="mt-3 text-sm">
            <Badge className="bg-black text-yellow-400">
              {todayMeals.mealCount} étkezés tervezve
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {mealTypes.map((mealType) => {
          if (!mealType.meals || mealType.meals.length === 0) return null;
          
          const totalCalories = mealType.meals.reduce((sum, meal) => sum + meal.calories, 0);
          
          return (
            <Card key={mealType.key} className="bg-gray-900 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Utensils className="w-5 h-5" />
                    {mealType.name}
                  </CardTitle>
                  <Badge className="bg-yellow-400 text-black">
                    {totalCalories} kcal
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mealType.meals.map((meal, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                        <div>
                          <span className="font-medium text-white">{meal.name}</span>
                          <span className="text-gray-400 ml-2">({meal.amount})</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                            {meal.calories} kcal
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getRecipeLink(meal.name), '_blank')}
                            className="text-blue-400 hover:text-blue-300 border-gray-600 hover:bg-blue-900/20"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Recept
                          </Button>
                        </div>
                      </div>
                      
                      <div className="ml-3 p-2 bg-gray-800/50 rounded border-l-2 border-yellow-400">
                        <div className="flex items-center gap-2 mb-2">
                          <ChefHat className="w-4 h-4 text-yellow-400" />
                          <span className="text-sm font-medium text-yellow-400">Összetevők:</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1 text-sm text-gray-300">
                          {meal.ingredients.map((ingredient, ingIndex) => (
                            <div key={ingIndex} className="flex justify-between">
                              <span>{ingredient.name}</span>
                              <span className="text-gray-400">{ingredient.amount} {ingredient.unit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
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
