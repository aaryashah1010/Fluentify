// @ts-nocheck
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  AlertCircle,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  TrendingUp,
  Zap,
  Eye,
  EyeOff,
  UserPlus,
  Lightbulb,
  RefreshCw,
  ArrowLeft,
  Check,
} from "lucide-react";

import fluentifyLogo from "../../assets/fluentify_logo.jpg";
import { useSignup, useVerifySignupOTP, useResendOTP } from "../../hooks/useAuth";

const checkPasswordStrength = (password, email, name) => {
  let strength = 0;
  const feedback = [];

  if (password.length >= 8) strength += 1;
  else feedback.push("At least 8 characters");

  if (password.length >= 12) strength += 1;

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
  else feedback.push("Mix of uppercase & lowercase");

  if (/\d/.test(password)) strength += 1;
  else feedback.push("Include numbers");

  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  else feedback.push("Include special characters");

  if (email && password.toLowerCase().includes(email.split("@")[0])) {
    strength -= 2;
    feedback.push("Avoid using your email");
  }

  if (name && password.toLowerCase().includes(name.toLowerCase())) {
    strength -= 2;
    feedback.push("Avoid using your name");
  }

  return { strength: Math.max(0, Math.min(5, strength)), feedback };
};

// Password Suggestions
const generatePasswordSuggestions = () => {
  const adjectives = ["Swift", "Brave", "Bright", "Quick", "Smart", "Bold", "Cool", "Epic"];
  const nouns = ["Tiger", "Eagle", "Dragon", "Phoenix", "Wolf", "Falcon", "Lion", "Hawk"];
  const symbols = ["!", "@", "#", "$", "%", "&", "*"];

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

export default function SignupWithOTP({ onNavigate }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "learner",
    otp: "",
  });

  const [error, setError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const signupMutation = useSignup();
  const verifySignupOTPMutation = useVerifySignupOTP();
  const resendOTPMutation = useResendOTP();

  useEffect(() => setIsVisible(true), []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setPasswordSuggestions([]);
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const validateName = (name) => {
    if (!name || !name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (/\d/.test(name)) return "Name cannot contain numbers";
    if (!/^[a-zA-Z\s'-]+$/.test(name))
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return null;
  };

  const getFieldError = useCallback(
    (field) => {
      if (!touched[field]) return "";

      if (field === "name") return validateName(form.name) || "";
      if (field === "email") {
        if (!form.email) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
          return "Please enter a valid email";
        return "";
      }
      if (field === "password") {
        if (!form.password) return "Password is required";
        if (form.password.length < 8)
          return "Password must be at least 8 characters";
        return "";
      }
      if (field === "confirmPassword") {
        if (!form.confirmPassword) return "Please confirm your password";
        if (form.password !== form.confirmPassword)
          return "Passwords do not match";
        return "";
      }

      return "";
    },
    [form, touched]
  );

  const validateForm = useCallback(() => {
    const nameError = validateName(form.name);
    if (nameError) return setError(nameError), false;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setError("Please enter a valid email address"), false;

    if (form.password.length < 8)
      return setError("Password must be at least 8 characters"), false;

    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match"), false;

    if (!acceptedTerms)
      return setError("Please accept the Terms and Conditions to continue"), false;

    return true;
  }, [form, acceptedTerms]);

  const handleSignupSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setError("");
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
      });

      if (!validateForm()) return;

      setIsLoading(true);

      signupMutation.mutate(
        {
          role: form.role,
          name: form.name,
          email: form.email,
          password: form.password,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
            setStep(2);
            setResendTimer(60);
          },
          onError: (err) => {
            setIsLoading(false);
            setError(err?.message || "Failed to send OTP. Please try again.");
          },
        }
      );
    },
    [validateForm]
  );

  const handleOTPChange = (index, value) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;

    setOtp(updated);
    setForm((prev) => ({ ...prev, otp: updated.join("") }));

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOTPVerify = useCallback(
    (e) => {
      e.preventDefault();

      if (form.otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }

      setIsLoading(true);

      verifySignupOTPMutation.mutate(
        {
          role: form.role,
          name: form.name,
          email: form.email,
          password: form.password,
          otp: form.otp,
        },
        {
          onSuccess: () => {
            setIsLoading(false);
            if (form.role === "learner") {
              onNavigate?.("learner");
            } else {
              onNavigate?.("admin-dashboard");
            }
          },
          onError: (err) => {
            setIsLoading(false);
            setError(err?.message || "Invalid or expired OTP");
          },
        }
      );
    },
    [form, onNavigate]
  );

  const handleResendOTP = () => {
    setError("");
    setOtp(["", "", "", "", "", ""]);

    resendOTPMutation.mutate(
      {
        email: form.email,
        otpType: "signup",
        role: form.role,
        name: form.name,
      },
      {
        onSuccess: () => {
          setResendTimer(60);
        },
        onError: (err) => {
          setError(err?.message || "Failed to resend OTP");
        },
      }
    );
  };

  const handleBackToSignup = () => {
    setStep(1);
    setOtp(["", "", "", "", "", ""]);
    setForm((prev) => ({ ...prev, otp: "" }));
    setError("");
  };

  const passwordStrength = checkPasswordStrength(
    form.password,
    form.email,
    form.name
  );

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-lime-500", "bg-green-500"];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <div className="min-h-screen h-screen flex overflow-x-hidden bg-gradient-to-br from-teal-900 via-orange-900 to-teal-900">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">

        {/* Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full opacity-20 blur-3xl animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-amber-500 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">

          {/* Logo ONLY */}
          <div className={`transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0 translate-y-8"}`}>

            {/* BIG CLEAN LOGO */}
            <div className="flex items-center justify-start mb-8">
              <div className="w-48 h-48 bg-white rounded-3xl shadow-2xl flex items-center justify-center ring-white/20 overflow-hidden">
                <img
                  src={fluentifyLogo}
                  alt="Fluentify Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>



            {/* Hero Text */}
            <h1 className="text-5xl xl:text-6xl mb-6 leading-tight">
              {step === 1 ? (
                <>
                  Master New Skills, <br />
                  <span className="bg-gradient-to-r from-orange-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
                    Unlock Your Voice
                  </span>
                </>
              ) : (
                <>
                  Almost There! <br />
                  <span className="bg-gradient-to-r from-orange-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
                    Verify Your Email
                  </span>
                </>
              )}
            </h1>

            <p className="text-xl text-gray-300 mb-12 max-w-lg">
              {step === 1
                ? "Speak with confidence"
                : "Check your inbox for the verification code"}
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center">
                  <Zap className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg mb-1">Interactive Learning</h3>
                  <p className="text-gray-400">
                    Hands-on learning powered by AI that adapts to your pace
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg mb-1">Smart AI Instructors</h3>
                  <p className="text-gray-400">
                    Learn with an AI mentor that listens and guides naturally
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg mb-1">Track Progress</h3>
                  <p className="text-gray-400">
                    Visualize your growth from beginner to fluent
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* RIGHT SIDE – Signup / OTP (NO SCROLL) */}
      <div className="w-full lg:w-1/2 xl:w-2/5 p-4 flex items-center justify-center bg-white/5 backdrop-blur-sm overflow-hidden">

        <div
          className={`w-full max-w-md h-full flex items-center transition-all duration-700 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl w-full max-h-[95vh] overflow-y-auto">

            {/* ---------- STEP 1 : SIGNUP ---------- */}
            {step === 1 && (
              <>
                <div className="text-center mb-4">

                  {/* HEADER ICON */}
                  <div className="relative inline-block mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <UserPlus className="w-7 h-7 text-white" />
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse" />
                  </div>

                  <h1 className="text-2xl text-gray-900">Create Account</h1>
                  <p className="text-sm text-gray-600">Join us to get started</p>
                </div>

                {/* SIGNUP FORM */}
                <form className="space-y-3" onSubmit={handleSignupSubmit}>

                  {/* ROLE */}
                  <div>
                    <label className="block mb-1 text-xs text-gray-700">I want to be a</label>
                    <div className="relative">
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pl-10 text-sm"
                      >
                        <option value="learner">Learner</option>
                        <option value="admin">Admin</option>
                      </select>
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* NAME */}
                  <div>
                    <label className="block mb-1 text-xs text-gray-700">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        onBlur={() => handleBlur("name")}
                        className={`w-full border rounded-lg px-3 py-2.5 pl-10 text-sm ${
                          getFieldError("name") ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>

                    {getFieldError("name") && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {getFieldError("name")}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label className="block mb-1 text-xs text-gray-700">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                      <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={() => handleBlur("email")}
                        className={`w-full border rounded-lg px-3 py-2.5 pl-10 text-sm ${
                          getFieldError("email") ? "border-red-500" : "border-gray-300"}
                        `}
                        autoComplete="email"
                      />
                    </div>

                    {getFieldError("email") && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {getFieldError("email")}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block mb-1 text-xs text-gray-700">Create Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={handleChange}
                        onBlur={() => handleBlur("password")}
                        className={`w-full border rounded-lg px-3 py-2.5 pl-10 pr-10 text-sm ${
                          getFieldError("password") ? "border-red-500" : "border-gray-300"
                        }`}
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {getFieldError("password") && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {getFieldError("password")}
                      </p>
                    )}

                    {/* Strength Indicator */}
                    {form.password && (
                      <div className="mt-1.5 space-y-1.5">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1 flex-1 rounded-full ${
                                idx < passwordStrength.strength
                                  ? strengthColors[passwordStrength.strength - 1]
                                  : "bg-gray-200"
                              }`}
                            ></div>
                          ))}
                        </div>

                        <p className="text-xs text-gray-600">
                          Strength:
                          <span
                            className={`ml-1 ${
                              passwordStrength.strength < 3 ? "text-orange-600" : "text-green-600"
                            }`}
                          >
                            {strengthLabels[passwordStrength.strength - 1] || "Very Weak"}
                          </span>
                        </p>

                        {passwordStrength.feedback.length > 0 && (
                          <ul className="text-xs text-gray-600 space-y-0.5">
                            {passwordStrength.feedback.map((msg, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <span className="text-orange-500">•</span> {msg}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label className="block mb-1 text-xs text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        onBlur={() => handleBlur("confirmPassword")}
                        className={`w-full border rounded-lg px-3 py-2.5 pl-10 pr-10 text-sm ${
                          getFieldError("confirmPassword") ? "border-red-500" : "border-gray-300"
                        }`}
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {getFieldError("confirmPassword") && (
                      <p className="text-xs text-red-600 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {getFieldError("confirmPassword")}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD SUGGESTIONS */}
                  <button
                    type="button"
                    onClick={() => setPasswordSuggestions(generatePasswordSuggestions())}
                    className="w-full border border-teal-300 rounded-lg py-1.5 text-xs text-teal-600 hover:bg-teal-50 flex items-center justify-center gap-2"
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Suggest Strong Passwords
                  </button>

                  {passwordSuggestions.length > 0 && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-2.5 mt-1.5">
                      {passwordSuggestions.map((pwd, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() =>
                            setForm({ ...form, password: pwd, confirmPassword: pwd })
                          }
                          className="w-full text-left text-xs font-mono px-2.5 py-1.5 bg-white rounded mb-1.5 last:mb-0 hover:bg-teal-50 border border-teal-300"
                        >
                          {pwd}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* TERMS */}
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 mt-0.5"
                    />
                    <span className="text-sm text-gray-600">
                      I accept the{" "}
                      <button
                        type="button"
                        onClick={() => window.open("/terms-and-conditions", "_blank")}
                        className="text-teal-600 underline cursor-pointer hover:text-teal-700"
                      >
                        Terms and Conditions
                      </button>{" "}
                      and{" "}
                      <button
                        type="button"
                        onClick={() => window.open("/privacy-policy", "_blank")}
                        className="text-teal-600 underline cursor-pointer hover:text-teal-700"
                      >
                        Privacy Policy
                      </button>
                    </span>
                  </div>

                  {/* ERROR BOX */}
                  {error && (
                    <div className="bg-red-50 text-red-800 border border-red-200 p-2.5 rounded-lg text-xs flex gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5" /> {error}
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isLoading || !acceptedTerms}
                    className="w-full py-2.5 text-sm text-white rounded-lg shadow-lg bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 flex justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
                          ></path>
                        </svg>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Continue to Verification
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-3 text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* LOGIN LINK */}
                <div className="flex justify-center w-full mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate("login");
                      } else {
                        navigate("/login");
                      }
                    }}
                    className="flex items-center gap-2 text-teal-600 hover:text-teal-700 text-sm transition-colors group"
                  >
                    Log In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </>
            )}

            {/*  OTP VERIFY  */}
            {step === 2 && (
              <>
                <div className="text-center mb-4">

                  <div className="relative inline-block mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-orange-600 rounded-xl shadow-lg flex items-center justify-center">
                      <Mail className="w-7 h-7 text-white" />
                    </div>
                    <Sparkles className="absolute -top-1 -right-1 text-yellow-400 w-5 h-5 animate-pulse" />
                  </div>

                  <h1 className="text-2xl text-gray-900 mb-2">Verify Your Email</h1>
                  <p className="text-sm text-gray-600">
                    We've sent a 6-digit code to <br />
                    <strong className="text-gray-900">{form.email}</strong>
                  </p>
                </div>

                <form className="space-y-4" onSubmit={handleOTPVerify}>

                  <div>
                    <p className="text-xs text-gray-700 text-center mb-3">Enter OTP Code</p>
                    <div className="flex justify-center gap-2">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          maxLength={1}
                          value={digit}
                          onKeyDown={(e) => handleOTPKeyDown(index, e)}
                          onChange={(e) => handleOTPChange(index, e.target.value)}
                          className="w-12 h-12 text-center text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg text-xs flex gap-2 text-red-800">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || form.otp.length !== 6}
                    className="w-full py-2.5 text-sm text-white rounded-lg bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 flex justify-center gap-2 disabled:bg-gray-400"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" />
                        </svg>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Verify & Create Account
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || resendOTPMutation.isPending}
                      className="text-sm text-teal-600 hover:text-teal-700 disabled:opacity-50 flex gap-2 items-center justify-center"
                    >
                      <RefreshCw className={`w-4 h-4 ${resendOTPMutation.isPending ? "animate-spin" : ""}`} />
                      {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend OTP"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleBackToSignup}
                    className="w-full text-sm text-gray-600 hover:text-gray-900 flex justify-center gap-2 mt-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Signup
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE LOGO */}
      <div className="lg:hidden absolute top-4 left-4 z-20">
        <div className="w-28 h-28 bg-white rounded-2xl p-3 shadow-2xl flex items-center justify-center ring-4 ring-white/30">
          <img
            src={fluentifyLogo}
            alt="Fluentify Logo"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-50px) scale(1.1); }
          66% { transform: translate(-20px,20px) scale(.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}