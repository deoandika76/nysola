return (
  <FullLayout title="Transaction History">
    <h1 className="text-3xl font-bold mb-6 text-purple-500">📜 Transaction History</h1>
    <div className="grid gap-4">
      {txs.length === 0 && (
        <p className="text-gray-400">Belum ada transaksi tercatat.</p>
      )}
      {txs.map((tx, idx) => {
        const timestamp =
          tx.createdAt && typeof tx.createdAt.seconds === 'number'
            ? new Date(tx.createdAt.seconds * 1000).toLocaleString('id-ID')
            : 'Invalid Date';

        return (
          <TxCard
            key={idx}
            from={tx.from}
            to={tx.to}
            value={tx.value}
            txHash={tx.txHash}
            createdAt={timestamp}
          />
        );
      })}
    </div>
  </FullLayout>
);