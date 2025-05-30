
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Pill, Clock, Target, AlertCircle } from "lucide-react";

const SupplementInfo = () => {
  const supplements = [
    {
      name: "Kreatin Monohidrát",
      dosage: "5g",
      timing: "Edzés után",
      goal: "Erő és teljesítmény növelés",
      importance: "high",
      description: "Segít az izomépítésben és az erő fejlesztésében."
    },
    {
      name: "Szenior Protein",
      dosage: "30g",
      timing: "Edzés után 30 percen belül",
      goal: "Izomnövekedés",
      importance: "high",
      description: "Gyors felszívódású fehérje az izomépiés optimalizálásához."
    },
    {
      name: "D3 Vitamin",
      dosage: "2000 IU",
      timing: "Reggel étkezéssel",
      goal: "Immunrendszer támogatás",
      importance: "medium",
      description: "Támogatja a csontegészséget és az immunrendszert."
    },
    {
      name: "Omega-3",
      dosage: "1000mg",
      timing: "Vacsorával",
      goal: "Gyulladáscsökkentés",
      importance: "medium",
      description: "Segít a regenerációban és csökkenti a gyulladást."
    },
    {
      name: "Multivitamin",
      dosage: "1 kapszula",
      timing: "Reggeli után",
      goal: "Általános egészség",
      importance: "low",
      description: "Biztosítja a napi vitaminszükségletet."
    }
  ];

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high": return "bg-red-500";
      case "medium": return "bg-orange-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getImportanceText = (importance: string) => {
    switch (importance) {
      case "high": return "Magas prioritás";
      case "medium": return "Közepes prioritás";
      case "low": return "Alacsony prioritás";
      default: return "Ismeretlen";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ajánlott kiegészítők</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          Részletes útmutató (Google Docs)
        </Button>
      </div>

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
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  {supplement.name}
                </CardTitle>
                <Badge className={getImportanceColor(supplement.importance)}>
                  {getImportanceText(supplement.importance)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600">{supplement.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Pill className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Adagolás</p>
                    <p className="font-semibold">{supplement.dosage}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Időzítés</p>
                    <p className="font-semibold">{supplement.timing}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cél</p>
                    <p className="font-semibold">{supplement.goal}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Személyre szabott tanácsok</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Az itt látható ajánlások az általános fitness célokra vonatkoznak. 
            A személyre szabott kiegészítő tervet a részletes útmutatóban találod.
          </p>
          <Button className="w-full" variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Személyes kiegészítő terv megtekintése
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementInfo;
