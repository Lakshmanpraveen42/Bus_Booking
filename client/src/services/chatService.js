import { USE_MOCK, API_BASE_URL } from '../config/env';
import chatData from '../data/chatResponses.json';
import { delay } from '../utils/generators';

/** Typing indicator delay in ms */
const TYPING_DELAY = 900;

export const chatService = {
  async sendMessage(userMessage, history = [], userId = null) {
    if (USE_MOCK) {
      await delay(TYPING_DELAY);
      return { 
        reply: "Mocking is disabled for the advanced AI. Set USE_MOCK=false in env.",
        quickReplies: ["Enable AI"] 
      };
    }

    // ─── Real API (Advanced ChatService) ───
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: userMessage,
        user_id: userId,
        history: history.map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text
        }))
      }),
    });
    
    if (!res.ok) throw new Error('Chat service unavailable');
    
    // Result includes { reply, action, data, quick_replies }
    const data = await res.json();
    return {
      text: data.reply,
      action: data.action,
      actionData: data.data,
      quickReplies: data.quick_replies || []
    };
  },

  getQuickReplies() {
    return chatData.quickReplies;
  },
};
