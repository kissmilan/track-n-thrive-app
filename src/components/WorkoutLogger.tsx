import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, PlayCircle, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService, WorkoutSheet, WorkoutExercise } from "@/services/googleSheetsService";
const WorkoutLogger = () => {
  const [workoutSheets, setWorkoutSheets] = useState<WorkoutSheet[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [currentExercises, setCurrentExercises] = useState<WorkoutExercise[]>([]);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const loadWorkoutSheets = async () => {
      const sheets = await googleSheetsService.getWorkoutSheets();
      setWorkoutSheets(sheets);
      if (sheets.length > 0) {
        setSelectedSheet(sheets[0].name);
        setCurrentExercises(sheets[0].weeks[0]?.exercises || []);
      }
    };
    loadWorkoutSheets();
  }, []);
  useEffect(() => {
    if (selectedSheet && workoutSheets.length > 0) {
      const sheet = workoutSheets.find(s => s.name === selectedSheet);
      if (sheet) {
        const week = sheet.weeks.find(w => w.weekNumber === selectedWeek);
        setCurrentExercises(week?.exercises || []);
      }
    }
  }, [selectedSheet, selectedWeek, workoutSheets]);
  const updateExerciseSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: number) => {
    setCurrentExercises(prev => prev.map((exercise, eIndex) => {
      if (eIndex === exerciseIndex) {
        const newSets = [...exercise.sets];
        if (!newSets[setIndex]) {
          newSets[setIndex] = {
            weight: 0,
            reps: 0
          };
        }
        newSets[setIndex] = {
          ...newSets[setIndex],
          [field]: value
        };
        return {
          ...exercise,
          sets: newSets
        };
      }
      return exercise;
    }));
  };
  const addSetToExercise = (exerciseIndex: number) => {
    setCurrentExercises(prev => prev.map((exercise, eIndex) => {
      if (eIndex === exerciseIndex && exercise.sets.length < 5) {
        return {
          ...exercise,
          sets: [...exercise.sets, {
            weight: 0,
            reps: 0
          }]
        };
      }
      return exercise;
    }));
  };
  const removeSetFromExercise = (exerciseIndex: number, setIndex: number) => {
    setCurrentExercises(prev => prev.map((exercise, eIndex) => {
      if (eIndex === exerciseIndex) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, sIndex) => sIndex !== setIndex)
        };
      }
      return exercise;
    }));
  };
  const markExerciseComplete = (exerciseIndex: number) => {
    setCurrentExercises(prev => prev.map((exercise, eIndex) => {
      if (eIndex === exerciseIndex) {
        return {
          ...exercise,
          completed: !exercise.completed
        };
      }
      return exercise;
    }));
  };
  const saveWorkout = async () => {
    if (!selectedSheet) {
      toast({
        title: "Hiba",
        description: "Válassz edzés típust!",
        variant: "destructive"
      });
      return;
    }
    const success = await googleSheetsService.saveWorkoutData(selectedSheet, selectedWeek, currentExercises);
    if (success) {
      toast({
        title: "Edzés mentve!",
        description: `${selectedSheet} - ${selectedWeek}. hét sikeresen mentve.`
      });
    } else {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült menteni az edzést. Próbáld újra!",
        variant: "destructive"
      });
    }
  };
  const completedExercises = currentExercises.filter(e => e.completed).length;
  const totalExercises = currentExercises.length;
  return <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Edzés kiválasztása</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Edzés típusa</Label>
              <Select value={selectedSheet} onValueChange={setSelectedSheet}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="Válassz edzést" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {workoutSheets.map(sheet => <SelectItem key={sheet.name} value={sheet.name} className="text-white">
                      {sheet.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Hét száma</Label>
              <Select value={selectedWeek.toString()} onValueChange={value => setSelectedWeek(parseInt(value))}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(week => <SelectItem key={week} value={week.toString()} className="text-white">
                      {week}. hét
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {totalExercises > 0 && <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                {completedExercises}/{totalExercises} gyakorlat kész
              </Badge>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full transition-all duration-300" style={{
              width: `${totalExercises > 0 ? completedExercises / totalExercises * 100 : 0}%`
            }} />
              </div>
            </div>}
        </CardContent>
      </Card>

      {currentExercises.map((exercise, exerciseIndex) => <Card key={exerciseIndex} className={`border-2 ${exercise.completed ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-900'}`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-white">{exercise.name}</CardTitle>
                  {exercise.videoUrl && <Button variant="outline" size="sm" className="text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-black">
                      <PlayCircle className="w-4 h-4 mr-1" />
                      Videó
                    </Button>}
                </div>
                <div className="flex gap-4 text-sm text-gray-400">
                  <span className="text-xl text-[#ffdb58] font-medium">Munka sorozatok: {exercise.workSets}</span>
                  <span className="text-xl text-[#ffdb58] font-medium">Ismétlések: {exercise.repRange}</span>
                </div>
              </div>
              <Button variant={exercise.completed ? "default" : "outline"} size="sm" onClick={() => markExerciseComplete(exerciseIndex)} className={exercise.completed ? "bg-green-600 hover:bg-green-700" : "border-gray-600 hover:bg-gray-800"}>
                {exercise.completed ? <CheckCircle className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercise.sets.map((set, setIndex) => <div key={setIndex} className="flex gap-2 items-center">
                <Label className="w-20 text-gray-300">{setIndex + 1}. sorozat</Label>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-400">Súly (kg)</Label>
                    <Input type="number" value={set.weight || ''} onChange={e => updateExerciseSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)} placeholder="0" step="0.5" className="bg-gray-800 border-gray-600 text-white placeholder-gray-400" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Ismétlés</Label>
                    <Input type="number" value={set.reps || ''} onChange={e => updateExerciseSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)} placeholder="0" className="bg-gray-800 border-gray-600 text-white placeholder-gray-400" />
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => removeSetFromExercise(exerciseIndex, setIndex)} className="text-red-400 border-gray-600 hover:bg-red-900/20">
                  <X className="w-4 h-4" />
                </Button>
              </div>)}
            
            {exercise.sets.length < 5 && <Button variant="outline" onClick={() => addSetToExercise(exerciseIndex)} className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                <Plus className="w-4 h-4 mr-2" />
                Újabb sorozat
              </Button>}
          </CardContent>
        </Card>)}

      {currentExercises.length > 0 && <Button onClick={saveWorkout} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
          <Save className="w-4 h-4 mr-2" />
          Edzés mentése
        </Button>}
    </div>;
};
export default WorkoutLogger;