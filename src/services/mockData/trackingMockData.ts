
import { WeightEntry, Supplement } from '@/types/tracking';

export const getMockWeightEntries = (): WeightEntry[] => {
  return [
    {
      date: "2024.05.28",
      weight: 91.60,
      sleep: 8,
      stress: 3,
      fatigue: 4,
      motivation: 8,
      training: 7
    },
    {
      date: "2024.05.29",
      weight: 91.40,
      sleep: 7,
      stress: 4,
      fatigue: 5,
      motivation: 7,
      training: 8
    }
  ];
};

export const getMockSupplements = (): Supplement[] => {
  return [
    {
      name: "Omega 3",
      description: "Esszenciális zsírsav, hormon termelés",
      dosage: "Reggel 2db",
      timing: "Reggel",
      taken: false,
      category: "vitamin",
      purchaseLink: "https://example.com/omega3"
    },
    {
      name: "C-vitamin",
      description: "Általános egészség, gyulladás csökkentés",
      dosage: "Reggel 2db",
      timing: "Reggel",
      taken: false,
      category: "vitamin",
      purchaseLink: "https://example.com/vitamin-c"
    },
    {
      name: "Magnézium",
      description: "Nyugtató hatású",
      dosage: "Este 3 db",
      timing: "Este",
      taken: false,
      category: "sleep",
      purchaseLink: "https://example.com/magnesium"
    }
  ];
};
