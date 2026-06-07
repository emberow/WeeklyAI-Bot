import { ClientConfig, Client, WebhookEvent, MessageAPIResponseBase, TextMessage } from '@line/bot-sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const client = new Client(clientConfig);

// Function handler to receive the text.
const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  // Process all variables here.
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

  // Process all message related variables here.
  const { replyToken } = event;
  const { text } = event.message;

  // Create a new message.
  const response: TextMessage = {
    type: 'text',
    text,
  };

  // Reply to the user.
  await client.replyMessage(replyToken, response);
};

export class Line {
    static async sendMessage(message: string) {
        try {
            const groupId = process.env.GROUP_ID || '';
            await client.pushMessage(groupId, {
            type: 'text',
            text: message,
            });
        } catch (err) {
            console.error('Error sending message:', err);
        }  
    }

    static async replyMessage(req: any){
        const events: WebhookEvent[] = req.events || [];
    
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const results = events.map(async (event: any) => {
            try {
            const responseText = '測試';
            event.message.text = responseText;
            await textEventHandler(event);
            } catch (err) {
                console.error(err)
                throw err;
            }
        })
        return results;
        }
}
