const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');
const cors = require('cors');

// Load environment variables

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000',process.env.FRONTEND_URL],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Expense Tracker API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 