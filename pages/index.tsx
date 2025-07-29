import Head from 'next/head'

export default function Home() {
  return (
    <div className="min-h-screen bg-carbon text-white flex items-center justify-center">
      <Head>
        <title>Nysola</title>
      </Head>
      <h1 className="text-4xl font-bold text-orchid">Welcome to Nysola</h1>
    </div>
  )
}