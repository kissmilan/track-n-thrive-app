
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Scale, TrendingDown, TrendingUp, Save, Moon, Zap, Heart, Target, Dumbbell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService, WeightEntry } from "@/services/googleSheetsService";

const WeightTracker = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<WeightEntry>>({
    date: new Date().toLocaleDateString('hu-HU', { month: '2-digit', day: '2-digit' }),
    weight: 0,
    sleep: 5,
    stress: 5,
    fatigue: 5,
    motivation: 5,
    training: 5
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadWeightEntries = async () => {
      setLoading(true);
      const entries = await googleSheetsService.getWeightEntries();
      setWeightEntries(entries);
      setLoading(false);
    };
    
    loadWeightEntries();
  }, []);

  const saveEntry = async () => {
    if (!newEntry.weight || newEntry.weight <= 0) {
      toast({
        title: "Hiba",
        description: "Kérlek add meg a testsúlyodat!",
        variant: "destructive",
      });
      return;
    }

    const entry: WeightEntry = {
      date: newEntry.date || new Date().toLocaleDateString('hu-HU', { month: '2-digit', day: '2-digit' }),
      weight: newEntry.weight,
      sleep: newEntry.sleep || 5,
      stress: newEntry.stress || 5,
      fatigue: newEntry.fatigue || 5,
      motivation: newEntry.motivation || 5,
      training: newEntry.training || 5,
      notes: newEntry.notes
    };

    const success = await googleSheetsService.saveWeightEntry(entry);
    
    if (success) {
      setWeightEntries([...weightEntries, entry]);
      setNewEntry({
        date: new Date().toLocaleDateString('hu-HU', { month: '2-digit', day: '2-digit' }),
        weight: 0,
        sleep: 5,
        stress: 5,
        fatigue: 5,
        motivation: 5,
        training: 5
      });
      
      toast({
        title: "Adatok mentve!",
        description: "Testsúly és wellness adatok sikeresen rögzítve.",
      });
    } else {
      toast({
        title: "Hiba",
        description: "Nem sikerült menteni az adatokat.",
        variant: "destructive",
      });
    }
  };

  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0;
  const targetWeight = 86; // A képen látható cél súly
  const trend = weightEntries.length >= 2 ? 
    weightEntries[weightEntries.length - 1].weight - weightEntries[weightEntries.length - 2].weight : 0;

  const latestEntry = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1] : null;
  const wellnessData = latestEntry ? [
    { subject: 'Alvás', value: latestEntry.sleep, fullMark: 10 },
    { subject: 'Stressz', value: 10 - latestEntry.stress, fullMark: 10 }, // Inverted for better visualization
    { subject: 'Fáradtság', value: 10 - latestEntry.fatigue, fullMark: 10 }, // Inverted
    { subject: 'Motiváció', value: latestEntry.motivation, fullMark: 10 },
    { subject: 'Edzés', value: latestEntry.training, fullMark: 10 }
  ] : [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <p>Adatok betöltése...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-3xl font-bold">{currentWeight} kg</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5" />
              Cél súly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{targetWeight} kg</div>
            <p className="text-black/70">{(currentWeight - targetWeight).toFixed(1)} kg hátra</p>
          </CardContent>
        </Card>

        <Card className={`${trend <= 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-orange-500 to-orange-600'} text-white`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              {trend <= 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
              Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {trend > 0 ? '+' : ''}{trend.toFixed(1)} kg
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Új bejegyzés rögzítése</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-gray-300">Dátum</Label>
              <Input
                id="date"
                value={newEntry.date}
                onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                placeholder="MM.DD"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="weight" className="text-gray-300">Testsúly (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={newEntry.weight || ''}
                onChange={(e) => setNewEntry({...newEntry, weight: parseFloat(e.target.value) || 0})}
                placeholder="91.60"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-300">
                <Moon className="w-4 h-4" />
                Alvás: {newEntry.sleep}/10
              </Label>
              <Slider
                value={[newEntry.sleep || 5]}
                onValueChange={(value) => setNewEntry({...newEntry, sleep: value[0]})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4" />
                Stressz: {newEntry.stress}/10
              </Label>
              <Slider
                value={[newEntry.stress || 5]}
                onValueChange={(value) => setNewEntry({...newEntry, stress: value[0]})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-300">
                <Zap className="w-4 h-4" />
                Fáradtság: {newEntry.fatigue}/10
              </Label>
              <Slider
                value={[newEntry.fatigue || 5]}
                onValueChange={(value) => setNewEntry({...newEntry, fatigue: value[0]})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-300">
                <Heart className="w-4 h-4" />
                Motiváció: {newEntry.motivation}/10
              </Label>
              <Slider
                value={[newEntry.motivation || 5]}
                onValueChange={(value) => setNewEntry({...newEntry, motivation: value[0]})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-300">
                <Dumbbell className="w-4 h-4" />
                Edzés: {newEntry.training}/10
              </Label>
              <Slider
                value={[newEntry.training || 5]}
                onValueChange={(value) => setNewEntry({...newEntry, training: value[0]})}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          <Button onClick={saveEntry} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
            <Save className="w-4 h-4 mr-2" />
            Adatok mentése
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Testsúly alakulása</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightEntries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#F3F4F6' }}
                    formatter={(value) => [`${value} kg`, 'Testsúly']}
                    labelFormatter={(label) => `Dátum: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#FDE047" 
                    strokeWidth={3}
                    dot={{ fill: '#FDE047', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {wellnessData.length > 0 && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Wellness állapot</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={wellnessData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                    <Radar
                      name="Wellness"
                      dataKey="value"
                      stroke="#FDE047"
                      fill="#FDE047"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WeightTracker;
