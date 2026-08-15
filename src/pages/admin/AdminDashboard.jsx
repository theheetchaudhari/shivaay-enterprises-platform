import React from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  TrendingUp,
  Users,
  ShoppingBag,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.08, ease: 'easeOut' },
  }),
};

// ─── Stat card data (UI placeholders — no data fetching) ─────────────────────
const statCards = [
  {
    id: 'stat-products',
    label: 'Total Products',
    value: '—',
    icon: Package,
    iconBg: 'bg-[#EFF6FF]',
    iconColor: 'text-[#2563EB]',
    note: 'Product data not loaded yet',
  },
  {
    id: 'stat-revenue',
    label: 'Monthly Revenue',
    value: '—',
    icon: TrendingUp,
    iconBg: 'bg-[#F0FDF4]',
    iconColor: 'text-[#16A34A]',
    note: 'Revenue tracking coming soon',
  },
  {
    id: 'stat-customers',
    label: 'Customers',
    value: '—',
    icon: Users,
    iconBg: 'bg-[#FFF7ED]',
    iconColor: 'text-[#EA580C]',
    note: 'Customer data coming soon',
  },
  {
    id: 'stat-orders',
    label: 'Orders',
    value: '—',
    icon: ShoppingBag,
    iconBg: 'bg-[#FDF2F8]',
    iconColor: 'text-[#9333EA]',
    note: 'Order tracking coming soon',
  },
];

// ─── Quick-action cards (placeholders) ───────────────────────────────────────
const quickActions = [
  {
    id: 'qa-products',
    title: 'Manage Products',
    description: 'Add, edit, or remove products from your catalogue.',
    icon: Package,
    tag: 'Coming Soon',
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
    tag: 'Coming Soon',
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
        <span className="text-[12px] font-medium text-[#9CA3AF] flex items-center gap-1">
          <Info size={12} />
          Placeholder
        </span>
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
      custom={index + statCards.length}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-[16px] border border-[#E5E7EB] p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group cursor-default"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-[10px] bg-[#F1F5F9] flex items-center justify-center">
          <Icon size={20} className="text-[#0F172A]" />
        </div>
        <span className="text-[11px] font-semibold bg-[#F1F5F9] text-[#6B7280] px-2.5 py-1 rounded-full">
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
            Panel v1.0
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card, i) => (
            <StatCard key={card.id} card={card} index={i + 2} />
          ))}
        </div>
      </div>

      {/* Notice banner */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={6}
        className="flex items-start gap-3 bg-[#FFF7ED] border border-[#FED7AA] rounded-[12px] px-4 py-3 mb-6 sm:mb-8"
        id="admin-placeholder-notice"
      >
        <Info size={18} className="text-[#EA580C] shrink-0 mt-0.5" />
        <p className="text-[13px] text-[#92400e] leading-relaxed">
          <span className="font-semibold">UI Placeholders:</span> The stat cards above
          display placeholder values only. No product, order, or customer data is loaded at this stage.
        </p>
      </motion.div>

      {/* Quick actions */}
      <div id="admin-quick-actions">
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

    </AdminLayout>
  );
};

export default AdminDashboard;
