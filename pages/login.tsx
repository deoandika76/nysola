import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    const correctPassword = process.env.NEXT_PUBLIC_LOGIN_PASS || 'nycuanhunter';

    if (password === correctPassword) {
      // Simpan ke localStorage biar bisa diakses page lain
      localStorage.setItem('nysola-auth', 'true');
      router.push('/dashboard');
    } else {
      setError('❌ Wrong password!');
    }
  };

  return (
    <>
      <Head>
        <title>Login - Nysola</title>
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">
        <h1 className="text-4xl font-bold mb-6 text-orchid font-futuristic">Login to Nysola</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your secret key"
          className="p-3 rounded-lg text-black w-full max-w-sm mb-4"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          onClick={handleLogin}
          className="bg-cyan hover:bg-orchid text-black px-6 py-2 rounded-xl font-bold transition-all"
        >
          🔓 Unlock Access
        </button>
      </div>
    </>
  );
}