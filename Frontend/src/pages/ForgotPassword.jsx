import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowLeft, RefreshCw, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const navigate = useNavigate();

  // Timer for OTP expiry
  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (step === 2) {
      setCanResend(true);
    }
  }, [resendCooldown, step]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/forgot-password/send-otp', { email });
      setStep(2);
      setTimeLeft(120);
      setResendCooldown(30);
      setCanResend(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/forgot-password/verify-otp', {
        email,
        otp: otpCode
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/forgot-password/reset-password', {
        email,
        newPassword,
        confirmPassword
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorData = err.response?.data?.error;
      if (errorData?.details?.errors) {
        setError(errorData.details.errors[0]);
      } else {
        setError(errorData?.message || 'Failed to reset password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/forgot-password/send-otp', { email });
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(120);
      setResendCooldown(30);
      setCanResend(false);
      alert('New OTP sent to your email!');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
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
            <Lock className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {step === 1 && 'Forgot Password'}
            {step === 2 && 'Verify OTP'}
            {step === 3 && 'Create New Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            {step === 1 && 'Enter your email to receive OTP'}
            {step === 2 && `OTP sent to ${email}`}
            {step === 3 && 'Enter your new password'}
          </p>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 text-red-600 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors shadow-md"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full inline-flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
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
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {timeLeft > 0 ? (
                  <>Code expires in <span className="font-semibold text-blue-600 dark:text-blue-400">{formatTime(timeLeft)}</span></>
                ) : (
                  <span className="text-red-600 dark:text-red-400 font-semibold">OTP has expired</span>
                )}
              </p>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 text-red-600 dark:text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6 || timeLeft === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors shadow-md"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Didn't receive the code?</p>
              <button
                onClick={handleResend}
                disabled={loading || !canResend || resendCooldown > 0}
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Resend OTP (${resendCooldown}s)` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-3 text-red-600 dark:text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 rounded-lg transition-colors shadow-md"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
