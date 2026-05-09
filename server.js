import express from 'express';
import { CopilotRuntime, OpenAIAdapter, copilotRuntimeNodeExpressEndpoint } from '@copilotkit/runtime';
import { createOpenAI } from '@ai-sdk/openai';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import cors from 'cors';

// Monkey patch OpenAIAdapter to use chat completions
const originalGetLanguageModel = OpenAIAdapter.prototype.getLanguageModel;
OpenAIAdapter.prototype.getLanguageModel = function() {
  try {
    const ai = createOpenAI({
      apiKey: this.openai.apiKey,
      baseURL: this.openai.baseURL,
      compatibility: 'compatible',
    });
    return ai.chat(this.model);
  } catch(e) {
    console.error("[CopilotKit] Error in getLanguageModel monkey patch:", e);
    throw e;
  }
};

dotenv.config();

const app = express();
app.use(cors());

app.use(copilotRuntimeNodeExpressEndpoint({
  endpoint: '/api/copilotkit',
  runtime: new CopilotRuntime(),
  serviceAdapter: new OpenAIAdapter({ 
    openai: new OpenAI({
      apiKey: process.env.VITE_DEEPSEEK_API_KEY || process.env.DEEPSEEK_API_KEY || "dummy",
      baseURL: "https://api.deepseek.com/v1",
    }),
    model: "deepseek-chat"
  }),
}));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
