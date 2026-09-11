import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  TrendingUp,
  Users,
  ArrowUpRight,
  Loader2,
  MapPin,
  ArrowRight,
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

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProducts: '—',
    activeProducts: '—',
    totalCustomers: '—',
  });
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

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
        .select('id, full_name, email, phone, created_at, customer_addresses(area, city)')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      setRecentCustomers(data || []);
    } catch (err) {
      console.error('Error fetching recent customers:', err);
    } finally {
      setLoadingCustomers(false);
    }
  }, []);

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

      {/* Recent Customers */}
      <div id="admin-customers" className="mb-8 mt-12">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={8}
          className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
            <div>
              <h3 className="text-[16px] font-bold text-[#0F172A]">Recent Customers</h3>
              <p className="text-[12px] text-[#64748B] mt-0.5">Last 5 registered accounts</p>
            </div>
            <button
              id="dashboard-view-all-customers-btn"
              onClick={() => navigate('/admin/customers')}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F172A] hover:text-[#DC2626] transition-colors group"
              aria-label="View all customers"
            >
              View All
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Body */}
          {loadingCustomers ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <Loader2 size={24} className="animate-spin text-[#0F172A]" />
              <p className="text-[13px] text-[#64748B]">Loading customers…</p>
            </div>
          ) : recentCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-3">
                <Users size={20} className="text-[#94A3B8]" />
              </div>
              <p className="text-[14px] font-semibold text-[#0F172A] mb-1">No customers yet</p>
              <p className="text-[12px] text-[#64748B]">Customers will appear here once they register.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {recentCustomers.map((cust) => {
                const addr = Array.isArray(cust.customer_addresses)
                  ? cust.customer_addresses[0]
                  : cust.customer_addresses;
                const cityArea = addr
                  ? [addr.area, addr.city].filter(Boolean).join(', ')
                  : null;
                return (
                  <div
                    key={cust.id}
                    className="flex items-center justify-between px-6 py-3.5 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-white">
                          {cust.full_name
                            ? cust.full_name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
                            : '?'}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0F172A] truncate">
                          {cust.full_name || '—'}
                        </p>
                        <p className="text-[11px] text-[#6B7280] truncate">
                          {cityArea ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin size={10} />
                              {cityArea}
                            </span>
                          ) : (
                            cust.email || '—'
                          )}
                        </p>
                      </div>
                    </div>
                    <button
                      id={`dashboard-customer-view-${cust.id}`}
                      onClick={() => navigate(`/admin/customers/${cust.id}`)}
                      className="shrink-0 ml-3 text-[12px] font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
                      aria-label={`View ${cust.full_name}`}
                    >
                      View →
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Footer CTA */}
          {!loadingCustomers && recentCustomers.length > 0 && (
            <div className="px-6 py-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
              <button
                id="dashboard-customers-cta"
                onClick={() => navigate('/admin/customers')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-[10px] border border-[#E5E7EB] text-[13px] font-semibold text-[#0F172A] hover:bg-white hover:shadow-sm transition-all duration-200 group"
                aria-label="View all registered customers"
              >
                <Users size={15} />
                View All Customers
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          )}
        </motion.div>
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;
