import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: LayoutDashboard,
    id: 'sidebar-nav-dashboard',
  },
  {
    label: 'Products',
    to: '/admin/products',
    icon: Package,
    id: 'sidebar-nav-products',
  },
];

// Reusable nav link with active highlight
function SidebarNavItem({ item, onClick }) {
  const Icon = item.icon;

  if (item.disabled) {
    return (
      <div
        id={item.id}
        className="flex items-center gap-3 px-4 py-3 rounded-[12px] text-[#64748b] cursor-not-allowed select-none"
        title="Coming soon"
      >
        <Icon size={20} className="shrink-0" />
        <span className="text-[15px] font-medium">{item.label}</span>
        <span className="ml-auto text-[11px] font-semibold bg-[#1e293b] text-[#64748b] px-2 py-0.5 rounded-full">
          Soon
        </span>
      </div>
    );
  }

  return (
    <NavLink
      id={item.id}
      to={item.to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-[12px] transition-all duration-200 ${
          isActive
            ? 'bg-[#DC2626] text-white shadow-sm'
            : 'text-[#94a3b8] hover:bg-[#1e293b] hover:text-white'
        }`
      }
    >
      <Icon size={20} className="shrink-0" />
      <span className="text-[15px] font-medium">{item.label}</span>
    </NavLink>
  );
}

// The actual sidebar panel content (shared between desktop and mobile drawer)
export function SidebarContent({ onClose, onLogout }) {
  return (
    <div className="flex flex-col h-full">
      {/* Branding */}
      <div className="px-5 pt-6 pb-5 border-b border-[#1e293b]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#DC2626]/20 border border-[#DC2626]/30">
              <ShieldCheck size={18} className="text-[#DC2626]" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">
                Shivaay Enterprises
              </p>
              <p className="text-[11px] text-[#64748b] leading-tight mt-0.5">
                Admin Panel
              </p>
            </div>
          </div>
          {/* Close button — only on mobile */}
          {onClose && (
            <button
              id="sidebar-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#64748b] hover:text-white hover:bg-[#1e293b] transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="px-4 mb-3 text-[11px] font-semibold uppercase tracking-widest text-[#475569]">
          Menu
        </p>
        {navItems.map((item) => (
          <SidebarNavItem key={item.id} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6 border-t border-[#1e293b] pt-4">
        <motion.button
          id="sidebar-logout-btn"
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-[#94a3b8] hover:bg-[#DC2626]/10 hover:text-[#DC2626] transition-all duration-200"
        >
          <LogOut size={20} className="shrink-0" />
          <span className="text-[15px] font-medium">Logout</span>
        </motion.button>
      </div>
    </div>
  );
}

// Mobile overlay drawer
function MobileDrawer({ open, onClose, onLogout }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Drawer panel */}
          <motion.aside
            key="drawer"
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-[270px] bg-[#0F172A] z-50 shadow-2xl lg:hidden"
            aria-label="Mobile navigation"
          >
            <SidebarContent onClose={onClose} onLogout={onLogout} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Main export — handles both desktop fixed sidebar and mobile drawer
const AdminSidebar = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside
        id="admin-sidebar-desktop"
        className="hidden lg:flex flex-col w-[240px] shrink-0 bg-[#0F172A] h-screen sticky top-0"
        aria-label="Admin navigation"
      >
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* Mobile drawer */}
      <MobileDrawer
        open={mobileOpen}
        onClose={onMobileClose}
        onLogout={handleLogout}
      />
    </>
  );
};

export default AdminSidebar;
