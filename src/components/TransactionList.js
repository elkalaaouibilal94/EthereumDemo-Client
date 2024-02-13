import React, { useState, useEffect } from 'react';

function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    if (!isCollapsed) return; // Only fetch if currently collapsed
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/getAllTransactions');
      if (!response.ok) throw new Error('Failed to fetch transactions.');

      const data = await response.json();
      if (data.length > 0) {
        setTransactions(data);
      } else {
        setError('No transactions found.');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle visibility and fetch transactions on expand
  const toggleCollapse = () => {
    if (isCollapsed) {
      fetchTransactions();
    }
    setIsCollapsed(!isCollapsed);
  };

  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      overflowX: 'auto', // Ensure table is scrollable on small screens
      display: isCollapsed ? 'none' : 'table', // Hide or show table
      backgroundColor: '#fff', // Set the background color to white
    },
    th: {
      background: '#007bff',
      color: 'white',
      padding: '10px',
      border: '1px solid #ddd',
    },
    td: {
      padding: '8px',
      border: '1px solid #ddd',
      textAlign: 'left',
      color: 'black', // Ensure text color is black for contrast
    },
    link: {
      color: '#007bff',
      textDecoration: 'none',
    },
    button: {
      background: '#007bff',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      marginTop: '20px',
    },
    error: {
      color: 'red',
      marginTop: '20px',
    },
    loading: {
      color: 'black', // Make "Loading..." text color black
      marginTop: '20px',
    },
    container: {
      marginTop: '20px',
      overflowX: 'auto', // Make the container scrollable horizontally
    },
  };
  
  return (
    <div>
      <button style={styles.button} onClick={toggleCollapse}>
        {isCollapsed ? 'Show Transactions' : 'Hide Transactions'}
      </button>

      {isLoading && <p style={styles.loading}>Loading...</p>}
      
      <div style={styles.container}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Transaction Hash</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td style={styles.td}>{tx.id}</td>
                <td style={styles.td}>{tx.addressFrom}</td>
                <td style={styles.td}>{tx.addressTo}</td>
                <td style={styles.td}>{tx.amount}</td>
                <td style={styles.td}>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${tx.transactionHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    {tx.transactionHash}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

export default TransactionsList;
