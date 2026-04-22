import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

export const EmptyState = ({ from, to, date }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
    <div className="text-6xl mb-4">🚌</div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">No buses found</h3>
    <p className="text-slate-500 text-sm max-w-sm">
      We couldn't find any buses from{' '}
      <span className="font-medium text-slate-700">{from}</span> to{' '}
      <span className="font-medium text-slate-700">{to}</span>
      {date ? ` on ${date}` : ''}.
    </p>
    <p className="text-slate-400 text-xs mt-2">Try a different date or route.</p>
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-red-500" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">Something went wrong</h3>
    <p className="text-slate-500 text-sm max-w-sm mb-6">
      {message || 'We encountered an error while loading buses. Please try again.'}
    </p>
    {onRetry && (
      <Button
        variant="primary"
        onClick={onRetry}
        leftIcon={<RefreshCw className="w-4 h-4" />}
      >
        Retry
      </Button>
    )}
  </div>
);
