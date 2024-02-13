export default function TxList({ txs }) {
  if (txs.length === 0) return null;

  return (
    <div className="tx-list">
      {txs.map((item, index) => (
        // Fallback to index if item.hash is not available, but prefer item.hash when possible
        <div key={item.hash || index} className="alert alert-info mt-5 bg-white">
          <div className="flex-1">
            <span className="text-white-600 font-semibold">Transaction Hash:</span>
            <span className="text-white ml-2">{item.hash}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
