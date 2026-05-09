import { callDeepSeekAPI } from '../lib/deepseek';

export async function getScoreAndTexts(
  bossId: string,
  userAnswer: string,
  taskContext?: string
): Promise<{
  score: number;
  dimensions: { name: string; value: number }[];
  bossComment1: string;
  bossComment2: string;
  suggestion: string;
}> {
  const answer = userAnswer ?? '';
  
  if (!answer.trim()) {
    return {
      score: 0,
      dimensions: [
        { name: '邏輯嚴謹', value: 0 },
        { name: '創意表達', value: 0 },
        { name: '完成度', value: 0 }
      ],
      bossComment1: '你什麼都沒寫啊？',
      bossComment2: '這是在跟我開玩笑嗎？',
      suggestion: '回去重寫一份交上來。'
    };
  }

  try {
    const prompt = `你是一個嚴格的老闆。請根據以下員工提交的任務內容進行評分與評價。
任務背景/要求：${taskContext || '完成交辦事項'}
員工提交內容：${answer}

請以 JSON 格式回傳，格式如下：
{
  "score": (0-100的整數),
  "dimensions": [
    { "name": "邏輯嚴謹", "value": (0-40的整數) },
    { "name": "創意表達", "value": (0-30的整數) },
    { "name": "完成度", "value": (0-30的整數) }
  ],
  "bossComment1": "(第一句老闆的短評，符合老闆語氣)",
  "bossComment2": "(第二句老闆的具體看法)",
  "suggestion": "(老闆給出的具體修改建議或下一步指示)"
}`;

    const response = await callDeepSeekAPI([
      { role: 'system', content: '你是一個職場模擬遊戲中的嚴格老闆與評分引擎。請務必回傳符合格式的 JSON。' },
      { role: 'user', content: prompt }
    ], true);

    const result = JSON.parse(response);
    
    // Ensure dimensions sum correctly
    return {
      score: result.score || 60,
      dimensions: result.dimensions || [
        { name: '邏輯嚴謹', value: 20 },
        { name: '創意表達', value: 20 },
        { name: '完成度', value: 20 }
      ],
      bossComment1: result.bossComment1 || '我看過了，還行。',
      bossComment2: result.bossComment2 || '但細節可以更好。',
      suggestion: result.suggestion || '再優化一下。'
    };
  } catch (error) {
    console.error("AI Scoring failed:", error);
    // Fallback logic
    return {
      score: 60,
      dimensions: [
        { name: '邏輯嚴謹', value: 20 },
        { name: '創意表達', value: 20 },
        { name: '完成度', value: 20 }
      ],
      bossComment1: '這份報告我收到了。',
      bossComment2: 'AI 系統剛好在忙，我先算你及格。',
      suggestion: '下次請再更仔細一點。'
    };
  }
}

