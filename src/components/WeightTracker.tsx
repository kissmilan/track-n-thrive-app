
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Scale, TrendingDown, TrendingUp, Save, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService, WeightEntry } from "@/services/googleSheetsService";

const WeightTracker = () => {
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    weight: 0,
    sleep: 5,
    stress: 5,
    fatigue: 5,
    motivation: 5,
    training: 5,
    notes: ""
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Get today's date in Hungarian format
  const getTodayDate = () => {
    const today = new Date();
    return today.toLocaleDateString('hu-HU');
  };

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
    if (newEntry.weight <= 0) {
      toast({
        title: "Hiba",
        description: "Add meg a testsúlyodat!",
        variant: "destructive",
      });
      return;
    }

    const success = await googleSheetsService.saveWeightEntry(newEntry);
    if (success) {
      const today = getTodayDate();
      const entryWithDate = { ...newEntry, date: today };
      setWeightEntries([...weightEntries, entryWithDate]);
      setNewEntry({
        weight: 0,
        sleep: 5,
        stress: 5,
        fatigue: 5,
        motivation: 5,
        training: 5,
        notes: ""
      });
      toast({
        title: "Bejegyzés mentve!",
        description: "Testsúly és wellness adatok sikeresen rögzítve.",
      });
    } else {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült menteni az adatokat. Próbáld újra!",
        variant: "destructive",
      });
    }
  };

  const getScaleColor = (value: number, type: 'positive' | 'negative') => {
    if (type === 'positive') {
      return value >= 7 ? 'text-green-400' : value >= 4 ? 'text-yellow-400' : 'text-red-400';
    } else {
      return value <= 3 ? 'text-green-400' : value <= 6 ? 'text-yellow-400' : 'text-red-400';
    }
  };

  const getScaleBg = (value: number, type: 'positive' | 'negative') => {
    if (type === 'positive') {
      return value >= 7 ? 'bg-green-900/30 border-green-700' : value >= 4 ? 'bg-yellow-900/30 border-yellow-700' : 'bg-red-900/30 border-red-700';
    } else {
      return value <= 3 ? 'bg-green-900/30 border-green-700' : value <= 6 ? 'bg-yellow-900/30 border-yellow-700' : 'bg-red-900/30 border-red-700';
    }
  };

  const calculateTrend = () => {
    if (weightEntries.length < 2) return null;
    const recent = weightEntries.slice(-7); // Last week
    const first = recent[0]?.weight || 0;
    const last = recent[recent.length - 1]?.weight || 0;
    const change = last - first;
    return { change: Math.round(change * 10) / 10, direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable' };
  };

  const trend = calculateTrend();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center text-white">
          <p>Testsúly adatok betöltése...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Calendar className="w-5 h-5" />
            Új bejegyzés - {getTodayDate()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Testsúly (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={newEntry.weight || ''}
                onChange={(e) => setNewEntry({...newEntry, weight: parseFloat(e.target.value) || 0})}
                placeholder="pl. 75.5"
                className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Wellness értékelés (1-10 skála)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg border ${getScaleBg(newEntry.sleep, 'positive')}`}>
                <Label className="text-gray-300">Alvás minősége</Label>
                <div className="mt-2">
                  <Slider
                    value={[newEntry.sleep]}
                    onValueChange={(value) => setNewEntry({...newEntry, sleep: value[0]})}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className={`text-center mt-2 text-2xl font-bold ${getScaleColor(newEntry.sleep, 'positive')}`}>
                    {newEntry.sleep}/10
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${getScaleBg(newEntry.stress, 'negative')}`}>
                <Label className="text-gray-300">Stressz szint</Label>
                <div className="mt-2">
                  <Slider
                    value={[newEntry.stress]}
                    onValueChange={(value) => setNewEntry({...newEntry, stress: value[0]})}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className={`text-center mt-2 text-2xl font-bold ${getScaleColor(newEntry.stress, 'negative')}`}>
                    {newEntry.stress}/10
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${getScaleBg(newEntry.fatigue, 'negative')}`}>
                <Label className="text-gray-300">Fáradtság</Label>
                <div className="mt-2">
                  <Slider
                    value={[newEntry.fatigue]}
                    onValueChange={(value) => setNewEntry({...newEntry, fatigue: value[0]})}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className={`text-center mt-2 text-2xl font-bold ${getScaleColor(newEntry.fatigue, 'negative')}`}>
                    {newEntry.fatigue}/10
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${getScaleBg(newEntry.motivation, 'positive')}`}>
                <Label className="text-gray-300">Motiváció</Label>
                <div className="mt-2">
                  <Slider
                    value={[newEntry.motivation]}
                    onValueChange={(value) => setNewEntry({...newEntry, motivation: value[0]})}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className={`text-center mt-2 text-2xl font-bold ${getScaleColor(newEntry.motivation, 'positive')}`}>
                    {newEntry.motivation}/10
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg border ${getScaleBg(newEntry.training, 'positive')} md:col-span-2`}>
                <Label className="text-gray-300">Edzés intenzitás</Label>
                <div className="mt-2">
                  <Slider
                    value={[newEntry.training]}
                    onValueChange={(value) => setNewEntry({...newEntry, training: value[0]})}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className={`text-center mt-2 text-2xl font-bold ${getScaleColor(newEntry.training, 'positive')}`}>
                    {newEntry.training}/10
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label className="text-gray-300">Jegyzetek (opcionális)</Label>
            <Textarea
              value={newEntry.notes}
              onChange={(e) => setNewEntry({...newEntry, notes: e.target.value})}
              placeholder="Megjegyzések a naphoz..."
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <Button onClick={saveEntry} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
            <Save className="w-4 h-4 mr-2" />
            Bejegyzés mentése
          </Button>
        </CardContent>
      </Card>

      {weightEntries.length > 0 && (
        <>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Scale className="w-5 h-5" />
                Testsúly trend
                {trend && (
                  <Badge className={`ml-2 ${
                    trend.direction === 'down' ? 'bg-green-600' : 
                    trend.direction === 'up' ? 'bg-red-600' : 'bg-gray-600'
                  }`}>
                    {trend.direction === 'down' && <TrendingDown className="w-3 h-3 mr-1" />}
                    {trend.direction === 'up' && <TrendingUp className="w-3 h-3 mr-1" />}
                    {trend.change > 0 ? '+' : ''}{trend.change} kg
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightEntries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      labelStyle={{ color: '#F3F4F6' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#FBBF24" 
                      strokeWidth={3}
                      dot={{ fill: '#FBBF24', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Korábbi bejegyzések</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weightEntries.slice(-10).reverse().map((entry, index) => (
                  <div key={index} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">{entry.date}</span>
                      <Badge className="bg-yellow-400 text-black">
                        {entry.weight} kg
                      </Badge>
                    </div>
                    <div className="grid grid-cols-5 gap-2 text-sm">
                      <div className="text-center">
                        <div className="text-gray-400">Alvás</div>
                        <div className={`font-semibold ${getScaleColor(entry.sleep, 'positive')}`}>
                          {entry.sleep}/10
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Stressz</div>
                        <div className={`font-semibold ${getScaleColor(entry.stress, 'negative')}`}>
                          {entry.stress}/10
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Fáradtság</div>
                        <div className={`font-semibold ${getScaleColor(entry.fatigue, 'negative')}`}>
                          {entry.fatigue}/10
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Motiváció</div>
                        <div className={`font-semibold ${getScaleColor(entry.motivation, 'positive')}`}>
                          {entry.motivation}/10
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-400">Edzés</div>
                        <div className={`font-semibold ${getScaleColor(entry.training, 'positive')}`}>
                          {entry.training}/10
                        </div>
                      </div>
                    </div>
                    {entry.notes && (
                      <div className="mt-2 text-sm text-gray-300 italic">
                        "{entry.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WeightTracker;
