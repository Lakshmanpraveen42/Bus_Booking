import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-8xl mb-5">🚌</div>
        <h1 className="text-5xl font-black text-slate-800 mb-2">404</h1>
        <p className="text-lg font-semibold text-slate-700 mb-2">Page Not Found</p>
        <p className="text-slate-400 text-sm mb-8">
          Looks like this bus took a wrong turn. The page you're looking for doesn't exist.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/')}
          leftIcon={<Bus className="w-5 h-5" />}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
