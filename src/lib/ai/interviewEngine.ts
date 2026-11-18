// src/lib/ai/interviewEngine.ts
import {
  InterviewQuestion,
  AnswerEvaluation,
  JobLocation,
  DifficultyLevel,
  CompanyInterviewData,
  CompanyQuestion,
} from "@/types/interview";
import { callGemmaOpenRouter, OpenRouterMessage } from "./openrouter";

export const LOCATION_OPTIONS: { id: JobLocation; label: string; flag: string; description: string }[] = [
  {
    id: "global_remote",
    label: "Global / Remote",
    flag: "🌍",
    description: "Distributed engineering standards, async collaboration & modern cloud stacks",
  },
  {
    id: "pakistan",
    label: "Pakistan (Local / Remote Hub)",
    flag: "🇵🇰",
    description: "Full-stack production patterns, practical enterprise delivery & API design",
  },
  {
    id: "united_states",
    label: "United States (US Market)",
    flag: "🇺🇸",
    description: "FAANG-style technical depth, scale trade-offs & system architecture",
  },
  {
    id: "united_kingdom_europe",
    label: "UK & Europe (EMEA)",
    flag: "🇬🇧",
    description: "Clean code principles, domain-driven design, security & GDPR compliance",
  },
  {
    id: "india",
    label: "India (Tech Hubs)",
    flag: "🇮🇳",
    description: "CS fundamentals, high-concurrency systems & scalable architecture",
  },
  {
    id: "middle_east",
    label: "Middle East (UAE / KSA)",
    flag: "🇦🇪",
    description: "Cloud transformation, fintech APIs & scalable digital infrastructure",
  },
];

/**
 * Top AI & Engineering Conceptual Questions Most Asked in the Modern Era (2025/2026)
 * Tagged with top hiring companies across Global tech and Pakistan industry leaders.
 */
