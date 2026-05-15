import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

// Connects to Google Gemini directly using your GEMINI_API_KEY.
// Set this secret in Cloudflare Workers → Settings → Variables and Secrets.
export const createLovableAiGatewayProvider = (apiKey: string) =>
  createOpenAICompatible({
    name: "gemini",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
