import { CopilotRuntime, OpenAIAdapter } from "@copilotkit/runtime";
import OpenAI from "openai";

export const runtime = 'edge';

export async function POST(req: Request) {
  // Initialize OpenAI client with DeepSeek settings
  const openai = new OpenAI({
    apiKey: process.env.VITE_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com/v1", // Use DeepSeek's endpoint
  });

  // Initialize CopilotKit Runtime
  const copilotKit = new CopilotRuntime();

  // Process the request
  return copilotKit.response(req, new OpenAIAdapter({ openai }));
}
