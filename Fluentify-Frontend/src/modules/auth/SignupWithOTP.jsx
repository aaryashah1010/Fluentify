import React, { useEffect, useState } from 'react';
import { Mail, User, UserPlus, ArrowLeft, RefreshCw, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useSignup, useVerifySignupOTP, useResendOTP } from '../../hooks/useAuth';
import { Button, ErrorMessage, Input } from '../../components';
import { PasswordInput } from './components';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import OTPInput from '../../components/OTPInput';

// Function to generate strong password suggestions
const generatePasswordSuggestions = () => {
  const adjectives = ['Swift', 'Brave', 'Bright', 'Quick', 'Smart', 'Bold', 'Cool', 'Epic'];
  const nouns = ['Tiger', 'Eagle', 'Dragon', 'Phoenix', 'Wolf', 'Falcon', 'Lion', 'Hawk'];
  const symbols = ['!', '@', '#', '$', '%', '&', '*'];
  
  const suggestions = [];
  for (let i = 0; i < 3; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 900) + 100;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    suggestions.push(`${adj}${noun}${num}${symbol}`);
  }
  return suggestions;
};

const SignupWithOTP = () => {
  const [step, setStep] = useState(1); // 1: Signup Form, 2: OTP Verification
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'learner', otp: '' });
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  
  const signupMutation = useSignup();
  const verifyOTPMutation = useVerifySignupOTP();
  const resendOTPMutation = useResendOTP();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setPasswordSuggestions([]);
  };

  const validateName = (name) => {
    if (!name || !name.trim()) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (/\d/.test(name)) return 'Name cannot contain numbers';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return null;
  };

  const validateForm = () => {
    // Validate name
    const nameError = validateName(form.name);
    if (nameError) {
      setError(nameError);
      return false;
    }

    // Validate email
    if (!validator.isEmail(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Validate password
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    // Validate password confirmation
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Validate terms acceptance
    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions to continue');
      return false;
    }

    return true;
  };

  const handleSignupSubmit = async e => {
    e.preventDefault();
    setError('');
    setPasswordSuggestions([]);
    
    if (!validateForm()) return;

    signupMutation.mutate(
      { role: form.role, name: form.name, email: form.email, password: form.password },
      {
        onSuccess: () => {
          setStep(2); // Move to OTP verification step
          setResendTimer(60);
        },
        onError: (err) => {
          console.error('Signup error:', err);
          setError(err.message || 'Signup failed');
          // Check if error response contains password suggestions
          if (err.data && err.data.suggestions) {
            setPasswordSuggestions(err.data.suggestions);
          }
        }
      }
    );
  };

  const handleOTPVerify = async e => {
    e.preventDefault();
    setError('');

    if (form.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    verifyOTPMutation.mutate(
      { 
        role: form.role, 
        name: form.name, 
        email: form.email, 
        password: form.password, 
        otp: form.otp 
      },
      {
        onSuccess: () => {
          // Navigate based on role
          if (form.role === 'learner') {
            navigate('/dashboard');
          } else {
            navigate('/admin-dashboard');
          }
        },
        onError: (err) => {
          setError(err.message || 'OTP verification failed');
        }
      }
    );
  };

  const handleResendOTP = () => {
    setError('');
    resendOTPMutation.mutate(
      { 
        email: form.email, 
        otpType: 'signup', 
        role: form.role, 
        name: form.name 
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

  const handleBackToSignup = () => {
    setStep(1);
    setForm({ ...form, otp: '' });
    setError('');
  };

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8">
        
        {step === 1 ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <UserPlus className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Join us to get started</p>
            </div>

            <form className="space-y-5" onSubmit={handleSignupSubmit}>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">I want to be a</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                >
                  <option value="learner">Learner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Name */}
              <Input
                name="name"
                type="text"
                label="Full Name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                icon={<User className="w-5 h-5" />}
              />

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
              />

              {/* Password */}
              <div>
                <PasswordInput
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  label="Create Password"
                  hint="Password must be at least 8 characters"
                  required
                />
                <PasswordStrengthIndicator 
                  password={form.password} 
                  email={form.email} 
                  name={form.name} 
                />
              </div>

              {/* Confirm Password */}
              <PasswordInput
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                label="Confirm Password"
                required
              />

              {/* Suggest Password Button */}
              <button
                type="button"
                onClick={() => setPasswordSuggestions(generatePasswordSuggestions())}
                className="w-full text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium inline-flex items-center justify-center gap-2 py-2 border border-indigo-300 dark:border-indigo-700 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
              >
                <Lightbulb className="w-4 h-4" />
                Suggest Strong Passwords
              </button>

              {/* Password Suggestions */}
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
                        onClick={() => setForm({ ...form, password: suggestion, confirmPassword: suggestion })}
                        className="w-full text-left text-sm font-mono bg-white dark:bg-gray-800 px-3 py-2 rounded border border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error */}
              <ErrorMessage message={error} />

              {/* Terms and Conditions Checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    setError('');
                  }}
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                />
                <label htmlFor="terms" className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer">
                  I accept the{' '}
                  <button type="button" className="text-emerald-600 hover:text-emerald-500 underline">
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-emerald-600 hover:text-emerald-500 underline">
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                loading={signupMutation.isPending}
                variant="success"
                className="w-full"
                disabled={!acceptedTerms || signupMutation.isPending}
              >
                Continue to Verification
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500 dark:text-gray-400">Already have an account?</span>{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-emerald-600 hover:text-emerald-500 font-medium"
              >
                Log In
              </button>
            </div>
          </>
        ) : (
          <>
            {/* OTP Verification Step */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-indigo-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verify Your Email</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                We've sent a 6-digit code to<br />
                <span className="font-medium text-gray-700 dark:text-gray-300">{form.email}</span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleOTPVerify}>
              {/* OTP Input */}
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

              {/* Error */}
              <ErrorMessage message={error} />

              {/* Verify Button */}
              <Button
                type="submit"
                loading={verifyOTPMutation.isPending}
                className="w-full"
              >
                Verify & Create Account
              </Button>

              {/* Resend OTP */}
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

              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToSignup}
                className="w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 font-medium inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Signup
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupWithOTP;
