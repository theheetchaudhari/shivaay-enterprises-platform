import { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { Crosshair, X, Loader2, Map as MapIcon } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue with bundlers (like Vite)
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to center map on coordinates programmatically
function MapCenterController({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { animate: true, duration: 0.5 });
    }
  }, [position, map]);
  return null;
}

// Helper component to handle map events
function MapEventsController({ setPosition, handleReverseGeocode }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      handleReverseGeocode(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({ initialLocation, onLocationSelect, onClose }) {
  // Default to Ankleshwar conceptually, but we will try to get current location if no initial
  const defaultPosition = { lat: 21.6264, lng: 73.0152 }; // Ankleshwar coordinates as fallback
  
  const [position, setPosition] = useState(initialLocation || defaultPosition);
  const [geocoding, setGeocoding] = useState(false);
  const [error, setError] = useState(null);
  const markerRef = useRef(null);
  const geocodeTimeoutRef = useRef(null);

  // Reverse geocode using Nominatim
  const handleReverseGeocode = useCallback((lat, lng) => {
    if (geocodeTimeoutRef.current) {
      clearTimeout(geocodeTimeoutRef.current);
    }

    geocodeTimeoutRef.current = setTimeout(async () => {
      setGeocoding(true);
      setError(null);
      
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&email=shivaayenterprises.orders@gmail.com`, {
          headers: {
            'Accept-Language': 'en-US,en;q=0.9'
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch address');
        
        const data = await res.json();
        
        if (data && data.address) {
          const addr = data.address;
          
          const address_line_1 = addr.road || addr.pedestrian || addr.footway || addr.path || addr.suburb || '';
          const address_line_2 = addr.neighbourhood || addr.residential || addr.hamlet || '';
          const area = addr.suburb || addr.neighbourhood || addr.city_district || '';
          const city = addr.city || addr.town || addr.village || addr.county || '';
          const state = addr.state || '';
          const pincode = addr.postcode || '';
          
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address_line_1,
            address_line_2,
            area,
            city,
            state,
            pincode
          });
        } else {
          onLocationSelect({ latitude: lat, longitude: lng });
        }
      } catch (err) {
        console.error('Reverse geocoding error:', err);
        setError('Could not auto-fill address from this location. You can still save it and type manually.');
        onLocationSelect({ latitude: lat, longitude: lng });
      } finally {
        setGeocoding(false);
      }
    }, 1000);
  }, [onLocationSelect]);

  // Get current location
  const handleCurrentLocation = useCallback(() => {
    setError(null);
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    
    setGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPos = { lat: latitude, lng: longitude };
        setPosition(newPos);
        handleReverseGeocode(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Unable to retrieve your location. Please check browser permissions.');
        setGeocoding(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [handleReverseGeocode]);

  // Run initial geolocation if no initial location is provided
  useEffect(() => {
    if (!initialLocation) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleCurrentLocation();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragEnd = () => {
    const marker = markerRef.current;
    if (marker != null) {
      const newPos = marker.getLatLng();
      setPosition(newPos);
      handleReverseGeocode(newPos.lat, newPos.lng);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-[#FFFFFF] rounded-[16px] shadow-xl w-full max-w-[800px] overflow-hidden flex flex-col h-[80vh] max-h-[700px]"
      >
        <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center">
              <MapIcon size={20} />
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#0F172A]">Choose Delivery Location</h3>
              <p className="text-[13px] text-[#64748B]">Drag the pin to your exact delivery location</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="relative flex-1 bg-[#E2E8F0]">
          {/* Controls overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] flex flex-col items-center gap-2 w-[90%] max-w-[400px]">
            {error && (
              <div className="bg-[#FEF2F2] border border-[#FCA5A5] text-[#DC2626] px-4 py-2 rounded-lg text-[13px] font-medium shadow-sm w-full text-center">
                {error}
              </div>
            )}
            
            {geocoding && (
              <div className="bg-[#FFFFFF] border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-full text-[13px] font-medium shadow-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#4338CA]" />
                Finding address...
              </div>
            )}
          </div>

          <div className="absolute bottom-6 right-4 z-[1000]">
            <button
              type="button"
              onClick={handleCurrentLocation}
              disabled={geocoding}
              className="bg-[#FFFFFF] text-[#0F172A] p-3 rounded-full shadow-md border border-[#E2E8F0] hover:bg-[#F8FAFC] active:scale-95 transition-all flex items-center justify-center group"
              title="Use my current location"
            >
              <Crosshair size={24} className="group-hover:text-[#4338CA] transition-colors" />
            </button>
          </div>

          <MapContainer 
            center={position} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker 
              position={position}
              draggable={true}
              eventHandlers={{ dragend: handleDragEnd }}
              ref={markerRef}
            />
            <MapCenterController position={position} />
            <MapEventsController setPosition={setPosition} handleReverseGeocode={handleReverseGeocode} />
          </MapContainer>
        </div>
        
        <div className="px-6 py-4 border-t border-[#F1F5F9] bg-[#FFFFFF] flex justify-between items-center">
          <div className="text-[13px] text-[#64748B]">
            <span className="font-semibold text-[#0F172A]">Coordinates:</span> {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-6 rounded-[10px] bg-[#0F172A] text-[#FFFFFF] text-[14px] font-semibold hover:bg-[#1E293B] active:scale-[0.98] transition-all"
          >
            Confirm Location
          </button>
        </div>
      </motion.div>
    </div>
  );
}
