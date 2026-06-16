import React from 'react';
import BookingList from './BookingList';
import BookingSelection from './BookingSelection';
import BusList from './BusList';

/**
 * Automatically detects and renders URLs as clickable links with security best practices.
 */
const renderMessageWithLinks = (text) => {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  return text.split(urlRegex).map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 font-bold underline hover:text-primary-700 transition-colors break-all"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const ChatMessageRenderer = ({ message }) => {
  const { type, data, text } = message;

  switch (type) {
    case 'bookings':
      return (
        <div className="w-full">
          <div className="text-sm leading-relaxed">{renderMessageWithLinks(text)}</div>
          <BookingList bookings={data} />
        </div>
      );
    
    case 'booking_selection':
      return (
        <div className="w-full">
          <div className="text-sm leading-relaxed font-medium">{renderMessageWithLinks(text)}</div>
          <BookingSelection bookings={data} />
        </div>
      );

    case 'bus_list':
      return (
        <div className="w-full">
          <div className="text-sm leading-relaxed font-medium">{renderMessageWithLinks(text)}</div>
          <BusList buses={data} />
        </div>
      );
    
    default:
      return (
        <div className="text-sm leading-relaxed whitespace-pre-line">
          {renderMessageWithLinks(text)}
        </div>
      );
  }
};

export default ChatMessageRenderer;
