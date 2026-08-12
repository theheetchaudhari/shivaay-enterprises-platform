import React, { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import AdminSidebar from '../components/admin/AdminSidebar';

/**
 * AdminLayout
 * Wraps admin pages with the shared sidebar + topbar shell.
 * Usage: <AdminLayout><YourPageContent /></AdminLayout>
 */
const AdminLayout = ({ children, pageTitle = 'Dashboard' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex">
      {/* Sidebar (desktop fixed + mobile drawer) */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header bar */}
        <header
          id="admin-topbar"
          className="sticky top-0 z-30 flex items-center justify-between h-[64px] px-4 sm:px-6 bg-white border-b border-[#E5E7EB] shadow-sm"
        >
          {/* Left: hamburger (mobile) + page title */}
          <div className="flex items-center gap-3">
            <button
              id="admin-mobile-menu-btn"
              className="lg:hidden p-2 rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-[17px] font-bold text-[#0F172A] leading-tight">
                {pageTitle}
              </h1>
              <p className="text-[12px] text-[#6B7280] leading-tight hidden sm:block">
                Shivaay Enterprises — Admin
              </p>
            </div>
          </div>

          {/* Right: notification placeholder + avatar */}
          <div className="flex items-center gap-2">
            <button
              id="admin-notifications-btn"
              className="p-2 rounded-[10px] text-[#6B7280] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors relative"
              aria-label="Notifications"
              title="Notifications (coming soon)"
            >
              <Bell size={20} />
            </button>

            {/* Admin avatar initials */}
            <div
              id="admin-avatar"
              className="w-9 h-9 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0"
              title="Admin"
            >
              <span className="text-[13px] font-bold text-white">A</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
