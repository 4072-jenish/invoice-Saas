// Pages/ViewCustomer.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../Utils/axios";
import "../Styles/ViewCustomer.css";

export default function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/customer/getCustomer/${id}`);
      console.log(res.data);
      setCustomer(res.data[0]);
    } catch (err) {
      console.error(err);
      navigate("/all-customer");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-customer/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await API.delete(`/customer/${id}`);
        navigate("/all-customer");
      } catch (err) {
        console.error("Error deleting customer:", err);
      }
    }
  };

  const handleCreateInvoice = () => {
    navigate(`/create-invoice?customer=${id}`);
  };

  if (loading) {
    return (
      <div className="view-customer-container">
        <div className="animated-bg">
          <div className="gradient-orb orbs-1"></div>
          <div className="gradient-orb orbs-2"></div>
          <div className="gradient-orb orbs-3"></div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading customer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="view-customer-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orbs-1"></div>
        <div className="gradient-orb orbs-2"></div>
        <div className="gradient-orb orbs-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header with Navigation */}
        <div className="page-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate(-1)}>
              <span className="back-icon">←</span>
              <span>Back to Customers</span>
            </button>
            <h1 className="page-title">
              <span className="title-gradient">Customer</span>
              <span className="title-gradient-alt">Profile</span>
            </h1>
          </div>
          
          <div className="header-actions">
            <button className="action-btn-secondary" onClick={handleEdit}>
              <span className="btn-icon">✏️</span>
              <span>Edit</span>
            </button>
            <button className="action-btn-danger" onClick={handleDelete}>
              <span className="btn-icon">🗑️</span>
              <span>Delete</span>
            </button>
            <button className="action-btn-primary" onClick={handleCreateInvoice}>
              <span className="btn-icon">📄</span>
              <span>Create Invoice</span>
              <div className="btn-glow"></div>
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column - Profile Card */}
          <div className="profile-column">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar">
                    {customer.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="avatar-badge">
                    {customer.isActive ? '🟢' : '⚪'}
                  </div>
                </div>
                <div className="profile-title">
                  <h2>{customer.name}</h2>
                  <p className="customer-id">Customer ID: {customer.id}</p>
                </div>
              </div>

              <div className="profile-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Invoices</span>
                  <span className="stat-value">{customer._count?.invoices || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Spent</span>
                  <span className="stat-value">₹{customer.totalSpent?.toLocaleString() || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Last Active</span>
                  <span className="stat-value">
                    {customer.lastActive 
                      ? new Date(customer.lastActive).toLocaleDateString() 
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="profile-contact">
                <h3>Contact Information</h3>
                <div className="contact-item">
                  <span className="contact-icon">📧</span>
                  <div className="contact-detail">
                    <span className="contact-label">Email Address</span>
                    <span className="contact-value">{customer.email || 'Not provided'}</span>
                  </div>
                  {customer.email && (
                    <button className="contact-action" title="Send Email">
                      ✉️
                    </button>
                  )}
                </div>

                <div className="contact-item">
                  <span className="contact-icon">📱</span>
                  <div className="contact-detail">
                    <span className="contact-label">Phone Number</span>
                    <span className="contact-value">{customer.phone || 'Not provided'}</span>
                  </div>
                  {customer.phone && (
                    <button className="contact-action" title="Call">
                      📞
                    </button>
                  )}
                </div>

              </div>

              <div className="profile-meta">
                <div className="meta-item">
                  <span className="meta-label">Customer Since</span>
                  <span className="meta-value">
                    {new Date(customer.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Last Updated</span>
                  <span className="meta-value">
                    {new Date(customer.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs and Content */}
          <div className="details-column">
            <div className="details-card">
              <div className="tabs-header">
                <button 
                  className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  <span className="tab-icon">📋</span>
                  <span>Details</span>
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
                  onClick={() => setActiveTab('invoices')}
                >
                  <span className="tab-icon">📄</span>
                  <span>Invoices</span>
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
                  onClick={() => setActiveTab('activity')}
                >
                  <span className="tab-icon">⏱️</span>
                  <span>Activity</span>
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'details' && (
                  <div className="details-tab">
                    <h3>Customer Information</h3>
                    
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Full Name</span>
                        <span className="info-value">{customer.name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Email Address</span>
                        <span className="info-value">{customer.email || '—'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Phone Number</span>
                        <span className="info-value">{customer.phone || '—'}</span>
                      </div>
                    </div>

                    <h3 style={{ marginTop: '2rem' }}>Additional Information</h3>
                    
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-label">Customer Type</span>
                        <span className="info-value">
                          <span className="badge badge-business">
                            {customer.type || 'Regular'}
                          </span>
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Payment Terms</span>
                        <span className="info-value">{customer.paymentTerms || 'Net 30'}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Credit Limit</span>
                        <span className="info-value">
                          ₹{customer.creditLimit?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Outstanding Balance</span>
                        <span className="info-value" style={{ color: '#ef4444' }}>
                          ₹{customer.outstanding?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'invoices' && (
                  <div className="invoices-tab">
                    <h3>Invoice History</h3>
                    
                    {customer.invoices?.length > 0 ? (
                      <div className="invoices-list">
                        <div className="invoice-header">
                          <span>Invoice #</span>
                          <span>Date</span>
                          <span>Amount</span>
                          <span>Status</span>
                          <span>Action</span>
                        </div>
                        
                        {customer.invoices.map((invoice, index) => (
                          <div key={invoice.id} className="invoice-row">
                            <span className="invoice-number">#{invoice.invoiceNumber}</span>
                            <span className="invoice-date">
                              {new Date(invoice.createdAt).toLocaleDateString()}
                            </span>
                            <span className="invoice-amount">₹{invoice.total.toLocaleString()}</span>
                            <span className={`invoice-status ${invoice.status}`}>
                              <span className="status-dot"></span>
                              {invoice.status}
                            </span>
                            <button 
                              className="invoice-action"
                              onClick={() => navigate(`/invoice/${invoice.id}`)}
                            >
                              View →
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <span className="empty-icon">📄</span>
                        <p>No invoices found for this customer</p>
                        <button 
                          className="btn btn-primary"
                          onClick={handleCreateInvoice}
                        >
                          Create First Invoice
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="activity-tab">
                    <h3>Recent Activity</h3>
                    
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-icon">👤</div>
                        <div className="timeline-content">
                          <p>Customer profile created</p>
                          <span className="timeline-date">
                            {new Date(customer.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      
                      {customer.invoices?.map((invoice, index) => (
                        <div key={index} className="timeline-item">
                          <div className="timeline-icon">📄</div>
                          <div className="timeline-content">
                            <p>Invoice #{invoice.invoiceNumber} generated</p>
                            <span className="timeline-date">
                              {new Date(invoice.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {customer.lastActive && (
                        <div className="timeline-item">
                          <div className="timeline-icon">⏱️</div>
                          <div className="timeline-content">
                            <p>Last login / activity</p>
                            <span className="timeline-date">
                              {new Date(customer.lastActive).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}