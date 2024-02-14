import { useState } from "react";
import { ethers } from "ethers";
import TransactionsList from './components/TransactionList';
import TxList from "./TxList";

const startPayment = async ({ setError, setTxs, ether, addr, senderAddr, privateKey }) => { // Include privateKey in the parameters
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found. Please install it.");
    ethers.utils.getAddress(addr);

    const transactionData = {
      addressFrom: senderAddr,
      addressTo: addr,
      amount: parseFloat(ether),
      privateKey, // Include privateKey in the transaction data
    };

    console.log(transactionData);

    const response = await fetch('http://localhost:8080/createTransaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      throw new Error('Failed to save transaction to backend');
    }

    const savedTransaction = await response.json();
    console.log("Transaction saved to backend:", savedTransaction);
    
    setTxs([{ ...savedTransaction, hash: savedTransaction.transactionHash }]);
  } catch (err) {
    setError(err.message);
  }
};

export default function App() {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [senderAddr, setSenderAddr] = useState('');
  const [recipientAddr, setRecipientAddr] = useState('');
  const [amount, setAmount] = useState('');
  const [privateKey, setPrivateKey] = useState(''); // State for privateKey

  const handleFetchCurrentAccount = async () => {
    if (!window.ethereum) {
      setError("No crypto wallet found. Please install it.");
      return;
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setSenderAddr(accounts[0]);
  };

  const handlePayment = async () => {
    setError();
    await startPayment({
      setError,
      setTxs,
      ether: amount,
      addr: recipientAddr,
      senderAddr,
      privateKey // Pass privateKey to your payment handler
    });
  };

  return (
    <div className="app-container" style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <div className="credit-card w-full shadow-lg mx-auto rounded-xl bg-white">
        <main className="mt-4 p-4">
          <h1 className="text-xl font-semibold text-gray-700 text-center">
            Send ETH payment
          </h1>
          <div className="flex items-center justify-between my-3">
            <input
              type="text"
              value={senderAddr}
              onChange={e => setSenderAddr(e.target.value)}
              className="input input-bordered block w-full focus:ring focus:outline-none"
              placeholder="Sender Address"
            />
            <button onClick={handleFetchCurrentAccount} className="btn btn-secondary ml-2">
              Fetch Current Account
            </button>
          </div>
          <div className="my-3">
            <input
              type="password" // Use password type for security
              value={privateKey}
              onChange={e => setPrivateKey(e.target.value)}
              className="input input-bordered block w-full focus:ring focus:outline-none"
              placeholder="Private Key"
            />
          </div>
          <div className="my-3">
            <input
              type="text"
              value={recipientAddr}
              onChange={e => setRecipientAddr(e.target.value)}
              className="input input-bordered block w-full focus:ring focus:outline-none"
              placeholder="Recipient Address"
            />
          </div>
          <div className="my-3">
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="input input-bordered block w-full focus:ring focus:outline-none"
              placeholder="Amount in ETH"
            />
          </div>
        </main>
        <footer className="p-4">
          <button
            onClick={handlePayment}
            className="btn btn-primary focus:ring focus:outline-none w-full"
          >
            Pay now
          </button>
        </footer>
      </div>
      <TxList txs={txs} />
      <TransactionsList />
    </div>
  );
}
