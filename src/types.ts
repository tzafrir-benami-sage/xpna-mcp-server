export type CreatePlanBudgetRequestBody = {
  name: string;
  description: string;
  budgetKey: string;
  dimensionsIds: string[];
};

export type CreatePlanActualsRequestBody = {
  planData: Record<string, any>;
};

export type JobStatus = { total: number; progress: number; error?: boolean };
