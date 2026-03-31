# @pipeworx/mcp-stackexchange

MCP server for StackExchange — search questions and answers from Stack Overflow and other StackExchange sites.

## Tools

| Tool | Description |
|------|-------------|
| `search_questions` | Search for questions on any StackExchange site |
| `get_answers` | Get answers for a specific question by ID |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "stackexchange": {
      "url": "https://gateway.pipeworx.io/stackexchange/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use stackexchange
```

## License

MIT
