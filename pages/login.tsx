import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';

// Dynamic import biar WalletConnectButton cuma jalan di client
const WalletConnectButton = dynamic(() => import('../components/WalletConnectButton'), {
  ssr: false,
});

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    setError('');
    setLoading(true);

    const correctPassword = process.env.NEXT_PUBLIC_LOGIN_PASS || 'nycuanhunter';

    setTimeout(() => {
      if (password === correctPassword) {
        localStorage.setItem('nysola-auth', 'true');
        document.cookie = 'nysola-auth=true; path=/';
        setUnlocked(true);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      } else {
        setError('❌ Wrong password!');
        setLoading(false);

        const input = document.getElementById('login-input');
        if (input) {
          input.classList.remove('animate-shake');
          void input.offsetWidth;
          input.classList.add('animate-shake');
        }
      }
    }, 800);
  };

  return (
    <>
      <Head>
        <title>Login - Nysola</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <h1 className="text-4xl font-bold mb-6 text-orchid font-futuristic animate-fade-in">
          Login to Nysola
        </h1>

        {/* Input Password */}
        <input
          id="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your secret key"
          className="p-3 rounded-lg text-black w-full max-w-sm mb-4 transition-all duration-300"
          disabled={loading}
        />

        {/* Error Message */}
        {error && <p className="text-red-500 mb-3 animate-pulse">{error}</p>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`${
            unlocked
              ? 'bg-green-400'
              : loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-cyan hover:bg-orchid'
          } text-black px-6 py-2 rounded-xl font-bold transition-all duration-300`}
        >
          {unlocked ? '✅ Unlocked!' : loading ? '🔐 Verifying...' : '🔓 Unlock Access'}
        </button>

        {/* Divider */}
        <div className="relative w-full max-w-sm my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-black px-2 text-gray-400">or</span>
          </div>
        </div>

        {/* WalletConnect Section */}
        <div className="bg-carbon p-6 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-lg font-semibold text-cyan text-center mb-4">Connect Wallet</h2>
          <WalletConnectButton />
        </div>
      </div>
    </>
  );
}