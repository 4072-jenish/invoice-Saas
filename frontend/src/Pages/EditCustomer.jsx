import { useState, useEffect } from "react";
import API from "../Utils/axios";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/AddCustomer.css";

export default function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

useEffect(() => {
  const fetchCustomer = async () => {
    try {
      const { data } = await API.get(`/customer/getCustomer/${id}`);
      console.log("Customer API Response:", data);

      const customerData = Array.isArray(data) ? data[0] : data;

      setFormData({
        name: customerData?.name || "",
        phone: customerData?.phone || "",
        email: customerData?.email || "",
      });

    } catch (error) {
      alert("Failed to load customer");
      navigate("/all-customer");
    } finally {
      setIsLoading(false);
    }
  };

  fetchCustomer();
}, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Customer name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await API.put(`/customer/editCustomer/${id}`, formData);

      alert("Customer Updated Successfully 🚀");
      navigate("/all-customer");
    } catch (error) {
      alert(error.response?.data?.message || "Error updating customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="add-customer-container">
        <h2 style={{ textAlign: "center", marginTop: "200px" }}>
          Loading Customer...
        </h2>
      </div>
    );
  }

  return (
    <div className="add-customer-container">
      <div className="content-wrapper">
        <header className="page-header">
          <h1 className="page-title">
            <span className="title-gradient">Edit</span>
            <span className="title-gradient-alt">Customer</span>
          </h1>
        </header>

        <div className="form-card">
          <div className="card-body">

            <div className="field-group">
              <label>Name *</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <span>{errors.name}</span>}
            </div>

            <div className="field-group">
              <label>Email *</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span>{errors.email}</span>}
            </div>

            <div className="field-group">
              <label>Phone</label>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="card-footer">
              <button className="btn btn-secondary" onClick={() => navigate("/customers")}>
                Cancel
              </button>

              <button
                className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Customer"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}