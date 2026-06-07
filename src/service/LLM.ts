import OpenAI from 'openai';

import * as dotenv from 'dotenv';

// 確保有讀取到 .env 檔案
dotenv.config();

// 初始化 OpenAI 實例
// 官方 SDK 會自動尋找 process.env.OPENAI_API_KEY，所以這裡可以留空
const openai = new OpenAI();

export class LLM {
  /**
   * 發送單次訊息給 ChatGPT 並獲取回應
   * @param userMessage 使用者輸入的文字
   * @param systemPrompt (選填) 設定 AI 的角色定位或行為準則
   * @returns AI 回應的文字
   */
  static async ask(userMessage: string, systemPrompt?: string): Promise<string> {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('❌ 錯誤：未在 .env 中偵測到 OPENAI_API_KEY！');
      }

      // 組裝對話歷史
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

      // 如果有提供系統提示詞（角色設定），就優先塞進去
      if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
      }

      // 塞入使用者目前的訊息
      messages.push({ role: 'user', content: userMessage });

      // 呼交 OpenAI Chat Completion API
      const response = await openai.responses.create({
          model: "gpt-5.5",
          tools: [
              { type: "web_search" },
          ],
          input: userMessage,
      });

      // 回傳 AI 生成的內容（若為空則回傳提示文字）
      return response.output_text;

    } catch (error) {
      console.error('❌ OpenAI API 呼叫失敗:', error);
      throw error; // 拋出錯誤讓上層呼叫者可以捕捉處理
    }
  }
}