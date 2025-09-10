export type CreatePlanBudgetRequestBody = {
  name: string;
  description: string;
  budgetKey: string;
  dimensionsIds: string[];
};

export type CreatePlanActualsRequestBody = {
  name: string;
  description: string;
  planData: Record<string, any>;
  dimensionsIds: string[];
};

export type JobStatus = { total: number; progress: number; error?: boolean };
