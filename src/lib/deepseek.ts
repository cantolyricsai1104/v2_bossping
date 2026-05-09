export const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';
export const DEEPSEEK_MODEL = 'deepseek-v4-pro';
export const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callDeepSeekAPI(messages: ChatMessage[], isJson = false) {
  if (!DEEPSEEK_API_KEY) {
    throw new Error('Missing DeepSeek API Key. Please add VITE_DEEPSEEK_API_KEY to your environment variables.');
  }

  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: messages,
        temperature: 0.7,
        response_format: isJson ? { type: "json_object" } : undefined
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`DeepSeek API Error: ${response.status} ${response.statusText} - ${errorData ? JSON.stringify(errorData) : ''}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling DeepSeek API:", error);
    throw error;
  }
}
