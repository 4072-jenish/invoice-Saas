// Pages/AllCustomers.jsx
import { useEffect, useState } from "react";
import API from "../Utils/axios";
import { useNavigate } from "react-router-dom";
import "../Styles/AllCustomers.css";

export default function AllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    withEmail: 0,
    withPhone: 0,
    recent: 0
  });

  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/customer/allCustomer");
      setCustomers(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Error loading customers", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    
    setStats({
      total: data.length,
      withEmail: data.filter(c => c.email).length,
      withPhone: data.filter(c => c.phone).length,
      recent: data.filter(c => new Date(c.createdAt) > thirtyDaysAgo).length
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await API.delete(`/customer/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error("Error deleting customer", err);
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCustomers.length === 0) return;
    
    if (window.confirm(`Delete ${selectedCustomers.length} selected customers?`)) {
      try {
        await Promise.all(selectedCustomers.map(id => API.delete(`/customer/${id}`)));
        setSelectedCustomers([]);
        fetchCustomers();
      } catch (err) {
        console.error("Error deleting customers", err);
      }
    }
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleSelectCustomer = (id) => {
    if (selectedCustomers.includes(id)) {
      setSelectedCustomers(selectedCustomers.filter(cId => cId !== id));
    } else {
      setSelectedCustomers([...selectedCustomers, id]);
    }
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc"
    });
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortConfig.key) {
      const aVal = a[sortConfig.key] || "";
      const bVal = b[sortConfig.key] || "";
      const direction = sortConfig.direction === "asc" ? 1 : -1;
      return aVal.localeCompare(bVal) * direction;
    }
    return 0;
  });

  const paginatedCustomers = sortedCustomers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);

  if (loading) {
    return (
      <div className="customers-container">
        <div className="animated-bg">
          <div className="gradient-orb orbs-1"></div>
          <div className="gradient-orb orbs-2"></div>
          <div className="gradient-orb orbs-3"></div>
        </div>
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customers-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orbs-1"></div>
        <div className="gradient-orb orbs-2"></div>
        <div className="gradient-orb orbs-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header Section */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">
              <span className="title-gradient">Customer</span>
              <span className="title-gradient-alt">Directory</span>
            </h1>
            <p className="page-subtitle">Manage and view all your customers</p>
          </div>
          
          <div className="header-actions">
            {selectedCustomers.length > 0 && (
              <button className="btn btn-danger" onClick={handleBulkDelete}>
                <span className="btn-icon">🗑️</span>
                Delete Selected ({selectedCustomers.length})
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={() => navigate("/addCustomer")}
            >
              <span className="btn-icon">+</span>
              Add Customer
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Customers</h3>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-trend">
                {stats.recent} new this month
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📧</div>
            <div className="stat-content">
              <h3>With Email</h3>
              <div className="stat-value">{stats.withEmail}</div>
              <div className="stat-trend">
                {Math.round((stats.withEmail / stats.total) * 100 || 0)}% conversion
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📱</div>
            <div className="stat-content">
              <h3>With Phone</h3>
              <div className="stat-value">{stats.withPhone}</div>
              <div className="stat-trend">
                {Math.round((stats.withPhone / stats.total) * 100 || 0)}% reachable
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>Active</h3>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-trend">All time customers</div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>
          
          <div className="filter-actions">
            <select className="filter-select" defaultValue="all">
              <option value="all">All Customers</option>
              <option value="withEmail">With Email</option>
              <option value="withPhone">With Phone</option>
              <option value="recent">Recent</option>
            </select>
            
            <button className="btn btn-outline" onClick={() => fetchCustomers()}>
              <span className="btn-icon">↻</span>
              Refresh
            </button>
          </div>
        </div>

        {/* Customers Table */}
        <div className="table-container">
          <div className="table-header">
            <div className="table-title">
              <h2>Customer List</h2>
              <span className="customer-count">{filteredCustomers.length} customers</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0}
                        onChange={handleSelectAll}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </th>
                  <th onClick={() => handleSort("name")} className="sortable">
                    Customer
                    {sortConfig.key === "name" && (
                      <span className="sort-icon">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("email")} className="sortable">
                    Email
                    {sortConfig.key === "email" && (
                      <span className="sort-icon">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th onClick={() => handleSort("phone")} className="sortable">
                    Phone
                    {sortConfig.key === "phone" && (
                      <span className="sort-icon">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer, index) => (
                    <tr 
                      key={customer.id} 
                      className={`table-row ${selectedCustomers.includes(customer.id) ? 'selected' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="checkbox-cell">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={() => handleSelectCustomer(customer.id)}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="customer-details">
                            <span className="customer-name">{customer.name}</span>
                            {customer.company && (
                              <span className="customer-company">{customer.company}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="email-cell">
                          <span className="email-text">{customer.email || '—'}</span>
                          {customer.email && (
                            <button className="email-action" title="Send email">
                              ✉️
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="phone-cell">
                          <span>{customer.phone || '—'}</span>
                          {customer.phone && (
                            <button className="phone-action" title="Call">
                              📞
                            </button>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="address-cell" title={customer.address}>
                          {customer.address || '—'}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            onClick={() => navigate(`/customer/${customer.id}`)}
                            title="View Details"
                          >
                            👁️
                          </button>
                          <button
                            className="action-btn edit"
                            onClick={() => navigate(`/edit-customer/${customer.id}`)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => handleDelete(customer.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                          <button
                            className="action-btn invoice"
                            onClick={() => navigate(`/create-invoice?customer=${customer.id}`)}
                            title="Create Invoice"
                          >
                            📄
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-content">
                        <span className="empty-icon">👥</span>
                        <h3>No customers found</h3>
                        <p>{searchTerm ? "Try adjusting your search" : "Get started by adding your first customer"}</p>
                        {!searchTerm && (
                          <button className="btn btn-primary" onClick={() => navigate("/addCustomer")}>
                            Add Customer
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {sortedCustomers.length > 0 && (
            <div className="pagination">
              <div className="pagination-info">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, sortedCustomers.length)} of{" "}
                {sortedCustomers.length} results
              </div>
              
              <div className="pagination-controls">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  ←
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
                
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}