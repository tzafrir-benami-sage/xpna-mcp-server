import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  createPlanFromBudget,
  createPlanFromActuals,
  getJobStatus,
  getSharedVersions,
  getUsers,
  shareVersionWithUser,
  getTest,
} from "./api.js";
import { budgets } from "./data.js";
import { planData } from "./fixtures/actuals-selections.js";

// Create an MCP server
const server = new McpServer({
  name: "xpna-mcp-server",
  version: "1.0.0",
  description: "MCP server for interacting with enhanced Sage Intacct Planning (eSIP) web application",
});

server.registerResource(
  "versions",
  "mcp://xpna-demo/plans",
  {
    title: "Plans",
    description: "Get list of plans in the account",
    mimeType: "application/json",
  },
  async (uri: { href: string }) => {
    try {
      const versions = await getSharedVersions();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(versions),
            mimeType: "application/json",
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: (error as Error).message }),
            mimeType: "application/json",
          },
        ],
      };
    }
  },
);

server.registerResource(
  "users",
  "mcp://xpna-demo/users",
  {
    title: "Users",
    description: "Get list of users in the account",
    mimeType: "application/json",
  },
  async (uri: { href: string }) => {
    try {
      const users = await getUsers();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(users),
            mimeType: "application/json",
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: (error as Error).message }),
            mimeType: "application/json",
          },
        ],
      };
    }
  },
);

server.registerResource(
  "budgets",
  "mcp://xpna-demo/budgets",
  {
    title: "Budgets",
    description: "Get list of SIF budgets in the account",
    mimeType: "application/json",
  },
  async (uri: { href: string }) => {
    try {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(budgets),
            mimeType: "application/json",
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify({ error: (error as Error).message }),
            mimeType: "application/json",
          },
        ],
      };
    }
  },
);

server.registerTool(
  "share-plan-with-user",
  {
    title: "Share Plan with User",
    description: "Share a specific plan with a user",
    inputSchema: { userId: z.string().min(1), planId: z.string().min(1) },
  },
  async ({ userId, planId }: { planId: string; userId: string }) => {
    await shareVersionWithUser(userId, planId);
    return {
      content: [
        {
          type: "text",
          text: `Shared plan ${planId} with user ${userId}`,
          mimeType: "text/plain",
        },
      ],
    };
  },
);

server.registerTool(
  "open-plan-in-browser",
  {
    title: "Get a URL to open a specific plan in Planning app",
    description: "Returns the URL of a specific plan to open in the browser",
    inputSchema: { planId: z.string().min(1) },
  },
  async ({ planId }: { planId: string }) => ({
    content: [
      {
        type: "text",
        text: `https://latest.intacct-planning.com/plan/${planId}`,
        mimeType: "text/html",
      },
    ],
  }),
);

server.registerTool(
  "create-plan-from-budget",
  {
    title: "Create an xPnA plan from a SIF Budget",
    description: "Create a new plan in xPnA based on a selected SIF Budget",
    inputSchema: {
      name: z.string().min(1),
      description: z.string().min(1),
      budgetKey: z.string().min(1),
    },
  },
  async ({ name, description, budgetKey }: { name: string; description: string; budgetKey: string }) => {
    try {
      const response = await createPlanFromBudget({ name, description, budgetKey });
      const requestId = response.headers.get("x-xpna-request-id") as string;
      if (!response.ok) {
        return {
          content: [
            {
              type: "text",
              text: `Error creating plan from budget: ${response.status} ${response.statusText}. Newrelic requestId: ${requestId}.`,
              mimeType: "text/plain",
            },
          ],
        };
      }
      const jobId = await response.text();
      return {
        content: [
          {
            type: "text",
            text: `Initiated create plan form SIF budget ${budgetKey} with name ${name}. jobId: ${jobId}. Newrelic requestId: ${requestId}`,
            mimeType: "text/plain",
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text",
            text: `Error thrown while creating plan from budget: ${e}`,
            mimeType: "text/plain",
          },
        ],
      };
    }
  },
);

server.registerTool(
  "poll-job-status",
  {
    title: "Poll job status",
    description: "Poll the status of a long-running job until completion",
    inputSchema: {
      jobId: z.string().min(1),
    },
  },
  async ({ jobId }: { jobId: string }) => {
    const status = await getJobStatus(jobId);
    return {
      content: [
        {
          type: "text",
          text: `jobId ${jobId}, status: ${JSON.stringify(status)}`,
          mimeType: "text/plain",
        },
      ],
    };
  },
);

server.registerTool(
  "create-plan-actuals",
  {
    title: "Create an xPnA plan from actuals",
    description: "Create a new plan in xPnA based on actuals",
    inputSchema: {
      name: z.string().min(1),
      description: z.string().min(1),
    },
  },
  async ({ name, description }) => {
    //planData comes for a fixture file
    const jobId = await createPlanFromActuals({ ...planData, name, description });
    return {
      content: [
        {
          type: "text",
          text: `Initiated create plan form actuals. jobId to poll status: ${jobId}`,
          mimeType: "text/plain",
        },
      ],
    };
  },
);

server.registerTool(
  "showcase-supportability",
  {
    title: "Showcase",
    description: "Showcase supportability tool. On any error x-xpna-request-id header can be used to search the logs.",
  },
  async () => {
    try {
      const response = await getTest();
      const requestId = response.headers.get("x-xpna-request-id") as string;
      if(!response.ok) {
        return {
          content: [
            {
              type: "text",
              text: `request failed: ${response.status} ${response.statusText}. Search the logs using requestId: ${requestId}.`,
              mimeType: "text/plain",
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(await response.json()),
            mimeType: "text/plain",
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ error: (error as Error).message }),
            mimeType: "text/plain",
          },
        ],
      };
    }
  },
);


// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
