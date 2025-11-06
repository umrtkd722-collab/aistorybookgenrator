'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { apiHandler } from '@/lib/api';
import { useRouter } from 'next/navigation';
export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
const {back} = useRouter()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  const endpoint = isSignUp ? "/auth/signup" : "/auth/signin";

  try {
    const res = await apiHandler(
      {
        url: endpoint,
        method: "POST",
        data: form,
      },
      {
        showSuccess: true,
        successMessage: isSignUp ? "Account Created!" : "Logged In ✅",
        showError:true
        
      }
    );

    // store token in cookie (server will set cookie soon)
    if (res.token) document.cookie = `accessToken=${res.token}; path=/;`;

    if (!isSignUp) {
      back()
    }

  } catch(e) {
    console.log(e)
  }
};
  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log(isSignUp ? 'Sign Up:' : 'Sign In:', form);
  //   alert(isSignUp ? 'Account created!' : 'Signed in!');
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10" data-aos="fade-up">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp
                ? 'Join us and start creating personalized books'
                : 'Sign in to continue your journey'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 p-1 rounded-full flex">
              <button
                onClick={() => setIsSignUp(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isSignUp
                    ? 'bg-[#F38DA0] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isSignUp
                    ? 'bg-[#F38DA0] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name (Sign Up only) */}
            {isSignUp && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required={isSignUp}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20 transition-all"
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20 transition-all"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:border-[#F38DA0] focus:ring-4 focus:ring-[#F38DA0]/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#F38DA0] to-pink-600 text-white font-bold rounded-full hover:from-pink-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

        

          {/* Footer Links */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="text-[#F38DA0] font-medium hover:underline"
                >
                  Sign In
                </button>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-[#F38DA0] font-medium hover:underline"
                >
                  Sign Up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}