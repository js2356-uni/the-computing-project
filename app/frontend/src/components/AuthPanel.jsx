import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';
import './AuthPanel.css';

export default function AuthPanel({ setIsAuthenticated }) {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showFaq, setShowFaq] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking token:', error);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      }
    }
  }, [setIsAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          alert('Passwords do not match!');
          return;
        }
        await axios.post('http://localhost:5000/api/signup', { email, password });
        alert('Signup successful! You can now login.');
        setMode('login');
      } else {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });
        localStorage.setItem('token', response.data.token); // store token (secure cookie better for real GDPR)
        setIsAuthenticated(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className={`auth-container ${theme}`}>
      <div className="auth-header">
        <h2 className="title">Smart Energy Forecast</h2>
        <div 
          className="faq-container" 
          onMouseEnter={() => setShowFaq(true)} 
          onMouseLeave={() => setShowFaq(false)}
        >
          <p className="subtitle">{mode === 'login' ? 'Login' : 'Sign Up'}</p>
          <div className="faq-icon">?</div>
          {showFaq && (
            <div className="faq-tooltip">
              <p>Smart Energy Forecast helps you understand and optimize your home's electricity usage. After logging in, you'll have access to: 1) Monthly forecasts showing predicted energy usage and costs, 2) Detailed breakdown of which appliances use the most power, 3) Personalized energy-saving tips to reduce your bills, and 4) Settings to customize your experience. Create an account now to start monitoring your energy consumption and discover ways to save money while helping the environment!</p>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={8}
          />
        </div>
        
        {mode === 'signup' && (
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={8}
            />
          </div>
        )}
        
        <button type="submit" className="submit-button">
          {mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
      
      <div className="auth-footer">
        <p>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setMode('signup')} className="toggle-mode-button">
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="toggle-mode-button">
                Login
              </button>
            </>
          )}
        </p>
        {localStorage.getItem('token') && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
