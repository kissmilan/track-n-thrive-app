
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { googleSheetsService } from "@/services/googleSheetsService";

interface WorkoutSet {
  reps: number;
  weight: number;
}

interface Exercise {
  id: string;
  name: string;
  sets: WorkoutSet[];
}

const WorkoutLogger = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    // Load available exercises from Google Sheets
    const loadExercises = async () => {
      const exercises = await googleSheetsService.getWorkoutExercises();
      setAvailableExercises(exercises);
      
      // Initialize with first exercise if none exist
      if (exercises.length > 0) {
        setExercises([{
          id: "1",
          name: exercises[0],
          sets: [{ reps: 0, weight: 0 }]
        }]);
      }
    };
    
    loadExercises();
  }, []);

  const addExercise = () => {
    if (!newExerciseName.trim()) return;
    
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: newExerciseName,
      sets: [{ reps: 0, weight: 0 }]
    };
    
    setExercises([...exercises, newExercise]);
    setNewExerciseName("");
  };

  const addSet = (exerciseId: string) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: [...exercise.sets, { reps: 0, weight: 0 }] }
        : exercise
    ));
  };

  const updateSet = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? {
            ...exercise,
            sets: exercise.sets.map((set, index) => 
              index === setIndex ? { ...set, [field]: value } : set
            )
          }
        : exercise
    ));
  };

  const removeSet = (exerciseId: string, setIndex: number) => {
    setExercises(exercises.map(exercise => 
      exercise.id === exerciseId 
        ? { ...exercise, sets: exercise.sets.filter((_, index) => index !== setIndex) }
        : exercise
    ));
  };

  const removeExercise = (exerciseId: string) => {
    setExercises(exercises.filter(exercise => exercise.id !== exerciseId));
  };

  const saveWorkout = async () => {
    const workoutData = exercises.map(exercise => ({
      exercise: exercise.name,
      sets: exercise.sets,
      date: new Date().toISOString().split('T')[0]
    }));

    const success = await googleSheetsService.saveWorkoutData(workoutData);
    
    if (success) {
      toast({
        title: "Edzés mentve!",
        description: "Az adatok sikeresen feltöltve a Google Sheets-be.",
      });
    } else {
      toast({
        title: "Hiba történt",
        description: "Nem sikerült menteni az edzést. Próbáld újra!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Plus className="w-5 h-5" />
            Új gyakorlat hozzáadása
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Gyakorlat neve"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addExercise()}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              list="available-exercises"
            />
            <datalist id="available-exercises">
              {availableExercises.map((exercise, index) => (
                <option key={index} value={exercise} />
              ))}
            </datalist>
            <Button onClick={addExercise} className="bg-yellow-400 hover:bg-yellow-500 text-black">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {exercises.map((exercise) => (
        <Card key={exercise.id} className="bg-gray-900 border-gray-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">{exercise.name}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExercise(exercise.id)}
                className="text-red-400 hover:text-red-300 border-gray-600 hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercise.sets.map((set, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Label className="w-16 text-gray-300">Sorozat {index + 1}</Label>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-400">Ismétlés</Label>
                    <Input
                      type="number"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(exercise.id, index, 'reps', parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">Súly (kg)</Label>
                    <Input
                      type="number"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(exercise.id, index, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      step="0.5"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
                {exercise.sets.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSet(exercise.id, index)}
                    className="text-red-400 border-gray-600 hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addSet(exercise.id)}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Újabb sorozat
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button onClick={saveWorkout} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
        <Save className="w-4 h-4 mr-2" />
        Edzés mentése
      </Button>
    </div>
  );
};

export default WorkoutLogger;
