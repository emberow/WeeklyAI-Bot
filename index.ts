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

// Create a new Express application.
const app: Application = express();



// Register the LINE middleware.
// As an alternative, you could also pass the middleware in the route handler, which is what is used here.
// app.use(middleware(middlewareConfig));

// Route handler to receive webhook events.
// This route is used to receive connection tests.
app.get(
  '/',
  async (_: Request, res: Response): Promise<Response> => {
    return res.status(200).json({
      status: 'success',
      message: 'Connected successfully!',
    });
  }
);

// This route is used for the Webhook.
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

// This route is used for the Webhook.
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

// Create a server and listen to it.
app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
});
