import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getSharedVersions, getUsers, shareVersionWithUser } from "./api.js";

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
  async (uri) => {
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
  async (uri) => {
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

server.registerTool(
  "share-plan-with-user",
  {
    title: "Share Plan with User",
    description: "Share a specific plan with a user",
    inputSchema: { userId: z.string().min(1), planId: z.string().min(1) },
  },
  async ({ userId, planId }) => {
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
  async ({ planId }) => ({
    content: [{
      type: "text",
      text: `https://latest.intacct-planning.com/plan/${planId}`,
      "mimeType": "text/html"
    }]
  })
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
