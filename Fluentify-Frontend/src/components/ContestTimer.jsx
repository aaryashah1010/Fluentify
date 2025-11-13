import React, { useState, useEffect } from 'react';

/**
 * Contest Timer Component
 * Displays a countdown timer for contest end time
 */
const ContestTimer = ({ endTime, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        if (onTimeUp) {
          onTimeUp();
        }
        return null;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return { hours, minutes, seconds, total: difference };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onTimeUp]);

  if (isExpired) {
    return (
      <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-red-700">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-lg font-bold">Time's Up!</span>
        </div>
        <p className="text-sm text-red-600 mt-2">The contest has ended</p>
      </div>
    );
  }

  if (!timeLeft) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mx-auto"></div>
        </div>
      </div>
    );
  }

  const getTimerColor = () => {
    const totalMinutes = Math.floor(timeLeft.total / (1000 * 60));
    if (totalMinutes <= 5) return 'border-red-500 bg-red-50';
    if (totalMinutes <= 15) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  const getTextColor = () => {
    const totalMinutes = Math.floor(timeLeft.total / (1000 * 60));
    if (totalMinutes <= 5) return 'text-red-700';
    if (totalMinutes <= 15) return 'text-yellow-700';
    return 'text-green-700';
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${getTimerColor()} transition-colors`}>
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <svg className={`w-6 h-6 ${getTextColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className={`text-sm font-medium ${getTextColor()}`}>
            Time Remaining
          </span>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          {/* Hours */}
          {timeLeft.hours > 0 && (
            <div className="flex flex-col items-center">
              <div className={`text-4xl font-bold ${getTextColor()} tabular-nums`}>
                {timeLeft.hours.toString().padStart(2, '0')}
              </div>
              <div className={`text-xs font-medium ${getTextColor()} uppercase mt-1`}>
                Hours
              </div>
            </div>
          )}
          
          {/* Separator */}
          {timeLeft.hours > 0 && (
            <div className={`text-4xl font-bold ${getTextColor()}`}>:</div>
          )}
          
          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-bold ${getTextColor()} tabular-nums`}>
              {timeLeft.minutes.toString().padStart(2, '0')}
            </div>
            <div className={`text-xs font-medium ${getTextColor()} uppercase mt-1`}>
              Minutes
            </div>
          </div>
          
          {/* Separator */}
          <div className={`text-4xl font-bold ${getTextColor()}`}>:</div>
          
          {/* Seconds */}
          <div className="flex flex-col items-center">
            <div className={`text-4xl font-bold ${getTextColor()} tabular-nums`}>
              {timeLeft.seconds.toString().padStart(2, '0')}
            </div>
            <div className={`text-xs font-medium ${getTextColor()} uppercase mt-1`}>
              Seconds
            </div>
          </div>
        </div>

        {/* Warning message */}
        {Math.floor(timeLeft.total / (1000 * 60)) <= 5 && (
          <div className="mt-4 text-sm text-red-600 font-medium animate-pulse">
            ⚠️ Hurry up! Less than 5 minutes remaining
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestTimer;
