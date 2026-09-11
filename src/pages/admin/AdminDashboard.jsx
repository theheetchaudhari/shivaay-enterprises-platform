import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  Users,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabase';

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: 'easeOut' },
  }),
};

// ─── Quick-action cards (placeholders) ───────────────────────────────────────
const quickActions = [
  {
    id: 'qa-products',
    title: 'Manage Products',
    description: 'Add, edit, or remove products from your catalogue.',
    icon: Package,
    tag: 'Active',
  },
  {
    id: 'qa-analytics',
    title: 'View Analytics',
    description: 'Track performance, traffic, and sales metrics.',
    icon: TrendingUp,
    tag: 'Coming Soon',
  },
  {
    id: 'qa-customers',
    title: 'Customer List',
    description: 'Browse and manage your registered customers.',
    icon: Users,
    tag: 'Active',
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({ card, index }) {
  const Icon = card.icon;
  return (
    <motion.div
      id={card.id}
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-[12px] ${card.iconBg} flex items-center justify-center`}>
          <Icon size={22} className={card.iconColor} />
        </div>
      </div>
      <div>
        <p className="text-[13px] text-[#6B7280] font-medium mb-1">{card.label}</p>
        <p className="text-[32px] font-bold text-[#0F172A] leading-none">{card.value}</p>
        <p className="text-[12px] text-[#9CA3AF] mt-2">{card.note}</p>
      </div>
    </motion.div>
  );
}

function QuickActionCard({ card, index }) {
  const Icon = card.icon;
  return (
    <motion.div
      id={card.id}
      variants={fadeUp}
      custom={index + 4} // adjust index for staggered animation
      initial="hidden"
      animate="visible"
      className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] flex items-center justify-center">
          <Icon size={20} className="text-[#0F172A]" />
        </div>
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${card.tag === 'Active' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#6B7280]'}`}>
          {card.tag}
        </span>
      </div>
      <h3 className="text-[15px] font-bold text-[#0F172A] mb-1">{card.title}</h3>
      <p className="text-[13px] text-[#6B7280] leading-relaxed">{card.description}</p>
    </motion.div>
  );
}

function formatDate(isoString) {
  if (!isoString) return 'N/A';
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
}

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: '—',
    activeProducts: '—',
    totalCustomers: '—',
  });
  const [customers, setCustomers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const fetchStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      // Total Products
      const { count: totalProducts, error: err1 } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      // Active Products
      const { count: activeProducts, error: err2 } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
        
      // Total Customers
      const { count: totalCustomers, error: err3 } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });
        
      if (!err1 && !err2 && !err3) {
        setStats({
          totalProducts: totalProducts ?? 0,
          activeProducts: activeProducts ?? 0,
          totalCustomers: totalCustomers ?? 0
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoadingCustomers(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*, customer_addresses(*)')
        .order('created_at', { ascending: false })
        .range(page * itemsPerPage, (page + 1) * itemsPerPage - 1);
        
      if (error) throw error;
      setCustomers(data || []);
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomers();
  }, [fetchCustomers]);

  const dynamicStatCards = [
    {
      id: 'stat-products',
      label: 'Total Products',
      value: loadingStats ? '...' : stats.totalProducts,
      icon: Package,
      iconBg: 'bg-[#EFF6FF]',
      iconColor: 'text-[#2563EB]',
      note: 'Total products in catalogue',
    },
    {
      id: 'stat-active-products',
      label: 'Active Products',
      value: loadingStats ? '...' : stats.activeProducts,
      icon: TrendingUp,
      iconBg: 'bg-[#F0FDF4]',
      iconColor: 'text-[#16A34A]',
      note: 'Products visible to customers',
    },
    {
      id: 'stat-customers',
      label: 'Total Customers',
      value: loadingStats ? '...' : stats.totalCustomers,
      icon: Users,
      iconBg: 'bg-[#FFF7ED]',
      iconColor: 'text-[#EA580C]',
      note: 'Registered customer accounts',
    },
  ];

  return (
    <AdminLayout pageTitle="Dashboard">

      {/* Welcome banner */}
      <motion.div
        id="admin-welcome-banner"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] rounded-[20px] p-6 sm:p-8 mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 overflow-hidden relative"
      >
        {/* Subtle decorative circle */}
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#DC2626]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-24 w-32 h-32 bg-[#3b82f6]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative">
          <p className="text-[13px] font-semibold text-[#DC2626] mb-1 uppercase tracking-wider">
            Admin Portal
          </p>
          <h2 className="text-[26px] sm:text-[30px] font-heading font-bold text-white leading-tight mb-2">
            Welcome back, Admin 👋
          </h2>
          <p className="text-[14px] sm:text-[15px] text-[#94a3b8] max-w-[500px] leading-relaxed">
            You're signed in to the Shivaay Enterprises admin panel. Use the sidebar
            to navigate. Additional management tools will appear here as they become available.
          </p>
        </div>

        <div className="relative shrink-0">
          <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-[12px] px-4 py-2.5 text-white text-[13px] font-medium">
            <ArrowUpRight size={16} className="text-[#DC2626]" />
            Panel v2.0
          </div>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div className="mb-6">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-[13px] font-semibold uppercase tracking-widest text-[#6B7280] mb-4"
        >
          Overview
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {dynamicStatCards.map((card, i) => (
            <StatCard key={card.id} card={card} index={i + 2} />
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div id="admin-quick-actions" className="mb-8 mt-12">
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={7}
          className="text-[13px] font-semibold uppercase tracking-widest text-[#6B7280] mb-4"
        >
          Quick Actions
        </motion.p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((card, i) => (
            <QuickActionCard key={card.id} card={card} index={i} />
          ))}
        </div>
      </div>

      {/* Customer Management */}
      <div id="admin-customers" className="mb-8 mt-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={8}
          className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
            <div>
              <h3 className="text-[18px] font-bold text-[#0F172A]">Customer Management</h3>
              <p className="text-[13px] text-[#64748B]">View registered customers and their delivery addresses.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0 || loadingCustomers}
                className="w-8 h-8 rounded-md border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[13px] font-medium text-[#0F172A]">Page {page + 1}</span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={customers.length < itemsPerPage || loadingCustomers}
                className="w-8 h-8 rounded-md border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="p-0 overflow-x-auto">
            {loadingCustomers ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <Loader2 size={32} className="animate-spin text-[#0F172A]" />
                <p className="text-[14px] text-[#64748B]">Loading customers...</p>
              </div>
            ) : customers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
                  <Users size={24} className="text-[#94A3B8]" />
                </div>
                <p className="text-[15px] font-semibold text-[#0F172A] mb-1">No customers found</p>
                <p className="text-[13px] text-[#64748B]">There are no registered customers to display on this page.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-[12px] font-bold text-[#64748B] uppercase tracking-wider">Delivery Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E7EB]">
                  {customers.map((cust) => {
                    // Extract address securely
                    const addrArr = cust.customer_addresses;
                    const addr = Array.isArray(addrArr) ? addrArr[0] : addrArr;
                                 
                    return (
                      <tr key={cust.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-[14px] font-semibold text-[#0F172A]">{cust.full_name || 'N/A'}</p>
                          <p className="text-[12px] text-[#64748B] mt-0.5 font-mono">{cust.id.substring(0,8)}...</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[13px] text-[#0F172A] mb-1">{cust.email}</p>
                          <p className="text-[13px] text-[#64748B]">{cust.phone || 'No phone'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-[13px] text-[#0F172A]">{formatDate(cust.created_at)}</p>
                        </td>
                        <td className="px-6 py-4">
                          {addr ? (
                            <div>
                              <p className="text-[13px] text-[#0F172A] leading-relaxed max-w-[280px]">
                                {addr.address_line_1}
                                {addr.address_line_2 ? `, ${addr.address_line_2}` : ''}
                                <br />
                                {addr.area}, {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              {addr.latitude && addr.longitude && (
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${addr.latitude},${addr.longitude}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#4338CA] hover:text-[#312E81] mt-2 group"
                                >
                                  <MapPin size={12} />
                                  Open in Maps
                                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
                                </a>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F1F5F9] text-[#64748B] text-[12px] font-medium">
                              No address saved
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;
