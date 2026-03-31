# mcp-stackexchange

StackExchange MCP — wraps the StackExchange API v2.3 (free, no auth required for read)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|

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

Or use the CLI:

```bash
npx pipeworx use stackexchange
```

## License

MIT
