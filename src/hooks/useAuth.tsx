
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { googleAuthService } from "@/services/googleAuthService";

export const useAuth = () => {
  const [userType, setUserType] = useState<"client" | "admin" | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedUserType = localStorage.getItem('user_type') as "client" | "admin" | null;
        const googleToken = localStorage.getItem('google_id_token');
        const currentUser = localStorage.getItem('google_auth_user');
        
        if (googleToken && currentUser && savedUserType) {
          setIsAuthenticated(true);
          setUserType(savedUserType);
          setUser(JSON.parse(currentUser));
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
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
      // A Google auth már megtörtént a GoogleLoginButton-ban
      // Itt csak beállítjuk a user type-ot
      localStorage.setItem('user_type', type);
      
      const currentUser = localStorage.getItem('google_auth_user');
      if (currentUser) {
        setUserType(type);
        setIsAuthenticated(true);
        setUser(JSON.parse(currentUser));
        
        const userObj = JSON.parse(currentUser);
        toast({
          title: "Sikeres bejelentkezés",
          description: `Üdvözölünk a FitTracker Pro-ban, ${userObj.user?.name || 'Felhasználó'}!`,
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

  return {
    userType,
    isAuthenticated,
    isLoading,
    user,
    handleGoogleAuth,
    handleSignOut,
    handleDownloadApp
  };
};
