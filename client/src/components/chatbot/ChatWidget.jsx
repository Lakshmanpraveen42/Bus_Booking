import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Bot, Minimize2 } from 'lucide-react';
import { useChatStore } from '../../store/useChatStore';
import { CHAT_SENDER } from '../../utils/constants';
import { formatTime12h } from '../../utils/formatters';

/** Typing indicator dots */
const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-4 py-2.5 bg-slate-100 rounded-2xl rounded-tl-sm w-fit">
    {[0, 150, 300].map((delay) => (
      <span
        key={delay}
        className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"
        style={{ animationDelay: `${delay}ms` }}
      />
    ))}
  </div>
);

/** Single message bubble */
const ChatBubble = ({ message }) => {
  const isBot = message.sender === CHAT_SENDER.BOT;
  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={['flex gap-2 mb-3', isBot ? 'justify-start' : 'justify-end'].join(' ')}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-primary-600" />
        </div>
      )}
      <div className={['max-w-[80%]', isBot ? '' : 'flex flex-col items-end'].join(' ')}>
        <div
          className={[
            'px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line',
            isBot
              ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
              : 'bg-primary-500 text-white rounded-tr-sm',
          ].join(' ')}
        >
          {message.text}
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 px-1">{time}</p>
      </div>
    </div>
  );
};

/** Quick reply chip buttons */
const QuickReplies = ({ replies, onSelect }) => {
  if (!replies?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {replies.map((reply) => (
        <button
          key={reply}
          onClick={() => onSelect(reply)}
          className="px-3 py-1 bg-white border border-primary-200 text-primary-600 rounded-full text-xs font-medium hover:bg-primary-50 hover:border-primary-400 transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
};

/**
 * Floating chat widget — rendered globally in App.jsx.
 * Uses useChatStore — no props needed.
 */
const ChatWidget = () => {
  const { messages, isOpen, isTyping, unreadCount, toggleChat, sendMessage } = useChatStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const lastBotMessage = [...messages].reverse().find((m) => m.sender === CHAT_SENDER.BOT);

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-[100] w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-3xl shadow-modal border border-slate-100 flex flex-col animate-slide-up overflow-hidden"
          style={{ maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-accent-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">SmartBus Assistant</p>
                <p className="text-white/70 text-[11px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Online
                </p>
              </div>
            </div>
            <button onClick={toggleChat} className="text-white/70 hover:text-white transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar" style={{ minHeight: 0 }}>
            {messages.map((msg) => (
              <div key={msg.id}>
                <ChatBubble message={msg} />
                {msg.sender === CHAT_SENDER.BOT && msg === lastBotMessage && !isTyping && (
                  <QuickReplies
                    replies={msg.quickReplies}
                    onSelect={(r) => sendMessage(r)}
                  />
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-100 p-3 flex gap-2 items-center">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="flex-1 text-sm px-3 py-2 rounded-xl border border-slate-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-colors"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAB Trigger */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        className={[
          'fixed bottom-6 right-4 sm:right-6 z-[100] w-14 h-14 rounded-full shadow-modal flex items-center justify-center transition-all duration-300',
          isOpen ? 'bg-slate-700 hover:bg-slate-800 rotate-0' : 'bg-primary-500 hover:bg-primary-600 hover:scale-105',
        ].join(' ')}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
};

export default ChatWidget;
