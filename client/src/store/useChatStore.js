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
      const { text: replyText, quickReplies } = await chatService.sendMessage(text);
      const botMsg = makeMessage(replyText, CHAT_SENDER.BOT, quickReplies ?? []);

      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
        unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
      }));
    } catch {
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
