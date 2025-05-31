
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Target, ArrowLeft } from "lucide-react";
import { WorkoutExercise } from "@/services/googleSheetsService";

interface WorkoutSummaryProps {
  exercises: WorkoutExercise[];
  workoutType: string;
  weekNumber: number;
  onClose: () => void;
}

const WorkoutSummary = ({ exercises, workoutType, weekNumber, onClose }: WorkoutSummaryProps) => {
  const calculateStats = () => {
    let totalVolumeIncrease = 0;
    let improvementCount = 0;
    let totalWeight = 0;
    let strengthPercentage = 0;

    exercises.forEach(exercise => {
      exercise.sets.forEach(set => {
        if (set.weight > 0 && set.reps > 0) {
          totalWeight += set.weight * set.reps;
          
          if (exercise.previousWeekBest) {
            const currentVolume = set.weight * set.reps;
            const previousVolume = exercise.previousWeekBest.weight * exercise.previousWeekBest.reps;
            const volumeIncrease = currentVolume - previousVolume;
            
            if (volumeIncrease > 0) {
              totalVolumeIncrease += volumeIncrease;
              improvementCount++;
            }
          }
        }
      });
    });

    // Calculate average strength percentage increase
    const exercisesWithPrevious = exercises.filter(e => e.previousWeekBest);
    if (exercisesWithPrevious.length > 0) {
      let totalPercentageIncrease = 0;
      exercisesWithPrevious.forEach(exercise => {
        const bestCurrentSet = exercise.sets.reduce((best, current) => 
          (current.weight * current.reps) > (best.weight * best.reps) ? current : best
        , { weight: 0, reps: 0 });
        
        if (bestCurrentSet.weight > 0 && exercise.previousWeekBest) {
          const currentVolume = bestCurrentSet.weight * bestCurrentSet.reps;
          const previousVolume = exercise.previousWeekBest.weight * exercise.previousWeekBest.reps;
          const percentageIncrease = ((currentVolume - previousVolume) / previousVolume) * 100;
          totalPercentageIncrease += Math.max(0, percentageIncrease);
        }
      });
      strengthPercentage = totalPercentageIncrease / exercisesWithPrevious.length;
    }

    return {
      totalVolumeIncrease: Math.round(totalVolumeIncrease),
      improvementCount,
      totalWeight: Math.round(totalWeight),
      strengthPercentage: Math.round(strengthPercentage * 10) / 10
    };
  };

  const stats = calculateStats();
  const completedExercises = exercises.filter(e => e.completed).length;

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6" />
            <CardTitle className="text-2xl">Edzés teljesítve! 🎉</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-100 text-lg">
            Gratulálunk! Sikeresen befejezted a {workoutType} edzést ({weekNumber}. hét).
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Target className="w-5 h-5 text-yellow-400" />
              Gyakorlatok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {completedExercises}/{exercises.length}
            </div>
            <p className="text-gray-300">gyakorlat teljesítve</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Összes mozgatott súly
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-400 mb-2">
              {stats.totalWeight} kg
            </div>
            <p className="text-gray-300">teljes volumen</p>
          </CardContent>
        </Card>
      </div>

      {stats.improvementCount > 0 && (
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Award className="w-5 h-5 text-purple-400" />
              Fejlődési mutatók
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.improvementCount}
                </div>
                <p className="text-gray-300 text-sm">gyakorlat javult</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {stats.totalVolumeIncrease}
                </div>
                <p className="text-gray-300 text-sm">extra volumen (kg)</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  +{stats.strengthPercentage}%
                </div>
                <p className="text-gray-300 text-sm">erősebb múlt hétnél</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Gyakorlatok részletei:</h3>
        {exercises.map((exercise, index) => (
          <Card key={index} className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-white">{exercise.name}</span>
                  <div className="text-sm text-gray-400">
                    {exercise.sets.length} sorozat befejezve
                  </div>
                </div>
                <div className="flex gap-2">
                  {exercise.completed && (
                    <Badge className="bg-green-600">Kész</Badge>
                  )}
                  {exercise.hasImprovement && (
                    <Badge className="bg-yellow-600">Javult</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button 
        onClick={onClose} 
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-medium"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Vissza az edzésnapló főoldalra
      </Button>
    </div>
  );
};

export default WorkoutSummary;
