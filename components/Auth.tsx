
import React, { useState } from 'react';
import { signIn, signUp, resetPassword, signInWithGoogle } from '../services/authService';
import { Loader2, ArrowRight } from 'lucide-react';

interface AuthProps {
  initialView?: 'LOGIN' | 'SIGNUP';
  onBack?: () => void;
}

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const Auth: React.FC<AuthProps> = ({ initialView = 'LOGIN', onBack }) => {
  const [isLogin, setIsLogin] = useState(initialView === 'LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setMessage('Password reset link sent to your email.');
        setLoading(false);
        return;
      }

      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, fullName);
        setMessage('Account created! Please check your email to verify.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      try {
          await signInWithGoogle();
      } catch(e: any) {
          setError(e.message || "Google Login Failed");
      }
  };

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Left Side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 xl:px-32 relative animate-in fade-in slide-in-from-left duration-500">
        <div className="max-w-md w-full mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome back' : 'Create an account'}
                </h1>
                {!isForgotPassword && (
                    <p className="text-gray-500 text-sm">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button 
                            onClick={() => { setIsLogin(!isLogin); setError(null); }}
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            {isLogin ? 'Sign up here' : 'Log in here'}
                        </button>
                    </p>
                )}
            </div>

            {/* Google Button */}
            {!isForgotPassword && (
                <div className="mb-8">
                    <button 
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors font-medium text-sm shadow-sm"
                    >
                        <GoogleIcon />
                        Connect with Google
                    </button>
                </div>
            )}

            {/* Divider */}
            {!isForgotPassword && (
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase text-gray-400 font-semibold tracking-wider">
                        <span className="bg-white px-4">Or continue with email</span>
                    </div>
                </div>
            )}

            {/* Error / Success Messages */}
            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}
            {message && <div className="mb-4 p-3 bg-green-50 text-green-600 text-xs rounded-lg">{message}</div>}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && !isForgotPassword && (
                    <div>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                        />
                    </div>
                )}

                <div>
                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    />
                </div>

                {!isForgotPassword && (
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                        />
                    </div>
                )}

                {!isForgotPassword && isLogin && (
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-600 select-none">
                            <input 
                                type="checkbox" 
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>Remember me</span>
                        </label>
                        <button 
                            type="button" 
                            onClick={() => setIsForgotPassword(true)}
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 py-3 rounded-lg font-semibold transition-all shadow-sm flex items-center justify-center gap-2 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin text-indigo-600" size={18} /> : (isForgotPassword ? 'Send Instructions' : isLogin ? 'Login' : 'Create Account')}
                </button>

                {isForgotPassword && (
                    <button 
                        type="button"
                        onClick={() => { setIsForgotPassword(false); setIsLogin(true); setError(null); }}
                        className="w-full text-center text-sm text-gray-500 hover:text-gray-900 mt-4"
                    >
                        Back to Login
                    </button>
                )}
            </form>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden md:block w-1/2 relative bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
            <img 
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2576&auto=format&fit=crop" 
                alt="Creative Professional" 
                className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
        </div>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between p-12 text-white z-10">
            {/* Top Logo */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 100 50" className="w-6 h-6 text-white fill-current">
                        <path d="M20,25 C20,5 45,5 50,25 C55,45 80,45 80,25 C80,5 55,5 50,25 C45,45 20,45 20,25 z" />
                    </svg>
                </div>
            </div>

            {/* Bottom Testimonial */}
            <div className="mb-8">
                <blockquote className="text-2xl md:text-3xl font-medium leading-tight mb-6 tracking-tight">
                    "Testing creative variations used to take weeks and cost thousands. With ClipJack, we iterate daily and our ROAS has never been higher"
                </blockquote>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-bold text-lg">Sophie</div>
                        <div className="text-gray-400 text-sm">Head of Paid Media</div>
                    </div>
                    {/* Carousel Indicators */}
                    <div className="flex gap-2">
                        <div className="w-12 h-1 bg-indigo-500 rounded-full"></div>
                        <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
                        <div className="w-12 h-1 bg-gray-700 rounded-full"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
