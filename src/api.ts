const xCompanyId = "N2NmZmMwMWMtOTdiMi00YmYxLWI3YjctZDU3Y2JjOTFhNzQy";
const accessToken =
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik56TXdPVVJHTVVZNU5ERXpRelJHUVVNMVF6azJSa1U1UVRJMU0wRTROemhGUmpWQ04wSTNOQSJ9.eyJodHRwczovL3NhZ2UuY29tL3NjaS9pZHAiOiJJbnRhY2N0IiwiaXNzIjoiaHR0cHM6Ly9pZC5zYWdlLmNvbS8iLCJzdWIiOiJhdXRoMHxlMGZhZjhhYmQ5NmI0MmU3ZDZhZjc4MjY5OWJkMjQ3OTM0YjY2MTQ1MWQ0NjgzYTUiLCJhdWQiOlsieHBuYS94cG5hIiwiaHR0cHM6Ly9zYWdlLWNpZC1wcm9kLnNhZ2VpZHByb2QuYXV0aDBhcHAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTc1NzMwMzk0OSwiZXhwIjoxNzU3MzMyNzQ5LCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIiwiYXpwIjoiODVXWEIxZ1lYeW5IREVHaXp5V25QVmVCaERXam1zRWQifQ.PGMYt5Od9tp9Cq-ghPvPleHrr5m-qba6OePuHQ4xcfZkM0QLLvhViZwTvlm7izGir-jf6W9JQxf2_gLnxrRTzWBvkbK3-xChD9vVszyZ-ANuIZrg1QEuVp69ddDIwd4tTkCIm5EV_E9cPW-QmCNccxFG9SKm4Bs4eZf6k3hmf8WpZXACbdpq8k6X5vrZ6ilYCqaVemX8pDksbnmlxuoCkrRIngxA8_OiUd0GjAyBN22rNpV3VzW8sBWcOMBuPiEg2oXsNDFHwDW9xOFCmaqqYdrm1lCAV8mQKFsTeQ1Ynmu1TkJ9LjzlwcWG5g5Q0_K6WpdXeiyGxOT-rHFnEpi7-g";

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
