import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {createPlanFromBudget, getSharedVersions, getUsers, shareVersionWithUser} from "./api.js";
import {budgets} from "./data.js";

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
  async (uri:{href:string}) => {
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
});

server.registerResource(
  "users",
  "mcp://xpna-demo/users",
  {
    title: "Users",
    description: "Get list of users in the account",
    mimeType: "application/json",
  },
  async (uri:{href:string}) => {
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
  async (uri:{href:string}) => {
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
  async ({ userId, planId }:{planId:string; userId:string}) => {
    await shareVersionWithUser(userId, planId);
    return {
      content: [{ 
        type: "text",
        text: `Shared plan ${planId} with user ${userId}`, 
        mimeType: "text/plain"
      }],
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
  async ({ planId }: {planId:string}) => ({
    content: [{
      type: "text",
      text: `https://latest.intacct-planning.com/plan/${planId}`,
      "mimeType": "text/html"
    }]
  })
);

server.registerTool(
  "create-plan-from-budget",
  {
    title: "Create an xPnA plan from a SIF Budget",
    description: "Create a new plan in xPnA based on a selected SIF Budget",
    inputSchema: {
      name: z.string().min(1) ,
      description: z.string().min(1),
      budgetKey: z.string().min(1)
    },
  },
  async ({ name, description, budgetKey }: {name:string, description:string, budgetKey:string}) => {
    const jobId = await createPlanFromBudget({ name, description, budgetKey });
    return {
      content: [{
        type: "text",
        text: `Initiated create plan form SIF budget ${budgetKey} with name ${name}. jobId to poll status: ${jobId.jobId}`,
        mimeType: "text/plain"
      }],
    };
  },
);

server.registerTool(
  "create-plan-actuals",
  {
    title: "Create Plan Actuals",
    description: "Creates a plan with actuals in Intacct Planning",
    inputSchema: {
      accessToken: z.string().min(1),
      xCompanyId: z.string().min(1),
      planData: z.any(),
    },
  },
  async ({ accessToken, xCompanyId, planData }) => {
    try {
      const jobResponse = await fetch('https://api.intacct-planning.com/v1/create-plan-actuals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-xpna-company-id': xCompanyId,
        },
        body: JSON.stringify(planData),
      });

      if (!jobResponse.ok) {
        throw new Error(`Failed to submit job: ${jobResponse.statusText}`);
      }

      const jobId = await jobResponse.text();

      const pollJob = async (): Promise<any> => {
        const statusResponse = await fetch(`https://api.intacct-planning.com/v1/job/${jobId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'x-xpna-company-id': xCompanyId,
          },
        });

        if (!statusResponse.ok) {
          throw new Error(`Failed to get job status: ${statusResponse.statusText}`);
        }

        return await statusResponse.json();
      };

      let jobStatus = await pollJob();
      let progress = 0;
      const maxAttempts = 60;
      let attempts = 0;

      while (jobStatus.progress < jobStatus.total && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second interval
        jobStatus = await pollJob();
        progress = Math.round((jobStatus.progress / jobStatus.total) * 100);
        attempts++;

        if (jobStatus.error) {
          throw new Error(`Job failed: ${jobStatus.error}`);
        }
      }

      if (attempts >= maxAttempts) {
        throw new Error('Job timed out after 10 minutes');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: true,
              jobId,
              finalStatus: jobStatus,
              message: `Plan "${planData.name}" created successfully`,
              progress: 100,
            }, null, 2),
          },
        ],
      };

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error occurred',
            }, null, 2),
          },
        ],
        isError: true,
      };
    }
  }
);


// Start receiving messages on stdin and sending messages on stdout
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
