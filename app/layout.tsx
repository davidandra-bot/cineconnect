import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CineConnect - Social Movie Community',
  description: 'Connect with movie lovers, share reviews, and discover your next favorite film',
};

// Navigation Component
function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-black/95 backdrop-blur-lg border-b border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-gold to-gold-dim rounded-full flex items-center justify-center transition group-hover:scale-110">
              <span className="text-black font-bold text-sm">CC</span>
            </div>
            <span className="text-2xl font-serif text-white tracking-tight">
              Cine<span className="text-gold">Connect</span>
            </span>
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-text-secondary hover:text-white transition text-sm">
              Home
            </Link>
            <Link href="/movies" className="text-text-secondary hover:text-white transition text-sm">
              Movies
            </Link>
            <Link href="/watchlist" className="text-text-secondary hover:text-white transition text-sm">
              📋 Watchlist
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {user ? (
  <>
    <Link href="/profile" className="text-text-secondary hover:text-white transition">
      👤 Profile
    </Link>
    <Link href="/watchlist" className="text-text-secondary hover:text-white transition relative md:hidden">
      📋
    </Link>
    <button
      onClick={signOut}
      className="px-4 py-2 bg-crimson/20 text-crimson rounded-full hover:bg-crimson/30 transition text-sm font-medium"
    >
      Sign Out
    </button>
  </>
) : (
  <Link href="/auth">
    <button className="px-4 py-2 bg-gold text-black rounded-full hover:bg-gold/80 transition text-sm font-medium">
      Sign In
    </button>
  </Link>
)}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden flex items-center justify-around py-2 border-t border-gray-800/50 bg-black/95 backdrop-blur">
        <Link href="/" className="flex flex-col items-center text-text-muted hover:text-white transition">
          <span className="text-lg">🏠</span>
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/movies" className="flex flex-col items-center text-text-muted hover:text-white transition">
          <span className="text-lg">🎬</span>
          <span className="text-xs">Movies</span>
        </Link>
        <Link href="/watchlist" className="flex flex-col items-center text-text-muted hover:text-white transition">
          <span className="text-lg">📋</span>
          <span className="text-xs">Watchlist</span>
        </Link>
        {user ? (
          <button onClick={signOut} className="flex flex-col items-center text-text-muted hover:text-white transition">
            <span className="text-lg">🚪</span>
            <span className="text-xs">Logout</span>
          </button>
        ) : (
          <Link href="/auth" className="flex flex-col items-center text-text-muted hover:text-white transition">
            <span className="text-lg">🔑</span>
            <span className="text-xs">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
