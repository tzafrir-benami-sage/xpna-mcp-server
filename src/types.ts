export type CreatePlanBudgetRequestBody = {
  name: string;
  description: string;
  budgetKey: string;
  dimensionsIds: string[];
};

export type AccountsStructure = {
  accounts: {
    id: string;
    href: string;
    key: string;
  }[];
  dimensions: string[];
};

export type CreatePlanActualsRequestBody = {
  name: string;
  description: string;
  reportingPeriods: {
    id: string;
    href: string;
    key: string;
  }[];
  dimensionsIds: string[];
  dimensionFilters: Record<string, string[]>;
  accountsStructure: AccountsStructure[];
  statisticalAccountsStructure: AccountsStructure[];
  populateData: {
    source: "actuals" | "budget";
    reportingPeriods: {
      id: string;
      href: string;
      key: string;
    }[];
    periodsMap: Record<string, string>;
  }[];
};

export type JobStatus = { total: number; progress: number; error?: boolean };
