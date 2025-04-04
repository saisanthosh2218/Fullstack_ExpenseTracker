# Expense Tracker

A full-stack expense tracking application built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- User authentication (register, login)
- Dashboard with financial summary and charts
- Transaction management (add, edit, delete)
- Filter transactions by type (income/expense)
- Categorize transactions
- Responsive design

## Tech Stack

### Frontend
- React (with Vite)
- React Router for navigation
- Chart.js for data visualization
- Axios for API requests
- React Icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install dependencies for both client and server
```
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Run the application
```
# Run server (from server directory)
npm run dev

# Run client (from client directory)
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Register a new account or login with existing credentials
2. Use the dashboard to view your financial summary
3. Add new transactions with the "Add New" button
4. View and manage your transactions in the Transactions tab

## License

This project is licensed under the MIT License. 