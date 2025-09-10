import { dimensionsIds } from "./data.js";
import type {CreatePlanActualsRequestBody, CreatePlanBudgetRequestBody, JobStatus} from "./types.js";

const xCompanyId = "Zjc1YzBjMWQtZTM5MS00ZGI1LThhMGUtMDkyMjA1ZTg4ZGQ5";
const accessToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik56TXdPVVJHTVVZNU5ERXpRelJHUVVNMVF6azJSa1U1UVRJMU0wRTROemhGUmpWQ04wSTNOQSJ9.eyJodHRwczovL3NhZ2UuY29tL3NjaS9pZHAiOiJJbnRhY2N0IiwiaXNzIjoiaHR0cHM6Ly9pZC5zYWdlLmNvbS8iLCJzdWIiOiJhdXRoMHxlMGZhZjhhYmQ5NmI0MmU3ZDZhZjc4MjY5OWJkMjQ3OTM0YjY2MTQ1MWQ0NjgzYTUiLCJhdWQiOlsieHBuYS94cG5hIiwiaHR0cHM6Ly9zYWdlLWNpZC1wcm9kLnNhZ2VpZHByb2QuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc1NzUwMzY3OSwiZXhwIjoxNzU3NTMyNDc5LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiODVXWEIxZ1lYeW5IREVHaXp5V25QVmVCaERXam1zRWQifQ.gkUooX7wjTKZn8e8U2RlesZw3j784JFp-MnYkw8dl2kCGsrv_1S7TDyy1RYDI-s7TaY1Hp0Ch56BUSnamVH0IUGmuZClWUszXWTDVzagWKysUiMh9EZGcFFl7GB6ulWXaKDJzfX2Pe-srpy1hrrFeo0Kl1FL5v8iKfhcunTHryYU54JgY-xzMQ8LgduNRj256wPcddfM53sH3KVxwBUeRod_7Bl3-xvzet_Kqnb09unoSwvfYAfL1-MGeZgyKJRSz4mrjRGia6HWbg0KENymT5RNFAtuiIaCLSp4i1pEEsuqK0Wo0QjnFxKEaxdHOjo4XCW40NWz4rAqDfyVaTxuuQ";

export const getSharedVersions = async () => {
  const url = "https://api.intacct-planning.com/v1/users/share";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-xpna-company-id": xCompanyId,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching shared versions: ${response.statusText}`);
  }

  const { versions } = (await response.json()) as {
    versions: Array<{ versionId: string; name: string; description?: string }>;
  };

  return versions.map((v) => ({
    id: v.versionId,
    name: v.name,
    description: v.description || "",
  }));
};

export const getUsers = async () => {
  const url = "https://api.intacct-planning.com/v1/users";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-xpna-company-id": xCompanyId,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching users: ${response.statusText}`);
  }

  const { users } = (await response.json()) as {
    users: Array<{ id: string; firstName: string; lastName: string; role: string; accessLevel: string }>;
  };

  return users;
};

export const shareVersionWithUser = async (userId: string, versionId: string): Promise<boolean> => {
  const url = `https://api.intacct-planning.com/v1/users/share/version/${versionId}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-xpna-company-id": xCompanyId,
    },
    body: JSON.stringify({ sharedWith: [{ userId }] }),
  });

  if (!response.ok) {
    throw new Error(`Error sharing version with user: ${response.statusText}`);
  }

  return true;
};

export const createPlanFromBudget = async ({
  budgetKey,
  name,
  description = `Plan created from SIF Budget ${budgetKey} at ${new Date().toLocaleString()}`,
}: {
  budgetKey: string;
  name: string;
  description: string;
}) => {
  const url = "https://api.intacct-planning.com/v1/create-plan-budget";

  return await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-xpna-company-id": xCompanyId,
    },
    body: JSON.stringify({ name, description, budgetKey, dimensionsIds } satisfies CreatePlanBudgetRequestBody),
    method: "POST",
  });
};

export const createPlanFromActuals = async (
  planData: CreatePlanActualsRequestBody
) => {
  const url = "https://api.intacct-planning.com/v1/create-plan-actuals";

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-xpna-company-id": xCompanyId,
    },
    body: JSON.stringify( planData  satisfies CreatePlanActualsRequestBody),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Error creating plan from budget: ${response.statusText}`);
  }
  const jobId = await response.text();

  return jobId;
};



export const getJobStatus = async (jobId: string) => {
  const url = `https://api.intacct-planning.com/v1/job/${jobId}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      "x-xpna-company-id": xCompanyId
    }
  });


  if (!response.ok) {
    throw new Error(`Error fetching job: ${response.statusText}`);
  }
  const status = await response.json() as JobStatus;

  return status;

}