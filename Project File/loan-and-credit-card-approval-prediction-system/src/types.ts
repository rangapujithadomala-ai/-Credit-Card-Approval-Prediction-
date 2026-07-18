export type ModelType = "Logistic Regression" | "Decision Tree" | "Random Forest";

export interface Hyperparameters {
  cValue?: number; // Logistic Regression regularization
  penalty?: "l1" | "l2"; // Logistic Regression penalty
  maxDepth?: number; // Decision Tree & Random Forest max depth
  criterion?: "gini" | "entropy"; // Decision Tree split criterion
  nEstimators?: number; // Random Forest estimators count
}

export interface PredictionRequest {
  income: number;
  incomeType: string;
  educationType: string;
  familyStatus: string;
  housingType: string;
  employmentDays: number;
  ageYears: number;
  familyMembers: number;
  childrenCount: number;
  overdueStatus: string;
  modelType: ModelType;
  hyperparameters: Hyperparameters;
}

export interface EvaluationMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  accuracy: number;
}

export interface PredictionResponse {
  approved: boolean;
  confidence: number;
  probabilityApproved: number;
  probabilityRejected: number;
  metrics: EvaluationMetrics;
  explanation: string;
}

export interface SampleRecord {
  id: number;
  income: number;
  incomeType: string;
  educationType: string;
  familyStatus: string;
  housingType: string;
  employmentDays: number;
  ageYears: number;
  familyMembers: number;
  childrenCount: number;
  overdueStatus: string;
  duplicate?: boolean;
  hasNulls?: boolean;
}
