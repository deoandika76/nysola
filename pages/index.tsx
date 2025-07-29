import Head from 'next/head';
import Layout from '../components/Layout';
import PromptBar from '../components/PromptBar';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Nysola Dashboard</title>
      </Head>
      <PromptBar />
      <h1 className="text-3xl font-bold text-orchid">Welcome to Nysola</h1>
      <p className="text-gray-400 mt-4">Autonomous AI Web3 cuan hunter interface 🚀</p>
    </Layout>
  );
}