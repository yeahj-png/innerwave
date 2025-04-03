export interface FrequencyOption {
  id: string;
  label: string;
  description: string;
  hz: number;
  carrierLeft?: number;
  carrierRight?: number;
  includePinkNoise?: boolean;
  isIsochronic?: boolean;
} 