import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

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
        // ✅ Simpan ke localStorage (untuk client use if needed)
        localStorage.setItem('nysola-auth', 'true');

        // ✅ Simpan ke cookie (buat dibaca middleware.ts)
        document.cookie = 'nysola-auth=true; path=/';

        setUnlocked(true);

        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      } else {
        setError('❌ Wrong password!');
        setLoading(false);

        // Shake animation
        const input = document.getElementById('login-input');
        if (input) {
          input.classList.remove('animate-shake');
          void input.offsetWidth; // force reflow
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

        <input
          id="login-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your secret key"
          className="p-3 rounded-lg text-black w-full max-w-sm mb-4 transition-all duration-300"
          disabled={loading}
        />

        {error && <p className="text-red-500 mb-3 animate-pulse">{error}</p>}

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
      </div>
    </>
  );
}