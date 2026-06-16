import { create } from 'zustand';
import { CHAT_SENDER } from '../utils/constants';
import { chatService } from '../services/chatService';
import { generateMsgId } from '../utils/generators';
import { useAuthStore } from './useAuthStore';

const makeMessage = (text, sender, quickReplies = [], metadata = {}) => ({
  id: generateMsgId(),
  text,
  sender,
  quickReplies,
  type: metadata.type || 'text',
  data: metadata.data || null,
  timestamp: new Date(),
});

const INITIAL_BOT_MSG = makeMessage(
  "Hi! 👋 I'm your SmartBus travel assistant. How can I help you today?",
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
      const { messages } = get();
      const auth = useAuthStore.getState();
      const userId = auth.user?.id || auth.user?._id || "SB_GUEST";
      const sessionId = auth.sessionId;

      const response = await chatService.sendMessage(
        text, 
        userId, 
        sessionId, 
        messages
      );

      // 8. Debugging (IMPORTANT)
      console.log("Chat Response:", response);

      // Determine message type based on intent
      let msgType = 'text';
      if (response.intent === 'view_bookings') {
        msgType = 'bookings';
      } else if (response.intent === 'cancel_ticket') {
        msgType = 'booking_selection';
      } else if (response.intent === 'book_ticket') {
        msgType = 'bus_list';
      }

      const botMsg = makeMessage(
        response.text, 
        CHAT_SENDER.BOT, 
        response.quickReplies,
        { type: msgType, data: response.data }
      );

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

  openChat: () => set({ isOpen: true, unreadCount: 0 }),
  
  clearMessages: () =>
    set({ messages: [INITIAL_BOT_MSG], unreadCount: 0 }),
}));
