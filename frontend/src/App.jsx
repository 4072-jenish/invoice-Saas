// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Components/Layout";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import CreateInvoice from "./Pages/CreateInvoice";
import AddCustomer from "./Pages/AddCustomers";
import AllCustomers from "./Pages/AllCustomers";
// import Invoices from "./Pages/Invoices";
// import Customers from "./Pages/Customers";
// import Settings from "./Pages/Settings";

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route wrapper (for login/register when already logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            
              <Dashboard />
            
          </ProtectedRoute>
        } />
        
        <Route path="/create-invoice" element={
          <ProtectedRoute>
            
              <CreateInvoice />
            
          </ProtectedRoute>
        } />
        
        <Route path="/edit-invoice/:id" element={
          <ProtectedRoute>
            
              <CreateInvoice />
            
          </ProtectedRoute>
        } />
        
        <Route path="/add-customer" element={
          <ProtectedRoute>
            
              <AddCustomer />
            
          </ProtectedRoute>
        } />
        
        <Route path="/all-customer" element={
          <ProtectedRoute>
            
              <AllCustomers />
            
          </ProtectedRoute>
        } />
        
      </Routes>
    </Router>
  );
}

export default App;