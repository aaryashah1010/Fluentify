import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, Check, X, AlertCircle, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { signup } from '../routes/auth';
import axios from 'axios';
import LearnerPreferences from './LearnerPreferences';
const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, level: 'weak' });
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    notMatchingEmail: true,
    notMatchingUsername: true
  });
  const [passwordSuggestions, setPasswordSuggestions] = useState([]);
  const [showRequirements, setShowRequirements] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Real-time password validation
    if (name === 'password') {
      validatePasswordStrength(value);
      // Hide suggestions when user starts typing
      if (value.length > 0) {
        setShowSuggestions(false);
      }
    }
  };

  const generatePasswordSuggestions = () => {
    const suggestions = [];
    
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*';
    
    const adjectives = ['Swift', 'Brave', 'Bright', 'Quick', 'Smart', 'Bold', 'Wise', 'Strong'];
    const nouns = ['Tiger', 'Eagle', 'Phoenix', 'Dragon', 'Falcon', 'Wolf', 'Lion', 'Hawk'];
    
    for (let i = 0; i < 3; i++) {
      let password = '';
      
      if (i === 0) {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const num = Math.floor(Math.random() * 100);
        const special = specialChars[Math.floor(Math.random() * specialChars.length)];
        password = `${adj}${noun}${num}${special}`;
      } else if (i === 1) {
        const randomUpper = uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
        const randomWord = lowercaseChars.split('').sort(() => Math.random() - 0.5).slice(0, 5).join('');
        const randomNum = Math.floor(Math.random() * 1000);
        const randomSpecial = specialChars[Math.floor(Math.random() * specialChars.length)];
        password = `${randomUpper}${randomWord}${randomNum}${randomSpecial}`;
      } else {
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const num = Math.floor(Math.random() * 1000);
        const special1 = specialChars[Math.floor(Math.random() * specialChars.length)];
        const special2 = specialChars[Math.floor(Math.random() * specialChars.length)];
        password = `${special1}${adj}${num}${special2}`;
      }
      
      suggestions.push(password);
    }
    
    return suggestions;
  };

  const handlePasswordFocus = () => {
    setShowRequirements(true);
    // Generate and show suggestions if password is empty or weak
    if (!form.password || passwordStrength.level === 'weak') {
      const suggestions = generatePasswordSuggestions();
      setPasswordSuggestions(suggestions);
      setShowSuggestions(true);
    }
  };

  const validatePasswordStrength = (password) => {
    // Calculate requirements
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      notMatchingEmail: !form.email || (password.toLowerCase() !== form.email.toLowerCase() && !password.toLowerCase().includes(form.email.toLowerCase())),
      notMatchingUsername: !form.name || (password.toLowerCase() !== form.name.toLowerCase() && !password.toLowerCase().includes(form.name.toLowerCase()))
    };
    
    setPasswordRequirements(requirements);
    
    // Calculate strength score
    let score = 0;
    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 10;
    if (requirements.hasUppercase) score += 20;
    if (requirements.hasLowercase) score += 20;
    if (requirements.hasNumber) score += 15;
    if (requirements.hasSpecialChar) score += 15;
    
    let level = 'weak';
    if (score >= 70) level = 'strong';
    else if (score >= 50) level = 'medium';
    
    setPasswordStrength({ score, level });
  };

  const validateForm = () => {
    if (!validator.isEmail(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Check specific password requirements and show appropriate error
    if (!passwordRequirements.notMatchingEmail) {
      setError('Password cannot be the same as or contain your email');
      setShowRequirements(true);
      return false;
    }
    
    if (!passwordRequirements.notMatchingUsername) {
      setError('Password cannot be the same as or contain your username');
      setShowRequirements(true);
      return false;
    }
    
    // Check other password requirements
    const otherRequirements = {
      minLength: passwordRequirements.minLength,
      hasUppercase: passwordRequirements.hasUppercase,
      hasLowercase: passwordRequirements.hasLowercase,
      hasNumber: passwordRequirements.hasNumber,
      hasSpecialChar: passwordRequirements.hasSpecialChar
    };
    
    const allRequirementsMet = Object.values(otherRequirements).every(req => req === true);
    if (!allRequirementsMet) {
      setError('Password does not meet all security requirements');
      setShowRequirements(true);
      return false;
    }
    
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    try {
      const { status, data } = await signup(form.role, form.name, form.email, form.password);
      if (status === 200 && data.success) {
        if (data.data?.token) {
          localStorage.setItem("jwt", data.data.token);
          console.log("Token stored in localStorage:", data.data.token);
        }
        
        // Send OTP for email verification
        try {
          await axios.post('http://localhost:5000/api/email-verification/send-otp', {
            email: form.email,
            name: form.name
          });
          
          // Navigate to email verification page
          navigate('/email-verification', {
            state: {
              email: form.email,
              name: form.name,
              role: form.role
            }
          });
        } catch (otpError) {
          console.error('Error sending OTP:', otpError);
          // If OTP fails, still allow user to proceed (they can verify later)
          if (form.role === 'learner') {
            navigate('/preferences');
          } else {
            navigate('/admin-dashboard');
          }
        }
      } else {
        const errorMessage = data.error?.message || data.message || 'Signup failed';
        setError(typeof errorMessage === 'string' ? errorMessage : 'Signup failed');
      }
    } catch (err) {
      console.log('Signup error:', err.response?.data);
      
      // Handle password validation errors from backend
      const errorData = err.response?.data;
      
      if (errorData?.error?.details) {
        const details = errorData.error.details;
        
        // Show password suggestions if available from backend
        if (details.suggestions && details.suggestions.length > 0) {
          setPasswordSuggestions(details.suggestions);
          setShowSuggestions(true);
        }
        
        // Show specific error messages
        if (details.errors && details.errors.length > 0) {
          setError(details.errors[0]); // Show first error
        } else {
          setError(errorData.error.message || 'Password does not meet security requirements');
        }
      } else if (errorData?.error?.message) {
        setError(errorData.error.message);
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError('Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setForm({ ...form, password: text });
    validatePasswordStrength(text);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-lg rounded-2xl p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-md">
            <UserPlus className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Join us to get started</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                onFocus={handlePasswordFocus}
                required
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            
            {/* Password Strength Indicator */}
            {form.password && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Password Strength:</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.level === 'strong' ? 'text-green-600 dark:text-green-400' :
                    passwordStrength.level === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {passwordStrength.level.toUpperCase()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      passwordStrength.level === 'strong' ? 'bg-green-500' :
                      passwordStrength.level === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${passwordStrength.score}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Password Requirements */}
            {showRequirements && form.password && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {passwordRequirements.minLength ? 
                      <Check className="w-3.5 h-3.5 text-green-500" /> : 
                      <X className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-400">At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.hasUppercase ? 
                      <Check className="w-3.5 h-3.5 text-green-500" /> : 
                      <X className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-400">One uppercase letter (A-Z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.hasLowercase ? 
                      <Check className="w-3.5 h-3.5 text-green-500" /> : 
                      <X className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-400">One lowercase letter (a-z)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.hasNumber ? 
                      <Check className="w-3.5 h-3.5 text-green-500" /> : 
                      <X className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-400">One number (0-9)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.hasSpecialChar ? 
                      <Check className="w-3.5 h-3.5 text-green-500" /> : 
                      <X className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-400">One special character (!@#$%^&*)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.notMatchingUsername ? 
                      <Check className="w-3.5 h-3.5 text-green-500" /> : 
                      <X className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-400">Not same as or contain username</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {passwordRequirements.notMatchingEmail ? 
                      <Check className="w-3.5 h-3.5 text-green-500" /> : 
                      <X className="w-3.5 h-3.5 text-red-500" />
                    }
                    <span className="text-xs text-gray-600 dark:text-gray-400">Not same as or contain email</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Password Suggestions */}
            {showSuggestions && passwordSuggestions.length > 0 && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Need a strong password? Try these:</p>
                </div>
                <div className="space-y-2">
                  {passwordSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => copyToClipboard(suggestion)}
                      className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-700 rounded text-xs font-mono text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">💡 Click any suggestion to use it instantly</p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-2 text-red-600 dark:text-red-200 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            By signing up, you agree to our{' '}
            <button className="text-emerald-600 hover:text-emerald-500 underline">Terms of Service</button>{' '}
            and{' '}
            <button className="text-emerald-600 hover:text-emerald-500 underline">Privacy Policy</button>
          </p>
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
      </div>
    </div>
  );
};

export default Signup;