export const MOST_ASKED_MODERN_ERA_QUESTIONS: InterviewQuestion[] = [
  {
    id: 101,
    topic: "Next.js App Router & RSC Flight Protocol",
    question:
      "In Next.js App Router and React 19, explain how React Server Components (RSC) differ from traditional SSR. What is the RSC Payload (Flight stream), and how do server/client boundaries impact network waterfalls and JavaScript bundle size?",
    difficulty: "Intermediate",
    marksAvailable: 10,
    rubricHint:
      "Distinction between SSR HTML vs serialized RSC Flight stream, zero-bundle-size server components, client component leaf nodes, and eliminating waterfalls.",
    accurateAnswer:
      "Unlike traditional SSR which sends full HTML and requires full client-side JavaScript re-hydration of the entire tree, React Server Components (RSC) render exclusively on the server and stream a compact, serialized JSON-like protocol called the 'Flight format' (RSC payload).\n\nKey Architectural Nuances:\n1. Zero Client Bundle Impact: Server component dependencies (like heavy markdown parsers, DB drivers, or internal SDKs) never leave the server and are NOT bundled into client JS.\n2. True Client Interactivity: Client Components ('use client') designate the hydration boundary for interactive hooks (useState, useEffect, event listeners). They receive server props serialized over the Flight protocol.\n3. Waterfalls vs Parallel Streams: Server Components can fetch data close to the source in parallel on the server before streaming HTML to the browser, eliminating client-to-server request waterfalls.\n4. Revalidation: Mutating data via Server Actions invalidates the Next.js router cache and re-renders server subtrees without refreshing the entire browser window.",
    globalCompanies: ["Google", "Vercel", "Meta", "Stripe"],
    pakistanCompanies: ["Arbisoft", "Systems Limited", "10Pearls"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 102,
    topic: "AI Agent Tool Calling & Function Execution Lifecycle",
    question:
      "How do LLM tool/function calling workflows operate under the hood in production AI agent systems? Walk through the cycle between user prompt, tool declaration schemas, model decision tokens, client execution, and multi-turn feedback.",
    difficulty: "Advanced",
    marksAvailable: 10,
    rubricHint:
      "JSON Schema tool declarations, function_call response generation, client execution isolation, and passing execution results back to the model context.",
    accurateAnswer:
      "Production AI Agent Tool Calling follows a deterministic 5-step loop:\n\n1. Tool Declaration: The client sends OpenAPI or JSON Schema declarations of available functions (name, description, parameters, required fields) in the system prompt or API options.\n2. Decision Token Generation: The LLM analyzes the user prompt and reasons whether a tool is required. If so, instead of conversational prose, it generates a structured JSON payload targeting a specific tool name with validated argument key-values.\n3. Client-Side Orchestration: The runtime intercepts the model's function_call output, validates inputs against a Zod/JSON schema, and executes the actual code (e.g. database query, external API, calculator) in a secure sandbox.\n4. Context Feedback: The client appends the function's output as a role: 'tool' or role: 'function' message back into the model's conversation history.\n5. Final Synthesis: The LLM synthesizes the tool result into a natural, grounded user response with citations and verification.",
    globalCompanies: ["Google DeepMind", "OpenAI", "Anthropic", "Microsoft"],
    pakistanCompanies: ["Careem", "VentureDive", "Devsinc"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 103,
    topic: "Serverless Database Scalability & Connection Pooling",
    question:
      "Why does serverless autoscaling (such as Google Cloud Run or Edge Functions) rapidly exhaust PostgreSQL/MySQL connection pools, and how do connection poolers like PgBouncer or Supabase Pooler prevent 500 connection exhaustion errors?",
    difficulty: "Intermediate",
    marksAvailable: 10,
    rubricHint:
      "Process concurrency vs database connection limit, connection lifecycle in ephemeral containers, transaction vs session pooling, and Prisma Accelerate / PgBouncer.",
    accurateAnswer:
      "In traditional monolithic servers, a single application process maintains a persistent pool of 10-20 database connections. In serverless/containerized autoscaling (Cloud Run, Lambda), incoming spikes spawn hundreds of independent container instances. Each instance tries opening its own connection pool, quickly surpassing PostgreSQL's default limit (typically 100-200 connections) and throwing 'FATAL: sorry, too many clients already'.\n\nHow Connection Poolers Solve This:\n1. Multiplexing: A proxy like PgBouncer or AWS RDS Proxy sits between the serverless containers and the Postgres server.\n2. Transaction Pooling: PgBouncer assigns a server connection only for the duration of a single transaction (`BEGIN` to `COMMIT`), immediately returning it to the shared pool for other lambdas rather than holding it idle across request lifetimes.\n3. HTTP/REST Adapters: Modern serverless databases (Neon, Supabase, Cloudflare D1) provide HTTP/WebSocket connection drivers that avoid stateful TCP handshakes altogether.",
    globalCompanies: ["Amazon AWS", "Uber", "Stripe", "Supabase"],
    pakistanCompanies: ["SadaPay", "Motive", "Arbisoft"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 104,
    topic: "Vector Embeddings & RAG Grounding Architecture",
    question:
      "Explain the architectural pipeline of a Retrieval-Augmented Generation (RAG) system: chunking strategies, vector embeddings, similarity indexing (HNSW vs IVFFlat), and re-ranking models for grounding LLM outputs.",
    difficulty: "Advanced",
    marksAvailable: 10,
    rubricHint:
      "Semantic chunking with sliding window overlap, vector similarity search using cosine distance, vector index trade-offs, and cross-encoder re-ranking.",
    accurateAnswer:
      "A production RAG pipeline bridges proprietary data to generative models without fine-tuning:\n\n1. Ingestion & Semantic Chunking: Documents are cleaned and split into semantically coherent chunks (e.g. 500 tokens with 10% overlap). Naive fixed-size chunking breaks context; recursive or AST-based chunking preserves document headers and code blocks.\n2. Embedding Generation: Each chunk is passed through an embedding model (e.g. text-embedding-004) to produce high-dimensional dense vectors (e.g. 768 or 1536 floats).\n3. Approximate Nearest Neighbor (ANN) Indexing: Stored in vector databases (pgvector, Pinecone, Milvus) using HNSW (Hierarchical Navigable Small World) for fast graph-based search or IVFFlat for memory efficiency.\n4. Hybrid Retrieval & Re-ranking: The user query is embedded, and top 20 candidates are fetched using hybrid search (combining BM25 keyword search + dense vector cosine similarity). A lightweight Cross-Encoder model re-ranks candidates to select the top 3-5 most pertinent chunks.\n5. Augmented Prompt: Chunks are injected into the system prompt as grounding context with strict anti-hallucination instructions.",
    globalCompanies: ["Google", "Databricks", "Pinecone", "Snowflake"],
    pakistanCompanies: ["Afiniti", "Systems Limited", "Devsinc"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 105,
    topic: "Modern Web Security: Server Actions, CSRF & Token Rotations",
    question:
      "In modern full-stack web applications utilizing Server Actions and Route Handlers, how do you safeguard against CSRF, secure HTTP-only cookie exfiltration, and implement seamless JWT refresh token rotation without race conditions?",
    difficulty: "Intermediate",
    marksAvailable: 10,
    rubricHint:
      "SameSite=Strict/Lax cookies, Origin header verification in Next.js Server Actions, refresh token rotation with reuse detection, and single-flight token locks.",
    accurateAnswer:
      "1. CSRF in Server Actions: Modern Next.js Server Actions automatically verify the incoming `Origin` and `Host` request headers against an allowed origin list. For public Route Handlers (`POST`), anti-CSRF synchronizer tokens or SameSite=Lax/Strict cookie policies prevent unauthorized cross-site POSTs.\n\n2. Secure Cookie Storage: Access tokens and refresh tokens must never be placed in `localStorage` or `sessionStorage` where malicious XSS scripts can exfiltrate them. Always store them in `HttpOnly`, `Secure`, `SameSite=Strict` cookies.\n\n3. Refresh Token Rotation with Reuse Detection: Whenever a refresh token is used, invalidate it immediately and issue a new pair (access token + new refresh token). If an expired or previously used refresh token is presented, trigger a security alarm, invalidate the entire token family, and force re-login.\n\n4. Concurrency Race Conditions: When 5 client tabs request a refresh simultaneously, use a 30-second grace period or a client-side singleton promise (single-flight mutex) to avoid invalidating valid sessions.",
    globalCompanies: ["Stripe", "Auth0", "Netflix", "Cloudflare"],
    pakistanCompanies: ["NayaPay", "SadaPay", "10Pearls"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 106,
    topic: "Distributed Event Streaming: Kafka vs RabbitMQ vs Redis Streams",
    question:
      "When designing high-throughput real-time distributed systems (e.g. ride dispatching or fintech ledgers), when would you choose Apache Kafka over RabbitMQ or Redis Streams? Explain partition rebalancing and consumer lag.",
    difficulty: "Advanced",
    marksAvailable: 10,
    rubricHint:
      "Append-only commit log vs message broker queue, partition ordering, consumer group offset tracking, and consumer lag monitoring.",
    accurateAnswer:
      "Core Conceptual Differences:\n- Apache Kafka is an immutable, distributed append-only commit log designed for massive throughput (millions of msgs/sec), long-term event retention, and event replayability.\n- RabbitMQ is an AMQP smart broker with complex routing (exchanges, topic bindings) that deletes messages once acknowledged.\n- Redis Streams is an in-memory stream ideal for ultra-low latency scenarios with smaller dataset retention.\n\nKey Kafka Mechanics:\n1. Partitioning & Ordering: Messages with the same partition key (e.g. `user_id` or `ride_id`) are guaranteed to be processed in strict chronological order within that partition.\n2. Consumer Groups & Rebalancing: Consumer group members automatically divide partitions amongst themselves. If a consumer crashes or a new one joins, Kafka triggers a rebalance to redistribute partitions.\n3. Consumer Lag: The difference between the latest offset produced in a partition and the offset committed by the consumer. High consumer lag indicates processing bottlenecks or downstream database throttling.",
    globalCompanies: ["Uber", "LinkedIn", "DoorDash", "Stripe"],
    pakistanCompanies: ["Careem", "Systems Limited", "VentureDive"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 107,
    topic: "Distributed Rate Limiting with Redis & Token Bucket",
    question:
      "How would you implement a distributed rate limiter capable of throttling millions of requests per second across multiple regions? Compare Token Bucket vs Sliding Window Counter and explain why Redis Lua scripts are essential.",
    difficulty: "Intermediate",
    marksAvailable: 10,
    rubricHint:
      "Token bucket refill math, sliding window log vs sliding window counter, and atomic multi-key execution via Redis Lua scripts.",
    accurateAnswer:
      "1. Token Bucket vs Sliding Window Counter:\n- Token Bucket: Tokens replenish at a constant rate $r$ up to capacity $B$. Allows short burst traffic without crashing downstream services.\n- Sliding Window Counter: Divides time into rolling sub-windows (e.g. previous minute + current minute weight). Prevents boundary-burst attacks where 2x requests land at window reset.\n\n2. Why Redis Lua Scripts are Critical:\nA naive implementation issues `GET count`, checks the threshold, and does `INCR count`. Under high concurrency across multiple server containers, this introduces a race condition (check-then-act) where 100 concurrent requests all read count=99 and pass.\nRedis evaluates Lua scripts atomically in a single thread: the read, calculation, timestamp update, and TTL expiry occur with zero interleaved operations.",
    globalCompanies: ["Cloudflare", "Google", "Stripe", "Shopify"],
    pakistanCompanies: ["SadaPay", "Arbisoft", "Motive"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 108,
    topic: "Optimistic UI, State Rollbacks & Mutation Queues",
    question:
      "Explain how modern client-side state layers handle Optimistic UI updates with rollback capabilities when a background network mutation fails or experiences high server latency.",
    difficulty: "Intermediate",
    marksAvailable: 10,
    rubricHint:
      "Immediate UI state mutation, temporary cache rollback snapshots, idempotency keys, and error recovery toast notifications.",
    accurateAnswer:
      "Optimistic UI eliminates artificial loading spinners by assuming server success and rendering the anticipated outcome immediately (0ms latency perception).\n\nArchitectural Workflow (React Query / SWR / TanStack):\n1. Cancel Outgoing Queries: Prevent background re-fetches from overwriting optimistic data.\n2. Snapshot Previous State: Take a shallow clone of the existing cache state before applying mutations.\n3. Optimistic Update: Immediately inject the new item (with a temporary client UUID and 'isPending' status flag) into the UI cache.\n4. Network Mutation: Fire the POST/PUT request with an idempotency key.\n5. Rollback on Error: If the server returns 4xx/5xx or times out, restore the snapshot into the cache and trigger a toast notification with a 'Retry' action.\n6. Settle & Invalidate: On success, replace the temporary client UUID with the server-assigned database ID.",
    globalCompanies: ["Figma", "Linear", "Meta", "Slack"],
    pakistanCompanies: ["Arbisoft", "10Pearls", "Careem"],
    frequency: "High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 109,
    topic: "Microservices vs Modular Monolith & Distributed Sagas",
    question:
      "What trade-offs dictate migrating from a modular monolith to microservices? In a microservice ecosystem, how do you coordinate distributed transactions across database boundaries without 2-phase locking (2PC)?",
    difficulty: "Advanced",
    marksAvailable: 10,
    rubricHint:
      "Conway's Law, team autonomy, network overhead, distributed tracing, and Saga Pattern (Choreography vs Orchestration) with compensating transactions.",
    accurateAnswer:
      "1. Migration Trade-Offs:\nA modular monolith (single codebase with strict internal boundaries and package isolation) is ideal until team size exceeds 50-80 engineers. Microservices introduce severe distributed complexity: network latency, distributed serialization, partial failures, telemetry/tracing overhead, and data consistency headaches. Migrate only when team organizational autonomy (Conway's Law) and independent deployment cadences demand it.\n\n2. The Saga Pattern (Instead of 2PC):\nTwo-Phase Commit (2PC) creates blocking database locks that severely hurt throughput in cloud environments. Instead, use the Saga pattern:\n- Orchestrated Saga: A central coordinator service sends commands to individual services (e.g. Order Service -> Payment Service -> Inventory Service). Each service executes a local transaction.\n- Compensating Transactions: If Inventory fails, the coordinator issues compensating events backwards to refund Payment and cancel the Order.\n- Idempotency & Outbox Pattern: Each microservice writes both business data and outgoing events to a local transactional outbox table in one ACID commit, ensuring at-least-once delivery.",
    globalCompanies: ["Amazon", "Netflix", "Uber", "Shopify"],
    pakistanCompanies: ["Systems Limited", "VentureDive", "Devsinc"],
    frequency: "Very High",
    conceptualEra: "Modern Era (2025/2026)",
  },
  {
    id: 110,
    topic: "Zero-Downtime Cloud Deployments & Canary Traffic Splitting",
    question:
      "Walk through setting up a zero-downtime deployment pipeline to Google Cloud Run or Kubernetes using canary traffic splitting. How do readiness probes, rollback signals, and database schema migrations coordinate?",
    difficulty: "Intermediate",
    marksAvailable: 10,
    rubricHint:
      "Cloud Run revision traffic splitting, expand/contract database migrations, readiness probes, and automated rollback thresholds.",
    accurateAnswer:
      "1. Automated Container Build: Commit triggers GitHub Actions. A multi-stage distroless Docker image is built and pushed with a SHA digest to Google Artifact Registry.\n\n2. Expand/Contract Database Migrations: Never make breaking schema changes (e.g. dropping a column) in the same deploy. Step 1 (Expand): Add new nullable column. Step 2: Deploy app that writes to both columns. Step 3 (Contract): Backfill old rows and drop deprecated column in a subsequent release.\n\n3. Cloud Run Canary Traffic Shifting:\n- Deploy new container as Revision B with 0% initial traffic.\n- Run readiness health checks (`/api/healthz`) to verify container boot and DB connections.\n- Shift 5% of production traffic to Revision B.\n- Monitor error rate (5xx spikes) and latency (p99). If metrics stay green for 5 minutes, progressively scale traffic to 25%, 50%, and 100%.\n- If error rate exceeds 0.5%, automatically route 100% back to Revision A in <1 second with zero dropped user connections.",
    globalCompanies: ["Google Cloud", "Netflix", "Spotify", "GitLab"],
    pakistanCompanies: ["Systems Limited", "Motive", "Arbisoft"],
    frequency: "High",
    conceptualEra: "Modern Era (2025/2026)",
  },
];

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "in", "it", "to", "for", "of", "and", "or",
  "what", "how", "are", "from", "on", "using", "with", "that", "this",
  "your", "you", "explain", "describe", "between", "when", "does", "can",
  "key", "core", "modern", "systems", "applications"
]);

function extractMeaningfulTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

/**
 * Safely extracts and parses JSON from raw LLM responses.
 * Handles markdown fences, preamble/postscript text, and gracefully returns null on failure.
 */
function safeExtractJson<T>(raw: string): T | null {
  if (!raw || typeof raw !== "string") return null;

  const trimmed = raw.trim();

  // 1. Direct parse attempt
  try {
    return JSON.parse(trimmed) as T;
  } catch { }

  // 2. Extract content from markdown ```json ... ``` or ``` ... ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim()) as T;
    } catch { }
  }

  // 3. Find outermost [ ... ] array
  const firstBracket = trimmed.indexOf("[");
  const lastBracket = trimmed.lastIndexOf("]");
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    try {
      return JSON.parse(trimmed.slice(firstBracket, lastBracket + 1)) as T;
    } catch { }
  }

  // 4. Find outermost { ... } object
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)) as T;
    } catch { }
  }

  return null;
}

