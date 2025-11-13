import React, { useEffect, useState } from 'react';
import { Mail, Lock, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import validator from 'validator';
import { useForgotPassword, useVerifyResetOTP, useResetPassword, useResendOTP } from '../../hooks/useAuth';
import { Button, ErrorMessage, Input } from '../../components';
import { PasswordInput } from './components';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import OTPInput from '../../components/OTPInput';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [form, setForm] = useState({ 
    email: '', 
    role: 'learner', 
    otp: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const [resendTimer, setResendTimer] = useState(0);
  const [roleLocked, setRoleLocked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Role/email locking via query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    const emailParam = params.get('email');
    if (roleParam === 'admin' || roleParam === 'learner') {
      setForm((prev) => ({ ...prev, role: roleParam }));
      setRoleLocked(true);
    }
    if (emailParam) {
      setForm((prev) => ({ ...prev, email: emailParam }));
    }
  }, [location.search]);
  
  const forgotPasswordMutation = useForgotPassword();
  const verifyOTPMutation = useVerifyResetOTP();
  const resetPasswordMutation = useResetPassword();
  const resendOTPMutation = useResendOTP();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setPasswordSuggestions([]);
  };

  // Step 1: Submit email
  const handleEmailSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (!validator.isEmail(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    forgotPasswordMutation.mutate(
      { email: form.email, role: form.role },
      {
        onSuccess: () => {
          setStep(2); // Move to OTP verification
          setResendTimer(60);
        },
        onError: (err) => {
          setError(err.message || 'Failed to send OTP');
        }
      }
    );
  };

  // Step 2: Verify OTP
  const handleOTPVerify = async e => {
    e.preventDefault();
    setError('');

    if (form.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    verifyOTPMutation.mutate(
      { email: form.email, otp: form.otp, role: form.role },
      {
        onSuccess: () => {
          setStep(3); // Move to password reset
        },
        onError: (err) => {
          setError(err.message || 'Invalid OTP');
        }
      }
    );
  };

  // Step 3: Reset password
  const handlePasswordReset = async e => {
    e.preventDefault();
    setError('');
    setPasswordSuggestions([]);

    if (form.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    resetPasswordMutation.mutate(
      { 
        email: form.email, 
        otp: form.otp, 
        newPassword: form.newPassword, 
        confirmPassword: form.confirmPassword, 
        role: form.role 
      },
      {
        onSuccess: () => {
          setStep(4); // Move to success screen
          // Persist role for login pre-select
          try { localStorage.setItem('lastRole', form.role); } catch {}
        },
        onError: (err) => {
          setError(err.message || 'Failed to reset password');
          if (err.suggestions) {
            setPasswordSuggestions(err.suggestions);
          }
        }
      }
    );
  };

  const handleResendOTP = () => {
    setError('');
    resendOTPMutation.mutate(
      { 
        email: form.email, 
        otpType: 'password_reset', 
        role: form.role 
      },
      {
        onSuccess: () => {
          setError('');
          setResendTimer(60);
        },
        onError: (err) => {
          setError(err.message || 'Failed to resend OTP');
        }
      }
    );
  };

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8">
        
        {step === 1 && (
          <>
            {/* Step 1: Email Input */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-red-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password?</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                No worries, we'll send you reset instructions
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleEmailSubmit}>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I am a</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  disabled={roleLocked}
                >
                  <option value="learner">Learner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Email */}
              <Input
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                icon={<Mail className="w-5 h-5" />}
                disabled={!!(new URLSearchParams(location.search).get('email'))}
              />

              <ErrorMessage message={error} />

              <Button
                type="submit"
                loading={forgotPasswordMutation.isPending}
                variant="danger"
                className="w-full"
              >
                Send OTP
              </Button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            {/* Step 2: OTP Verification */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify OTP</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                We've sent a 6-digit code to<br />
                <span className="font-medium text-gray-700 dark:text-gray-300">{form.email}</span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleOTPVerify}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                  Enter OTP Code
                </label>
                <OTPInput
                  length={6}
                  value={form.otp}
                  onChange={(otp) => setForm({ ...form, otp })}
                  disabled={verifyOTPMutation.isPending}
                />
              </div>

              <ErrorMessage message={error} />

              <Button
                type="submit"
                loading={verifyOTPMutation.isPending}
                className="w-full"
              >
                Verify OTP
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendOTPMutation.isPending || resendTimer > 0}
                  className="text-sm text-indigo-600 hover:text-indigo-500 font-medium inline-flex items-center gap-2 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${resendOTPMutation.isPending ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            {/* Step 3: New Password */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Create a strong password for your account
              </p>
            </div>

            <form className="space-y-5" onSubmit={handlePasswordReset}>
              <div>
                <PasswordInput
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  label="New Password"
                  required
                />
                <PasswordStrengthIndicator 
                  password={form.newPassword} 
                  email={form.email} 
                />
              </div>

              <PasswordInput
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                label="Confirm Password"
                required
              />

              {passwordSuggestions.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                    Suggested strong passwords:
                  </p>
                  <div className="space-y-1">
                    {passwordSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setForm({ ...form, newPassword: suggestion, confirmPassword: suggestion })}
                        className="w-full text-left text-sm font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded border border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ErrorMessage message={error} />

              <Button
                type="submit"
                loading={resetPasswordMutation.isPending}
                variant="success"
                className="w-full"
              >
                Reset Password
              </Button>
            </form>
          </>
        )}

        {step === 4 && (
          <>
            {/* Step 4: Success */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Password Reset Successful!</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <Button
                onClick={() => navigate(`/login?role=${form.role}`)}
                variant="success"
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
