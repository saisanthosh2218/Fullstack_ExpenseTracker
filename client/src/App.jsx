import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Transactions from './components/transactions/Transactions';
import AddTransaction from './components/transactions/AddTransaction';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';

// Set default axios base URL
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Using API URL:", axios.defaults.baseURL);
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Set auth token header
        axios.defaults.headers.common['x-auth-token'] = token;
        
        // Get user data
        const res = await axios.get('/auth/user');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['x-auth-token'];
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      const userRes = await axios.get('/auth/user');
      setUser(userRes.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;
      
      const userRes = await axios.get('/auth/user');
      setUser(userRes.data);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Navbar user={user} logout={logout} />}
        <div className="container">
          <Routes>
            <Route path="/login" element={
              isAuthenticated ? <Navigate to="/" /> : <Login login={login} />
            } />
            <Route path="/register" element={
              isAuthenticated ? <Navigate to="/" /> : <Register register={register} />
            } />
            <Route path="/" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Dashboard user={user} />
              </PrivateRoute>
            } />
            <Route path="/transactions" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <Transactions />
              </PrivateRoute>
            } />
            <Route path="/add-transaction" element={
              <PrivateRoute isAuthenticated={isAuthenticated}>
                <AddTransaction />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
