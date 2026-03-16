---
title: "Recipe: CRM Enrichment with MCP"
slug: recipe-crm-mcp
order: 2
description: "End-to-end walkthrough: connect Claude to a CRM via MCP"
section: guides
---

# Recipe: CRM Enrichment with MCP

## What You Will Build

An **MCP server** that connects Claude to a CRM system, letting Claude look up customer records and enrich them with additional data. When you ask "look up customer John Doe," Claude calls your MCP tools to fetch and update the record -- no manual API work required.

The Model Context Protocol (MCP) gives Claude structured access to external systems through tool definitions. You will build a small Node.js server that exposes two tools: `lookup_customer` and `enrich_record`.

## Prerequisites

- Node.js 18 or later
- Claude Code installed
- A CRM or REST API with customer data (this recipe uses a generic REST API; adapt endpoints to your system)
- Basic familiarity with [MCP](topics/mcp.html) concepts

## Step 1: Scaffold the MCP Server

Create a new directory for your server and initialize it:

```bash
mkdir crm-mcp-server && cd crm-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk
```

Your project structure:

```plaintext
crm-mcp-server/
  node_modules/
  package.json
  server.js          <-- you will create this
```

Add `"type": "module"` to your `package.json` so you can use ES module imports.

## Step 2: Implement the Server

Create `server.js` with the full MCP server implementation. This uses the stdio transport, which means Claude launches the server as a child process and communicates over stdin/stdout.

```javascript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const CRM_BASE_URL = process.env.CRM_API_URL || "https://api.example.com";
const CRM_API_KEY = process.env.CRM_API_KEY;

const server = new McpServer({
  name: "crm-enrichment",
  version: "1.0.0",
});

// Tool: Look up a customer by name or email
server.tool(
  "lookup_customer",
  "Search for a customer record by name or email address",
  {
    query: z.string().describe("Customer name or email to search for"),
  },
  async ({ query }) => {
    const res = await fetch(
      `${CRM_BASE_URL}/customers/search?q=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${CRM_API_KEY}` } }
    );

    if (!res.ok) {
      return {
        content: [{ type: "text", text: `API error: ${res.status} ${res.statusText}` }],
      };
    }

    const data = await res.json();
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  }
);

// Tool: Enrich a customer record with additional data
server.tool(
  "enrich_record",
  "Add or update fields on a customer record",
  {
    customerId: z.string().describe("The customer ID to update"),
    fields: z.record(z.string()).describe("Key-value pairs to add or update"),
  },
  async ({ customerId, fields }) => {
    const res = await fetch(`${CRM_BASE_URL}/customers/${customerId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${CRM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fields),
    });

    if (!res.ok) {
      return {
        content: [{ type: "text", text: `Update failed: ${res.status} ${res.statusText}` }],
      };
    }

    const updated = await res.json();
    return {
      content: [{ type: "text", text: `Record updated:\n${JSON.stringify(updated, null, 2)}` }],
    };
  }
);

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Step 3: Configure Claude Code

Register the MCP server in your project's `.mcp.json` file (create it in the project root where you use Claude):

```json
{
  "mcpServers": {
    "crm": {
      "command": "node",
      "args": ["/absolute/path/to/crm-mcp-server/server.js"],
      "env": {
        "CRM_API_URL": "https://api.your-crm.com",
        "CRM_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Key points:

- **command** and **args** tell Claude how to start the server process.
- **env** passes environment variables (API keys, base URLs) to the server process.
- Use an absolute path to the server file, or a path relative to the `.mcp.json` location.

## Step 4: Test the Integration

Restart Claude Code (or start a new session) so it discovers the new MCP server. Then try:

```bash
claude "look up customer John Doe"
```

Claude will:

1. See the `lookup_customer` tool from your MCP server.
2. Call it with `{ "query": "John Doe" }`.
3. Display the results from your CRM API.

To test enrichment:

```bash
claude "add the tag 'enterprise' to customer cust_12345"
```

Claude will call `enrich_record` with the customer ID and the new field.

## Verify It Works

Your integration is working when:

- Claude lists `lookup_customer` and `enrich_record` among its available tools (you can ask "what MCP tools do you have?").
- A lookup query returns structured customer data from your API.
- An enrichment request updates the record and returns the updated data.
- Error responses (invalid API key, customer not found) surface as readable messages, not crashes.

## Next Steps

- Read the [MCP reference](topics/mcp.html) for the full configuration schema, including `headers` and `timeout` options.
- Switch to SSE transport if you need to host the MCP server remotely (see the MCP How-To tab).
- Add more tools: `create_customer`, `list_recent_activity`, `generate_report`.
- Combine with a [deployment skill](topics/recipe-deployment-skill.html) to automate CRM data migrations.
