
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
    toast({
      title: "Google bejelentkezés sikeres",
      description: `Sikeresen beléptél ${userType === "client" ? "kliens" : "edző"} módban`,
    });
    // Itt később integrálhatjuk a meglévő auth rendszerrel
    onGoogleAuth(userType);
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
            {isLoading ? "Bejelentkezés..." : "Régi módszer (Google API)"}
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
            {isLoading ? "Bejelentkezés..." : "Admin Belépés (régi)"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthButtons;
