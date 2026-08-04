# mcp-stackexchange

StackExchange MCP — wraps the StackExchange API v2.3 (free, no auth required for read)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_questions` | Search for questions on StackOverflow or any StackExchange site. Returns title, body, score, answer count, tags, and link. |
| `get_answers` | Get answers for a specific StackExchange question by ID. Returns answer body, score, and whether it is accepted. |
| `stack_get_user` | Look up a StackExchange user by numeric ID. Returns display name, reputation, badges (gold/silver/bronze counts), location, website, account age, last access, and per-site activity counts (questions/answers). Works on any StackExchange site (default: stackoverflow). |
| `list_questions_by_tag` | Browse questions by TAG, sorted by votes or recency — answers "top questions tagged <tag>", "trending <tag> questions this week/month", "most-voted <tag> questions". Returns title, score, answer count, whether answered, view count, tags, and link (call get_answers with a returned question_id to read answers). Combine tags with ";" for AND (e.g. "kubernetes;helm"). Distinct from search_questions, which is keyword-based. |
| `stack_tags` | List or search StackOverflow / StackExchange tags with question counts and synonym info — top tags by popularity, tags matching a name fragment, or stats for specific tags. Answers "most popular StackOverflow tags", "how many questions are tagged X", "which tags have more than N questions". Example: stack_tags({ sort: "popular", limit: 20 }) or stack_tags({ inname: "python" }) |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "stackexchange": {
      "url": "https://gateway.pipeworx.io/stackexchange/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Stackexchange data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
