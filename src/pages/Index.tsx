
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Users, Activity, Target, Apple, Settings } from "lucide-react";
import ClientDashboard from "@/components/ClientDashboard";
import AdminPanel from "@/components/AdminPanel";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [userType, setUserType] = useState<"client" | "admin" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const handleGoogleAuth = (type: "client" | "admin") => {
    // Placeholder for Google OAuth integration
    toast({
      title: "Autentikáció",
      description: "Google OAuth integráció hamarosan elérhető lesz!",
    });
    setUserType(type);
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
                FitTracker Pro
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Professzionális edzés- és étrendkövető rendszer személyi edzőknek és klienseiknek
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <Card className="border-2 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-700">Kliens Belépés</CardTitle>
                  <CardDescription>
                    Követd az edzéseidet, testsúlyodat és étrendedet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleGoogleAuth("client")} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Belépés Google-lel
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl text-green-700">Edző Belépés</CardTitle>
                  <CardDescription>
                    Kövesd a klienseid haladását és kezeld az adatokat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleGoogleAuth("admin")} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    Admin Belépés
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Edzéskövetés</h3>
                <p className="text-gray-600">Rögzítsd ismétléseidet és súlyaidat egyszerűen</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                  <Apple className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Étrendtervezés</h3>
                <p className="text-gray-600">Kövesd és tervezd az étkezéseidet</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Google Integráció</h3>
                <p className="text-gray-600">Automatikus szinkronizálás Google Sheets-szel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {userType === "client" ? <ClientDashboard /> : <AdminPanel />}
    </div>
  );
};

export default Index;
