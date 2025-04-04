import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaWallet, FaChartPie, FaChartBar } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [summary, setSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0
  });
  const [categorySummary, setCategorySummary] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('category');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get all transactions
        const transactionsRes = await axios.get('/api/transactions');
        const transactions = transactionsRes.data;
        setAllTransactions(transactions);
        setRecentTransactions(transactions.slice(0, 5));
        
        // Calculate summary manually from transactions
        const totalIncome = transactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        const totalExpenses = transactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        setSummary({
          income: totalIncome,
          expenses: totalExpenses,
          balance: totalIncome - totalExpenses
        });

        // Calculate category summary manually
        const expensesByCategory = {};
        const incomesByCategory = {};
        
        transactions.forEach(t => {
          const amount = parseFloat(t.amount);
          if (t.type === 'expense') {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + amount;
          } else {
            incomesByCategory[t.category] = (incomesByCategory[t.category] || 0) + amount;
          }
        });
        
        const manualCategorySummary = [
          ...Object.keys(expensesByCategory).map(category => ({
            _id: { type: 'expense', category },
            total: expensesByCategory[category]
          })),
          ...Object.keys(incomesByCategory).map(category => ({
            _id: { type: 'income', category },
            total: incomesByCategory[category]
          }))
        ];
        
        setCategorySummary(manualCategorySummary);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare pie chart data
  const preparePieChartData = () => {
    // Group by category for expenses
    const expenseCategories = categorySummary
      .filter(item => item._id.type === 'expense')
      .map(item => ({
        category: item._id.category,
        amount: item.total
      }));

    // If no expense data, return placeholder data
    if (expenseCategories.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#e0e0e0'],
            borderWidth: 1
          }
        ]
      };
    }
    
    const chartData = {
      labels: expenseCategories.map(item => item.category),
      datasets: [
        {
          data: expenseCategories.map(item => item.amount),
          backgroundColor: [
            '#6c5ce7',
            '#fd79a8',
            '#00b894',
            '#fdcb6e',
            '#74b9ff',
            '#a29bfe',
            '#fab1a0',
            '#55efc4',
            '#ff7675',
            '#00cec9'
          ],
          borderWidth: 1
        }
      ]
    };

    return chartData;
  };

  // Prepare bar chart data
  const prepareBarChartData = () => {
    // Get income and expense by month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    // Initialize data arrays with zeros
    const incomeData = Array(12).fill(0);
    const expenseData = Array(12).fill(0);
    
    // Process transactions to get monthly data
    allTransactions.forEach(transaction => {
      const date = new Date(transaction.date);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        const amount = parseFloat(transaction.amount);
        if (transaction.type === 'income') {
          incomeData[monthIndex] += amount;
        } else {
          expenseData[monthIndex] += amount;
        }
      }
    });
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          backgroundColor: 'rgba(0, 184, 148, 0.6)',
          borderColor: '#00b894',
          borderWidth: 1
        },
        {
          label: 'Expenses',
          data: expenseData,
          backgroundColor: 'rgba(255, 118, 117, 0.6)',
          borderColor: '#ff7675',
          borderWidth: 1
        }
      ]
    };
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amount (₹)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Income & Expenses',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '600'
        }
      }
    }
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Expenses by Category',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: '600'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ₹${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-indicator"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="financial-dashboard">
      <h1>Financial Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card income">
          <div className="icon">
            <FaArrowUp className="income" />
          </div>
          <h3>Total Income</h3>
          <div className="amount income">₹{summary.income.toFixed(2)}</div>
          <div className="subtitle">Total money received</div>
        </div>
        
        <div className="summary-card expense">
          <div className="icon">
            <FaArrowDown className="expense" />
          </div>
          <h3>Total Expenses</h3>
          <div className="amount expense">₹{summary.expenses.toFixed(2)}</div>
          <div className="subtitle">Total money spent</div>
        </div>
        
        <div className="summary-card">
          <div className="icon">
            <FaWallet className="balance" />
          </div>
          <h3>Current Balance</h3>
          <div className="amount balance">₹{summary.balance.toFixed(2)}</div>
          <div className="subtitle">Available funds</div>
        </div>
      </div>
      
      {/* Spending Overview */}
      <div className="card">
        <div className="card-header">
          <h2>Spending Overview</h2>
          <div className="spending-tabs">
            <div 
              className={`spending-tab ${activeTab === 'category' ? 'active' : ''}`}
              onClick={() => setActiveTab('category')}
            >
              <FaChartPie style={{ marginRight: '0.5rem' }} /> By Category
            </div>
            <div 
              className={`spending-tab ${activeTab === 'month' ? 'active' : ''}`}
              onClick={() => setActiveTab('month')}
            >
              <FaChartBar style={{ marginRight: '0.5rem' }} /> By Month
            </div>
          </div>
        </div>
        
        <div className="chart-container">
          {activeTab === 'category' ? (
            <Pie data={preparePieChartData()} options={pieChartOptions} />
          ) : (
            <Bar data={prepareBarChartData()} options={barChartOptions} />
          )}
        </div>
      </div>
      
      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h2>Recent Transactions</h2>
          <Link to="/transactions" className="btn btn-primary">View All</Link>
        </div>
        
        <div className="transactions-list">
          {recentTransactions.length === 0 ? (
            <p className="empty-state">No transactions found. <Link to="/add-transaction">Add one now</Link>.</p>
          ) : (
            recentTransactions.map(transaction => (
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
                <div className={`amount ${transaction.type}`}>
                  {transaction.type === 'expense' ? '-' : '+'}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 