/**
 * Detects if the candidate simply repeated, echoed, or copied the question back
 */
function isQuestionCopyPaste(questionText: string, answerText: string): boolean {
  const normQ = questionText.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const normA = answerText.toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

  if (!normA) return true;

  // 1. Exact match
  if (normA === normQ) return true;

  // 2. Verbatim question contained in answer
  if (normQ.length > 25 && normA.includes(normQ)) {
    return true;
  }

  // 3. Significant chunk of question contained in answer and answer isn't much longer
  if (normQ.length > 35) {
    const chunk = normQ.slice(0, 45);
    if (normA.includes(chunk) && normA.length < normQ.length * 1.6) {
      return true;
    }
  }

  // 4. Token overlap check: if >= 65% of candidate's vocabulary is borrowed from question
  const qTokens = new Set(extractMeaningfulTokens(questionText));
  const aTokens = extractMeaningfulTokens(answerText);
  if (aTokens.length === 0) return true;

  let matchCount = 0;
  for (const token of aTokens) {
    if (qTokens.has(token)) {
      matchCount++;
    }
  }

  const copyRatio = matchCount / aTokens.length;
  // If high ratio and candidate didn't add substantive original reasoning
  if (copyRatio >= 0.65 && aTokens.length <= qTokens.size * 1.5) {
    return true;
  }

  // 5. Ending with a question mark while echoing most question words
  if (answerText.trim().endsWith("?") && copyRatio >= 0.5) {
    return true;
  }

  return false;
}

/**
 * Detects low-effort answers like "idk", "no idea", "skip", or random gibberish
 */
function isLowEffortOrGibberish(answerText: string): boolean {
  const trimmed = answerText.trim().toLowerCase();
  if (trimmed.length < 15) return true;

  const lowEffortPhrases = [
    "i don't know",
    "i dont know",
    "no idea",
    "no clue",
    "not sure",
    "skip",
    "pass",
    "n/a",
    "none",
    "test test",
    "asdf",
  ];

  if (lowEffortPhrases.some((phrase) => trimmed.includes(phrase)) && trimmed.length < 50) {
    return true;
  }

  // Repetitive word spam (e.g. "react react react")
  const words = trimmed.split(/\s+/);
  if (words.length > 6) {
    const unique = new Set(words);
    if (unique.size / words.length < 0.35) return true;
  }

  return false;
}

/**
 * Semantic keyword overlap with expected model answer
 */
function evaluateSemanticConceptMatch(
  userAnswer: string,
  accurateAnswer: string,
  rubricHint: string
): { score: number; matched: string[]; missing: string[] } {
  const expectedTokens = new Set([
    ...extractMeaningfulTokens(accurateAnswer),
    ...extractMeaningfulTokens(rubricHint),
  ]);
  const userTokens = new Set(extractMeaningfulTokens(userAnswer));

  const matched: string[] = [];
  const missing: string[] = [];

  for (const token of expectedTokens) {
    if (userTokens.has(token)) {
      matched.push(token);
    } else if (missing.length < 4 && token.length > 4) {
      missing.push(token);
    }
  }

  let score = 2;
  if (matched.length >= 8) score = 9;
  else if (matched.length >= 5) score = 8;
  else if (matched.length >= 3) score = 6;
  else if (matched.length >= 2) score = 4;
  else if (matched.length === 1) score = 2;
  else score = 0;

  return { score, matched: matched.slice(0, 4), missing: missing.slice(0, 3) };
}

/**
 * Generate 10 tailored interview questions using Gemma or resilient curriculum generator
 */
export async function generate10Questions(params: {
  targetRole: string;
  difficulty: DifficultyLevel;
  skills: string[];
  interviewFocus: string;
  location: JobLocation;
}): Promise<InterviewQuestion[]> {
  const locationMeta =
    LOCATION_OPTIONS.find((l) => l.id === params.location) ||
    LOCATION_OPTIONS[0];

  const systemPrompt = `You are the Lead Technical Interviewer and Engineering Director at InterviewPilot AI.
Generate exactly 10 original, challenging conceptual and architectural interview questions for a candidate.
For each question, tag top Global Tech Companies (e.g. Google, Meta, Stripe, Amazon, Netflix, Microsoft, Vercel) and top Pakistan Tech Companies (e.g. Arbisoft, Systems Limited, Careem, 10Pearls, SadaPay, VentureDive, Devsinc, Motive) that actively ask this style of question.
Return ONLY valid JSON in this exact structure without markdown backticks or commentary:
[
  {
    "id": 1,
    "question": "Question text here?",
    "topic": "Topic Name",
    "difficulty": "${params.difficulty}",
    "marksAvailable": 10,
    "rubricHint": "Key criteria expected in answer",
    "accurateAnswer": "Detailed accurate model answer explaining the exact concepts, architectural considerations, and best practices.",
    "globalCompanies": ["Google", "Meta", "Stripe"],
    "pakistanCompanies": ["Arbisoft", "Systems Limited", "Careem"],
    "frequency": "Very High",
    "conceptualEra": "Modern Era (2025/2026)"
  }
]`;

  const userPrompt = `Candidate Profile:
- Role: ${params.targetRole}
- Level: ${params.difficulty}
- Skills: ${params.skills.join(", ")}
- Focus: ${params.interviewFocus}
- Target Market: ${locationMeta.label} (${locationMeta.description})

Generate 10 original, challenging, and domain-relevant questions (worth 10 marks each, 100 marks total).
Ensure "accurateAnswer" contains the full correct answer so the student can study from it.
Include real company names in globalCompanies (e.g. Google, Stripe) and pakistanCompanies (e.g. Arbisoft, Careem).`;

  try {
    const rawResponse = await callGemmaOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], 0.6);

    const parsed = safeExtractJson<any[]>(rawResponse);
    if (Array.isArray(parsed) && parsed.length >= 8) {
      return parsed.slice(0, 10).map((q, idx) => ({
        id: idx + 1,
        question: q.question,
        topic: q.topic || `Topic ${idx + 1}`,
        difficulty: params.difficulty,
        marksAvailable: 10,
        rubricHint: q.rubricHint || "Clear explanation of concepts with examples.",
        accurateAnswer: q.accurateAnswer || "Comprehensive technical explanation adhering to industry best practices.",
        globalCompanies: Array.isArray(q.globalCompanies) && q.globalCompanies.length > 0
          ? q.globalCompanies
          : ["Google", "Meta", "Stripe"],
        pakistanCompanies: Array.isArray(q.pakistanCompanies) && q.pakistanCompanies.length > 0
          ? q.pakistanCompanies
          : ["Arbisoft", "Systems Limited", "Careem"],
        frequency: q.frequency || "Very High",
        conceptualEra: q.conceptualEra || "Modern Era (2025/2026)",
      }));
    }
  } catch (err) {
    // Upstream OpenRouter unavailable or rate-limited; gracefully fall back to curated curriculum
  }

  // Resilient High-Quality Curated Fallback
  return getCurated10Questions(params.targetRole, params.difficulty, params.skills, locationMeta.label);
}

