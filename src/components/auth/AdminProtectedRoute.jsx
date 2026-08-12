import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2, AlertTriangle } from 'lucide-react';

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          setDebugMsg(error.message);
          setIsAdmin(false);
        } else if (profile && profile.role === 'admin') {
          setIsAdmin(true);
        } else {
          setDebugMsg(`Profile found: ${profile ? 'Yes' : 'No'}. Role: ${profile?.role || 'N/A'}`);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setDebugMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-[#FFFFFF]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white px-4 text-center">
        <AlertTriangle size={48} className="text-[#DC2626] mb-4" />
        <h2 className="text-[24px] font-bold text-[#FFFFFF] mb-2">Access Denied</h2>
        <p className="text-[#9CA3AF] mb-2">You do not have administrator privileges to view this page.</p>
        <div className="bg-[#1e293b] text-left p-4 rounded-lg border border-[#334155] mb-6 max-w-lg w-full">
          <p className="text-sm font-mono text-red-400">Debug Info: {debugMsg}</p>
        </div>
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            window.location.href = '/admin/login';
          }}
          className="bg-[#FFFFFF] text-[#0F172A] px-6 py-3 rounded-[12px] font-semibold hover:bg-[#F1F5F9] transition-colors"
        >
          Sign Out & Return to Login
        </button>
      </div>
    );
  }

  return children;
};

export default AdminProtectedRoute;
