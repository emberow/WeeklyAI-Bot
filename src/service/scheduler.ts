import { schedule } from 'node-cron';
import { Line } from './Line';
import * as dotenv from 'dotenv';
import { LLM } from './LLM';

dotenv.config()

// 每周詢問訊息，並傳送到line
export const scheduleDailyMessage = () => {
  schedule('0 9 * * 1', async () => {
    try {
      console.log("Scheduling task started...");
      const prompt = process.env.AI_PROMPT || '';
      if (prompt === '') return;
      const message = await LLM.ask(prompt);
      Line.sendMessage(message);
      console.log("Scheduling task ended...");
    }
    catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};