/**
 * Evaluate Candidate Answer out of 10 marks with Strict Guardrails
 */
export async function evaluateCandidateAnswer(params: {
  question: InterviewQuestion;
  userAnswer: string;
  difficulty: DifficultyLevel;
  location: JobLocation;
}): Promise<AnswerEvaluation> {
  const trimmed = params.userAnswer.trim();

  // 1. STRICT GUARD: COPY-PASTED QUESTION DETECTION (The exact glitch reported by user)
  if (isQuestionCopyPaste(params.question.question, trimmed)) {
    return {
      questionId: params.question.id,
      marksEarned: 0,
      explanation:
        "You repeated or copied the question back instead of providing an answer. In an engineering interview, repeating the interviewer's prompt without a solution awards 0 marks.",
      correctConcepts: ["No technical answer provided — question was duplicated"],
      missingConcepts: [
        "End-to-end technical explanation",
        "Implementation details & architecture",
        "Key concepts addressing the prompt",
      ],
      suggestions:
        "Answer the question in your own words. Walk through the technical architecture, data flow, or lifecycle steps.",
      accurateAnswer: params.question.accurateAnswer,
    };
  }

  // 2. STRICT GUARD: LOW-EFFORT / GIBBERISH DETECTION
  if (isLowEffortOrGibberish(trimmed)) {
    return {
      questionId: params.question.id,
      marksEarned: 0,
      explanation:
        "The response was too short, evasive, or lacked technical substance to be evaluated against the 10-mark rubric.",
      correctConcepts: ["None"],
      missingConcepts: [
        `Core engineering concepts related to ${params.question.topic}`,
        "Structured problem-solving reasoning",
      ],
      suggestions:
        "Always attempt to explain the concept even if partially unsure. Break down your reasoning step by step.",
      accurateAnswer: params.question.accurateAnswer,
    };
  }

  // 3. AI EVALUATION PROMPT (with anti-plagiarism guardrails)
  const systemPrompt = `You are a Senior Technical Hiring Manager evaluating an interview answer out of 10 marks.
CRITICAL RULES:
1. If the candidate repeats or echoes the question prompt without an answer, award 0 marks.
2. If the candidate writes irrelevant filler, award 0 marks.
3. Award marks strictly from 0 to 10 based on technical depth, terminology, and alignment with the Expected Model Answer.
Return ONLY valid JSON matching this schema:
{
  "marksEarned": 7,
  "explanation": "Why this score was awarded",
  "correctConcepts": ["Concept 1", "Concept 2"],
  "missingConcepts": ["Missing Point 1", "Missing Point 2"],
  "suggestions": "Actionable feedback to improve"
}`;

  const userPrompt = `Question (Worth 10 Marks):
"${params.question.question}"

Topic: ${params.question.topic}
Expected Model Answer:
"${params.question.accurateAnswer}"

Candidate's Answer:
"${trimmed}"

Grade the candidate's answer strictly between 0 and 10.`;

  try {
    const rawResponse = await callGemmaOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ], 0.2);

    const parsed = safeExtractJson<{
      marksEarned?: number;
      explanation?: string;
      correctConcepts?: string[];
      missingConcepts?: string[];
      suggestions?: string;
    }>(rawResponse);

    if (parsed && typeof parsed.marksEarned === "number") {
      let marks = Math.min(10, Math.max(0, Number(parsed.marksEarned) || 0));

      // Double-check AI output against copy-paste guard
      if (isQuestionCopyPaste(params.question.question, trimmed)) {
        marks = 0;
      }

      return {
        questionId: params.question.id,
        marksEarned: marks,
        explanation: parsed.explanation || "Answer evaluated against expected technical rubrics.",
        correctConcepts:
          Array.isArray(parsed.correctConcepts) && parsed.correctConcepts.length > 0
            ? parsed.correctConcepts
            : ["Addressed part of the prompt"],
        missingConcepts:
          Array.isArray(parsed.missingConcepts) && parsed.missingConcepts.length > 0
            ? parsed.missingConcepts
            : ["More technical depth recommended"],
        suggestions:
          parsed.suggestions ||
          "Provide concrete code or architectural examples to back your points.",
        accurateAnswer: params.question.accurateAnswer,
      };
    }
  } catch (err) {
    // Upstream OpenRouter rate-limited or non-JSON; fall through to semantic matcher
  }

  // 4. SEMANTIC CONCEPT MATCHING FALLBACK (No naive character length check!)
    const matchResult = evaluateSemanticConceptMatch(
      trimmed,
      params.question.accurateAnswer,
      params.question.rubricHint
    );

    return {
      questionId: params.question.id,
      marksEarned: matchResult.score,
      explanation:
        matchResult.score >= 7
          ? `Strong answer! You demonstrated a clear grasp of ${params.question.topic} and touched on key concepts.`
          : matchResult.score >= 4
            ? `Partially correct. You addressed basic elements of ${params.question.topic}, but lacked depth on core mechanics.`
            : `Insufficient technical depth. The answer did not adequately address the core concepts of ${params.question.topic}.`,
      correctConcepts:
        matchResult.matched.length > 0
          ? matchResult.matched.map((m) => `Mentioned concept: ${m}`)
          : ["General relevance to question topic"],
      missingConcepts:
        matchResult.missing.length > 0
          ? matchResult.missing.map((m) => `Key concept: ${m}`)
          : ["Architecture boundaries and error handling", "Production trade-offs"],
      suggestions:
        "Study the accurate model answer below to incorporate industry-standard terminology and workflows.",
      accurateAnswer: params.question.accurateAnswer,
    };
}

/**
 * Curated 10-Question Bank by Domain & Modern Architectural Standards
 */
