
import { Button } from "@/components/ui/button";
import { Download, Apple, Activity, Target } from "lucide-react";

interface WelcomeScreenProps {
  onDownloadApp: () => void;
}

const WelcomeScreen = ({ onDownloadApp }: WelcomeScreenProps) => {
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
            
            <Button
              onClick={onDownloadApp}
              className="mb-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg font-medium"
            >
              <Download className="w-5 h-5 mr-2" />
              Alkalmazás letöltése
            </Button>
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
};

export default WelcomeScreen;
