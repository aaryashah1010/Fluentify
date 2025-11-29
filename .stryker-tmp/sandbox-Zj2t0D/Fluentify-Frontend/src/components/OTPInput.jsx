// @ts-nocheck
import React, { useRef, useState, useEffect, useCallback } from 'react';

const OTPInput = ({ length = 6, value, onChange, disabled = false, autoFocus = true }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    // Only sync if we're not in the middle of an update
    if (!isUpdatingRef.current) {
      if (value) {
        setOtp(value.split('').slice(0, length));
      } else {
        setOtp(Array(length).fill(''));
      }
    }
  }, [value, length]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const handleChange = useCallback((index, val) => {
    if (disabled) return;
    
    isUpdatingRef.current = true;
    
    if (!val) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      onChange(newOtp.join(''));
      setTimeout(() => { isUpdatingRef.current = false; }, 0);
      return;
    }

    if (val.length > 1 && /^\d+$/.test(val)) {
      const digits = val.slice(0, length).split('');
      const newOtp = Array(length).fill('');
      for (let i = 0; i < length; i++) {
        newOtp[i] = digits[i] || '';
      }
      setOtp(newOtp);
      onChange(newOtp.join(''));
      setTimeout(() => {
        isUpdatingRef.current = false;
        const lastFilledIndex = Math.min(digits.length - 1, length - 1);
        inputRefs.current[lastFilledIndex]?.focus();
      }, 0);
      return;
    }

    if (!/^\d$/.test(val)) {
      isUpdatingRef.current = false;
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    onChange(newOtp.join(''));

    setTimeout(() => {
      isUpdatingRef.current = false;
      if (val && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }, 0);
  }, [otp, onChange, length, disabled]);

  const handleKeyDown = useCallback((index, e) => {
    if (disabled) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      isUpdatingRef.current = true;
      const newOtp = [...otp];
      if (newOtp[index]) {
        // Clear current digit
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
        setTimeout(() => { isUpdatingRef.current = false; }, 0);
      } else if (index > 0) {
        // Move back and clear previous
        inputRefs.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
        setTimeout(() => { isUpdatingRef.current = false; }, 0);
      }
    }
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, [otp, onChange, length, disabled]);

  const handlePaste = useCallback((e) => {
    if (disabled) return;
    
    e.preventDefault();
    isUpdatingRef.current = true;
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    
    if (!/^\d+$/.test(pastedData)) {
      isUpdatingRef.current = false;
      return;
    }

    const newOtp = pastedData.split('');
    while (newOtp.length < length) {
      newOtp.push('');
    }
    
    setOtp(newOtp);
    onChange(newOtp.join(''));
    
    setTimeout(() => {
      isUpdatingRef.current = false;
      const lastFilledIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[lastFilledIndex]?.focus();
    }, 0);
  }, [onChange, length, disabled]);

  return (
    <div className="flex gap-2 justify-center flex-wrap">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          name={`otp-digit-${index}`}
          className={`
            w-12 h-14 text-center text-2xl font-bold
            border-2 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            transition-all duration-200
            ${disabled 
              ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed' 
              : 'bg-white dark:bg-gray-900'
            }
            ${digit 
              ? 'border-indigo-500 dark:border-indigo-400' 
              : 'border-gray-300 dark:border-gray-700'
            }
            text-gray-900 dark:text-white
          `}
          autoComplete="one-time-code"
          pattern="\d*"
        />
      ))}
    </div>
  );
};

export default OTPInput;