function getCurated10Questions(
  role: string,
  difficulty: DifficultyLevel,
  skills: string[],
  location: string
): InterviewQuestion[] {
  const baseSkills = skills.slice(0, 3).join(", ") || "Full Stack";

  return [
    {
      id: 1,
      topic: "Core Architecture & Mental Model",
      question: `In modern ${role} applications using ${baseSkills}, explain the core architectural flow from a user interaction to data persistence. What are the key rendering or processing boundaries?`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Clear division between client/server, state management lifecycle, and API contracts.",
      accurateAnswer:
        "In modern architectures (e.g. Next.js / React), UI components dispatch actions or triggers. Client components handle interactive state, invoking Server Actions or REST/gRPC endpoints. The server layer authenticates the request, applies business validation, queries the database (with ORM or SQL), and returns serializable data. Boundaries must separate secret keys and heavy compute on the server from lightweight DOM rendering on the client.",
      globalCompanies: ["Google", "Meta", "Stripe", "Vercel"],
      pakistanCompanies: ["Arbisoft", "Systems Limited", "10Pearls"],
      frequency: "Very High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 2,
      topic: "Asynchronous Concurrency & Error Handling",
      question: `How do you handle asynchronous failures, retries, and network errors gracefully in production when consuming third-party APIs or microservices?`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Exponential backoff, idempotent operations, user-facing optimistic rollbacks, and error boundaries.",
      accurateAnswer:
        "Best practices include: 1) Using try/catch with typed error boundaries; 2) Implementing exponential backoff with jitter for transient 5xx network glitches; 3) Ensuring operations are idempotent (e.g. using unique request idempotency keys) so retries don't duplicate mutations; 4) Graceful UI degradation with clear alerts, skeleton loaders, and non-blocking retry buttons.",
      globalCompanies: ["Stripe", "Uber", "Amazon AWS"],
      pakistanCompanies: ["Careem", "SadaPay", "NayaPay"],
      frequency: "Very High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 3,
      topic: "Performance & Resource Optimization",
      question: `Describe 3 critical techniques you use to diagnose and fix performance bottlenecks in high-traffic applications. Mention specific metrics you monitor.`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Core Web Vitals (LCP, INP, CLS), database query indexing, memory leak detection, and caching tiers.",
      accurateAnswer:
        "1) Frontend Web Vitals: Monitor LCP (Largest Contentful Paint) via code splitting and CDN image optimization; INP (Interaction to Next Paint) by avoiding blocking the main thread. 2) Backend Database: Analyze query plans (`EXPLAIN ANALYZE`), add composite B-Tree indexes, and eliminate N+1 queries. 3) Caching: Deploy multi-layer caching with stale-while-revalidate and Redis for hot paths.",
      globalCompanies: ["Google", "Netflix", "Cloudflare"],
      pakistanCompanies: ["Arbisoft", "Systems Limited", "VentureDive"],
      frequency: "Very High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 4,
      topic: "State Management & Reactivity",
      question: `How do you decide between local component state, global client state (Zustand/Redux), and server cache/state in modern applications?`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Distinction between server state (fetched data) and true client UI state (modals, drafts).",
      accurateAnswer:
        "Keep server state on the server or in dedicated cache (React Query, SWR, Next.js cache) rather than duplicating it in global client stores. Use local component state (`useState`, `useReducer`) for transient UI interactions (input values, dropdowns). Reserve global stores (Zustand) strictly for application-wide client concerns like active session, theme, or multi-step checkout state.",
      globalCompanies: ["Meta", "Figma", "Airbnb"],
      pakistanCompanies: ["10Pearls", "Arbisoft", "Devsinc"],
      frequency: "High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 5,
      topic: "Security & Vulnerability Prevention",
      question: `Explain how you prevent Cross-Site Scripting (XSS), SQL/NoSQL Injection, and Cross-Site Request Forgery (CSRF) in web and cloud applications.`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Input sanitization, parameterized queries, Content Security Policy, and SameSite HTTP-only cookies.",
      accurateAnswer:
        "1) XSS: Never dangerously inject raw HTML without sanitizing (DOMPurify). Enforce strict Content Security Policy (CSP) headers. 2) Injection: Always use parameterized queries or trusted ORMs; never concatenate raw user input into SQL or MongoDB filters. 3) CSRF: Use SameSite=Lax/Strict on HTTP-only secure cookies and anti-CSRF verification tokens on state-changing POST/PUT requests.",
      globalCompanies: ["Microsoft", "Stripe", "Auth0"],
      pakistanCompanies: ["SadaPay", "NayaPay", "Afiniti"],
      frequency: "Very High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 6,
      topic: "System Scalability & Database Indexing",
      question: `When a relational database table grows beyond 10 million rows, queries begin slowing down. What systematic steps would you take to optimize it?`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Indexing, read-replicas, table partitioning, query restructuring, and Redis caching.",
      accurateAnswer:
        "First, run `EXPLAIN ANALYZE` on slow queries to identify full table scans. Add targeted indexes on filtered and foreign key columns. If writes remain heavy, partition tables horizontally by date or tenant ID. Implement Redis caching for read-heavy static lookups and introduce read-replicas to offload reporting queries from the primary database.",
      globalCompanies: ["Amazon AWS", "Uber", "Databricks"],
      pakistanCompanies: ["Careem", "Systems Limited", "Motive"],
      frequency: "Very High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 7,
      topic: "Cloud Deployment & CI/CD Pipelines",
      question: `Walk through your ideal automated deployment pipeline for deploying a containerized application to Google Cloud (e.g. Cloud Run) with zero downtime.`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Docker multi-stage builds, GitHub Actions, automated unit/integration tests, and canary/blue-green traffic splitting.",
      accurateAnswer:
        "Code is committed to GitHub. GitHub Actions triggers linting, type-checking, and test suites. A multi-stage Docker build produces an immutable, minimal distroless image, pushed to Google Artifact Registry. Google Cloud Run deploys the new revision without traffic. Health probes verify readiness before Cloud Run automatically shifts 100% of traffic, guaranteeing zero downtime.",
      globalCompanies: ["Google Cloud", "GitLab", "Spotify"],
      pakistanCompanies: ["Systems Limited", "VentureDive", "Arbisoft"],
      frequency: "High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 8,
      topic: "Code Refactoring & Technical Debt",
      question: `You inherit a 2,000-line monolithic component or function with poor test coverage and frequent bugs. What is your strategy to safely refactor it?`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Characterization tests, incremental strangler pattern, small pull requests, and single responsibility.",
      accurateAnswer:
        "1) Do not rewrite everything at once. Write characterization tests around current behavior to establish a safety baseline. 2) Apply the Strangler Fig pattern: extract pure helper functions and business logic into isolated, testable modules. 3) Split the monolithic UI into smaller single-responsibility components with strict prop contracts. 4) Deploy changes in small, continuous, verifiable PRs.",
      globalCompanies: ["Meta", "Shopify", "GitHub"],
      pakistanCompanies: ["Arbisoft", "10Pearls", "Devsinc"],
      frequency: "High",
      conceptualEra: "Modern Era (2025/2026)",
    },
    {
      id: 9,
      topic: "STAR Behavioral: Conflict & Tight Deadlines",
      question: `Describe a situation where a stakeholder or team member strongly disagreed with your technical proposal right before a critical launch. How did you resolve it?`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "STAR method: Situation, Task, Action, Result. Focus on objective data, listening, and collaborative alignment.",
      accurateAnswer:
        "Use the STAR method: 1) Situation: State the high-stakes project and the disagreement (e.g. choice of database or release date). 2) Task: Explain your responsibility in delivering on time while maintaining quality. 3) Action: Outline how you scheduled a focused discussion, gathered objective benchmark data, listened to their trade-offs, and proposed an agreeable MVP compromise. 4) Result: Quantifiable outcome (e.g. shipped on time with zero regressions).",
      globalCompanies: ["Amazon", "Google", "Microsoft"],
      pakistanCompanies: ["Careem", "Systems Limited", "SadaPay"],
      frequency: "Very High",
      conceptualEra: "Foundational Leadership",
    },
    {
      id: 10,
      topic: "Engineering Leadership & Best Practices",
      question: `In the context of ${location}, what engineering practices and habits distinguish an exceptional senior engineer from an average developer?`,
      difficulty,
      marksAvailable: 10,
      rubricHint: "Ownership, mentorship, communication, business impact awareness, and proactive observability.",
      accurateAnswer:
        "Exceptional engineers go beyond writing syntax: they take full end-to-end ownership, communicate trade-offs clearly to non-technical stakeholders, actively mentor junior teammates, design systems with observability (logging, metrics, traces) in mind, and align technical decisions with real business value and candidate user happiness.",
      globalCompanies: ["Google", "Netflix", "Stripe"],
      pakistanCompanies: ["Arbisoft", "Systems Limited", "Careem"],
      frequency: "High",
      conceptualEra: "Foundational Leadership",
    },
  ];
}

/**
 * Interactive Chat with AI Interview Agent
 * Candidates can ask for code examples, interviewer expectations at specific companies,
 * concept simplifications, or practice answers in a multi-turn conversation.
 */
