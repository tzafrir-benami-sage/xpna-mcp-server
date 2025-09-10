export type CreatePlanBudgetRequestBody = {
  name: string;
  description: string;
  budgetKey: string;
  dimensionsIds: string[];
};