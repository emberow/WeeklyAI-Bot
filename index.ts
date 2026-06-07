// Import all dependencies, mostly using destructuring for better view.
import { middleware, MiddlewareConfig } from '@line/bot-sdk';
import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { scheduleDailyMessage } from './src/service/scheduler';
import { Line } from './src/service/Line';

dotenv.config()

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const PORT = process.env.PORT || 3000;

const app: Application = express();

app.get(
  '/',
  async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      status: 'success',
      message: 'Connected successfully!',
    });
  }
);

app.post(
  '/webhook',
  middleware(middlewareConfig),
  async (req: Request, res: Response): Promise<Response> => {
    const results = Line.replyMessage(req.body);
    return res.status(200).json({
      status: 'success',
      results,
    });
  }
);

app.get(
  '/test',
  async (req: Request, res: Response): Promise<Response> => {
      try {
        await Line.sendMessage('test');
      }
      catch (error) {
        console.error("Error in scheduled task:", error);
      }
    return res.status(200).json({
      status: 'success',
    });
  }
);

// schedule 發送訊息
scheduleDailyMessage();

app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
});
