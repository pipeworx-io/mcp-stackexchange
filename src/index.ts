/**
 * StackExchange MCP — wraps the StackExchange API v2.3 (free, no auth required for read)
 *
 * Tools:
 * - search_questions: search questions on any StackExchange site
 * - get_answers: get answers for a specific question
 */

interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

const BASE_URL = 'https://api.stackexchange.com/2.3';

const tools: McpToolExport['tools'] = [
  {
    name: 'search_questions',
    description:
      'Search for questions on StackOverflow or any StackExchange site. Returns title, body, score, answer count, tags, and link.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query string' },
        site: {
          type: 'string',
          description:
            'StackExchange site slug (default: stackoverflow). Examples: serverfault, superuser, askubuntu, math, physics',
        },
        limit: {
          type: 'number',
          description: 'Number of results to return (1-20, default 5)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_answers',
    description:
      'Get answers for a specific StackExchange question by ID. Returns answer body, score, and whether it is accepted.',
    inputSchema: {
      type: 'object',
      properties: {
        question_id: {
          type: 'number',
          description: 'The numeric question ID from the question URL',
        },
        site: {
          type: 'string',
          description: 'StackExchange site slug (default: stackoverflow)',
        },
      },
      required: ['question_id'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_questions':
      return searchQuestions(
        args.query as string,
        (args.site as string) ?? 'stackoverflow',
        (args.limit as number) ?? 5,
      );
    case 'get_answers':
      return getAnswers(
        args.question_id as number,
        (args.site as string) ?? 'stackoverflow',
      );
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchQuestions(query: string, site: string, limit: number) {
  const pagesize = Math.min(20, Math.max(1, limit));
  const params = new URLSearchParams({
    q: query,
    site,
    pagesize: String(pagesize),
    order: 'desc',
    sort: 'relevance',
    filter: 'withbody',
  });

  const res = await fetch(`${BASE_URL}/search/advanced?${params}`);
  if (!res.ok) throw new Error(`StackExchange API error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    items?: {
      question_id: number;
      title: string;
      body?: string;
      score: number;
      answer_count: number;
      is_answered: boolean;
      tags: string[];
      link: string;
      creation_date: number;
      last_activity_date: number;
      view_count: number;
    }[];
    quota_remaining?: number;
    has_more?: boolean;
  };

  if (!data.items) throw new Error('Unexpected StackExchange response format');

  return {
    site,
    count: data.items.length,
    has_more: data.has_more ?? false,
    quota_remaining: data.quota_remaining ?? null,
    questions: data.items.map((q) => ({
      question_id: q.question_id,
      title: q.title,
      body: q.body ?? null,
      score: q.score,
      answer_count: q.answer_count,
      is_answered: q.is_answered,
      tags: q.tags,
      link: q.link,
      view_count: q.view_count,
      created: new Date(q.creation_date * 1000).toISOString(),
      last_activity: new Date(q.last_activity_date * 1000).toISOString(),
    })),
  };
}

async function getAnswers(questionId: number, site: string) {
  const params = new URLSearchParams({
    site,
    order: 'desc',
    sort: 'votes',
    filter: 'withbody',
  });

  const res = await fetch(`${BASE_URL}/questions/${questionId}/answers?${params}`);
  if (!res.ok) throw new Error(`StackExchange API error: ${res.status} ${res.statusText}`);

  const data = (await res.json()) as {
    items?: {
      answer_id: number;
      question_id: number;
      body?: string;
      score: number;
      is_accepted: boolean;
      creation_date: number;
      last_activity_date: number;
      owner?: { display_name?: string; reputation?: number };
    }[];
    quota_remaining?: number;
    has_more?: boolean;
  };

  if (!data.items) throw new Error('Unexpected StackExchange response format');

  return {
    site,
    question_id: questionId,
    count: data.items.length,
    quota_remaining: data.quota_remaining ?? null,
    answers: data.items.map((a) => ({
      answer_id: a.answer_id,
      body: a.body ?? null,
      score: a.score,
      is_accepted: a.is_accepted,
      owner_name: a.owner?.display_name ?? null,
      owner_reputation: a.owner?.reputation ?? null,
      created: new Date(a.creation_date * 1000).toISOString(),
      last_activity: new Date(a.last_activity_date * 1000).toISOString(),
    })),
  };
}

export default { tools, callTool } satisfies McpToolExport;
