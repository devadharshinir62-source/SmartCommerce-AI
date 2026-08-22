import React, { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ArrowLeft
} from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');

    // Registration validation
    if (isRegisterMode) {
      if (!name.trim()) {
        setError('Please enter your name.');
        return;
      }

      if (password.length < 4) {
        setError('Password must contain at least 4 characters.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const newUser = {
        name: name.trim(),
        email: email.trim(),
        password
      };

      // Save registered user
      localStorage.setItem(
        'smartcommerce_registered_user',
        JSON.stringify(newUser)
      );

      // Automatically log in after registration
      onLogin({
        name: newUser.name,
        email: newUser.email
      });

      return;
    }

    // Login validation
    const savedUser = localStorage.getItem(
      'smartcommerce_registered_user'
    );

    if (!savedUser) {
      setError(
        'No account found. Please create an account first.'
      );
      return;
    }

    const registeredUser = JSON.parse(savedUser);

    if (
      email.trim() !== registeredUser.email ||
      password !== registeredUser.password
    ) {
      setError('Invalid email or password.');
      return;
    }

    // Successful login
    onLogin({
      name: registeredUser.name,
      email: registeredUser.email
    });
  };

  const switchMode = () => {
    setIsRegisterMode(!isRegisterMode);

    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 py-10">

      {/* LOGO */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
          {isRegisterMode ? (
            <UserPlus className="w-8 h-8 text-white" />
          ) : (
            <LogIn className="w-8 h-8 text-white" />
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          SmartCommerce
          <span className="text-brand-400 ml-2">
            AI
          </span>
        </h1>

        <p className="text-slate-400 mt-3">
          Intelligent Shopping & Recommendation Assistant
        </p>
      </div>

      {/* LOGIN / REGISTER CARD */}
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-7 sm:p-10">

        <h2 className="text-3xl font-bold text-white">
          {isRegisterMode
            ? 'Create an account'
            : 'Welcome back'}
        </h2>

        <p className="text-slate-400 mt-2 mb-7">
          {isRegisterMode
            ? 'Sign up to start shopping with AI.'
            : 'Login to continue shopping with AI.'}
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* NAME - ONLY REGISTER */}
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-white placeholder:text-slate-500 transition"
                />
              </div>
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-white placeholder:text-slate-500 transition"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full pl-12 pr-12 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-white placeholder:text-slate-500 transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD - ONLY REGISTER */}
          {isRegisterMode && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-white placeholder:text-slate-500 transition"
                />
              </div>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-base shadow-lg shadow-brand-500/20 transition"
          >
            {isRegisterMode ? (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </button>

        </form>

        {/* SWITCH LOGIN / REGISTER */}
        <div className="mt-7 pt-6 border-t border-slate-700 text-center">

          {isRegisterMode ? (
            <p className="text-sm text-slate-400">
              Already have an account?

              <button
                onClick={switchMode}
                className="ml-2 text-brand-400 hover:text-brand-300 font-semibold transition"
              >
                <ArrowLeft className="inline w-4 h-4 mr-1" />
                Login
              </button>
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              New to SmartCommerce AI?

              <button
                onClick={switchMode}
                className="ml-2 text-brand-400 hover:text-brand-300 font-semibold transition"
              >
                Create Account
                <UserPlus className="inline w-4 h-4 ml-1" />
              </button>
            </p>
          )}

        </div>

      </div>

      {/* FOOTER */}
      <p className="mt-6 text-sm text-slate-500">
        SmartCommerce AI • Internship Project
      </p>

    </div>
  );
}