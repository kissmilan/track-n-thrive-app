
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
  const [isStandalone, setIsStandalone] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if app is already installed
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode || isIOSStandalone);
    };

    checkStandalone();

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      console.log('App installed');
      setDeferredPrompt(null);
      setCanInstall(false);
      setIsStandalone(true);
      toast({
        title: "Alkalmazás telepítve!",
        description: "A FitTracker Pro sikeresen telepítve lett az eszközödre.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkStandalone);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', checkStandalone);
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
    console.log('Install prompt requested', { canInstall, deferredPrompt, isStandalone });

    if (isStandalone) {
      toast({
        title: "Már telepítve",
        description: "Az alkalmazás már telepítve van az eszközödön!",
      });
      return;
    }

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
      console.log('Showing install prompt');
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      console.log('User choice:', choiceResult.outcome);
      
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
    canInstall: canInstall && isMobile() && !isStandalone,
    isInstalling,
    showInstallPrompt,
    isMobile: isMobile(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isStandalone
  };
};