export async function chatWithInterviewAgent(params: {
  question: InterviewQuestion;
  userMessage: string;
  chatHistory?: { role: "assistant" | "user"; content: string }[];
  location?: JobLocation;
}): Promise<string> {
  const globalCo = (params.question.globalCompanies || ["Google", "Meta", "Stripe"]).join(", ");
  const pakistanCo = (params.question.pakistanCompanies || ["Arbisoft", "Systems Limited", "Careem"]).join(", ");

  const systemPrompt = `You are InterviewPilot AI, an elite Senior Engineering Interviewer and Technical Coach.
The candidate is currently preparing for this technical interview question:
Question: "${params.question.question}"
Topic: ${params.question.topic}
Difficulty: ${params.question.difficulty}
Accurate Model Answer: "${params.question.accurateAnswer}"
Target Companies Asking This:
- Global: ${globalCo}
- Pakistan: ${pakistanCo}

Respond to the candidate's query in an encouraging, highly knowledgeable, and authoritative tone.
- If they ask for code or an example, provide clean, idiomatic, typed code with clear comments.
- If they ask what interviewers at Google, Careem, Arbisoft, or Systems Ltd look for, explain the exact rubric.
- If they ask you to simplify or clarify, provide an intuitive analogy and mental model.
- If they test their own answer, give them feedback and estimated marks out of 10.
Keep responses concise, sharp, and directly actionable (under 250 words unless writing a code snippet).`;

  const messages: OpenRouterMessage[] = [
    { role: "system", content: systemPrompt },
    ...(params.chatHistory || []).slice(-4).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: params.userMessage },
  ];

  try {
    return await callGemmaOpenRouter(messages, 0.4);
  } catch (err) {
    const msg = params.userMessage.toLowerCase();
    if (msg.includes("code") || msg.includes("example") || msg.includes("syntax")) {
      return `Here is a production-level architectural snippet for **${params.question.topic}**:

\`\`\`typescript
// Modern enterprise pattern for ${params.question.topic}
export async function executeProductionWorkflow(payload: unknown) {
  // 1. Strict input boundary validation (Zod schema)
  const validated = schema.parse(payload);

  // 2. Execute isolated, idempotent transaction
  const result = await db.transaction(async (tx) => {
    return await tx.records.create({
      data: { ...validated, idempotencyKey: generateKey() }
    });
  });

  // 3. Trigger cache revalidation / distributed stream
  return { success: true, data: result };
}
\`\`\`

**Key Interview Tip:** Emphasize boundary validation, typed contracts, and transaction idempotency when explaining this to interviewers.`;
    }

    if (
      msg.includes("company") ||
      msg.includes("google") ||
      msg.includes("arbisoft") ||
      msg.includes("careem") ||
      msg.includes("systems") ||
      msg.includes("stripe")
    ) {
      return `**Interviewer Perspective for ${params.question.topic}:**
- **At Google & Stripe:** Focus is placed on distributed edge cases, concurrency hazards, memory/network overhead, and clean architectural decoupling.
- **At Arbisoft, Systems Limited & Careem:** Interviewers look for pragmatic system delivery: why you picked this architecture over alternatives, how you handle production outages/timeouts, and your ability to reason about database and network latency.`;
    }

    return `Great question! When discussing **${params.question.topic}** in a high-stakes interview:

1. **Foundational Mental Model:** ${params.question.accurateAnswer.slice(0, 180)}...
2. **Key Concepts to Mention:** ${params.question.rubricHint}
3. **Common Pitfall:** Candidates often jump into implementation without articulating the architectural trade-offs between speed, scalability, and complexity.

Would you like to see a code example, or practice how to answer this in 2 minutes?`;
  }
}

/**
 * Company Scout: Search Top 5 Best Interview Questions with Detailed Answers
 */
