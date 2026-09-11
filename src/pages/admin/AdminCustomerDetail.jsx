import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Navigation,
  Calendar,
  Hash,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Users,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import { supabase } from '../../lib/supabase';

// ─── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.07, ease: 'easeOut' },
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
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

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, mono = false }) {
  const isEmpty = value === null || value === undefined || value === '';
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[#F1F5F9] last:border-b-0">
      <div className="w-8 h-8 rounded-[8px] bg-[#F1F5F9] flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={15} className="text-[#64748B]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#94A3B8] mb-0.5">
          {label}
        </p>
        {isEmpty ? (
          <p className="text-[13px] text-[#CBD5E1] italic">Not provided</p>
        ) : (
          <p className={`text-[14px] text-[#0F172A] break-words ${mono ? 'font-mono text-[12px]' : ''}`}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Detail Section Card ──────────────────────────────────────────────────────
function SectionCard({ title, children, index }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-[16px] border border-[#E5E7EB] shadow-sm overflow-hidden"
    >
      <div className="px-5 py-4 border-b border-[#E5E7EB] bg-[#F8FAFC]">
        <p className="text-[13px] font-bold text-[#0F172A] uppercase tracking-widest">
          {title}
        </p>
      </div>
      <div className="px-5 py-1">{children}</div>
    </motion.div>
  );
}

// ─── Loading State ────────────────────────────────────────────────────────────
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <Loader2 size={32} className="animate-spin text-[#0F172A]" />
      <p className="text-[14px] text-[#64748B]">Loading customer profile…</p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ message, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      <div className="w-14 h-14 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-4">
        <AlertTriangle size={26} className="text-[#DC2626]" />
      </div>
      <p className="text-[16px] font-bold text-[#0F172A] mb-1">
        {message === 'not_found' ? 'Customer Not Found' : 'Failed to Load Customer'}
      </p>
      <p className="text-[13px] text-[#64748B] mb-6 max-w-[300px]">
        {message === 'not_found'
          ? "This customer record does not exist or you don't have access to it."
          : "There was a problem loading this customer's data. Please try again."}
      </p>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1e293b] transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Customers
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
const AdminCustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomer = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('customers')
        .select('*, customer_addresses(*)')
        .eq('id', id)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // PostgREST "no rows" error — customer not found
          setError('not_found');
        } else {
          throw fetchError;
        }
        return;
      }

      setCustomer(data);
    } catch (err) {
      console.error('Error fetching customer detail:', err);
      setError('fetch_error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCustomer();
  }, [fetchCustomer]);

  const handleBack = () => navigate('/admin/customers');

  // Extract first address
  const addr = customer
    ? Array.isArray(customer.customer_addresses)
      ? customer.customer_addresses[0]
      : customer.customer_addresses
    : null;

  const hasCoordinates = addr?.latitude && addr?.longitude;
  const mapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${addr.latitude},${addr.longitude}`
    : null;

  return (
    <AdminLayout pageTitle="Customer Profile">
      {/* Back navigation */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="mb-5"
      >
        <button
          id="customer-detail-back-btn"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#0F172A] transition-colors group"
          aria-label="Back to customers list"
        >
          <ArrowLeft
            size={15}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          All Customers
        </button>
      </motion.div>

      {/* Loading / Error states */}
      {loading && <LoadingState />}
      {!loading && error && (
        <ErrorState message={error} onBack={handleBack} />
      )}

      {/* Main content */}
      {!loading && !error && customer && (
        <>
          {/* Profile header */}
          <motion.div
            id="customer-detail-header"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="bg-gradient-to-r from-[#0F172A] to-[#1e293b] rounded-[20px] p-6 sm:p-8 mb-6 flex flex-col sm:flex-row sm:items-center gap-5 relative overflow-hidden"
          >
            {/* Decorative blur */}
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[#DC2626]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-20 w-28 h-28 bg-[#3b82f6]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Avatar */}
            <div className="relative w-16 h-16 rounded-full bg-[#DC2626]/20 border-2 border-[#DC2626]/40 flex items-center justify-center shrink-0">
              <span className="text-[20px] font-bold text-white">
                {getInitials(customer.full_name)}
              </span>
            </div>

            {/* Name + meta */}
            <div className="relative min-w-0">
              <h2 className="text-[22px] sm:text-[26px] font-heading font-bold text-white leading-tight truncate">
                {customer.full_name || 'Unnamed Customer'}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                {customer.email && (
                  <span className="flex items-center gap-1.5 text-[13px] text-[#94a3b8]">
                    <Mail size={13} />
                    {customer.email}
                  </span>
                )}
                {customer.phone && (
                  <span className="flex items-center gap-1.5 text-[13px] text-[#94a3b8]">
                    <Phone size={13} />
                    {customer.phone}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#475569] mt-1.5 flex items-center gap-1.5">
                <Calendar size={12} />
                Customer since {formatDate(customer.created_at)}
              </p>
            </div>
          </motion.div>

          {/* Detail grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Customer Information */}
            <SectionCard title="Customer Information" index={2}>
              <InfoRow icon={User} label="Full Name" value={customer.full_name} />
              <InfoRow icon={Mail} label="Email Address" value={customer.email} />
              <InfoRow icon={Phone} label="Phone Number" value={customer.phone} />
            </SectionCard>

            {/* Account Details */}
            <SectionCard title="Account Details" index={3}>
              <InfoRow icon={Hash} label="Customer ID" value={customer.id} mono />
              <InfoRow icon={Calendar} label="Registered On" value={formatDate(customer.created_at)} />
              <InfoRow
                icon={Users}
                label="Address Status"
                value={addr ? 'Delivery address saved' : 'No address on file'}
              />
            </SectionCard>

            {/* Delivery Address */}
            <SectionCard title="Delivery Address" index={4}>
              {addr ? (
                <>
                  <InfoRow icon={MapPin} label="Address Line 1" value={addr.address_line_1} />
                  {addr.address_line_2 && (
                    <InfoRow icon={MapPin} label="Address Line 2" value={addr.address_line_2} />
                  )}
                  <InfoRow icon={MapPin} label="Area" value={addr.area} />
                  <InfoRow icon={MapPin} label="City" value={addr.city} />
                  <InfoRow icon={MapPin} label="State" value={addr.state} />
                  <InfoRow icon={MapPin} label="Pincode" value={addr.pincode} />
                  {addr.landmark && (
                    <InfoRow icon={MapPin} label="Landmark" value={addr.landmark} />
                  )}
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                    <MapPin size={18} className="text-[#94A3B8]" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A] mb-1">No address saved</p>
                  <p className="text-[12px] text-[#64748B]">
                    This customer has not added a delivery address yet.
                  </p>
                </div>
              )}
            </SectionCard>

            {/* Location */}
            <SectionCard title="Location" index={5}>
              {hasCoordinates ? (
                <>
                  <InfoRow icon={Navigation} label="Latitude" value={String(addr.latitude)} mono />
                  <InfoRow icon={Navigation} label="Longitude" value={String(addr.longitude)} mono />
                  <div className="py-3">
                    <a
                      id="customer-maps-link"
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-[13px] font-semibold rounded-[10px] hover:bg-[#1e293b] transition-colors group"
                      aria-label="Open customer location in Google Maps"
                    >
                      <MapPin size={15} />
                      Open in Google Maps
                      <ExternalLink
                        size={13}
                        className="opacity-60 group-hover:opacity-100 transition-opacity"
                      />
                    </a>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 rounded-full bg-[#F1F5F9] flex items-center justify-center mx-auto mb-3">
                    <Navigation size={18} className="text-[#94A3B8]" />
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A] mb-1">No location data</p>
                  <p className="text-[12px] text-[#64748B]">
                    GPS coordinates were not captured for this customer.
                  </p>
                </div>
              )}
            </SectionCard>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminCustomerDetail;
