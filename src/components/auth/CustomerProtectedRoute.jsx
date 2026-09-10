import { Navigate, useLocation } from 'react-router-dom';
import { useCustomerAuth } from '../../context/CustomerAuthContext';
import { Loader2 } from 'lucide-react';

export default function CustomerProtectedRoute({ children }) {
  const { session, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#0F172A]" size={32} />
        <p className="text-[14px] text-[#64748B] font-medium">Verifying session...</p>
      </div>
    );
  }

  // If no session exists, redirect to login page.
  // Save the attempted URL to redirect back after login.
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authorized
  return children;
}
