import { create } from 'zustand';
import { CHAT_SENDER } from '../utils/constants';
import { chatService } from '../services/chatService';
import { generateMsgId } from '../utils/generators';

const makeMessage = (text, sender, quickReplies = []) => ({
  id: generateMsgId(),
  text,
  sender,
  quickReplies,
  timestamp: new Date(),
});

const INITIAL_BOT_MSG = makeMessage(
  "Hi! 👋 I'm your BusGo travel assistant. How can I help you today?",
  CHAT_SENDER.BOT,
  chatService.getQuickReplies()
);

export const useChatStore = create((set, get) => ({
  messages: [INITIAL_BOT_MSG],
  isOpen: false,
  isTyping: false,
  unreadCount: 0,

  toggleChat: () => {
    const { isOpen } = get();
    set({ isOpen: !isOpen, unreadCount: isOpen ? 0 : get().unreadCount });
    if (!isOpen) set({ unreadCount: 0 });
  },

  sendMessage: async (text) => {
    if (!text.trim()) return;

    const userMsg = makeMessage(text, CHAT_SENDER.USER);
    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
    }));

    try {
      // Get current history to send to AI
      const currentMessages = get().messages;
      const history = currentMessages.map(m => ({
        role: m.sender === CHAT_SENDER.BOT ? 'assistant' : 'user',
        content: m.text
      })).slice(-10); // Send last 10 messages

      const response = await chatService.sendMessage(text, history);
      const { text: replyText, quickReplies, action, data } = response;
      
      const botMsg = makeMessage(replyText, CHAT_SENDER.BOT, quickReplies ?? []);

      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
        unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
      }));

      // Handle Actions
      if (action === 'search_trips' && data) {
        // We set the search params so the user can just go to /buses
        const { useBookingStore } = await import('./useBookingStore');
        useBookingStore.getState().setSearchParams({
          from: data.source,
          to: data.destination,
          date: data.date
        });
      }
      
      return response; // Return full response in case UI needs it
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = makeMessage(
        "Sorry, I'm having trouble connecting right now. Please try again shortly.",
        CHAT_SENDER.BOT
      );
      set((state) => ({
        messages: [...state.messages, errorMsg],
        isTyping: false,
      }));
    }
  },

  clearMessages: () =>
    set({ messages: [INITIAL_BOT_MSG], unreadCount: 0 }),
}));
