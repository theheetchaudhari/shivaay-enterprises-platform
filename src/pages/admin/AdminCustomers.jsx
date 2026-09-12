import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  AlertTriangle,
  Search,
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
    transition: { duration: 0.35, delay: i * 0.06, ease: 'easeOut' },
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ─── Customer Avatar ──────────────────────────────────────────────────────────
function CustomerAvatar({ name }) {
  const initials = getInitials(name);
  return (
    <div className="w-9 h-9 rounded-full bg-[#0F172A] flex items-center justify-center shrink-0">
      <span className="text-[12px] font-bold text-white">{initials}</span>
    </div>
  );
}

// ─── Desktop Table Row ────────────────────────────────────────────────────────
function CustomerTableRow({ customer, onView }) {
  const addr = Array.isArray(customer.customer_addresses)
    ? customer.customer_addresses[0]
    : customer.customer_addresses;

  return (
    <tr className="hover:bg-[#F8FAFC] transition-colors group">
      {/* Customer */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <CustomerAvatar name={customer.full_name} />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#0F172A] truncate">
              {customer.full_name || '—'}
            </p>
            <p className="text-[11px] text-[#94A3B8] font-mono mt-0.5">
              {customer.id.substring(0, 8)}…
            </p>
          </div>
        </div>
      </td>

      {/* Contact */}
      <td className="px-5 py-4">
        <p className="text-[13px] text-[#0F172A] mb-0.5 truncate max-w-[200px]">
          {customer.email || '—'}
        </p>
        <p className="text-[12px] text-[#6B7280]">
          {customer.phone || 'No phone'}
        </p>
      </td>

      {/* City / Area */}
      <td className="px-5 py-4">
        {addr ? (
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-[#94A3B8] shrink-0" />
            <span className="text-[13px] text-[#0F172A] truncate max-w-[140px]">
              {[addr.area, addr.city].filter(Boolean).join(', ') || '—'}
            </span>
          </div>
        ) : (
          <span className="text-[12px] text-[#94A3B8]">No address</span>
        )}
      </td>

      {/* Address status */}
      <td className="px-5 py-4">
        {addr ? (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A]">
            Saved
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-[#F1F5F9] text-[#94A3B8]">
            Not set
          </span>
        )}
      </td>

      {/* Joined */}
      <td className="px-5 py-4">
        <p className="text-[13px] text-[#0F172A]">{formatDate(customer.created_at)}</p>
      </td>

      {/* Action */}
      <td className="px-5 py-4">
        <button
          id={`customer-view-${customer.id}`}
          onClick={() => onView(customer.id)}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F172A] hover:text-[#DC2626] transition-colors group/btn"
          aria-label={`View details for ${customer.full_name}`}
        >
          View
          <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-0.5" />
        </button>
      </td>
    </tr>
  );
}

// ─── Mobile Customer Card ─────────────────────────────────────────────────────
function CustomerCard({ customer, index, onView }) {
  const addr = Array.isArray(customer.customer_addresses)
    ? customer.customer_addresses[0]
    : customer.customer_addresses;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="bg-white border border-[#E5E7EB] rounded-[16px] p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CustomerAvatar name={customer.full_name} />
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#0F172A] truncate">
              {customer.full_name || '—'}
            </p>
            <p className="text-[12px] text-[#6B7280] truncate">{customer.email || '—'}</p>
          </div>
        </div>
        <button
          id={`customer-card-view-${customer.id}`}
          onClick={() => onView(customer.id)}
          className="shrink-0 flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[#0F172A] hover:bg-[#1e293b] px-3 py-1.5 rounded-[8px] transition-colors"
          aria-label={`View details for ${customer.full_name}`}
        >
          View
          <ArrowRight size={13} />
        </button>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-2">
        <div>
          <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide font-semibold mb-0.5">Phone</p>
          <p className="text-[13px] text-[#0F172A]">{customer.phone || '—'}</p>
        </div>
        <div>
          <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide font-semibold mb-0.5">City</p>
          <p className="text-[13px] text-[#0F172A]">
            {addr ? [addr.area, addr.city].filter(Boolean).join(', ') || '—' : '—'}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide font-semibold mb-0.5">Address</p>
          <span className={`text-[12px] font-medium px-2 py-0.5 rounded-full ${addr ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
            {addr ? 'Saved' : 'Not set'}
          </span>
        </div>
        <div>
          <p className="text-[11px] text-[#94A3B8] uppercase tracking-wide font-semibold mb-0.5">Joined</p>
          <p className="text-[13px] text-[#0F172A]">{formatDate(customer.created_at)}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Loader2 size={32} className="animate-spin text-[#0F172A]" />
      <p className="text-[14px] text-[#64748B]">Loading customers…</p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
        <Users size={26} className="text-[#94A3B8]" />
      </div>
      <p className="text-[16px] font-bold text-[#0F172A] mb-1">No customers yet</p>
      <p className="text-[13px] text-[#64748B] max-w-[300px]">
        Customers will appear here once they register on the platform.
      </p>
    </div>
  );
}

// ─── Search Empty state ───────────────────────────────────────────────────────
function SearchEmptyState({ searchQuery, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-16 h-16 rounded-[20px] bg-[#F1F5F9] flex items-center justify-center mb-5">
        <Search size={30} className="text-[#94A3B8]" />
      </div>
      <p className="text-[16px] font-bold text-[#0F172A] mb-2">No results found</p>
      <p className="text-[13px] text-[#64748B] mb-5 max-w-[300px]">
        We couldn't find any customers matching "{searchQuery}".
      </p>
      <button
        onClick={onClear}
        className="text-[13px] font-semibold text-[#0F172A] hover:text-[#334155] underline underline-offset-4"
      >
        Clear search
      </button>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
        <AlertTriangle size={26} className="text-[#DC2626]" />
      </div>
      <p className="text-[16px] font-bold text-[#0F172A] mb-1">Failed to load customers</p>
      <p className="text-[13px] text-[#64748B] mb-4 max-w-[300px]">
        There was a problem fetching customer data. Please try again.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-[#0F172A] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1e293b] transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 10;

const AdminCustomers = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get total count first
      const { count } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true });

      // Fetch paginated customer list with addresses
      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('*, customer_addresses(*)')
        .order('created_at', { ascending: false })
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

      if (fetchError) throw fetchError;

      setCustomers(data || []);
      setTotalCount(count ?? 0);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomers();
  }, [fetchCustomers]);

  const handleView = (id) => navigate(`/admin/customers/${id}`);
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // ── Derived State ─────────────────────────────────────────────────────────
  const filteredCustomers = customers.filter(customer => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      (customer.full_name && customer.full_name.toLowerCase().includes(query)) ||
      (customer.email && customer.email.toLowerCase().includes(query)) ||
      (customer.phone && customer.phone.toLowerCase().includes(query))
    );
  });

  return (
    <AdminLayout pageTitle="Customers">
      {/* Page header */}
      <motion.div
        id="admin-customers-header"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="mb-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-[24px] font-heading font-bold text-[#0F172A] leading-tight">
              Customer List
            </h2>
            <p className="text-[13px] text-[#6B7280] mt-0.5">
              {loading ? 'Loading…' : `${totalCount} registered customer${totalCount !== 1 ? 's' : ''}`}
            </p>
          </div>
          {customers.length > 0 && (
            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-[#E5E7EB] rounded-[12px] text-[14px] text-[#0F172A] placeholder-[#9CA3AF] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-colors shadow-sm"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Main card */}
      <motion.div
        id="admin-customers-table-card"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={1}
        className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm overflow-hidden"
      >
        {/* Card header */}
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between bg-[#F8FAFC]">
          <p className="text-[13px] font-semibold text-[#0F172A]">All Customers</p>
          {/* Pagination controls */}
          {!loading && totalCount > 0 && (
            <div className="flex items-center gap-2">
              <button
                id="customers-prev-page"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-8 h-8 rounded-md border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[12px] font-medium text-[#0F172A] min-w-[70px] text-center">
                {page + 1} / {totalPages || 1}
              </span>
              <button
                id="customers-next-page"
                onClick={() => setPage((p) => p + 1)}
                disabled={customers.length < ITEMS_PER_PAGE || (page + 1) >= totalPages}
                className="w-8 h-8 rounded-md border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState onRetry={fetchCustomers} />
        ) : customers.length === 0 ? (
          <EmptyState />
        ) : filteredCustomers.length === 0 ? (
          <SearchEmptyState searchQuery={searchQuery} onClear={() => setSearchQuery('')} />
        ) : (
          <>
            {/* Desktop table — hidden on small screens */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      City / Area
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Address
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-5 py-3 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {filteredCustomers.map((cust) => (
                    <CustomerTableRow key={cust.id} customer={cust} onView={handleView} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list — shown only on small screens */}
            <div className="sm:hidden p-4 space-y-3">
              {filteredCustomers.map((cust, i) => (
                <CustomerCard key={cust.id} customer={cust} index={i} onView={handleView} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AdminLayout>
  );
};

export default AdminCustomers;
