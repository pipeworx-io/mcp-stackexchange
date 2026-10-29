# mcp-stackexchange

StackExchange MCP — wraps the StackExchange API v2.3 (free, no auth required for read)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1857+ live data sources. This is an independent, unofficial integration — not affiliated with, endorsed by, or published by the upstream provider.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/stackexchange/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1857+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/stackexchange_search_questions \
  -H 'Content-Type: application/json' \
  -d '{"query":"python async await"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/stackexchange_search_questions`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

## Run it from npm

`@pipeworx/mcp-stackexchange` is a local stdio bridge to the Pipeworx gateway: your MCP client
starts it with `npx`, and it forwards every call to the same
`https://gateway.pipeworx.io/stackexchange/mcp` endpoint shown above. It needs network access;
there is no offline mode.

```json
{
  "mcpServers": {
    "stackexchange": {
      "command": "npx",
      "args": ["-y", "@pipeworx/mcp-stackexchange"]
    }
  }
}
```

Without a key it calls anonymously, capped at 50 calls a day. A free account
raises that to 200 a day: get a key at https://pipeworx.io/signup and add
`"env": { "PIPEWORX_API_KEY": "<your key>" }` to the server entry.
The key is sent as a Bearer token, the same way a hosted connection sends it,
so calls are metered and billed exactly as they are there.

It lists **only** this pack's tools by default. Set `PIPEWORX_META_TOOLS=1` to
also list `ask_pipeworx` and the other gateway-wide tools.

Behind an HTTPS proxy: Node's built-in `fetch` does not read `HTTPS_PROXY` by
default. Newer Node releases honour it when `NODE_USE_ENV_PROXY=1` is set; check
your Node version's documentation.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Stackexchange data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
