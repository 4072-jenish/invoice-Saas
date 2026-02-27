// Pages/AddCustomer.jsx
import { useState } from "react";
import API from "../Utils/axios";
import { useNavigate } from "react-router-dom";
import "../Styles/AddCustomer.css";

export default function AddCustomer() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await API.post("/customer/addCustomer", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
      });

      alert("Customer Added Successfully 🔥");
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (Object.values(formData).some(value => value.trim())) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="add-customer-container">
      <div className="animated-bg">
        <div className="gradient-orb orbs-1"></div>
        <div className="gradient-orb orbs-2"></div>
        <div className="gradient-orb orbs-3"></div>
      </div>

      <div className="content-wrapper">
        <header className="page-header">
          <div className="header-left">
            <h1 className="page-title">
              <span className="title-gradient">Add New</span>
              <span className="title-gradient-alt">Customer</span>
            </h1>
            <p className="page-subtitle">Fill in the customer information below</p>
          </div>
          <button className="btn btn-outline" onClick={handleCancel}>
            <span className="btn-icon">←</span>
            Back to Dashboard
          </button>
        </header>

        <div className="content-grid">
          <div className="form-column">
            <div className="form-card">
              <div className="card-header">
                <div className="header-icon">📋</div>
                <div>
                  <h2>Customer Information</h2>
                  <p>Enter the customer's personal and contact details</p>
                </div>
              </div>

              <div className="card-body">
                {/* Avatar Section */}
                <div className="avatar-section">
                  <div className="avatar-wrapper">
                    <div className="avatar">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                    <button className="avatar-upload-btn" type="button">
                      <span className="upload-icon">📸</span>
                      Upload Photo
                    </button>
                  </div>
                  <p className="avatar-hint">Optional: Upload a profile picture</p>
                </div>

                {/* Form Fields */}
                <div className="form-fields">
                  {/* Name Field */}
                  <div className="field-group">
                    <label htmlFor="name">
                      Full Name <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.name ? 'error' : ''}`}>
                      <span className="field-icon">👤</span>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className={errors.name ? 'error' : ''}
                      />
                    </div>
                    {errors.name && <span className="error-message">{errors.name}</span>}
                  </div>

                  {/* Email Field */}
                  <div className="field-group">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <div className={`input-wrapper ${errors.email ? 'error' : ''}`}>
                      <span className="field-icon">📧</span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className={errors.email ? 'error' : ''}
                      />
                    </div>
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  {/* Phone Field */}
                  <div className="field-group">
                    <label htmlFor="phone">Phone Number</label>
                    <div className={`input-wrapper ${errors.phone ? 'error' : ''}`}>
                      <span className="field-icon">📱</span>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        value={formData.phone}
                        onChange={handleChange}
                        className={errors.phone ? 'error' : ''}
                      />
                    </div>
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button 
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✓</span>
                      Save Customer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview & Tips */}
          <div className="sidebar-column">
            {/* Live Preview Card */}
            <div className="preview-card">
              <div className="preview-header">
                <span className="preview-icon">👁️</span>
                <h3>Live Preview</h3>
              </div>
              <div className="preview-body">
                <div className="preview-avatar">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '👤'}
                </div>
                <div className="preview-details">
                  <div className="preview-row">
                    <span className="preview-label">Name:</span>
                    <span className="preview-value">{formData.name || 'Not provided'}</span>
                  </div>
                  <div className="preview-row">
                    <span className="preview-label">Email:</span>
                    <span className="preview-value">{formData.email || 'Not provided'}</span>
                  </div>
                  <div className="preview-row">
                    <span className="preview-label">Phone:</span>
                    <span className="preview-value">{formData.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="tips-card">
              <div className="tips-header">
                <span className="tips-icon">💡</span>
                <h3>Quick Tips</h3>
              </div>
              <div className="tips-list">
                <div className="tip-item">
                  <span className="tip-bullet">•</span>
                  <p>Customer name and email are required fields</p>
                </div>
                <div className="tip-item">
                  <span className="tip-bullet">•</span>
                  <p>Add phone number for SMS notifications</p>
                </div>
                <div className="tip-item">
                  <span className="tip-bullet">•</span>
                  <p>All data is encrypted and secure</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="actions-card">
              <h4>Quick Actions</h4>
              <button className="action-btn" onClick={() => navigate("/customers")}>
                <span className="action-icon">📋</span>
                View All Customers
              </button>
              <button className="action-btn" onClick={() => navigate("/create-invoice")}>
                <span className="action-icon">📄</span>
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}