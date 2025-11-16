import React, { useEffect, useState } from 'react';
import { Mail, Lock, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import validator from 'validator';

import { 
  useForgotPassword, 
  useVerifyResetOTP, 
  useResetPassword, 
  useResendOTP 
} from '../../hooks/useAuth';

import { Button, ErrorMessage, Input } from '../../components';
import { PasswordInput } from './components';
import PasswordStrengthIndicator from '../../components/PasswordStrengthIndicator';
import OTPInput from '../../components/OTPInput';

const ForgotPassword = () => {

  const [step, setStep] = useState(1);
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

  const forgotPasswordMutation = useForgotPassword();
  const verifyOTPMutation = useVerifyResetOTP();
  const resetPasswordMutation = useResetPassword();
  const resendOTPMutation = useResendOTP();

  // Query params (role/email lock)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get('role');
    const emailParam = params.get('email');

    if (roleParam === 'admin' || roleParam === 'learner') {
      setForm(prev => ({ ...prev, role: roleParam }));
      setRoleLocked(true);
    }
    if (emailParam) {
      setForm(prev => ({ ...prev, email: emailParam }));
    }
  }, [location.search]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setPasswordSuggestions([]);
  };

  // ------------------------------------
  // STEP 1 — SUBMIT EMAIL
  // ------------------------------------
  const handleEmailSubmit = e => {
    e.preventDefault();
    setError('');

    if (!validator.isEmail(form.email)) {
      return setError('Please enter a valid email');
    }

    forgotPasswordMutation.mutate(
      { email: form.email, role: form.role },
      {
        onSuccess: () => {
          setStep(2);
          setResendTimer(60);
        },
        onError: err => setError(err.message || 'Failed to send OTP')
      }
    );
  };

  // ------------------------------------
  // STEP 2 — VERIFY OTP
  // ------------------------------------
  const handleOTPVerify = e => {
    e.preventDefault();
    setError('');

    if (form.otp.length !== 6) {
      return setError('Please enter a valid 6-digit OTP');
    }

    verifyOTPMutation.mutate(
      { email: form.email, otp: form.otp, role: form.role },
      {
        onSuccess: () => setStep(3),
        onError: err => setError(err.message || 'Invalid OTP')
      }
    );
  };

  // ------------------------------------
  // STEP 3 — RESET PASSWORD
  // ------------------------------------
  const handlePasswordReset = e => {
    e.preventDefault();
    setError('');
    setPasswordSuggestions([]);

    if (form.newPassword.length < 8)
      return setError('Password must be at least 8 characters');
    if (form.newPassword !== form.confirmPassword)
      return setError('Passwords do not match');

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
          setStep(4);
          localStorage.setItem('lastRole', form.role);
        },
        onError: err => {
          setError(err.message || 'Failed to reset password');
          if (err.suggestions) setPasswordSuggestions(err.suggestions);
        }
      }
    );
  };

  // ------------------------------------
  // RESEND OTP HANDLER
  // ------------------------------------
  const handleResendOTP = () => {
    resendOTPMutation.mutate(
      {
        email: form.email,
        otpType: 'password_reset',
        role: form.role
      },
      {
        onSuccess: () => setResendTimer(60),
        onError: err => setError(err.message)
      }
    );
  };

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-teal-50 p-6">
      
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-10 animate-fadeIn">
        
        {/* ====================== STEP 1 ====================== */}
        {step === 1 && (
          <>

            <div className="text-center mb-10">
              
              {/* Icon */}
              <div className="relative mx-auto mb-6 flex justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-teal-400 shadow-xl flex items-center justify-center">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300/30 to-teal-300/30 blur-xl glow-pulse"></div>
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900">Forgot Password?</h2>
              <p className="text-gray-600 mt-2">
                We'll send you a verification code.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleEmailSubmit}>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  disabled={roleLocked}
                  className="w-full px-3 py-3 rounded-xl border border-gray-300 
                    focus:ring-2 focus:ring-orange-400 shadow-sm"
                >
                  <option value="learner">Learner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Email */}
              <Input
  name="email"
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  icon={<Mail className="text-gray-500" />}
  
  value={form.email}
  onChange={handleChange}
  required

  className="!bg-white !border !border-gray-300 !text-gray-700 !shadow-sm focus:!ring-orange-400 focus:!border-orange-400"
  inputClassName="!bg-white !text-gray-700"
  iconClassName="text-gray-500"
 />


              <ErrorMessage message={error} />

              <Button 
                type="submit"
                loading={forgotPasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-orange-500 to-teal-500 text-white py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02]"
              >
                Send OTP
              </Button>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2 text-teal-600 hover:text-orange-600 text-sm"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            </form>

          </>
        )}

        {/* ====================== STEP 2 ====================== */}
        {step === 2 && (
  <>
    {/* Header Section */}
    <div className="text-center mb-10">

      {/* Centered Gradient Icon with Glow */}
      <div className="relative mx-auto mb-6 flex justify-center">
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-teal-400 rounded-full flex items-center justify-center shadow-xl">
          <Mail className="w-10 h-10 text-white" />
        </div>

        {/* Soft glow behind icon */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300/30 to-teal-300/30 blur-2xl opacity-70"></div>
      </div>

      <h2 className="text-3xl font-extrabold text-gray-900">Verify OTP</h2>

      <p className="text-gray-600 text-sm mt-2">
        A verification code has been sent to<br />
        <span className="font-semibold text-gray-800">{form.email}</span>
      </p>
    </div>

    {/* Form Section */}
    <form className="space-y-8" onSubmit={handleOTPVerify}>

      <label className="block text-center text-gray-700 font-medium mb-2">
        Enter 6-digit Code
      </label>

      {/* OTP INPUT — Light Mode, Rounded, Modern */}
      <OTPInput
  length={6}
  value={form.otp}
  onChange={(otp) => setForm({ ...form, otp })}
  disabled={verifyOTPMutation.isPending}
  containerStyle="flex justify-center gap-3"
  inputStyle={{
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    fontSize: "20px",
    fontWeight: "600",
    backgroundColor: "#ffffff",
    color: "#333",
    border: "2px solid #e5e7eb",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    textAlign: "center",
  }}
  focusStyle={{
    border: "2px solid #fb923c",      // orange-400
    boxShadow: "0 0 8px rgba(251,146,60,0.5)",
    outline: "none",
  }}
/>


      <ErrorMessage message={error} />

      {/* Verify Button */}
      <Button
        type="submit"
        loading={verifyOTPMutation.isPending}
        className="
          w-full py-3 text-white rounded-xl 
          bg-gradient-to-r from-orange-500 to-teal-500 
          shadow-lg hover:shadow-xl transition-all
        "
      >
        Verify OTP
      </Button>

      {/* Resend OTP */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resendTimer > 0 || resendOTPMutation.isPending}
          className="
            flex items-center gap-2 mx-auto
            text-teal-700 hover:text-teal-800 font-medium
            disabled:opacity-50 transition-all
          "
        >
          <RefreshCw
            size={16}
            className={resendOTPMutation.isPending ? "animate-spin" : ""}
          />
          {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
        </button>
      </div>

      {/* Back Button */}
      <button
        type="button"
        onClick={() => setStep(1)}
        className="
          w-full flex items-center justify-center 
          gap-2 text-gray-600 hover:text-gray-900 text-sm transition-all
        "
      >
        <ArrowLeft size={16} />
        Back
      </button>

    </form>
  </>
)}


        {/* ====================== STEP 3 ====================== */}
        {step === 3 && (
          <>
            <div className="text-center mb-10">

              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300/30 to-teal-300/30 blur-xl glow-pulse"></div>
              </div>

              <h2 className="text-3xl font-extrabold text-gray-900">Set New Password</h2>
              <p className="text-gray-600 text-sm mt-2">
                Choose a strong password for your account.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handlePasswordReset}>

              <div>
                <PasswordInput
                  name="newPassword"
                  label="New Password"
                  placeholder="Enter new password"
                  value={form.newPassword}
                  onChange={handleChange}
                />
                <PasswordStrengthIndicator
                  password={form.newPassword}
                  email={form.email}
                />
              </div>

              <PasswordInput
                name="confirmPassword"
                label="Confirm Password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
              />

              {passwordSuggestions.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="font-medium text-blue-900 mb-2">Suggested strong passwords:</p>
                  <div className="space-y-1">
                    {passwordSuggestions.map((s, i) => (
                      <button
                        type="button"
                        key={i}
                        onClick={() =>
                          setForm({ ...form, newPassword: s, confirmPassword: s })
                        }
                        className="w-full text-left px-3 py-2 bg-white border border-blue-300 rounded-md hover:bg-blue-50 font-mono text-sm"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <ErrorMessage message={error} />

              <Button
                type="submit"
                loading={resetPasswordMutation.isPending}
                className="w-full bg-gradient-to-r from-teal-500 to-orange-500 text-white py-3 rounded-xl shadow-md hover:shadow-xl"
              >
                Reset Password
              </Button>

            </form>
          </>
        )}

        {/* ====================== STEP 4 — SUCCESS ====================== */}
        {step === 4 && (
          <div className="text-center animate-fadeIn">
            
            <div className="relative mx-auto mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                <CheckCircle className="w-14 h-14 text-white" />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-300/40 to-teal-300/40 blur-xl glow-pulse"></div>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              Password Reset Successful!
            </h2>

            <p className="text-gray-600 mb-8">
              You can now log in using your new password.
            </p>

            <Button
              onClick={() => navigate(`/login?role=${form.role}`)}
              className="w-full bg-gradient-to-r from-orange-500 to-teal-500 text-white py-3 rounded-xl shadow-md hover:shadow-xl"
            >
              Go to Login
            </Button>

          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
