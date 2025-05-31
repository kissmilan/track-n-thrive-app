
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExternalLink, Pill, Clock, Target, AlertCircle, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService, Supplement } from "@/services/googleSheetsService";

const SupplementTracker = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSupplements = async () => {
      setLoading(true);
      const supplementsData = await googleSheetsService.getSupplements();
      setSupplements(supplementsData);
      setLoading(false);
    };
    
    loadSupplements();
  }, []);

  const toggleSupplement = (index: number) => {
    setSupplements(prev => prev.map((supplement, i) => 
      i === index ? { ...supplement, taken: !supplement.taken } : supplement
    ));
    
    const supplement = supplements[index];
    toast({
      title: supplement.taken ? "Kiegészítő eltávolítva" : "Kiegészítő felvéve",
      description: `${supplement.name} ${supplement.taken ? 'eltávolítva a mai listából' : 'hozzáadva a mai listához'}.`,
    });
  };

  const handlePurchase = (supplement: Supplement) => {
    if (supplement.purchaseLink) {
      window.open(supplement.purchaseLink, '_blank');
      toast({
        title: "Átirányítás a vásárláshoz",
        description: `Megnyílik a ${supplement.name} vásárlási oldala.`,
      });
    } else {
      toast({
        title: "Nincs vásárlási link",
        description: "Ehhez a kiegészítőhöz nincs beállítva vásárlási link.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "vitamin": return "bg-blue-500";
      case "digestive": return "bg-green-500";
      case "joint": return "bg-purple-500";
      case "extract": return "bg-orange-500";
      case "sleep": return "bg-indigo-500";
      case "pre-workout": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case "vitamin": return "Vitamin";
      case "digestive": return "Emésztés";
      case "joint": return "Ízület";
      case "extract": return "Kivonat";
      case "sleep": return "Alvás";
      case "pre-workout": return "Edzés előtti";
      default: return "Egyéb";
    }
  };

  const takenToday = supplements.filter(s => s.taken).length;
  const totalSupplements = supplements.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <p>Kiegészítők betöltése...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Ajánlott kiegészítők</h2>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
          onClick={() => window.open('https://docs.google.com/document/d/example', '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
          Részletes útmutató
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Mai előrehaladás
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{takenToday}/{totalSupplements}</div>
          <p className="text-black/70">kiegészítő bevéve ma</p>
          <div className="w-full bg-black/20 rounded-full h-2 mt-2">
            <div 
              className="bg-black h-2 rounded-full transition-all duration-300" 
              style={{width: `${totalSupplements > 0 ? (takenToday / totalSupplements) * 100 : 0}%`}}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Fontos tudnivalók
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-blue-100">
            <li>• A kiegészítők nem helyettesítik a kiegyensúlyozott étrendet</li>
            <li>• Konzultálj orvossal új kiegészítő bevétele előtt</li>
            <li>• Tartsd be az ajánlott adagolást</li>
            <li>• Rendszeresen ellenőrizd a lejárati dátumokat</li>
          </ul>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {supplements.map((supplement, index) => (
          <Card key={index} className={`transition-all duration-300 ${
            supplement.taken ? 'bg-green-900/30 border-green-700' : 'bg-gray-900 border-gray-700'
          }`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={supplement.taken}
                    onCheckedChange={() => toggleSupplement(index)}
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                  <div>
                    <CardTitle className="flex items-center gap-2 text-white">
                      <Pill className="w-5 h-5" />
                      {supplement.name}
                    </CardTitle>
                    <Badge className={getCategoryColor(supplement.category)}>
                      {getCategoryText(supplement.category)}
                    </Badge>
                  </div>
                </div>
                {supplement.purchaseLink && (
                  <Button
                    onClick={() => handlePurchase(supplement)}
                    size="sm"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Vásárlás
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">{supplement.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Pill className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Adagolás</p>
                    <p className="font-semibold text-white">{supplement.dosage}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Időzítés</p>
                    <p className="font-semibold text-white">{supplement.timing}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Személyre szabott tanácsok</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Az itt látható ajánlások az általános fitness célokra vonatkoznak. 
            A személyre szabott kiegészítő tervet a részletes útmutatóban találod.
          </p>
          <Button 
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black" 
            onClick={() => window.open('https://docs.google.com/document/d/example', '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Személyes kiegészítő terv megtekintése
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementTracker;
