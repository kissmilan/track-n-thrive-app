
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Settings, Activity, Target } from "lucide-react";
import GoogleLoginButton from "./GoogleLoginButton";
import { useToast } from "@/hooks/use-toast";

interface AuthButtonsProps {
  onGoogleAuth: (type: "client" | "admin") => void;
  isLoading: boolean;
}

const AuthButtons = ({ onGoogleAuth, isLoading }: AuthButtonsProps) => {
  const { toast } = useToast();

  const handleGoogleSuccess = (userType: "client" | "admin") => (credential: string) => {
    console.log(`${userType} Google bejelentkezés sikeres:`, credential);
    
    // Dekódoljuk a JWT tokent hogy megkapjuk az email címet
    try {
      const payload = JSON.parse(atob(credential.split('.')[1]));
      const userEmail = payload.email;
      
      // Admin email ellenőrzés
      const adminEmails = ['kissmilan93@gmail.com']; // Itt add meg a saját admin email címedet
      const isAdmin = adminEmails.includes(userEmail);
      
      // Ha admin próbál kliens módban belépni, akkor admin módba irányítjuk
      const finalUserType = isAdmin ? 'admin' : userType;
      
      localStorage.setItem('google_id_token', credential);
      localStorage.setItem('google_auth_user', JSON.stringify({
        user: {
          email: userEmail,
          name: payload.name,
          imageUrl: payload.picture,
          id: payload.sub
        }
      }));
      
      toast({
        title: "Google bejelentkezés sikeres",
        description: `Sikeresen beléptél ${finalUserType === "client" ? "kliens" : "admin"} módban`,
      });
      
      onGoogleAuth(finalUserType);
    } catch (error) {
      console.error('Token dekódolási hiba:', error);
      toast({
        title: "Bejelentkezési hiba", 
        description: "Nem sikerült feldolgozni a Google tokent",
        variant: "destructive"
      });
    }
  };

  const handleGoogleError = () => {
    toast({
      title: "Google bejelentkezési hiba",
      description: "Nem sikerült bejelentkezni Google fiókkal",
      variant: "destructive"
    });
  };

  return (
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
        <CardContent className="space-y-4">
          <GoogleLoginButton 
            onSuccess={handleGoogleSuccess("client")}
            onError={handleGoogleError}
          />
          <div className="text-center text-gray-400 text-sm">vagy</div>
          <Button 
            onClick={() => onGoogleAuth("client")} 
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 text-lg font-medium"
          >
            <Activity className="w-5 h-5 mr-2" />
            {isLoading ? "Bejelentkezés..." : "Alternatív belépés"}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 border-gray-700 bg-gray-900 hover:border-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/20">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-400/20 rounded-full flex items-center justify-center">
            <Settings className="w-8 h-8 text-yellow-400" />
          </div>
          <CardTitle className="text-2xl text-yellow-400">Admin Belépés</CardTitle>
          <CardDescription className="text-gray-300">
            Kövesd a klienseid haladását és kezeld az adatokat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <GoogleLoginButton 
            onSuccess={handleGoogleSuccess("admin")}
            onError={handleGoogleError}
          />
          <div className="text-center text-gray-400 text-sm">vagy</div>
          <Button 
            onClick={() => onGoogleAuth("admin")} 
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3 text-lg font-medium"
          >
            <Target className="w-5 h-5 mr-2" />
            {isLoading ? "Bejelentkezés..." : "Admin Belépés"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthButtons;
