import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPlus, FaMinus } from 'react-icons/fa';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { type, amount, category, description, date } = formData;

  const expenseCategories = ['Housing', 'Food', 'Transportation', 'Entertainment', 'Shopping', 'Utilities', 'Healthcare', 'Education', 'Personal', 'Other'];
  const incomeCategories = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Side Hustle', 'Other'];

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      setError('Please fill in all fields');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await axios.post('/transactions', {
        ...formData,
        amount: parseFloat(amount)
      });
      
      setLoading(false);
      navigate('/transactions');
    } catch (err) {
      setError('Error adding transaction');
      setLoading(false);
      console.error('Error adding transaction:', err);
    }
  };

  return (
    <div className="add-transaction-form">
      <div className="card">
        <h2>Add New Transaction</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Transaction Type</label>
            <div className="transaction-type-selector">
              <div 
                className={`type-option expense ${type === 'expense' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'expense' })}
              >
                <FaMinus style={{ marginRight: '0.5rem' }} /> Expense
              </div>
              <div 
                className={`type-option income ${type === 'income' ? 'active' : ''}`}
                onClick={() => setFormData({ ...formData, type: 'income' })}
              >
                <FaPlus style={{ marginRight: '0.5rem' }} /> Income
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <div className="input-with-icon">
              <input
                type="number"
                name="amount"
                id="amount"
                value={amount}
                onChange={onChange}
                className="form-control"
                placeholder="Enter amount"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              value={category}
              onChange={onChange}
              className="form-control"
              required
            >
              <option value="">Select a category</option>
              {type === 'expense' ? (
                expenseCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              ) : (
                incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))
              )}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              name="description"
              id="description"
              value={description}
              onChange={onChange}
              className="form-control"
              placeholder="Enter description"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              id="date"
              value={date}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction; 