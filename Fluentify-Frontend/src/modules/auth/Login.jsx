import React, { useState, useCallback, useEffect } from 'react';
import { Mail, User, AlertCircle, Lock, ArrowRight, Sparkles, BookOpen, Award, TrendingUp, Zap, FormInputIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import validator from 'validator';
import { useLogin } from '../../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import fluentifyLogo from "../../assets/fluentify_logo.jpg";

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'learner' });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  
  const navigate = useNavigate();
  const loginMutation = useLogin();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
  }, []);

  const handleBlur = useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const getFieldError = useCallback((field) => {
    if (!touched[field]) return '';
    
    switch (field) {
      case 'email':
        if (!form.email) return 'Email is required';
        if (!validator.isEmail(form.email)) return 'Please enter a valid email';
        return '';
      case 'password':
        if (!form.password) return 'Password is required';
        if (form.password.length < 8) return 'Password must be at least 8 characters';
        return '';
      default:
        return '';
    }
  }, [form.email, form.password, touched]);

  const validateForm = useCallback(() => {
    if (!validator.isEmail(form.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  }, [form.email, form.password]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });
    
    if (!validateForm()) return;

    loginMutation.mutate(
      { role: form.role, email: form.email, password: form.password },
      {
        onSuccess: (data) => {
          if (form.role === 'learner') {
            navigate('/dashboard');
          } else {
            navigate('/admin-dashboard');
          }
        },
        onError: (err) => {
          setError(err.message || 'Login failed');
        }
      }
    );
  }, [form, validateForm, loginMutation, navigate]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const emailError = getFieldError('email');
  const passwordError = getFieldError('password');

  return (
    <div className="min-h-screen flex overflow-x-hidden bg-gradient-to-br from-teal-900 via-orange-900 to-teal-900">
      
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 text-white">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-start mb-8">
              <div className="w-48 h-48 bg-white rounded-3xl shadow-2xl flex items-center justify-center ring-white/20 overflow-hidden">
                <img
                  src={fluentifyLogo}
                  alt="Fluentify Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              Master New Skills,
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
                Unlock Your Voice
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-lg">
              Speak with confidence
            </p>

            {/* Features */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500/30 transition-colors">
                  <Zap className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Interactive Learning</h3>
                  <p className="text-gray-400">Hands-on learning powered by AI that adapts to your pace
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                  <Award className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Smart AI Instructors</h3>
                  <p className="text-gray-400">Learn with an AI mentor that listens, correct and helps you grow naturally</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/30 transition-colors">
                  <TrendingUp className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Track Progress</h3>
                  <p className="text-gray-400">Visualize your journey - from beginner to fluent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm">
        <div 
          className={`w-full max-w-md transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8">
            
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-600">
                Sign in to continue your learning journey
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="role" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  I am a
                </label>
                <div className="relative">
                  <select
                    id="role"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white transition-all cursor-pointer text-sm"
                  >
                    <option value="learner">Learner</option>
                    <option value="admin">Admin</option>
                  </select>
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-teal-500 transition-colors pointer-events-none z-10" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur('email')}
                    onKeyPress={handleKeyPress}
                    className={`w-full border rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white transition-all text-sm ${
                      emailError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    autoComplete="email"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                    <AlertCircle className="w-3 h-3" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-teal-500 transition-colors pointer-events-none z-10" />
    
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}  // 👈 fixed here
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  onKeyPress={handleKeyPress}
                  className={`w-full border rounded-lg px-3 py-2.5 pl-10 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white transition-all text-sm ${
                    passwordError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 z-10"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
                  <AlertCircle className="w-3 h-3" />
                  <span>{passwordError}</span>
                </p>
              )}
            </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/forgot-password')}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium transition-colors hover:underline"
        >
          Forgot password?
        </button>
      </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loginMutation.isPending || !!emailError || !!passwordError}
                className="w-full bg-gradient-to-r from-teal-600 to-orange-600 hover:from-teal-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-2 group disabled:cursor-not-allowed text-sm"
              >
                {loginMutation.isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500 font-medium">
                  New here?
                </span>
              </div>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-semibold transition-colors group text-sm"
              >
                <span>Create an account</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lg:hidden absolute top-6 left-6 z-20">
        <img 
          src={fluentifyLogo} 
          alt="Fluentify Logo" 
          className="w-16 h-16 object-contain bg-white rounded-lg p-2"
        />
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;