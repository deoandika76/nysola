import Layout from '../components/Layout';

export default function Settings() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-orchid">Settings</h1>
      <p className="mt-2 text-gray-400">Konfigurasi mode eksekusi: Passive / Active / Stealth / Coordinator.</p>
    </Layout>
  );
}