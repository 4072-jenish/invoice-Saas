// Pages/CreateInvoice.jsx
import { useEffect, useState } from "react";
import API from "../Utils/axios";
import { useNavigate } from "react-router-dom";
import "../Styles/CreateInvoice.css";

export default function CreateInvoice() {
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [items, setItems] = useState([
    { productName: "", quantity: 1, price: 0, gstPercent: 0 }
  ]);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    API.get("/customer/allCustomer")
      .then(res => setCustomers(res.data))
      .catch(() => alert("Failed to load customers"));
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    c.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([
      ...items,
      { productName: "", quantity: 1, price: 0, gstPercent: 0 }
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const updated = items.filter((_, i) => i !== index);
      setItems(updated);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  const calculateGST = () => {
    return items.reduce((sum, item) => {
      const itemTotal = item.quantity * item.price;
      return sum + (itemTotal * (item.gstPercent / 100));
    }, 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateGST();
  };

  const handleSubmit = async () => {
    if (!customerId) {
      alert("Please select a customer");
      return;
    }

    if (items.some(item => !item.productName || item.price <= 0)) {
      alert("Please fill all item details correctly");
      return;
    }

    try {
      await API.post("/invoice/creatInvoice", {
        customerId,
        items,
        invoiceDate,
        dueDate,
        subtotal: calculateSubtotal(),
        gstTotal: calculateGST(),
        total: calculateTotal()
      });

      alert("Invoice Created Successfully 🔥");
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating invoice");
    }
  };

  const selectedCustomer = customers.find(c => c.id === customerId);

  return (
    <div className="invoice-create-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orbs-1"></div>
        <div className="gradient-orb orbs-2"></div>
        <div className="gradient-orb orbs-3"></div>
      </div>

      <div className="content-wrapper">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <span className="title-gradient">Create New</span>
              <span className="title-gradient-alt">Invoice</span>
            </h1>
            <p className="page-subtitle">Fill in the details to generate a professional invoice</p>
          </div>
          <button className="cancel-btn" onClick={() => navigate("/dashboard")}>
            <span className="btn-icon">←</span>
            <span>Cancel</span>
          </button>
        </div>

        <div className="invoice-form">
          {/* Left Column - Customer & Details */}
          <div className="form-left">
            {/* Customer Selection */}
            <div className="form-section customer-section">
              <div className="section-header">
                <span className="section-icon">👤</span>
                <h2>Customer Details</h2>
              </div>

              {!selectedCustomer ? (
                <div className="customer-selector">
                  <div className="search-box">
                    <span className="search-icon">🔍</span>
                    <input
                      type="text"
                      placeholder="Search customer by name or email..."
                      value={customerSearch}
                      onChange={(e) => {
                        setCustomerSearch(e.target.value);
                        setShowCustomerDropdown(true);
                      }}
                      onFocus={() => setShowCustomerDropdown(true)}
                    />
                  </div>
                  
                  {showCustomerDropdown && filteredCustomers.length > 0 && (
                    <div className="customer-dropdown">
                      {filteredCustomers.map(c => (
                        <div
                          key={c.id}
                          className="customer-item"
                          onClick={() => {
                            setCustomerId(c.id);
                            setCustomerSearch(c.name);
                            setShowCustomerDropdown(false);
                          }}
                        >
                          <div className="customer-avatar">
                            {c.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="customer-info">
                            <span className="customer-name">{c.name}</span>
                            <span className="customer-email">{c.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button 
                    className="new-customer-btn"
                    onClick={() => navigate("/addCustomer")}
                  >
                    <span className="btn-icon">+</span>
                    Add New Customer
                  </button>
                </div>
              ) : (
                <div className="selected-customer">
                  <div className="customer-card">
                    <div className="customer-avatar large">
                      {selectedCustomer.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="customer-details">
                      <h3>{selectedCustomer.name}</h3>
                      <p>{selectedCustomer.email}</p>
                      <p>{selectedCustomer.phone}</p>
                      <p>{selectedCustomer.address}</p>
                    </div>
                    <button 
                      className="change-customer-btn"
                      onClick={() => {
                        setCustomerId("");
                        setCustomerSearch("");
                      }}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Invoice Dates */}
            <div className="form-section dates-section">
              <div className="section-header">
                <span className="section-icon">📅</span>
                <h2>Invoice Details</h2>
              </div>

              <div className="dates-grid">
                <div className="date-field">
                  <label>Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="date-input"
                  />
                </div>
                <div className="date-field">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="form-section notes-section">
              <div className="section-header">
                <span className="section-icon">📝</span>
                <h2>Notes</h2>
              </div>
              <textarea
                className="notes-input"
                placeholder="Add any additional notes or payment instructions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="4"
              />
            </div>
          </div>

          {/* Right Column - Items */}
          <div className="form-right">
            <div className="form-section items-section">
              <div className="section-header">
                <span className="section-icon">🛒</span>
                <h2>Invoice Items</h2>
                <button className="add-item-btn" onClick={addItem}>
                  <span className="btn-icon">+</span>
                  Add Item
                </button>
              </div>

              <div className="items-container">
                {/* Items Header */}
                <div className="items-header">
                  <div className="col-product">Product</div>
                  <div className="col-qty">Qty</div>
                  <div className="col-price">Price</div>
                  <div className="col-gst">GST %</div>
                  <div className="col-total">Total</div>
                  <div className="col-action"></div>
                </div>

                {/* Items List */}
                {items.map((item, index) => {
                  const itemTotal = item.quantity * item.price;
                  const gstAmount = itemTotal * (item.gstPercent / 100);
                  const lineTotal = itemTotal + gstAmount;

                  return (
                    <div key={index} className="item-row">
                      <div className="col-product">
                        <input
                          type="text"
                          className="item-input"
                          placeholder="Product name"
                          value={item.productName}
                          onChange={(e) =>
                            handleItemChange(index, "productName", e.target.value)
                          }
                        />
                      </div>
                      <div className="col-qty">
                        <input
                          type="number"
                          className="item-input number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, "quantity", Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="col-price">
                        <input
                          type="number"
                          className="item-input number"
                          min="0"
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(index, "price", Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="col-gst">
                        <input
                          type="number"
                          className="item-input number"
                          min="0"
                          max="100"
                          value={item.gstPercent}
                          onChange={(e) =>
                            handleItemChange(index, "gstPercent", Number(e.target.value))
                          }
                        />
                      </div>
                      <div className="col-total">
                        <span className="line-total">
                          ₹{lineTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="col-action">
                        {items.length > 1 && (
                          <button
                            className="remove-item-btn"
                            onClick={() => removeItem(index)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Invoice Summary */}
              <div className="invoice-summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>GST Total:</span>
                  <span>₹{calculateGST().toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button className="preview-btn">
                  <span className="btn-icon">👁️</span>
                  Preview
                </button>
                <button className="generate-btn" onClick={handleSubmit}>
                  <span className="btn-icon">⚡</span>
                  Generate Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}