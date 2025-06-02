
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setCanInstall(false);
      toast({
        title: "Alkalmazás telepítve!",
        description: "A FitTracker Pro sikeresen telepítve lett az eszközödre.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };

  const showInstallPrompt = async () => {
    if (!canInstall || !deferredPrompt) {
      // iOS specifikus instrukciók
      if (isIOS()) {
        toast({
          title: "iOS Telepítés",
          description: "Safari böngészőben nyisd meg az oldalt, majd kattints a 'Megosztás' gombra és válaszd a 'Hozzáadás a kezdőképernyőhöz' opciót.",
        });
        return;
      }
      
      // Android specifikus instrukciók
      if (isAndroid()) {
        toast({
          title: "Android Telepítés",
          description: "Chrome böngészőben a címsor mellett megjelenik egy 'Telepítés' ikon. Kattints rá és kövesd az utasításokat.",
        });
        return;
      }

      // Asztali telepítés
      toast({
        title: "Telepítés nem támogatott",
        description: "Ez az eszköz nem támogatja az automatikus telepítést. Próbáld meg egy mobileszközön!",
        variant: "destructive"
      });
      return;
    }

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        toast({
          title: "Telepítés elkezdődött",
          description: "Az alkalmazás telepítése folyamatban...",
        });
      } else {
        toast({
          title: "Telepítés megszakítva",
          description: "A telepítés nem történt meg.",
        });
      }
      
      setDeferredPrompt(null);
      setCanInstall(false);
    } catch (error) {
      console.error('PWA telepítési hiba:', error);
      toast({
        title: "Telepítési hiba",
        description: "Hiba történt a telepítés során. Próbáld újra!",
        variant: "destructive"
      });
    } finally {
      setIsInstalling(false);
    }
  };

  return {
    canInstall: canInstall && isMobile(),
    isInstalling,
    showInstallPrompt,
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid()
  };
};
