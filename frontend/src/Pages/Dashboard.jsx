// Updated Dashboard.jsx - Header Section Only
import { useEffect, useState } from "react";
import API from "../Utils/axios";
import { useNavigate } from "react-router-dom";
import "../Styles/Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const invoicesPerPage = 5;
  const indexOfLastInvoice = currentPage * invoicesPerPage;
  const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
  const currentInvoices = invoices.slice(
    indexOfFirstInvoice,
    indexOfLastInvoice
  );
  
  const totalPages = Math.ceil(invoices.length / invoicesPerPage);
  
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 1,
    pendingInvoices: 0,
    totalRevenue: 324500
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/invoice/getAllInvoice");
      setInvoices(res.data);
      calculateStats(res.data);
    } catch (error) {
      console.error("Error loading invoices:", error);
      setInvoices(invoices);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (invoiceData) => {
    const stats = invoiceData.reduce(
      (acc, inv) => {
        acc.totalInvoices++;
        acc.totalRevenue += inv.total || 0;
        if (inv.status === "paid") acc.paidInvoices++;
        if (inv.status === "pending" || inv.status === "unpaid") acc.pendingInvoices++;
        return acc;
      },
      { totalInvoices: 0, paidInvoices: 0, pendingInvoices: 0, totalRevenue: 0 }
    );
    setStats(stats);
  };

  const handleViewPDF = async (invoiceId) => {
    try {
      const res = await API.get(`/${invoiceId}/generateInvoicePDF`, {
        responseType: "blob",
      });
      const file = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("Failed to load PDF");
    }
  };

  return (
    <div className="dashboard-container">
      <div className="animated-bg">
        <div className="gradient-orb orbs-1"></div>
        <div className="gradient-orb orbs-2"></div>
        <div className="gradient-orb orbs-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Clean Header Design */}
        <header className="dashboard-header">
          <div className="header-top">
            <div className="header-left">
              <h1 className="page-title">
                <span className="title-gradient">Invoice</span>
                <span className="title-gradient-alt">Dashboard</span>
              </h1>
              <span className="header-badge">Pro</span>
            </div>
            
            <div className="header-right">
              {/* User Menu */}
              <div className="user-menu">
                <div className="user-avatar">
                  <span>👤</span>
                </div>
                <span className="user-name">Admin</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="header-nav">
            <button 
              className={`nav-tab ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => navigate('/dashboard')}
            >
              <span className="nav-icon">📊</span>
              <span>Overview</span>
            </button>
            
            <button 
              className="nav-tab"
              onClick={() => navigate('/all-customer')}
            >
              <span className="nav-icon">👥</span>
              <span>Customers</span>
            </button>
            
            <button 
              className="nav-tab"
              onClick={() => navigate('/create-invoice')}
            >
              <span className="nav-icon">➕</span>
              <span>New Invoice</span>
            </button>
            
            <button 
              className="nav-tab"
              onClick={() => navigate('/reports')}
            >
              <span className="nav-icon">📈</span>
              <span>Reports</span>
            </button>
            
            <button 
              className="nav-tab"
              onClick={() => navigate('/settings')}
            >
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
          </div>

          {/* Action Bar */}
          <div className="action-bar">
            <div className="action-bar-left">
              <div className="search-box">
                <span className="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search invoices, customers..." 
                  className="search-input"
                />
              </div>
            </div>
            
            <div className="action-bar-right">
              <button className="action-btn-secondary" onClick={() => navigate("/all-customer")}>
                <span className="btn-icon">👥</span>
                <span>Customers</span>
              </button>
              
              <button className="action-btn-primary" onClick={() => navigate("/create-invoice")}>
                <span className="btn-icon">+</span>
                <span>New Invoice</span>
                <div className="btn-glow"></div>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-card-inner">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Total Invoices</h3>
                <div className="stat-value">{stats.totalInvoices}</div>
                <div className="stat-trend positive">+12%</div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-inner">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Paid Invoices</h3>
                <div className="stat-value">{stats.paidInvoices}</div>
                <div className="stat-trend positive">+5%</div>
              </div>
            </div>  
          </div>

          <div className="stat-card">
            <div className="stat-card-inner">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <h3>Pending</h3>
                <div className="stat-value">{stats.pendingInvoices}</div>
                <div className="stat-trend negative">-2%</div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-inner">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Revenue</h3>
                <div className="stat-value">${stats.totalRevenue.toLocaleString()}</div>
                <div className="stat-trend positive">+23%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Table with Neon Effects */}
        <div className="table-container">
          <div className="table-header">
            <h2>Recent Invoices</h2>
            <div className="table-search">
              <input type="text" placeholder="Search invoices..." />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.map((inv, index) => (
                  <tr key={inv.id} style={{ animationDelay: `${index * 0.1}s` }} className="table-row-fade">
                    <td className="invoice-cell">
                      <span className="invoice-number">#{inv.invoiceNumber}</span>
                    </td>
                    <td className="customer-cell">
                      <div className="customer-avatar">
                        {inv.customer?.name.charAt(0)}
                      </div>
                      <span>{inv.customer?.name}</span>
                    </td>
                    <td className="amount-cell">₹{inv.total?.toLocaleString()}</td>
                    <td className="date-cell">
                      {new Date(inv.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="status-cell">
                      <span className={`status-badge ${inv.status}`}>
                        <span className="status-dot"></span>
                        {inv.status}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button 
                        className="action-btn view-btn"
                        onClick={() => handleViewPDF(inv.id)}
                        title="View PDF"
                      >
                        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/>
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" strokeWidth="2"/>
                        </svg>
                        <span>View</span>
                      </button>
                    
                      <button className="action-btn download-btn" title="Download">
                        <svg className="action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path d="M12 3v12m0 0l-3-3m3 3l3-3M5 21h14" strokeWidth="2"/>
                        </svg>
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination with Animation */}
          <div className="pagination">
            <div className="pagination-info">
              Showing {indexOfFirstInvoice + 1} to{" "}
              {Math.min(indexOfLastInvoice, invoices.length)} of{" "}
              {invoices.length} results
            </div>

            <div className="pagination-controls">
              <button
                className="page-btn prev"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                ←
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={`page-btn ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="page-btn next"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}