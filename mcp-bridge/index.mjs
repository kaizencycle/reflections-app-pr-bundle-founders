import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Configuration
const {
  PORT = 8081,
  MCP_SERVER_URL = "http://localhost:3001",  // Your MCP server
  BRIDGE_TOKEN = process.env.BRIDGE_TOKEN || "",
  RATE_LIMIT_PER_HOUR = 100
} = process.env;

// Simple rate limiting
const rateLimits = new Map();

function checkRateLimit(clientId) {
  const now = Date.now();
  const hour = Math.floor(now / (1000 * 60 * 60));
  const key = `${clientId}:${hour}`;
  
  const count = rateLimits.get(key) || 0;
  if (count >= RATE_LIMIT_PER_HOUR) {
    return false;
  }
  
  rateLimits.set(key, count + 1);
  return true;
}

// Auth middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  if (!BRIDGE_TOKEN || token !== BRIDGE_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Health check
app.get("/", (req, res) => {
  res.json({ 
    status: "MCP Bridge OK", 
    version: "1.0.0",
    mcp_server: MCP_SERVER_URL,
    endpoints: ["/execute", "/tools", "/health"]
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// List available MCP tools
app.get("/tools", requireAuth, async (req, res) => {
  try {
    const response = await fetch(`${MCP_SERVER_URL}/tools`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "tools/list"
      })
    });
    
    const data = await response.json();
    res.json(data.result || data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tools", details: error.message });
  }
});

// Execute MCP tool calls
app.post("/execute", requireAuth, async (req, res) => {
  const clientId = req.ip || 'unknown';
  
  if (!checkRateLimit(clientId)) {
    return res.status(429).json({ error: "Rate limit exceeded" });
  }

  try {
    const { tool_calls, context } = req.body;
    
    if (!tool_calls || !Array.isArray(tool_calls)) {
      return res.status(400).json({ error: "Missing or invalid tool_calls array" });
    }

    const results = [];
    
    for (const toolCall of tool_calls) {
      const { name, arguments: args } = toolCall;
      
      console.log(`Executing MCP tool: ${name}`, args);
      
      try {
        const mcpResponse = await fetch(`${MCP_SERVER_URL}/tools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: Date.now(),
            method: "tools/call",
            params: {
              name,
              arguments: args
            }
          }),
          timeout: 30000
        });
        
        const mcpData = await mcpResponse.json();
        
        if (mcpData.error) {
          results.push({
            tool: name,
            success: false,
            error: mcpData.error.message || "MCP tool error"
          });
        } else {
          results.push({
            tool: name,
            success: true,
            result: mcpData.result
          });
        }
      } catch (toolError) {
        console.error(`Tool ${name} failed:`, toolError);
        results.push({
          tool: name,
          success: false,
          error: toolError.message
        });
      }
    }
    
    res.json({
      success: true,
      results,
      context,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Bridge execution error:", error);
    res.status(500).json({ 
      error: "Bridge execution failed", 
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`MCP Bridge listening on :${PORT}`);
  console.log(`MCP Server: ${MCP_SERVER_URL}`);
  console.log(`Auth: ${BRIDGE_TOKEN ? 'Enabled' : 'Disabled'}`);
});
