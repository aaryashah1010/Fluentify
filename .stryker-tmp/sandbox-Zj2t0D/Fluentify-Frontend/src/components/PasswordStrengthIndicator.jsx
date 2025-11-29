// @ts-nocheck
import React from 'react';
import { Check, X } from 'lucide-react';

const PasswordStrengthIndicator = ({ password, email = '', name = '' }) => {
  const requirements = [
    { label: 'At least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'One uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
    { label: 'One lowercase letter', test: (pwd) => /[a-z]/.test(pwd) },
    { label: 'One number', test: (pwd) => /\d/.test(pwd) },
    { label: 'One special character', test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
    { 
      label: 'Not same as email', 
      test: (pwd) => !email || pwd.toLowerCase() !== email.toLowerCase() 
    },
  ];

  const metRequirements = requirements.filter(req => req.test(password));
  const strength = metRequirements.length;

  const getStrengthColor = () => {
    if (strength <= 3) return 'bg-red-500';
    if (strength <= 5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength <= 3) return 'Weak';
    if (strength <= 5) return 'Medium';
    return 'Strong';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength</span>
          <span className={`text-xs font-medium ${
            strength <= 3 ? 'text-red-600' : strength <= 5 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
            style={{ width: `${(strength / requirements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Requirements Checklist */}
      <div className="grid grid-cols-1 gap-1">
        {requirements.map((req, index) => {
          const isMet = req.test(password);
          return (
            <div key={index} className="flex items-center gap-2 text-xs">
              {isMet ? (
                <Check className="w-3 h-3 text-green-600" />
              ) : (
                <X className="w-3 h-3 text-gray-400" />
              )}
              <span className={isMet ? 'text-green-600' : 'text-gray-500 dark:text-gray-400'}>
                {req.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
