import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaEdit, FaFilter, FaSearch, FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axios.get('/transactions');
        setTransactions(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching transactions:', err);
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const deleteTransaction = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(transaction => transaction._id !== id));
      } catch (err) {
        console.error('Error deleting transaction:', err);
      }
    }
  };

  // Search and filter logic
  const filteredTransactions = transactions
    .filter(transaction => {
      // Type filter
      if (filter !== 'all' && transaction.type !== filter) return false;
      
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(query) ||
          transaction.category.toLowerCase().includes(query)
        );
      }
      
      // Date range
      if (dateRange.startDate && new Date(transaction.date) < new Date(dateRange.startDate)) return false;
      if (dateRange.endDate && new Date(transaction.date) > new Date(dateRange.endDate)) return false;
      
      return true;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, most recent first

  // Calculate summary
  const summary = {
    total: filteredTransactions.length,
    income: filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0),
    expenses: filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-indicator"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <h1>Transactions</h1>
      <div className="card">
        <div className="card-header">
          <h2>Manage Your Transactions</h2>
          <Link to="/add-transaction" className="btn btn-primary">Add New</Link>
        </div>
        
        {/* Filter Controls */}
        <div className="filter-section">
          <div className="filter-control search-input">
            <FaSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="filter-control">
            <select 
              className="form-control"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
        </div>
        
        {/* Summary Row */}
        <div className="summary-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="summary-card">
            <h3>Filtered Transactions</h3>
            <div className="amount balance">{summary.total}</div>
            <div className="subtitle">transactions found</div>
          </div>
          
          <div className="summary-card income">
            <h3>Total Income</h3>
            <div className="amount income">₹{summary.income.toFixed(2)}</div>
            <div className="subtitle">from filtered transactions</div>
          </div>
          
          <div className="summary-card expense">
            <h3>Total Expenses</h3>
            <div className="amount expense">₹{summary.expenses.toFixed(2)}</div>
            <div className="subtitle">from filtered transactions</div>
          </div>
        </div>
        
        {filteredTransactions.length === 0 ? (
          <p className="empty-state">No transactions found. <Link to="/add-transaction">Add one now</Link>.</p>
        ) : (
          <div className="transactions-list">
            {filteredTransactions.map(transaction => (
              <div key={transaction._id} className="transaction-item">
                <div className="left">
                  <div className={`transaction-icon ${transaction.type}`}>
                    {transaction.type === 'income' ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                  <div className="transaction-details">
                    <div className="description">{transaction.description}</div>
                    <span className="category">{transaction.category}</span>
                    <div className="date">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="right">
                  <div className={`amount ${transaction.type}`}>
                    {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                  </div>
                  <div className="actions">
                    <Link to={`/edit-transaction/${transaction._id}`} className="btn-icon">
                      <FaEdit />
                    </Link>
                    <button 
                      className="btn-icon delete"
                      onClick={() => deleteTransaction(transaction._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions; 