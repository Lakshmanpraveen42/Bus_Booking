import { USE_MOCK, API_BASE_URL } from '../config/env';
import chatData from '../data/chatResponses.json';
import { delay } from '../utils/generators';

/** Typing indicator delay in ms — makes bot feel real */
const TYPING_DELAY = 900;

/**
 * Match a user message against keyword groups and return
 * the appropriate response key.
 */
const classifyMessage = (message) => {
  const lower = message.toLowerCase().trim();

  if (chatData.greetings.some((g) => lower.includes(g))) return 'greeting';
  if (chatData.farewell.some((f) => lower.includes(f))) return 'farewell';
  if (lower.includes('cancel')) return 'cancellation';
  if (lower.includes('refund')) return 'refund';
  if (lower.includes('seat') || lower.includes('berth')) return 'seats';
  if (lower.includes('pay') || lower.includes('upi') || lower.includes('card')) return 'payment';
  if (lower.includes('luggage') || lower.includes('bag') || lower.includes('weight')) return 'luggage';
  if (lower.includes('track') || lower.includes('live') || lower.includes('location')) return 'tracking';

  return 'default';
};

/**
 * Send a message and receive a bot reply.
 * Both mock and real implementations must return { text: string }.
 *
 * To integrate OpenAI later, replace the else branch:
 *   const res = await fetch(...)
 *   return { text: res.choices[0].message.content }
 */
export const chatService = {
  async sendMessage(userMessage, userId, sessionId, history = []) {
    if (USE_MOCK) {
      await delay(TYPING_DELAY);
      const key = classifyMessage(userMessage);
      const text = chatData.responses[key] ?? chatData.responses.default;
      return { text, quickReplies: key === 'default' ? chatData.quickReplies : [] };
    }

    // ─── Real API (FastAPI Chatbot) ───
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ 
        user_id: userId || "SB_GUEST",
        session_id: (sessionId && sessionId.trim() !== "") ? sessionId : "",
        message: userMessage,
        timestamp: new Date().toISOString()
      }),
    });
    if (!res.ok) throw new Error('Chat service unavailable');
    const json = await res.json();
    
    // Return standard format: { text: string, quickReplies: [] }
    // Handles case where backend returns { response: "..." } or { reply: "..." }
    return { 
      text: json.message || json.response || json.reply || json.text || "I'm sorry, I couldn't process that.", 
      quickReplies: json.quickReplies ?? [],
      intent: json.intent,
      data: json.data || []
    };
  },

  getQuickReplies() {
    return chatData.quickReplies;
  },
};
