// components/Layout.jsx
import { useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const location = useLocation();
  
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <>{children}</>;
  }

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container">
          <span className="navbar-brand fw-bold">Invoice SaaS</span>
        </div>
      </nav>
      <div className="bg-light min-vh-100 py-4">
        {children}
      </div>
    </>
  );
}