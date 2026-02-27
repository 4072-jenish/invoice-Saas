// Pages/Register.jsx
import { useState, useEffect } from "react";
import API from "../Utils/axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Auth.css";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    const password = formData.password;
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 15;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 10;
    
    setPasswordStrength(Math.min(strength, 100));
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await API.post("/auth/regUser", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      // Auto-login after registration (optional)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }

      // Success animation
      setTimeout(() => {
        alert("🎉 Registration successful! Welcome aboard!");
        navigate("/dashboard");
      }, 500);

    } catch (err) {
      console.log(err);
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ form: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return '#ef4444';
    if (passwordStrength < 70) return '#f59e0b';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
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
            <h1 className="brand-title">Start Your Journey!</h1>
            <p className="brand-subtitle">Create your free account and start managing invoices like a pro</p>
            
            <div className="brand-features">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Free 14-day trial</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>No credit card required</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Cancel anytime</span>
              </div>
            </div>

            <div className="brand-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Invoices</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-form">
          <div className="form-card">
            <div className="card-shine"></div>
            
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Join thousands of businesses using InvoiceFlow</p>
            </div>

            {errors.form && (
              <div className="error-alert">
                <span className="alert-icon">⚠️</span>
                <span>{errors.form}</span>
              </div>
            )}

            <div className="blur(10px)blur(10px)">
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    autoComplete="name"
                  />
                  {formData.name && !errors.name && <span className="input-valid">✓</span>}
                </div>
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    autoComplete="email"
                  />
                  {formData.email && !errors.email && <span className="input-valid">✓</span>}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill"
                        style={{ 
                          width: `${passwordStrength}%`,
                          backgroundColor: getPasswordStrengthColor()
                        }}
                      ></div>
                    </div>
                    <span className="strength-text" style={{ color: getPasswordStrengthColor() }}>
                      {getPasswordStrengthText()} password
                    </span>
                  </div>
                )}
                
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {/* Confirm Password Field */}
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <span className="label-icon">✓</span>
                  Confirm Password
                </label>
                <div className={`input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {/* Terms Agreement */}
                {/* <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => {
                        setAgreeTerms(e.target.checked);
                        if (errors.terms) setErrors({ ...errors, terms: null });
                      }}
                    />
                    <span className="checkmark"></span>
                    <span>
                      I agree to the{" "}
                      <button className="terms-link" onClick={() => navigate("/terms")}>
                        Terms of Service
                      </button>{" "}
                      and{" "}
                      <button className="terms-link" onClick={() => navigate("/privacy")}>
                        Privacy Policy
                      </button>
                    </span>
                  </label>
                  {errors.terms && <span className="error-message">{errors.terms}</span>}
                </div> */}

              {/* Register Button */}
              <button
                className={`login-btn ${isLoading ? 'loading' : ''}`}
                onClick={handleRegister}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span className="btn-icon">✨</span>
                    <span>Create Account</span>
                  </>
                )}
                <div className="btn-glow"></div>
              </button>

              {/* Login Link */}
              <div className="auth-footer">
                <p>
                  Already have an account?{" "}
                  <button 
                    className="auth-link"
                    onClick={() => navigate("/")}
                  >
                    Sign in here
                  </button> 
                </p>
              </div>

              {/* Social Registration */}
              <div className="social-register">
                <p className="social-divider">
                  <span>Or register with</span>
                </p>
                
                <div className="social-buttons">
                  <button className="social-btn google">
                    <span className="social-icon">G</span>
                    <span>Google</span>
                  </button>
                  <button className="social-btn github">
                    <span className="social-icon">GH</span>
                    <span>GitHub</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

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