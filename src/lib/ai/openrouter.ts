import { GoogleGenAI } from "@google/genai";

export interface OpenRouterMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface GenerateCoachingAdviceParams {
  targetRole: string;
  experienceLevel: string;
  primarySkills: string[];
  interviewFocus: string;
  categoryTitle: string;
}

const GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.1-pro-preview",
  "gemini-2.5-flash",
];

const CANDIDATE_MODELS = [
  process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free",
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "openrouter/free",
  "nvidia/nemotron-3.5-lightning:free",
  "google/gemma-4-31b-it:free",
  "inclusionai/ling-3.2-flash:free",
];

/**
 * Call official Google AI Studio Gemini API using the @google/genai SDK
 */
async function callGoogleGeminiStudio(
  apiKey: string,
  messages: OpenRouterMessage[],
  temperature = 0.5
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
  const systemPrompt = messages.find((m) => m.role === "system")?.content;
  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  if (contents.length === 0 && systemPrompt) {
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
  }

  let lastError = "";

  for (const model of GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt || undefined,
          temperature,
          maxOutputTokens: 1200,
        },
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      lastError = err.message || String(err);
      console.warn(`Google AI Studio Gemini (${model}) issue:`, lastError);

      // If the API key is invalid/unauthenticated, trying other models will fail identically
      if (
        lastError.includes("API key not valid") ||
        lastError.includes("UNAUTHENTICATED") ||
        lastError.includes("401") ||
        lastError.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED")
      ) {
        break;
      }
    }
  }

  throw new Error(`Google AI Studio Gemini failed on all models: ${lastError}`);
}

/**
 * Unified AI Caller:
 * Priority 1: Official Google AI Studio Gemini API (if GEMINI_API_KEY or GOOGLE_API_KEY is present)
 * Priority 2: OpenRouter Free Models Chain (Gemma 4, Nemotron 3 Ultra 550B, OpenRouter Free)
 */
export async function callGemmaOpenRouter(
  messages: OpenRouterMessage[],
  temperature = 0.5
): Promise<string> {
  const providerPref = (process.env.AI_PROVIDER || "").toLowerCase().trim();

  // 1. Check for official Google AI Studio Gemini API Key (unless provider is explicitly set to openrouter)
  if (providerPref !== "openrouter") {
    const geminiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY ||
      "";

    if (geminiKey && geminiKey.trim().length > 0) {
      try {
        return await callGoogleGeminiStudio(geminiKey, messages, temperature);
      } catch (geminiErr) {
        console.warn("Google AI Studio Gemini call failed, falling back to OpenRouter:", geminiErr);
      }
    }
  }

  // 2. OpenRouter Provider Fallback
  const apiKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.api_key ||
    "";

  if (!apiKey) {
    throw new Error(
      "Missing AI API key. Please configure GEMINI_API_KEY (Google AI Studio) or OPENROUTER_API_KEY in .env"
    );
  }

  let lastError = "";

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey.trim()}`,
          "HTTP-Referer": "https://interviewpilot.ai",
          "X-Title": "InterviewPilot AI",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: 1200,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const msg = data.choices?.[0]?.message;
        const content = msg?.content || msg?.reasoning;
        if (content && typeof content === "string" && content.trim().length > 0) {
          return content.trim();
        }
      } else {
        const errText = await response.text();
        lastError = `Model ${model} returned ${response.status}: ${errText}`;
        console.warn(`OpenRouter model ${model} issue:`, lastError);

        // If the key is invalid / user not found (401), subsequent models will fail identically
        if (response.status === 401) {
          break;
        }
      }
    } catch (e: any) {
      lastError = e.message;
      console.warn(`OpenRouter network error on ${model}:`, e);
    }
  }

  throw new Error(`All candidate AI models were unavailable: ${lastError}`);
}

/**
 * Generate personalized onboarding coach summary from Gemma
 */
export async function generatePersonalizedOnboardingAdvice(
  params: GenerateCoachingAdviceParams
): Promise<string> {
  const systemPrompt = `You are InterviewPilot AI, an elite AI interview coach for software engineering candidates.
Provide exactly 3 concise, high-impact bullet points of strategic advice (under 120 words total).
Directly reference the candidate's chosen track (${params.targetRole}) and technologies (${params.primarySkills.slice(0, 4).join(", ")}).`;

  const userPrompt = `Candidate Profile:
- Target Track: ${params.targetRole}
- Experience: ${params.experienceLevel}
- Core Skills: ${params.primarySkills.join(", ")}
- Focus Area: ${params.interviewFocus}
- Assigned Category: ${params.categoryTitle}

Give 3 bullet points of high-impact advice to ace interviews in this domain.`;

  try {
    return await callGemmaOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);
  } catch (err) {
    console.warn("Using high-quality fallback coaching summary:", err);
    return `• Master core ${params.primarySkills[0] || "engineering"} architecture patterns, async lifecycle, and data mutation boundaries.
• Clearly explain technical trade-offs between speed, scalability, and complexity when discussing solutions.
• Structure all situational answers with the STAR framework (Situation, Task, Action, Result) with quantifiable impact.`;
  }
}
