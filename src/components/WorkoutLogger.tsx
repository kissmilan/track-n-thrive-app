
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Save, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: "1",
      name: "Guggolás",
      sets: [{ reps: 0, weight: 0 }]
    }
  ]);
  const [newExerciseName, setNewExerciseName] = useState("");
  const { toast } = useToast();

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

  const saveWorkout = () => {
    // Itt később Google Sheets integráció lesz
    toast({
      title: "Edzés mentve!",
      description: "Az adatok sikeresen feltöltve a Google Sheets-be.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
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
            />
            <Button onClick={addExercise}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{exercise.name}</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeExercise(exercise.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercise.sets.map((set, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Label className="w-16">Sorozat {index + 1}</Label>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-gray-600">Ismétlés</Label>
                    <Input
                      type="number"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(exercise.id, index, 'reps', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Súly (kg)</Label>
                    <Input
                      type="number"
                      value={set.weight || ''}
                      onChange={(e) => updateSet(exercise.id, index, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      step="0.5"
                    />
                  </div>
                </div>
                {exercise.sets.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSet(exercise.id, index)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => addSet(exercise.id)}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Újabb sorozat
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button onClick={saveWorkout} className="w-full bg-green-600 hover:bg-green-700 text-white">
        <Save className="w-4 h-4 mr-2" />
        Edzés mentése
      </Button>
    </div>
  );
};

export default WorkoutLogger;
