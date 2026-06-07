import { ClientConfig, Client, WebhookEvent, MessageAPIResponseBase, TextMessage } from '@line/bot-sdk';
import * as dotenv from 'dotenv';
import { LLM } from './LLM';

dotenv.config();

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.CHANNEL_SECRET || '',
};

const client = new Client(clientConfig);

const textEventHandler = async (event: WebhookEvent): Promise<MessageAPIResponseBase | undefined> => {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return;
  }

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
    
        const results = events.map(async (event: any) => {
            try {
                const message = event.message.text;
                const mentionees = event.message.mention?.mentionees || [];
                // 檢查被標記的名單內，有沒有包含機器人自己 (isSelf === true)
                const isBotMentioned = mentionees.some((m: any) => m.isSelf === true);
                if (!isBotMentioned) {
                    return null;
                }
                const res = await LLM.ask(message);
                event.message.text = res;
                await textEventHandler(event);
            } catch (err) {
                console.error(err)
            }
        })
        return results;
    }
}
