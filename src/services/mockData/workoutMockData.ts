
import { WorkoutSheet, UserProgress } from '@/types/workout';

export const getMockUserProgress = (): UserProgress => {
  return {
    totalWorkouts: 12,
    weeklyWorkouts: 4,
    hasMinimumWorkouts: true
  };
};

export const getMockWorkoutSheets = (): WorkoutSheet[] => {
  return [
    {
      name: "Felsőtest 1",
      weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
        weekNumber: weekIndex + 1,
        exercises: [
          {
            name: "Fekvenyomás 1 kezességgel",
            workSets: 3,
            repRange: "6-10",
            videoUrl: "https://example.com/video1",
            sets: [],
            completed: false,
            volumeImprovement: 0,
            weightIncrease: 0,
            strengthIncrease: 0,
            previousWeekBest: weekIndex > 0 ? { weight: 80, reps: 8 } : undefined,
            hasImprovement: false
          },
          {
            name: "Tárogatás gépen",
            workSets: 3,
            repRange: "8-12",
            videoUrl: "https://example.com/video2",
            sets: [],
            completed: false,
            volumeImprovement: 0,
            weightIncrease: 0,
            strengthIncrease: 0,
            previousWeekBest: weekIndex > 0 ? { weight: 60, reps: 10 } : undefined,
            hasImprovement: false
          },
          {
            name: "Oldalemeles padhoz dőlve",
            workSets: 4,
            repRange: "10-15",
            videoUrl: "https://example.com/video3",
            sets: [],
            completed: false,
            volumeImprovement: 0,
            weightIncrease: 0,
            strengthIncrease: 0,
            previousWeekBest: weekIndex > 0 ? { weight: 15, reps: 12 } : undefined,
            hasImprovement: false
          }
        ]
      }))
    },
    {
      name: "Láb",
      weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
        weekNumber: weekIndex + 1,
        exercises: [
          {
            name: "Guggolás",
            workSets: 4,
            repRange: "8-12",
            videoUrl: "https://example.com/video4",
            sets: [],
            completed: false,
            volumeImprovement: 0,
            weightIncrease: 0,
            strengthIncrease: 0,
            previousWeekBest: weekIndex > 0 ? { weight: 100, reps: 10 } : undefined,
            hasImprovement: false
          },
          {
            name: "Román felhúzás",
            workSets: 3,
            repRange: "10-12",
            videoUrl: "https://example.com/video5",
            sets: [],
            completed: false,
            volumeImprovement: 0,
            weightIncrease: 0,
            strengthIncrease: 0,
            previousWeekBest: weekIndex > 0 ? { weight: 80, reps: 10 } : undefined,
            hasImprovement: false
          }
        ]
      }))
    },
    {
      name: "Felsőtest 2",
      weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
        weekNumber: weekIndex + 1,
        exercises: [
          {
            name: "Húzódzkodás",
            workSets: 3,
            repRange: "5-8",
            videoUrl: "https://example.com/video6",
            sets: [],
            completed: false,
            volumeImprovement: 0,
            weightIncrease: 0,
            strengthIncrease: 0,
            previousWeekBest: weekIndex > 0 ? { weight: 10, reps: 6 } : undefined,
            hasImprovement: false
          }
        ]
      }))
    },
    {
      name: "Push/Pull",
      weeks: Array.from({ length: 12 }, (_, weekIndex) => ({
        weekNumber: weekIndex + 1,
        exercises: [
          {
            name: "Vállnomás",
            workSets: 4,
            repRange: "8-10",
            videoUrl: "https://example.com/video7",
            sets: [],
            completed: false,
            volumeImprovement: 0,
            weightIncrease: 0,
            strengthIncrease: 0,
            previousWeekBest: weekIndex > 0 ? { weight: 40, reps: 8 } : undefined,
            hasImprovement: false
          }
        ]
      }))
    }
  ];
};
