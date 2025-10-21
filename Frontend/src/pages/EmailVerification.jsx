import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const EmailVerification = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name, role } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate('/signup');
      return;
    }

    // Countdown timer for OTP expiry
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Enable resend after 30 seconds
    const resendTimer = setTimeout(() => {
      setCanResend(true);
    }, 30000); // 30 seconds

    return () => {
      clearInterval(timer);
      clearTimeout(resendTimer);
    };
  }, [email, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) {
      newOtp.push('');
    }
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    document.getElementById(`otp-${lastIndex}`).focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/email-verification/verify-otp', {
        email,
        otp: otpCode
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          if (role === 'learner') {
            navigate('/preferences');
          } else {
            navigate('/admin-dashboard');
          }
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resendCooldown > 0) {
      return;
    }

    setResending(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/email-verification/resend-otp', {
        email,
        name
      });

      if (response.data.success) {
        setOtp(['', '', '', '', '', '']);
        setTimeLeft(120); // 2 minutes
        setResendCooldown(30); // 30 seconds cooldown
        setError('');
        alert('New OTP sent to your email!');
      }
    } catch (err) {
      const errorData = err.response?.data?.error;
      if (errorData?.details?.waitTime) {
        setError(`Please wait ${errorData.details.waitTime} seconds before requesting a new OTP`);
        setResendCooldown(errorData.details.waitTime);
      } else {
        setError(errorData?.message || 'Failed to resend OTP. Please try again.');
      }
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Email Verified!</h2>
          <p className="text-gray-600 dark:text-gray-400">Redirecting you to the app...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
            <Mail className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            We've sent a 6-digit code to<br />
            <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
            Enter OTP Code
          </label>
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {timeLeft > 0 ? (
              <>Code expires in <span className="font-semibold text-blue-600 dark:text-blue-400">{formatTime(timeLeft)}</span></>
            ) : (
              <span className="text-red-600 dark:text-red-400 font-semibold">OTP has expired</span>
            )}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 text-red-600 dark:text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6 || timeLeft === 0}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors shadow-md mb-4"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        {/* Resend OTP */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={resending || !canResend || resendCooldown > 0}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${resending ? 'animate-spin' : ''}`} />
            {resendCooldown > 0 
              ? `Resend OTP (${resendCooldown}s)` 
              : resending 
                ? 'Sending...' 
                : 'Resend OTP'}
          </button>
        </div>

        {/* Back to Signup */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigate('/signup')}
            className="w-full inline-flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
