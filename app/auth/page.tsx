'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: email.split('@')[0],
            },
          },
        });
        if (error) throw error;
        setError('Check your email for verification link!');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md p-8 bg-surface-elevated rounded-2xl border border-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-gold">
            {isLogin ? 'Welcome Back' : 'Join CineConnect'}
          </h1>
          <p className="text-text-secondary mt-2">
            {isLogin ? 'Sign in to continue' : 'Create your movie community account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-gold focus:outline-none transition"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-gold focus:outline-none transition"
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-crimson text-sm text-center bg-crimson/10 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/80 transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-text-secondary hover:text-white transition text-sm"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