export async function searchCompanyInterviewQuestions(
  companyName: string,
  targetRole?: string
): Promise<CompanyInterviewData> {
  const role = targetRole || "Software Engineering";

  const systemPrompt = `You are the Lead Technical Interviewer and Engineering Intelligence Scout at InterviewPilot AI.
The candidate is preparing for an interview at: "${companyName}".
Target Role: "${role}".
Provide exactly the Top 5 Best, most frequently asked conceptual and architectural interview questions for this specific company in the modern era, along with their comprehensive, accurate model answers.
Explain why this company asks each question.
Return ONLY valid JSON matching this schema:
{
  "company": "${companyName}",
  "summary": "Brief 1-2 sentence overview of ${companyName}'s engineering culture, interview format, and tech stack.",
  "engineeringCulture": "Key qualities they look for (e.g. distributed scale, ownership, code cleanliness).",
  "questions": [
    {
      "id": 1,
      "topic": "Topic name",
      "question": "Detailed question text",
      "whyAsked": "Why ${companyName} specifically tests this concept",
      "accurateAnswer": "Detailed, comprehensive model answer explaining modern architecture, trade-offs, and code best practices."
    }
  ]
}`;

  const userPrompt = `Search and return top 5 interview questions and model answers for: ${companyName}`;

  try {
    const raw = await callGemmaOpenRouter(
      [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      0.3
    );

    const parsed = safeExtractJson<CompanyInterviewData>(raw);
    if (parsed && Array.isArray(parsed.questions) && parsed.questions.length >= 3) {
      return {
        company: parsed.company || companyName,
        summary:
          parsed.summary ||
          `Top technical and architectural interview questions for ${companyName}.`,
        engineeringCulture:
          parsed.engineeringCulture ||
          "High-concurrency systems, practical architecture, and clean problem solving.",
        questions: parsed.questions.slice(0, 5).map((q, idx) => ({
          id: idx + 1,
          topic: q.topic || `Core Domain ${idx + 1}`,
          question: q.question,
          whyAsked: q.whyAsked || `Core interview criteria tested at ${companyName}`,
          accurateAnswer: q.accurateAnswer,
        })),
      };
    }
  } catch (err) {
    console.warn("Company search dynamic generation issue, using curated fallback:", err);
  }

  // Curated Fallbacks for top companies
  return getCuratedCompanyInterviewData(companyName, role);
}

/**
 * Curated 5-Question Fallbacks for top tech companies
 */
function getCuratedCompanyInterviewData(
  companyName: string,
  role: string
): CompanyInterviewData {
  const norm = companyName.toLowerCase().trim();

  if (norm.includes("google")) {
    return {
      company: "Google",
      summary: "Google evaluates algorithmic depth, distributed system scalability, clean coding boundaries, and Googleyness.",
      engineeringCulture: "Focuses on massive scale (billions of users), clean abstraction layers, and proactive failure isolation.",
      questions: [
        {
          id: 1,
          topic: "Distributed Concurrency & MapReduce / Event Streams",
          question: "How would you design a distributed real-time web crawler and indexer that handles billions of web pages with duplicate URL deduplication and politeness throttling?",
          whyAsked: "Tests knowledge of distributed queues, bloom filters for URL deduplication, and rate limiting across worker nodes.",
          accurateAnswer: "Architecture: 1) URL Frontier managed via distributed Kafka partitions with priority queues. 2) Deduplication using scalable Redis Bloom Filters to test URL existence in O(1) without storing raw URLs in memory. 3) Host-based rate limiters (Token Bucket) to respect robots.txt politeness. 4) Workers stream raw HTML to object storage and push extracted tokens into inverted index shards.",
        },
        {
          id: 2,
          topic: "Memory Leak Detection & V8 Engine Optimization",
          question: "Explain how Google V8's Garbage Collector (Scavenger / Minor GC vs Mark-Sweep-Compact / Major GC) works, and how you diagnose memory leaks caused by detached DOM nodes or lingering closures.",
          whyAsked: "Google values deep runtime fundamentals over high-level framework trivia.",
          accurateAnswer: "V8 uses generational hypothesis: young objects live in Nursery/Intermediate spaces, collected via Cheyney's copy algorithm (fast Minor GC). Surviving objects move to Old Space, managed by Major GC (incremental Mark-Sweep-Compact). To diagnose leaks: capture Chrome DevTools Heap Snapshots, inspect 'Detached HTML Elements' retained by event listeners, and analyze retaining paths back to window root.",
        },
        {
          id: 3,
          topic: "Next-Gen Web Performance (LCP, INP, CLS)",
          question: "Google Search ranks sites partly on Core Web Vitals. How do you optimize INP (Interaction to Next Paint) when heavy JavaScript computations freeze the browser main thread?",
          whyAsked: "Google invented Core Web Vitals and tests engineers on real-world responsiveness.",
          accurateAnswer: "INP measures user interaction latency. Optimizations: 1) Yielding to the main thread via `scheduler.yield()` or microtask chunking so input events process immediately. 2) Offloading CPU-heavy sorting/filtering to Web Workers. 3) Avoiding synchronous layout thrashing (batching DOM reads and writes). 4) Debouncing and using transitions (`useTransition` in React).",
        },
        {
          id: 4,
          topic: "Scalable API Design & Idempotency",
          question: "When designing high-concurrency mutation APIs across multiple microservices, how do you implement idempotency keys and prevent duplicate charges or operations during network retries?",
          whyAsked: "Crucial for Google Cloud, Google Pay, and Play Store transactions.",
          accurateAnswer: "Client sends an `Idempotency-Key: <UUID>` header. The server acquires an atomic distributed lock in Redis for that key. If key is currently 'IN_FLIGHT', return 409 or wait. Once completed, persist the exact response status and payload in Redis with a 24-hour TTL. Subsequent retries with the same key immediately return the cached payload without re-executing business logic.",
        },
        {
          id: 5,
          topic: "Googleyness: Ambiguity & Disagreement",
          question: "Tell me about a time you worked on a technically ambiguous project where requirements were shifting, and two senior engineers insisted on contradictory architectures. How did you navigate it?",
          whyAsked: "Evaluates collaborative leadership, intellectual humility, and data-driven decision making.",
          accurateAnswer: "Structure using STAR: 1) Situation: A large migration project with competing technical visions (e.g. gRPC vs GraphQL). 2) Task: Define a clear evaluation benchmark without ego. 3) Action: Created an objective matrix evaluating throughput, developer ergonomics, and latency with a 2-day proof of concept. Listened empathetically to both perspectives. 4) Result: Consensus achieved, project delivered 2 weeks early with zero friction.",
        },
      ],
    };
  }

  if (norm.includes("careem")) {
    return {
      company: "Careem (Uber Company)",
      summary: "Careem is the super-app of the Middle East & Pakistan, emphasizing distributed real-time geospatial matching, high-throughput Kafka pipelines, and fintech reliability.",
      engineeringCulture: "Values pragmatic ownership, low-latency microservices, and fault-tolerant payment/booking transactions.",
      questions: [
        {
          id: 1,
          topic: "Geospatial Indexing & Ride Matching",
          question: "How would you design a real-time driver dispatching system that matches 100,000 active riders with nearby drivers in under 500ms? Compare Uber H3 vs Google S2 geospatial indexing.",
          whyAsked: "Core to Careem's ride-hailing and delivery dispatching engine.",
          accurateAnswer: "Use Uber H3 (hexagonal hierarchical spatial index) or Google S2 cells. Hexagons have invariant neighbor distances. Drivers stream GPS coordinates via WebSockets/MQTT into Redis GEO or in-memory H3 buckets. When a ride is requested, calculate the rider's H3 index at resolution 8, query adjacent hexagonal cells, filter available drivers by heading/ETA, and issue match offers via Kafka.",
        },
        {
          id: 2,
          topic: "Kafka Partitioning & Surge Pricing Concurrency",
          question: "During peak rush hour in Karachi or Dubai, ride demand spikes 10x. How do you design Kafka topic partitioning to calculate real-time surge pricing without bottlenecks?",
          whyAsked: "Evaluates distributed message partitioning, consumer group lag, and stateful stream processing.",
          accurateAnswer: "Partition the incoming `ride_requests` topic by `geohash_prefix` or `city_zone_id` so all events for a specific neighborhood land on the same Kafka partition in order. Use Apache Flink or Kafka Streams with tumbling 1-minute time windows to compute the ratio of supply (available drivers) to demand (rider searches). Output dynamic surge multipliers directly to Redis cache.",
        },
        {
          id: 3,
          topic: "Distributed Transactions: Careem Pay & Ride Checkout",
          question: "When a customer finishes a ride, Careem Pay must deduct Careem Pay wallet credits, charge the credit card balance if needed, and pay the driver. How do you orchestrate this without 2-Phase Locking?",
          whyAsked: "Tests real-world financial transaction reliability across independent microservices.",
          accurateAnswer: "Implement the Orchestrated Saga Pattern: 1) Ride Completion Service triggers Saga Coordinator. 2) Step 1: Hold wallet funds. Step 2: Call payment gateway (Visa/Mastercard). Step 3: Credit Captain wallet. If Step 2 fails, coordinator triggers compensating transactions to release held wallet funds. All operations must carry an Idempotency Key and use Transactional Outbox pattern.",
        },
        {
          id: 4,
          topic: "Mobile App Battery & Network Reconnection in Emerging Markets",
          question: "Captain apps run in low-connectivity areas with mobile data drops and intense battery drain. How do you optimize mobile data syncing and reconnection logic?",
          whyAsked: "A critical daily operational challenge for Careem Captains across Pakistan and MENA.",
          accurateAnswer: "1) Exponential backoff with jitter on reconnects to prevent thundering herd on cell towers. 2) Batch non-critical telemetry GPS points locally in SQLite and upload in compressed gzip chunks over HTTP/2. 3) Use WebSocket heartbeats (ping/pong) with adaptive interval based on battery level and moving speed (less frequent when vehicle is stationary).",
        },
        {
          id: 5,
          topic: "Culture: Customer & Captain Obsession",
          question: "Tell me about a production incident where an app feature degraded Captain or User experience. How did you diagnose, resolve, and prevent recurrence?",
          whyAsked: "Careem evaluates operational resilience and empathy for everyday users.",
          accurateAnswer: "Describe a concrete incident: A payment webhook timeout caused false 'ride failed' prompts. Immediate Action: Rolled back canary deploy, issued automated apologies, and created an automated reconciliation cron to fix balances. Long-term fix: Added circuit breaker with Resilience4j and improved synthetic ping alerts.",
        },
      ],
    };
  }

  if (norm.includes("arbisoft")) {
    return {
      company: "Arbisoft",
      summary: "Arbisoft is one of Pakistan's elite software engineering houses, known for rigorous Computer Science fundamentals, clean code, scalable Python/Django, TypeScript/React, and edX global scale.",
      engineeringCulture: "Emphasizes deep algorithm design, clean architectural patterns, database indexing, and disciplined testing.",
      questions: [
        {
          id: 1,
          topic: "Database Indexing & N+1 Query Optimization",
          question: "In a high-traffic edTech application like edX running on PostgreSQL with millions of student submissions, queries suddenly spike CPU to 100%. Walk through your step-by-step diagnostic and query optimization workflow.",
          whyAsked: "Arbisoft built major components of edX and tests engineers on deep relational database performance.",
          accurateAnswer: "1) Diagnostic: Enable `pg_stat_statements` and run `EXPLAIN (ANALYZE, BUFFERS)` to inspect sequential scans vs index scans. 2) Eliminate N+1: Use `select_related` (joins) and `prefetch_related` in ORMs. 3) Indexing: Create composite B-Tree indexes on `(course_id, submission_date DESC)` to cover sorting queries. 4) Partitioning: Partition submission tables horizontally by academic year.",
        },
        {
          id: 2,
          topic: "Modern Full-Stack Architecture: Next.js & Server Actions",
          question: "In Next.js 15/16 App Router, how do React Server Components (RSC) and Server Actions interact? How do you maintain type safety between client components and database queries?",
          whyAsked: "Arbisoft builds modern web applications using TypeScript and Next.js.",
          accurateAnswer: "Server Components fetch data directly from the DB/ORM on the server with zero client bundle impact. When a form or button triggers a Server Action (`'use server'`), it executes on the server and revalidates cache tags using `revalidatePath()` or `revalidateTag()`. Type safety is maintained using Zod schemas to validate inputs at the action boundary and infer return types (`ActionState<T>`).",
        },
        {
          id: 3,
          topic: "Asynchronous Background Jobs & Celery / Redis Queues",
          question: "How do you architect an asynchronous worker queue (Celery/BullMQ with Redis) to process video transcoding or PDF report generation without memory leaks or worker starvation?",
          whyAsked: "Arbisoft systems routinely process heavy asynchronous data pipelines.",
          accurateAnswer: "1) Separate queues: Dedicated queues for fast jobs vs long-running heavy jobs. 2) Prevent memory leaks: Configure `max-tasks-per-child` so worker processes restart after 100 jobs. 3) Visibility timeout: Ensure acknowledgement timeout exceeds maximum task execution time. 4) Dead-letter queue (DLQ): Auto-retry 3 times with exponential backoff before sending failed jobs to DLQ for alerting.",
        },
        {
          id: 4,
          topic: "System Design: Real-time Live Code Assessment Sandbox",
          question: "Design a secure remote code execution sandbox (like LeetCode or HackerRank) where thousands of candidates compile and run untrusted Python/C++ code concurrently.",
          whyAsked: "Evaluates security boundaries, virtualization, and resource limits.",
          accurateAnswer: "Architecture: 1) Web service receives code submission. 2) Dispatches job to worker node. 3) Worker spins up ephemeral gVisor sandbox or lightweight Docker container with dropped Linux capabilities (`CAP_NET_RAW` disabled, read-only rootfs). 4) Enforces strict cgroups limits: max 256MB RAM, 1 CPU core, 2-second timeout. 5) Captures stdout/stderr and securely tears down container.",
        },
        {
          id: 5,
          topic: "Culture: Code Review Rigor & Technical Debt",
          question: "How do you conduct code reviews when reviewing code written by junior engineers vs senior peers? What automated tooling do you enforce in CI/CD?",
          whyAsked: "Arbisoft is famous for high code review standards and engineering mentorship.",
          accurateAnswer: "Automate the trivial (ESLint, Prettier, TypeScript compiler, SonarQube for vulnerability scans). In human review: focus on architectural coherence, edge cases, error recovery, and test coverage. For juniors: explain the 'why' with links to patterns and offer pairing sessions. For seniors: focus on long-term scalability and business impact trade-offs.",
        },
      ],
    };
  }

  if (norm.includes("systems")) {
    return {
      company: "Systems Limited",
      summary: "Systems Limited is Pakistan's largest publicly listed IT enterprise exporter, specializing in digital transformation, banking, cloud modernization, and high-concurrency enterprise stacks.",
      engineeringCulture: "Emphasizes enterprise architecture, cloud resilience, secure API contracts, and scalable backend delivery.",
      questions: [
        {
          id: 1,
          topic: "Enterprise Microservices Migration & Strangler Fig Pattern",
          question: "A Tier-1 commercial bank has a 15-year-old monolithic core banking application. How do you design an incremental migration to microservices without risking operational downtime?",
          whyAsked: "Systems Limited leads large-scale digital banking transformation projects.",
          accurateAnswer: "Apply the Strangler Fig Pattern: 1) Deploy an API Gateway (e.g. Kong, Apigee) in front of the monolith. 2) Intercept new domain functionalities (e.g. Account Statements, Mobile Top-ups) and route them to new containerized microservices. 3) Use Change Data Capture (CDC with Debezium) to sync database changes bidirectionally. 4) Progressively strangle legacy modules until the monolith is retired.",
        },
        {
          id: 2,
          topic: "Cloud-Native Multi-Region High Availability",
          question: "How do you architect an active-active multi-region deployment on Google Cloud (Cloud Run / GKE with Cloud Spanner / PostgreSQL) ensuring less than 5 minutes RTO and zero RPO?",
          whyAsked: "Crucial for fintech and mission-critical enterprise systems.",
          accurateAnswer: "1) Cloud Spanner or CockroachDB with multi-region consensus (Paxos / Raft) guarantees zero RPO (no lost transactions). 2) Google Cloud Global External HTTP(S) Load Balancer routes traffic to the nearest healthy region via Anycast IP. 3) Stateless microservices on Cloud Run/GKE scale automatically. 4) Automated health checks redirect 100% of traffic within seconds if a regional datacenter fails.",
        },
        {
          id: 3,
          topic: "REST vs gRPC vs GraphQL in Enterprise Stacks",
          question: "When should an enterprise adopt gRPC over REST or GraphQL for internal service-to-service communication? Explain HTTP/2 multiplexing and protobuf serialization benefits.",
          whyAsked: "Evaluates protocol understanding, serialization efficiency, and microservice networking.",
          accurateAnswer: "gRPC uses Protocol Buffers (binary serialization) and HTTP/2. Benefits: 1) 7-10x faster serialization than JSON. 2) True multiplexing over a single TCP connection, eliminating head-of-line blocking. 3) Strongly typed schema contracts (`.proto`) generate client libraries automatically. Use gRPC for high-throughput internal microservice calls; expose REST/GraphQL to external web/mobile clients.",
        },
        {
          id: 4,
          topic: "OAuth 2.0 & OpenID Connect in Banking Apps",
          question: "Explain the Authorization Code Grant with PKCE (Proof Key for Code Exchange) workflow for a mobile banking application. Why is PKCE required over standard client secrets?",
          whyAsked: "Core security requirement for financial compliance (PCI-DSS, SBP regulations).",
          accurateAnswer: "Mobile apps cannot keep client secrets confidential (decompilation can expose them). PKCE workflow: 1) App generates a random `code_verifier` and its cryptographic hash `code_challenge`. 2) Directs user to Authorization Server passing `code_challenge`. 3) User logs in and receives `authorization_code`. 4) App exchanges `code` + original `code_verifier` for JWT tokens. The server verifies the hash, preventing interception attacks.",
        },
        {
          id: 5,
          topic: "Enterprise Delivery: SLA Breaches & RCA",
          question: "A high-visibility client API experienced an SLA breach during month-end financial closing. How do you lead the Root Cause Analysis (RCA) and present findings to executive stakeholders?",
          whyAsked: "Systems Limited assesses executive communication and structured post-mortem leadership.",
          accurateAnswer: "1) Conduct blameless 5-Whys analysis: isolate what failed (e.g. connection pool exhaustion), why safeguards didn't catch it, and why recovery took time. 2) Actionable items: add auto-scaling headroom, synthetic canary probes, and revised runbooks. 3) Executive communication: present timeline, impact in business numbers, root cause in plain English, and permanent preventative safeguards.",
        },
      ],
    };
  }

  // Generic Dynamic Top Tech Fallback
  return {
    company: companyName,
    summary: `Technical interview scout for ${companyName}. Preparing for ${role} rounds in the modern engineering era.`,
    engineeringCulture: "Problem-solving under production constraints, system architecture, and clean code principles.",
    questions: [
      {
        id: 1,
        topic: "Core Architecture & Scalability",
        question: `How would you architect a high-traffic, resilient system at ${companyName} to handle sudden 10x traffic spikes with zero downtime?`,
        whyAsked: `Tests foundational understanding of scalability, load balancing, and caching tiers at ${companyName}.`,
        accurateAnswer: "Combine horizontal auto-scaling (Cloud Run/Kubernetes), CDN edge caching for static assets, Redis multi-layer caching with stale-while-revalidate for dynamic data, and connection pooling for the database.",
      },
      {
        id: 2,
        topic: "Asynchronous Workflows & Resilient Retries",
        question: `How do you handle third-party API latency and network dropouts gracefully when processing mission-critical operations at ${companyName}?`,
        whyAsked: `Evaluates error boundaries, circuit breakers, and idempotency in production environments.`,
        accurateAnswer: "Use exponential backoff with jitter for retries, ensure mutations are idempotent using unique client idempotency keys, and wrap external services in circuit breakers (e.g. Resilience4j) to prevent cascading failures.",
      },
      {
        id: 3,
        topic: "Database Indexing & Performance Optimization",
        question: `When querying large datasets at ${companyName}, queries begin slowing down. What systematic steps do you take to diagnose and optimize them?`,
        whyAsked: `Assesses practical database performance and query tuning skills.`,
        accurateAnswer: "Run EXPLAIN ANALYZE to identify sequential table scans, add composite B-Tree indexes on filtered columns, eliminate N+1 query patterns, and introduce read replicas for reporting workloads.",
      },
      {
        id: 4,
        topic: "Modern Full-Stack Patterns & State Synchronization",
        question: `How do you ensure type-safe contracts and seamless data synchronization between client frontend and backend services at ${companyName}?`,
        whyAsked: `Tests modern full-stack web engineering standards and developer velocity.`,
        accurateAnswer: "Use end-to-end type safety (TypeScript with Zod validation at API boundaries), optimistic UI mutations with automated rollback on failure, and server-side state revalidation.",
      },
      {
        id: 5,
        topic: "Engineering Leadership & Ownership",
        question: `Describe a situation at ${companyName} where you identified technical debt or architectural bottlenecks and championed a solution to production.`,
        whyAsked: `Evaluates proactivity, communication, and engineering ownership.`,
        accurateAnswer: "Use the STAR method: explain the bottleneck, measure impact with metrics, build consensus with a minimal prototype, and execute incremental refactoring without breaking production releases.",
      },
    ],
  };
}

/**
 * Conversational Interview Pilot with Greeting & Personalized Name Memory
 */
export async function chatWithInterviewPilot(params: {
  userMessage: string;
  candidateName?: string;
  targetCompany?: string;
  chatHistory: { role: "user" | "assistant"; content: string }[];
}): Promise<string> {
  const name = params.candidateName || "Candidate";
  const company = params.targetCompany || "Top Tech Companies";

  const systemPrompt = `You are InterviewPilot AI, an elite Google-style AI Interview Coach and Scout.
You are chatting with ${name}, who is preparing for technical interviews at ${company}.
Your personality: Encouraging, sharp, highly knowledgeable, and conversational.
Capabilities:
- If the user introduces themselves or mentions their name, welcome them warmly by name and ask which company or technology they are aiming for today.
- If the user asks about ANY company (e.g. Google, Careem, Arbisoft, Systems Limited, Stripe, Meta, Amazon, SadaPay, etc.), highlight their interview rounds and provide top questions/answers.
- If the user asks for code, provide clean, idiomatic TypeScript / modern code.
- If the user speaks via voice or asks a quick question, provide concise, high-impact answers suitable for reading or listening to aloud.
Keep responses engaging, formatted in clean Markdown, and under 300 words unless writing a complete code snippet.`;

  const messages: OpenRouterMessage[] = [
    { role: "system", content: systemPrompt },
    ...(params.chatHistory || []).slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: params.userMessage },
  ];

  try {
    return await callGemmaOpenRouter(messages, 0.5);
  } catch (err) {
    return `Hey ${name}! I'm ready to help you prepare for **${company}**. 

You can:
1. Search any company above to explore their **Top 5 Best Interview Questions** with full model answers.
2. Ask me to walk through system design, React/Next.js, backend architecture, or coding patterns.
3. Use the 🎙️ **Mic button** to ask questions with your voice and the 🔊 **Speaker** to listen aloud!

What specific topic or company would you like to explore first?`;
  }
}

