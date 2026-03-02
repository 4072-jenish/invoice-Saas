// Pages/Login.jsx
import { useState, useEffect } from "react";
import API from "../Utils/axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
     
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log('login called');
      
      const res = await API.post("/auth/login", { email, password });
      
      // Store token
      localStorage.setItem("token", res.data.token);
      
      // Store email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }
      
      // Store user data if returned
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      
      // Success animation
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
      
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please check your credentials.";
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orbs-1"></div>
        <div className="gradient-orb orbs-2"></div>
        <div className="gradient-orb orbs-3"></div>
      </div>

      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>

      <div className="auth-wrapper">
        {/* Left Side - Branding */}
        <div className="auth-brand">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">📊</span>
              <span className="logo-text">Invoice<span className="logo-highlight">Flow</span></span>
            </div>
            <h1 className="brand-title">Welcome Back!</h1>
            <p className="brand-subtitle">Sign in to manage your invoices and customers</p>
            
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Smart Invoice Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Real-time Analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Secure & Encrypted</span>
              </div>
            </div>

            <div className="brand-testimonial">
              <p>"The best invoice management solution we've used!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">JD</div>
                <div className="author-info">
                  <span className="author-name">John Doe</span>
                  <span className="author-title">CEO, TechCorp</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form">
          <div className="form-card">
            <div className="card-shine"></div>
            
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Please enter your credentials to access your account</p>
            </div>

            {errors.form && (
              <div className="error-alert">
                <span className="alert-icon">⚠️</span>
                <span>{errors.form}</span>
              </div>
            )}

            <div className="form-body">
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: null });
                    }}
                    onKeyPress={handleKeyPress}
                    autoComplete="email"
                  />
                  {email && !errors.email && <span className="input-valid">✓</span>}
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <div className={`input-wrapper ${errors.password ? 'error' : ''}`}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: null });
                    }}
                    onKeyPress={handleKeyPress}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  <span>Remember me</span>
                </label>
                
                <button 
                  className="forgot-link"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                className={`login-btn ${isLoading ? 'loading' : ''}`}
                onClick={handleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">→</span>
                    <span>Sign In</span>
                  </>
                )}
                <div className="btn-glow"></div>
              </button>

              {/* Register Link */}
              <div className="auth-footer">
                <p>
                  Don't have an account?{" "}
                  <button 
                    className="auth-link"
                    onClick={() => navigate("/register")}
                  >
                    Create account
                  </button>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="demo-credentials">
                <p className="demo-title">Demo Credentials</p>
                <div className="demo-grid">
                  <div className="demo-item">
                    <span className="demo-label">Email:</span>
                    <span className="demo-value">admin@demo.com</span>
                  </div>
                  <div className="demo-item">
                    <span className="demo-label">Password:</span>
                    <span className="demo-value">password123</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="auth-links">
            <button className="link-btn" onClick={() => navigate("/privacy")}>
              Privacy Policy
            </button>
            <span className="link-separator">•</span>
            <button className="link-btn" onClick={() => navigate("/terms")}>
              Terms of Service
            </button>
            <span className="link-separator">•</span>
            <button className="link-btn" onClick={() => navigate("/help")}>
              Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}