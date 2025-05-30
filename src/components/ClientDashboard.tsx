
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Target, 
  Apple, 
  Scale, 
  TrendingUp, 
  Calendar,
  ChefHat,
  Pill
} from "lucide-react";
import WorkoutLogger from "./WorkoutLogger";
import WeightTracker from "./WeightTracker";
import MealPlanner from "./MealPlanner";
import MealViewer from "./MealViewer";
import SupplementInfo from "./SupplementInfo";

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Üdv, János! 👋</h1>
          <p className="text-gray-600">Itt követheted a haladásodat és kezelheted az étrendedet</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="workout" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Edzés</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <Scale className="w-4 h-4" />
              <span className="hidden sm:inline">Testsúly</span>
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              <span className="hidden sm:inline">Étkezés</span>
            </TabsTrigger>
            <TabsTrigger value="planner" className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              <span className="hidden sm:inline">Tervezés</span>
            </TabsTrigger>
            <TabsTrigger value="supplements" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              <span className="hidden sm:inline">Kiegészítők</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Mai edzés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3/5</div>
                  <p className="text-blue-100">gyakorlat elvégezve</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    Testsúly
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">75.2 kg</div>
                  <p className="text-green-100">-0.3 kg a céltól</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    Kalóriák
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,847</div>
                  <p className="text-orange-100">2,200-ból</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Heti cél
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4/6</div>
                  <p className="text-purple-100">edzés teljesítve</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Heti előrehaladás
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Edzések</span>
                      <span>4/6</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Étrendkövetés</span>
                      <span>6/7</span>
                    </div>
                    <Progress value={86} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Testsúly mérés</span>
                      <span>7/7</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Mai teendők</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="line-through text-gray-500">Reggeli bevitel</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Láb edzés befejezése</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Esti testsúly mérés</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workout">
            <WorkoutLogger />
          </TabsContent>

          <TabsContent value="weight">
            <WeightTracker />
          </TabsContent>

          <TabsContent value="meals">
            <MealViewer />
          </TabsContent>

          <TabsContent value="planner">
            <MealPlanner />
          </TabsContent>

          <TabsContent value="supplements">
            <SupplementInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;
