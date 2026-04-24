import { create } from 'zustand';
import { CHAT_SENDER } from '../utils/constants';
import { chatService } from '../services/chatService';
import { generateMsgId } from '../utils/generators';
import { useAuthStore } from './useAuthStore';

const makeMessage = (text, sender, extra = {}) => ({
  id: generateMsgId(),
  text,
  sender,
  quickReplies: extra.quickReplies || [],
  action: extra.action || null,
  actionData: extra.actionData || null,
  timestamp: new Date(),
});

const INITIAL_BOT_MSG = makeMessage(
  "Hi! 👋 I'm your SmartBus travel assistant. How can I help you today?",
  CHAT_SENDER.BOT,
  { quickReplies: ["Book a Ticket", "Festival Specials"] }
);

export const useChatStore = create((set, get) => ({
  messages: [INITIAL_BOT_MSG],
  isOpen: false,
  isTyping: false,
  unreadCount: 0,

  toggleChat: () => {
    const { isOpen } = get();
    set({ isOpen: !isOpen, unreadCount: isOpen ? 0 : get().unreadCount });
  },

  sendMessage: async (text) => {
    if (!text.trim()) return;

    const userMsg = makeMessage(text, CHAT_SENDER.USER);
    set((state) => ({
      messages: [...state.messages, userMsg],
      isTyping: true,
    }));

    try {
      const { messages } = get();
      const currentUser = useAuthStore.getState().user;
      
      const response = await chatService.sendMessage(
        text, 
        messages, 
        currentUser?.id
      );

      const botMsg = makeMessage(response.text, CHAT_SENDER.BOT, {
        quickReplies: response.quickReplies,
        action: response.action,
        actionData: response.actionData
      });

      set((state) => ({
        messages: [...state.messages, botMsg],
        isTyping: false,
        unreadCount: state.isOpen ? 0 : state.unreadCount + 1,
      }));

      return botMsg; // Return for immediate action handling if needed
    } catch (err) {
      console.error(err);
      const errorMsg = makeMessage(
        "I'm having trouble connecting to my brain right now. 🧠 Just a second...",
        CHAT_SENDER.BOT
      );
      set((state) => ({
        messages: [...state.messages, errorMsg],
        isTyping: false,
      }));
    }
  },

  openChat: () => set({ isOpen: true, unreadCount: 0 }),
  
  clearMessages: () =>
    set({ messages: [INITIAL_BOT_MSG], unreadCount: 0 }),
}));
