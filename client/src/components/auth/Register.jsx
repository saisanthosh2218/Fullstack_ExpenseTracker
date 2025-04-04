import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash } from 'react-icons/fa';
import PasswordStrengthMeter from './PasswordStrengthMeter';

const Register = ({ register }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { name, email, password, password2 } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Function to check password requirements without regex
  const checkPasswordRequirements = (password) => {
    const isLongEnough = password.length >= 8;
    let hasUppercase = false;
    let hasLowercase = false;
    let hasNumber = false;
    let hasSpecialChar = false;
    
    // Check each character in the password
    for (let i = 0; i < password.length; i++) {
      const code = password.charCodeAt(i);
      
      // Check for uppercase (A-Z have char codes 65-90)
      if (code >= 65 && code <= 90) {
        hasUppercase = true;
      }
      // Check for lowercase (a-z have char codes 97-122)
      else if (code >= 97 && code <= 122) {
        hasLowercase = true;
      }
      // Check for numbers (0-9 have char codes 48-57)
      else if (code >= 48 && code <= 57) {
        hasNumber = true;
      }
      // Anything else is a special character
      else {
        hasSpecialChar = true;
      }
    }
    
    return {
      isValid: isLongEnough && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
      isLongEnough,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    
    // Check if password meets minimum requirements
    const passwordCheck = checkPasswordRequirements(password);
    
    if (!passwordCheck.isValid) {
      setError('Password does not meet the security requirements');
      return;
    }
    
    setError('');
    setLoading(true);
    
    const success = await register(name, email, password);
    
    if (!success) {
      setError('Registration failed. Email may already be in use.');
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <p className="subtitle">Sign up to start tracking your finances</p>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <div className="input-with-icon">
            <FaUser className="input-icon" />
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={onChange}
              className="form-control"
              placeholder="Your name"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-with-icon">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={onChange}
              className="form-control"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-with-icon">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={password}
              onChange={onChange}
              className="form-control password-input"
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          
          {/* Password Strength Meter */}
          {password && <PasswordStrengthMeter password={password} />}
        </div>
        
        <div className="form-group">
          <label htmlFor="password2">Confirm Password</label>
          <div className="input-with-icon">
            <FaLock className="input-icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="password2"
              id="password2"
              value={password2}
              onChange={onChange}
              className="form-control password-input"
              placeholder="••••••••"
              required
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={toggleConfirmPasswordVisibility}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {password && password2 && password !== password2 && (
            <div className="text-danger" style={{ fontSize: '0.75rem', marginTop: '6px' }}>
              Passwords do not match
            </div>
          )}
        </div>
        
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating Account...' : <><FaUserPlus style={{ marginRight: '0.5rem' }} /> Create Account</>}
        </button>
      </form>
      
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register; 