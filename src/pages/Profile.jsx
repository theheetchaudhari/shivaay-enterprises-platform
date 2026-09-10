import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Save, Loader2, AlertCircle, CheckCircle2, Map as MapIcon, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import LocationPickerMap from '../components/profile/LocationPickerMap';
import { AnimatePresence } from 'framer-motion';

// Simple animated wrapper for sections
const SectionWrapper = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    className="bg-[#FFFFFF] rounded-[16px] shadow-sm border border-[#E2E8F0] overflow-hidden"
  >
    {children}
  </motion.div>
);

export default function Profile() {
  const { user } = useCustomerAuth();
  const [loading, setLoading] = useState(true);
  
  // Profile state
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    email: '' // Display only
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  // Address state
  const [address, setAddress] = useState({
    address_line_1: '',
    address_line_2: '',
    area: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    latitude: null,
    longitude: null
  });
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressMessage, setAddressMessage] = useState(null);
  const [showMap, setShowMap] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (profileData) {
        setProfile({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          email: profileData.email || ''
        });
      }

      // Fetch address
      const { data: addressData, error: addressError } = await supabase
        .from('customer_addresses')
        .select('*')
        .eq('customer_id', user.id)
        .single();
        
      // Ignore PGRST116 (No rows found) - valid if user hasn't added address yet
      if (addressError && addressError.code !== 'PGRST116') {
        console.error('Error fetching address:', addressError);
      }
      
      if (addressData) {
        setAddress({
          address_line_1: addressData.address_line_1 || '',
          address_line_2: addressData.address_line_2 || '',
          area: addressData.area || '',
          city: addressData.city || '',
          state: addressData.state || '',
          pincode: addressData.pincode || '',
          landmark: addressData.landmark || '',
          latitude: addressData.latitude || null,
          longitude: addressData.longitude || null
        });
      }
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  // Handlers
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const trimmedName = profile.full_name.trim();
    if (profile.phone && profile.phone.length !== 10) {
      setProfileMessage({ type: 'error', text: 'Phone number must be exactly 10 digits.' });
      setTimeout(() => setProfileMessage(null), 3000);
      return;
    }

    setProfileSaving(true);
    setProfileMessage(null);
    
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          full_name: trimmedName,
          phone: profile.phone
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfileMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      console.error('Profile update error:', error);
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setProfileSaving(false);
      // Clear success message after 3 seconds
      setTimeout(() => setProfileMessage(null), 3000);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    
    if (address.pincode && address.pincode.length !== 6) {
      setAddressMessage({ type: 'error', text: 'Pincode must be exactly 6 digits.' });
      setTimeout(() => setAddressMessage(null), 3000);
      return;
    }

    setAddressSaving(true);
    setAddressMessage(null);
    
    try {
      const { error } = await supabase
        .from('customer_addresses')
        .upsert({
          customer_id: user.id,
          address_line_1: address.address_line_1,
          address_line_2: address.address_line_2,
          area: address.area,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          landmark: address.landmark,
          latitude: address.latitude,
          longitude: address.longitude
        }, { onConflict: 'customer_id' });
        
      if (error) throw error;
      
      setAddressMessage({ type: 'success', text: 'Delivery address saved successfully.' });
    } catch (error) {
      console.error('Address update error:', error);
      setAddressMessage({ type: 'error', text: 'Failed to save address.' });
    } finally {
      setAddressSaving(false);
      // Clear success message after 3 seconds
      setTimeout(() => setAddressMessage(null), 3000);
    }
  };

  const handleLocationSelect = useCallback((locationData) => {
    setAddress(prev => ({
      ...prev,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      // Only override address fields if geocoding provided them
      ...(locationData.address_line_1 && { address_line_1: locationData.address_line_1 }),
      ...(locationData.address_line_2 && { address_line_2: locationData.address_line_2 }),
      ...(locationData.area && { area: locationData.area }),
      ...(locationData.city && { city: locationData.city }),
      ...(locationData.state && { state: locationData.state }),
      ...(locationData.pincode && { pincode: locationData.pincode }),
    }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[#0F172A]" size={32} />
        <p className="text-[15px] text-[#64748B] font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto">
        
        <div className="mb-8 md:mb-10">
          <h1 className="text-[32px] md:text-[40px] font-heading font-bold text-[#0F172A] mb-2 leading-tight">
            Your Profile
          </h1>
          <p className="text-[16px] text-[#64748B]">
            Manage your personal information and delivery address.
          </p>
        </div>

        <div className="grid gap-8">
          
          {/* Personal Information Section */}
          <SectionWrapper delay={0.1}>
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center gap-3 bg-[#F8FAFC]/50">
              <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold text-[#0F172A]">Personal Information</h2>
                <p className="text-[13px] text-[#64748B]">Your contact details for orders.</p>
              </div>
            </div>
            
            <form onSubmit={handleProfileSubmit} className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="email" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profile.email}
                    disabled
                    className="w-full h-11 px-4 rounded-[12px] bg-[#F1F5F9] border-transparent text-[#64748B] text-[15px] cursor-not-allowed outline-none"
                  />
                  <p className="text-[12px] text-[#94A3B8] mt-1.5">Email cannot be changed.</p>
                </div>
                
                <div>
                  <label htmlFor="full_name" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value.replace(/[0-9]/g, '') })}
                    placeholder="E.g. Rahul Patel"
                    className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    inputMode="numeric"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="E.g. +91 98765 43210"
                    className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="h-11 px-6 rounded-[12px] bg-[#0F172A] text-[#FFFFFF] text-[15px] font-semibold hover:bg-[#1E293B] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center min-w-[120px]"
                >
                  {profileSaving ? <Loader2 size={18} className="animate-spin" /> : 'Save Changes'}
                </button>
                
                {profileMessage && (
                  <div className={`flex items-center gap-2 text-[14px] font-medium ${profileMessage.type === 'error' ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                    {profileMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    {profileMessage.text}
                  </div>
                )}
              </div>
            </form>
          </SectionWrapper>

          {/* Delivery Address Section */}
          <SectionWrapper delay={0.2}>
            <div className="px-6 py-5 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#0F172A]">Primary Delivery Address</h2>
                  <p className="text-[13px] text-[#64748B]">Where should we deliver your orders?</p>
                </div>
              </div>
              {address.latitude && address.longitude && (
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 text-[13px] font-semibold text-[#4338CA] bg-[#E0E7FF] px-3 py-1.5 rounded-full hover:bg-[#C7D2FE] transition-colors"
                >
                  <ExternalLink size={14} /> Open in Google Maps
                </a>
              )}
            </div>
            
            <form onSubmit={handleAddressSubmit} className="p-6 md:p-8">
              <div className="mb-6 pb-6 border-b border-[#F1F5F9]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0F172A] mb-1">Set Location via Map</h3>
                    <p className="text-[13px] text-[#64748B]">Drop a pin on the map to auto-fill your address</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMap(true)}
                    className="h-10 px-4 rounded-[10px] bg-[#E0E7FF] text-[#4338CA] text-[14px] font-semibold hover:bg-[#C7D2FE] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0"
                  >
                    <MapIcon size={16} /> Choose Location
                  </button>
                </div>
                {address.latitude && address.longitude && (
                  <div className="mt-4 flex items-center gap-2 text-[13px] text-[#16A34A] bg-[#DCFCE7] px-3 py-2 rounded-[8px] md:hidden">
                    <CheckCircle2 size={16} /> Coordinates saved
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${address.latitude},${address.longitude}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-auto flex items-center gap-1 font-semibold text-[#0F172A] hover:underline"
                    >
                      <ExternalLink size={14} /> View
                    </a>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <div className="md:col-span-2">
                  <label htmlFor="address_line_1" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    id="address_line_1"
                    required
                    value={address.address_line_1}
                    onChange={(e) => setAddress({ ...address, address_line_1: e.target.value })}
                    placeholder="Shop/House No., Building Name"
                    className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address_line_2" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    Address Line 2 <span className="text-[#94A3B8] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="address_line_2"
                    value={address.address_line_2}
                    onChange={(e) => setAddress({ ...address, address_line_2: e.target.value })}
                    placeholder="Street, Society, or Area"
                    className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="area" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    Area / Locality *
                  </label>
                  <input
                    type="text"
                    id="area"
                    required
                    value={address.area}
                    onChange={(e) => setAddress({ ...address, area: e.target.value })}
                    placeholder="E.g. GIDC"
                    className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="landmark" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    Landmark <span className="text-[#94A3B8] font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="landmark"
                    value={address.landmark}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    placeholder="Nearby popular place"
                    className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="E.g. Ankleshwar"
                    className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="state" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      required
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      placeholder="Gujarat"
                      className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="pincode" className="block text-[13px] font-semibold text-[#475569] mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      inputMode="numeric"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      placeholder="393002"
                      className="w-full h-11 px-4 rounded-[12px] bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] text-[15px] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                    />
                  </div>
                </div>

              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-[#F1F5F9]">
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="h-11 px-6 rounded-[12px] bg-[#0F172A] text-[#FFFFFF] text-[15px] font-semibold hover:bg-[#1E293B] active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 min-w-[150px]"
                >
                  {addressSaving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Address</>}
                </button>
                
                {addressMessage && (
                  <div className={`flex items-center gap-2 text-[14px] font-medium ${addressMessage.type === 'error' ? 'text-[#DC2626]' : 'text-[#16A34A]'}`}>
                    {addressMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                    {addressMessage.text}
                  </div>
                )}
              </div>
            </form>
          </SectionWrapper>
          
        </div>
      </div>

      <AnimatePresence>
        {showMap && (
          <LocationPickerMap
            initialLocation={address.latitude && address.longitude ? { lat: address.latitude, lng: address.longitude } : null}
            onLocationSelect={handleLocationSelect}
            onClose={() => setShowMap(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
