
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Scale, TrendingDown, TrendingUp, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const WeightTracker = () => {
  const [currentWeight, setCurrentWeight] = useState("");
  const { toast } = useToast();

  // Példa adatok
  const weightData = [
    { date: "01.15", weight: 76.2 },
    { date: "01.16", weight: 76.0 },
    { date: "01.17", weight: 75.8 },
    { date: "01.18", weight: 75.5 },
    { date: "01.19", weight: 75.3 },
    { date: "01.20", weight: 75.2 },
    { date: "01.21", weight: 75.2 },
  ];

  const saveWeight = () => {
    if (!currentWeight) {
      toast({
        title: "Hiba",
        description: "Kérlek add meg a testsúlyodat!",
        variant: "destructive",
      });
      return;
    }

    // Itt később Google Sheets integráció lesz
    toast({
      title: "Testsúly mentve!",
      description: `${currentWeight} kg sikeresen rögzítve.`,
    });
    setCurrentWeight("");
  };

  const trend = weightData[weightData.length - 1].weight - weightData[0].weight;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Scale className="w-5 h-5" />
              Jelenlegi súly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">75.2 kg</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cél súly</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">74.5 kg</div>
            <p className="text-green-100">-0.7 kg hátra</p>
          </CardContent>
        </Card>

        <Card className={`${trend < 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {trend < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
              Heti trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)} kg
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Testsúly rögzítése</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 max-w-md">
            <div className="flex-1">
              <Label htmlFor="weight">Testsúly (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                placeholder="75.5"
              />
            </div>
            <Button onClick={saveWeight} className="self-end">
              <Save className="w-4 h-4 mr-2" />
              Mentés
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testsúly alakulása</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['dataMin - 0.5', 'dataMax + 0.5']} />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, 'Testsúly']}
                  labelFormatter={(label) => `Dátum: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={{ fill: '#2563eb', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTracker;
