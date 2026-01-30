import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage({ setIsLoggedIn }) {
  const [formData, setFormData] = useState({
    bankName: '',
    branchName: '',
    bankId: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.bankName.trim()) newErrors.bankName = 'Bank Name is required';
    if (!formData.branchName.trim()) newErrors.branchName = 'Branch Name is required';
    if (!formData.bankId.trim()) newErrors.bankId = 'Bank ID is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Save session
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('bank_name', formData.bankName);
    localStorage.setItem('branch_name', formData.branchName);
    localStorage.setItem('bank_id', formData.bankId);
    localStorage.setItem('linkedAccounts', 'false'); // initially no accounts

    // IMPORTANT: update React state
    setIsLoggedIn(true);

    // Navigate to dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Chakravyuh AI</h1>
          <p className="login-subtitle">Bank Login</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="bankName">Bank Name *</label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              className={errors.bankName ? 'error' : ''}
              placeholder="Enter Bank Name"
            />
            {errors.bankName && <span className="error-message">{errors.bankName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="branchName">Branch Name *</label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={formData.branchName}
              onChange={handleChange}
              className={errors.branchName ? 'error' : ''}
              placeholder="Enter Branch Name"
            />
            {errors.branchName && <span className="error-message">{errors.branchName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="bankId">Bank ID / IFSC Code *</label>
            <input
              type="text"
              id="bankId"
              name="bankId"
              value={formData.bankId}
              onChange={handleChange}
              className={errors.bankId ? 'error' : ''}
              placeholder="Enter Bank ID or IFSC Code"
            />
            {errors.bankId && <span className="error-message">{errors.bankId}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email (optional)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter Password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button type="submit" className="login-button">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
