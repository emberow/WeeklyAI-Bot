import { schedule } from 'node-cron';
import { Line } from './Line';
import * as dotenv from 'dotenv';

dotenv.config()

// 每周詢問訊息，並傳送到line
export const scheduleDailyMessage = () => {
  schedule('0 1 * * *', async () => {
    try {
      console.log("Scheduling task started...");
      Line.sendMessage('xxx');
      console.log("Scheduling task ended...");
    }
    catch (error) {
      console.error("Error in scheduled task:", error);
    }
  });
};