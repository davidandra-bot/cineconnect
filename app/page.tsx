'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gold text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black px-4">
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-gold mb-4 gold-glow">
          CineConnect
        </h1>
        <p className="text-xl text-text-secondary mb-8">
          Welcome to the social universe of cinema! 🎬
        </p>

        {user ? (
          <div>
            <p className="text-white mb-4">Hello, {user.email}!</p>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-6 py-3 bg-crimson text-white rounded-lg hover:bg-crimson/80 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <Link href="/auth">
            <button className="px-8 py-3 bg-gold text-black rounded-lg font-semibold hover:bg-gold/80 transition">
              Get Started
            </button>
          </Link>
        )}
      </div>
    </main>
  );
}
