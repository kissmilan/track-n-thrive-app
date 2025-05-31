
export interface WeightEntry {
  date: string;
  weight: number;
  sleep: number;
  stress: number;
  fatigue: number;
  motivation: number;
  training: number;
  notes?: string;
}

export interface Supplement {
  name: string;
  description: string;
  dosage: string;
  timing: string;
  taken: boolean;
  category: 'vitamin' | 'digestive' | 'joint' | 'extract' | 'sleep' | 'pre-workout';
  purchaseLink?: string;
}
