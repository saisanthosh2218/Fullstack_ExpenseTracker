import { useState, useEffect } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PasswordStrengthMeter = ({ password }) => {
  const [strength, setStrength] = useState({
    score: 0,
    label: 'Very Weak',
    className: 'strength-very-weak'
  });
  
  const [criteria, setCriteria] = useState({
    length: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  useEffect(() => {
    // Check password criteria without regex
    const hasLength = password.length >= 8;
    
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSpecial = false;
    
    // Check each character in the password
    for (let i = 0; i < password.length; i++) {
      const char = password[i];
      const code = password.charCodeAt(i);
      
      // Check for uppercase (A-Z have char codes 65-90)
      if (code >= 65 && code <= 90) {
        hasUpper = true;
      }
      // Check for lowercase (a-z have char codes 97-122)
      else if (code >= 97 && code <= 122) {
        hasLower = true;
      }
      // Check for numbers (0-9 have char codes 48-57)
      else if (code >= 48 && code <= 57) {
        hasNum = true;
      }
      // Anything else is a special character
      else {
        hasSpecial = true;
      }
    }
    
    const newCriteria = {
      length: hasLength,
      hasUppercase: hasUpper,
      hasLowercase: hasLower,
      hasNumber: hasNum,
      hasSpecialChar: hasSpecial
    };

    setCriteria(newCriteria);

    // Calculate strength score (0-4)
    const criteriaCount = Object.values(newCriteria).filter(Boolean).length;
    
    // Map the score to strength level
    let strengthInfo = { score: 0, label: 'Very Weak', className: 'strength-very-weak' };
    
    if (criteriaCount === 1) {
      strengthInfo = { score: 1, label: 'Weak', className: 'strength-weak' };
    } else if (criteriaCount === 2) {
      strengthInfo = { score: 2, label: 'Medium', className: 'strength-medium' };
    } else if (criteriaCount === 3) {
      strengthInfo = { score: 3, label: 'Strong', className: 'strength-strong' };
    } else if (criteriaCount >= 4) {
      strengthInfo = { score: 4, label: 'Very Strong', className: 'strength-very-strong' };
    }

    setStrength(strengthInfo);
  }, [password]);

  const getPasswordStrengthColor = () => {
    switch (strength.score) {
      case 0: return '#ff7675'; // Very Weak - Red
      case 1: return '#fdcb6e'; // Weak - Yellow
      case 2: return '#74b9ff'; // Medium - Blue
      case 3: return '#a29bfe'; // Strong - Purple
      case 4: return '#00b894'; // Very Strong - Green
      default: return '#eee';
    }
  };

  return (
    <div className="password-strength-container">
      <div className="password-strength-meter">
        <div 
          className={`password-strength-meter-fill ${strength.className}`}
          style={{ 
            backgroundColor: getPasswordStrengthColor()
          }}
        ></div>
      </div>
      
      <div className="password-strength-text">
        <span>Password Strength</span>
        <span style={{ color: getPasswordStrengthColor() }}>{strength.label}</span>
      </div>
      
      <ul className="password-requirements">
        <li className={criteria.length ? 'valid' : ''}>
          {criteria.length ? <FaCheck /> : <FaTimes />}
          At least 8 characters
        </li>
        <li className={criteria.hasUppercase ? 'valid' : ''}>
          {criteria.hasUppercase ? <FaCheck /> : <FaTimes />}
          At least one uppercase letter
        </li>
        <li className={criteria.hasLowercase ? 'valid' : ''}>
          {criteria.hasLowercase ? <FaCheck /> : <FaTimes />}
          At least one lowercase letter
        </li>
        <li className={criteria.hasNumber ? 'valid' : ''}>
          {criteria.hasNumber ? <FaCheck /> : <FaTimes />}
          At least one number
        </li>
        <li className={criteria.hasSpecialChar ? 'valid' : ''}>
          {criteria.hasSpecialChar ? <FaCheck /> : <FaTimes />}
          At least one special character
        </li>
      </ul>
    </div>
  );
};

export default PasswordStrengthMeter; 