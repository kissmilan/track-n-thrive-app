
export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface WorkoutExercise {
  name: string;
  workSets: number;
  repRange: string;
  videoUrl?: string;
  sets: WorkoutSet[];
  completed: boolean;
  volumeImprovement: number;
  weightIncrease: number;
  strengthIncrease: number;
  notes?: string;
  previousWeekBest?: WorkoutSet;
  hasImprovement?: boolean;
}

export interface WorkoutWeek {
  weekNumber: number;
  exercises: WorkoutExercise[];
  completed?: boolean;
  totalVolumeIncrease?: number;
  strengthPercentage?: number;
}

export interface WorkoutSheet {
  name: string;
  weeks: WorkoutWeek[];
}

export interface UserProgress {
  totalWorkouts: number;
  weeklyWorkouts: number;
  hasMinimumWorkouts: boolean;
}
