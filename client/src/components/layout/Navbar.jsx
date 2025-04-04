import { Link, useLocation } from 'react-router-dom';
import { FaSignOutAlt, FaChartPie, FaPlus, FaList, FaWallet } from 'react-icons/fa';

const Navbar = ({ user, logout }) => {
  const location = useLocation();
  const { pathname } = location;
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <FaWallet className="logo-icon" />
          <Link to="/">MoneyTrack</Link>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/" className={pathname === '/' ? 'active' : ''}>
              <FaChartPie style={{ marginRight: '0.5rem' }} /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/transactions" className={pathname === '/transactions' ? 'active' : ''}>
              <FaList style={{ marginRight: '0.5rem' }} /> Transactions
            </Link>
          </li>
          <li>
            <Link to="/add-transaction" className={pathname === '/add-transaction' ? 'active' : ''}>
              <FaPlus style={{ marginRight: '0.5rem' }} /> Add New
            </Link>
          </li>
          <li className="logout-link">
            <a href="#!" onClick={logout}>
              <FaSignOutAlt style={{ marginRight: '0.5rem' }} /> Logout
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 