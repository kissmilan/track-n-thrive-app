
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
        // Ellenőrizzük a localStorage-ban tárolt adatokat
        const savedUserType = localStorage.getItem('user_type') as "client" | "admin" | null;
        const googleToken = localStorage.getItem('google_id_token');
        const currentUser = localStorage.getItem('google_auth_user');
        
        if (googleToken && currentUser && savedUserType) {
          setIsAuthenticated(true);
          setUserType(savedUserType);
          setUser(JSON.parse(currentUser));
        } else if (googleAuthService.isAuthenticated()) {
          // Fallback a régi módszerre
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
