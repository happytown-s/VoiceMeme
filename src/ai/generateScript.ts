import type { ScriptRequest, ScriptResponse, ScriptSegment } from '../types';
import { API_CONFIG } from '../constants';

/** Chat message for GLM-5 API */
interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** GLM-5 API response */
interface GLM5Response {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/** Streaming chunk from GLM-5 API */
interface GLM5StreamChunk {
  choices: Array<{
    delta: {
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

/** Prompt templates for different styles */
const STYLE_PROMPTS: Record<ScriptRequest['style'], string> = {
  funny:
    '面白くてクスッと笑えるトーク風に。ツッコミやオチを入れて。口語体で。',
  dramatic:
    'ドラマチックなナレーション風に。感情を込めて、臨場感たっぷりに。',
  cute:
    '可愛らしいキャラクター風に。語尾に「〜だもん」「〜なの」など可愛い表現を使って。',
  scary:
    'ホラー映画の語り手風に。不気味でちょっと怖い雰囲気で。',
  news:
    'ニュースキャスター風に。フォーマルな言葉遣いで、嘘のニュースを真顔で読むスタイル。',
};

/** Build the system prompt for script generation */
function buildSystemPrompt(style: ScriptRequest['style'], language: ScriptRequest['language']): string {
  const styleInstruction = STYLE_PROMPTS[style];
  const langInstruction =
    language === 'ja'
      ? '出力は日本語で。'
      : 'Output in English.';

  return `あなたは声メメ（ボイスミーム）の台本作家です。
以下の条件に従って台本を作成してください：

1. 文字数は${language === 'ja' ? '200〜500文字' : '100〜300 words'}程度
2. 読み上げて面白い/印象的な台本にする
3. ${styleInstruction}
4. ${langInstruction}
5. セグメントごとに改行で区切って（最大8セグメント）
6. 各セグメントは短く、1回の呼吸で読める長さにする`;
}

/** Generate a unique ID */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** Parse generated script text into segments */
function parseSegments(text: string): ScriptSegment[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => ({
      id: generateId(),
      text: line,
    }));
}

/**
 * Generate a script using GLM-5 API (non-streaming).
 */
export async function generateScript(
  request: ScriptRequest,
  apiKey: string,
): Promise<ScriptResponse> {
  const systemPrompt = buildSystemPrompt(request.style, request.language);
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `テーマ: ${request.topic}`,
    },
  ];

  const response = await fetch(`${API_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages,
      max_tokens: 1024,
      temperature: 0.8,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GLM-5 API error ${response.status}: ${errorText}`);
  }

  const data: GLM5Response = await response.json();
  const text = data.choices[0]?.message?.content?.trim() ?? '';

  if (!text) {
    throw new Error('GLM-5 returned empty response');
  }

  const segments = parseSegments(text);
  const scriptId = generateId();

  return {
    id: scriptId,
    text,
    segments,
    createdAt: Date.now(),
  };
}

/**
 * Generate a script using GLM-5 API with streaming.
 * Calls onChunk for each text fragment and onComplete with the full response.
 */
export async function generateScriptStream(
  request: ScriptRequest,
  apiKey: string,
  options: {
    onChunk: (text: string) => void;
    onComplete: (response: ScriptResponse) => void;
    onError: (error: Error) => void;
  },
): Promise<void> {
  const systemPrompt = buildSystemPrompt(request.style, request.language);
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `テーマ: ${request.topic}`,
    },
  ];

  let fullText = '';

  try {
    const response = await fetch(
      `${API_CONFIG.baseUrl}/chat/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: API_CONFIG.model,
          messages,
          max_tokens: 1024,
          temperature: 0.8,
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GLM-5 API error ${response.status}: ${errorText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null — streaming not supported');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;

        const data = trimmed.slice(6);
        if (data === '[DONE]') continue;

        try {
          const chunk: GLM5StreamChunk = JSON.parse(data);
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            fullText += content;
            options.onChunk(fullText);
          }
        } catch {
          // Skip malformed chunks
        }
      }
    }

    const scriptId = generateId();
    const segments = parseSegments(fullText);

    options.onComplete({
      id: scriptId,
      text: fullText,
      segments,
      createdAt: Date.now(),
    });
  } catch (error) {
    options.onError(error instanceof Error ? error : new Error(String(error)));
  }
}
