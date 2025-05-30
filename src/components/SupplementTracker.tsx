
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Pill, CheckCircle, Clock, Coffee, Moon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService, Supplement } from "@/services/googleSheetsService";

const SupplementTracker = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadSupplements = async () => {
      setLoading(true);
      const supplementData = await googleSheetsService.getSupplements();
      setSupplements(supplementData);
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
      title: supplement.taken ? "Tápkiegészítő visszavonva" : "Tápkiegészítő bevéve",
      description: `${supplement.name} ${supplement.taken ? 'visszavonva' : 'megjelölve bevettként'}.`,
    });
  };

  const categoryColors = {
    vitamin: "bg-orange-500",
    digestive: "bg-green-500", 
    joint: "bg-blue-500",
    extract: "bg-purple-500",
    sleep: "bg-indigo-500",
    'pre-workout': "bg-red-500"
  };

  const categoryNames = {
    vitamin: "Vitaminok",
    digestive: "Emésztés javítók",
    joint: "Ízületvédők", 
    extract: "Extrakt",
    sleep: "Alvás",
    'pre-workout': "Edzés előtti"
  };

  const getTimingIcon = (timing: string) => {
    if (timing.toLowerCase().includes('reggel')) return <Coffee className="w-4 h-4" />;
    if (timing.toLowerCase().includes('este')) return <Moon className="w-4 h-4" />;
    return <Clock className="w-4 h-4" />;
  };

  const groupedSupplements = supplements.reduce((acc, supplement) => {
    if (!acc[supplement.category]) {
      acc[supplement.category] = [];
    }
    acc[supplement.category].push(supplement);
    return acc;
  }, {} as Record<string, Supplement[]>);

  const takenCount = supplements.filter(s => s.taken).length;
  const totalCount = supplements.length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <p>Tápkiegészítők betöltése...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Mai tápkiegészítők
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{takenCount}/{totalCount}</div>
              <p className="text-black/70">bevéve ma</p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-8 h-8" />
              <div className="w-20 bg-black/20 rounded-full h-2">
                <div 
                  className="bg-black h-2 rounded-full transition-all duration-300" 
                  style={{width: `${totalCount > 0 ? (takenCount / totalCount) * 100 : 0}%`}}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedSupplements).map(([category, categorySupplements]) => (
        <Card key={category} className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors]}`} />
              {categoryNames[category as keyof typeof categoryNames]}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {categorySupplements.map((supplement, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  supplement.taken 
                    ? 'bg-green-900/30 border-green-500' 
                    : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={supplement.taken}
                      onCheckedChange={() => toggleSupplement(supplements.indexOf(supplement))}
                      className="border-gray-400"
                    />
                    <div>
                      <h3 className="font-semibold text-white">{supplement.name}</h3>
                      <p className="text-sm text-gray-400">{supplement.description}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="outline" className="text-gray-300 border-gray-500">
                          {supplement.dosage}
                        </Badge>
                        <div className="flex items-center gap-1 text-gray-400">
                          {getTimingIcon(supplement.timing)}
                          <span className="text-sm">{supplement.timing}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {supplement.taken && (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Card className="bg-gray-800 border-gray-600">
        <CardContent className="pt-6">
          <div className="text-center text-gray-300">
            <Pill className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-sm">
              A tápkiegészítők pontos adagolásáért és időzítéséért konzultálj orvossal vagy táplálkozási szakértővel.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupplementTracker;
