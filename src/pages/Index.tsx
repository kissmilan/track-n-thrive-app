import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, Users, Activity, Target, Apple, Settings, Download, Smartphone } from "lucide-react";
import ClientDashboard from "@/components/ClientDashboard";
import AdminPanel from "@/components/AdminPanel";
import { useToast } from "@/hooks/use-toast";
import { googleAuthService } from "@/services/googleAuthService";
import { googleSheetsService } from "@/services/googleSheetsService";

const Index = () => {
  const [userType, setUserType] = useState<"client" | "admin" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (googleAuthService.isAuthenticated()) {
          setIsAuthenticated(true);
          const savedUserType = localStorage.getItem('user_type') as "client" | "admin" | null;
          const currentUser = googleAuthService.getCurrentUser();
          
          if (savedUserType) {
            setUserType(savedUserType);
          }
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
        // Ha hiba van, töröljük a tárolt adatokat
        localStorage.clear();
        setIsAuthenticated(false);
        setUserType(null);
        setUser(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleGoogleAuth = async (type: "client" | "admin") => {
    setIsLoading(true);
    
    try {
      const result = await googleAuthService.signIn();
      
      if (result.accessToken) {
        // Állítsuk be a tokent a Google Sheets szolgáltatásban
        googleSheetsService.setAccessToken(result.accessToken);
        
        // Mentsük el a felhasználó típusát
        localStorage.setItem('user_type', type);
        
        setUserType(type);
        setIsAuthenticated(true);
        setUser(result.user);
        
        toast({
          title: "Sikeres bejelentkezés",
          description: `Üdvözölünk a FitTracker Pro-ban, ${result.user?.user?.name || 'Felhasználó'}!`,
        });
      }
    } catch (error) {
      console.error('Bejelentkezési hiba:', error);
      toast({
        title: "Bejelentkezési hiba",
        description: "Nem sikerült bejelentkezni. Kérjük, próbáld újra!",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await googleAuthService.signOut();
      setIsAuthenticated(false);
      setUserType(null);
      setUser(null);
      
      toast({
        title: "Sikeres kijelentkezés",
        description: "Biztonságosan kijelentkeztél.",
      });
    } catch (error) {
      console.error('Kijelentkezési hiba:', error);
      toast({
        title: "Kijelentkezési hiba",
        description: "Hiba történt a kijelentkezés során.",
        variant: "destructive"
      });
    }
  };

  const handleDownloadApp = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      toast({
        title: "iOS Telepítés",
        description: "Safari böngészőben nyisd meg az oldalt, majd kattints a 'Megosztás' gombra és válaszd a 'Hozzáadás a kezdőképernyőhöz' opciót.",
      });
    } else if (isAndroid) {
      toast({
        title: "Android Telepítés",
        description: "Chrome böngészőben a címsor mellett megjelenik egy 'Telepítés' ikon. Kattints rá és kövesd az utasításokat.",
      });
    } else {
      toast({
        title: "Asztali telepítés",
        description: "A böngésző címsorában megjelenik egy telepítés ikon. Kattints rá az alkalmazás telepítéséhez.",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent mb-4">
                FitTracker Pro
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Professzionális edzés- és étrendkövető rendszer személyi edzőknek és klienseiknek
              </p>
              
              {/* Letöltési gomb */}
              <Button
                onClick={handleDownloadApp}
                className="mb-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                Alkalmazás letöltése
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <Card className="border-2 border-gray-700 bg-gray-900 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-yellow-400" />
                  </div>
                  <CardTitle className="text-2xl text-yellow-400">Kliens Belépés</CardTitle>
                  <CardDescription className="text-gray-300">
                    Követd az edzéseidet, testsúlyodat és étrendedet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleGoogleAuth("client")} 
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 text-lg font-medium"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    {isLoading ? "Bejelentkezés..." : "Belépés Google-lel"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-2 border-gray-700 bg-gray-900 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-yellow-400" />
                  </div>
                  <CardTitle className="text-2xl text-yellow-400">Edző Belépés</CardTitle>
                  <CardDescription className="text-gray-300">
                    Kövesd a klienseid haladását és kezeld az adatokat
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleGoogleAuth("admin")} 
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 text-lg font-medium"
                  >
                    <Target className="w-5 h-5 mr-2" />
                    {isLoading ? "Bejelentkezés..." : "Admin Belépés"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="mt-16 grid md:grid-cols-3 gap-6 text-center">
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Edzéskövetés</h3>
                <p className="text-gray-400">Rögzítsd ismétléseidet és súlyaidat egyszerűen</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <Apple className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Étrendtervezés</h3>
                <p className="text-gray-400">Kövesd és tervezd az étkezéseidet</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">Google Integráció</h3>
                <p className="text-gray-400">Automatikus szinkronizálás Google Sheets-szel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-4">
        {user && (
          <div className="text-white text-sm">
            Üdv, {user.user?.name || user.name || 'Felhasználó'}!
          </div>
        )}
        <Button
          onClick={handleDownloadApp}
          variant="outline"
          size="sm"
          className="border-green-400 text-green-400 hover:bg-green-400 hover:text-black"
        >
          <Smartphone className="w-4 h-4 mr-1" />
          Letöltés
        </Button>
        <Button 
          onClick={handleSignOut}
          variant="outline"
          className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
        >
          Kijelentkezés
        </Button>
      </div>
      {userType === "client" ? <ClientDashboard /> : <AdminPanel />}
    </div>
  );
};

export default Index;
