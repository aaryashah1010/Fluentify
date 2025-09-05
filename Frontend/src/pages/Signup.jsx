import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'learner' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch(`/api/auth/signup/${form.role}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      });
      const data = await res.json();
      if (data.token) {
        if (form.role === 'learner') {
          navigate('/dashboard');
        } else {
          navigate('/admin-dashboard');
        }
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass Card */}
        <div className="backdrop-blur-lg bg-white bg-opacity-10 border border-white border-opacity-20 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-black" />
            </div>
            <h2 className="text-3xl font-bold text-black mb-2">Join Us</h2>
            <p className="text-gray-300">Create your account to get started</p>
          </div>

          <div className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">I want to be a</label>
              <div className="relative">
                <select 
                  name="role" 
                  value={form.role} 
                  onChange={handleChange}
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 appearance-none backdrop-blur-sm"
                >
                  <option value="learner" className="bg-gray-800">Learner</option>
                  <option value="admin" className="bg-gray-800">Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl pl-10 pr-4 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl pl-10 pr-4 py-3 text-black
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl pl-10 pr-12 py-3 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-400">
                Password should be at least 8 characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-xl p-3 text-red-200 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 text-black font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Terms */}
            <div className="text-center text-xs text-gray-400">
              By signing up, you agree to our{' '}
              <button className="text-emerald-400 hover:text-emerald-300 underline">
                Terms of Service
              </button>{' '}
              and{' '}
              <button className="text-emerald-400 hover:text-emerald-300 underline">
                Privacy Policy
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 text-center">
            <span>Already have an account? </span>
            <button type="button" className="text-blue-600 underline" onClick={() => navigate('/login')}>Login</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;