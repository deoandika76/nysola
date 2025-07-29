import Layout from '../components/Layout';

export default function Notifications() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-orchid">Notifications</h1>
      <p className="mt-2 text-gray-400">Log: task berhasil, gagal, blacklist alert, atau reward masuk.</p>
    </Layout>
  );
}