"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Plus, 
  Home, 
  Briefcase, 
  Check, 
  Loader2,
  Phone,
  User,
  Building,
  Sparkles
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  tag?: 'Home' | 'Work' | 'Other';
}

interface AddressManagerProps {
  address: ShippingAddress;
  onChange: (updated: ShippingAddress) => void;
  errors?: Record<string, string>;
  className?: string;
}

const SAVED_ADDRESSES_KEY = 'vivaan_saved_addresses';

export const AddressManager: React.FC<AddressManagerProps> = ({
  address,
  onChange,
  errors = {},
  className = '',
}) => {
  const { toast } = useToast();
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([]);
  const [selectedTag, setSelectedTag] = useState<'Home' | 'Work' | 'Other'>('Home');

  // Geolocation states
  const [geoState, setGeoState] = useState<'idle' | 'detecting' | 'success' | 'denied' | 'error'>('idle');
  const [geoMessage, setGeoMessage] = useState<string>('');

  // Pincode lookup states
  const [pincodeLookupState, setPincodeLookupState] = useState<'idle' | 'checking' | 'verified' | 'failed'>('idle');
  const [pincodeNotice, setPincodeNotice] = useState<string>('');

  // Load saved addresses from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_ADDRESSES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
        }
      }
    } catch {
      // Ignore JSON error
    }
  }, []);

  // Save current address to saved addresses list
  const handleSaveCurrentAddress = () => {
    if (!address.name || !address.phone || !address.address || !address.pincode) {
      toast({
        variant: "destructive",
        title: "Incomplete Address",
        description: "Please fill in all required fields before saving.",
      });
      return;
    }

    const newEntry: ShippingAddress = {
      ...address,
      tag: selectedTag,
    };

    const updated = [
      newEntry,
      ...savedAddresses.filter(a => a.address !== address.address || a.pincode !== address.pincode)
    ].slice(0, 4); // Keep top 4 addresses

    setSavedAddresses(updated);
    try {
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updated));
      toast({
        title: "Address Saved",
        description: `Saved to your ${selectedTag} addresses.`,
      });
    } catch {
      // Ignore storage error
    }
  };

  const handleSelectSavedAddress = (saved: ShippingAddress) => {
    onChange(saved);
    if (saved.tag) setSelectedTag(saved.tag);
    toast({
      title: "Address Selected",
      description: `Loaded ${saved.tag || 'saved'} shipping address.`,
    });
  };

  // Indian Pincode Auto-Lookup via Postal API
  const handlePincodeLookup = useCallback(async (code: string) => {
    const cleanPincode = code.trim().replace(/\D/g, '');
    if (cleanPincode.length !== 6) {
      setPincodeLookupState('idle');
      setPincodeNotice('');
      return;
    }

    setPincodeLookupState('checking');
    setPincodeNotice('Verifying pincode...');

    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPincode}`, {
        cache: 'force-cache'
      });
      const data = await res.json();

      if (Array.isArray(data) && data[0]?.Status === 'Success' && data[0].PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        const detectedCity = postOffice.District || postOffice.Block || postOffice.Name;
        const detectedState = postOffice.State;

        onChange({
          ...address,
          pincode: cleanPincode,
          city: address.city || detectedCity,
          state: address.state || detectedState,
        });

        setPincodeLookupState('verified');
        setPincodeNotice(`${detectedCity}, ${detectedState}`);
      } else {
        setPincodeLookupState('failed');
        setPincodeNotice('Pincode verified locally. Please confirm City and State.');
      }
    } catch {
      setPincodeLookupState('failed');
      setPincodeNotice('Pincode lookup offline. Please enter City & State manually.');
    }
  }, [address, onChange]);

  // GPS / Geolocation Detection with fallback
  const handleUseCurrentLocation = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setGeoState('error');
      setGeoMessage('Location service is not supported on this device. Please enter manually.');
      return;
    }

    setGeoState('detecting');
    setGeoMessage('Detecting your GPS location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // 1. Try free OpenStreetMap Nominatim reverse geocode
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
            { credentials: 'omit' }
          );
          
          if (!response.ok) throw new Error('Geocoding response not ok');
          const data = await response.json();
          const addr = data.address || {};

          const road = addr.road || addr.street || addr.suburb || addr.neighbourhood || '';
          const city = addr.city || addr.town || addr.village || addr.county || addr.district || '';
          const state = addr.state || '';
          const pincode = (addr.postcode || '').replace(/\D/g, '').slice(0, 6);

          const fullStreet = [addr.house_number, road, addr.suburb].filter(Boolean).join(', ');

          onChange({
            ...address,
            address: fullStreet || address.address,
            city: city || address.city,
            state: state || address.state,
            pincode: pincode || address.pincode,
          });

          setGeoState('success');
          setGeoMessage('Location detected! Please check flat/building number.');
          
          if (pincode && pincode.length === 6) {
            handlePincodeLookup(pincode);
          }
        } catch (fetchErr) {
          console.warn('Reverse geocode error:', fetchErr);
          setGeoState('error');
          setGeoMessage('GPS coordinates found, but auto-fill is offline. Please enter address manually.');
        }
      },
      (geoError) => {
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setGeoState('denied');
          setGeoMessage('Location permission denied. Please enter your address manually.');
        } else if (geoError.code === geoError.TIMEOUT) {
          setGeoState('error');
          setGeoMessage('Location request timed out. Please enter your address manually.');
        } else {
          setGeoState('error');
          setGeoMessage('Unable to detect location. Please enter your address manually.');
        }
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 60000 }
    );
  };

  const handleFieldChange = (name: keyof ShippingAddress, value: string) => {
    let formattedValue = value;
    if (name === 'phone') {
      // Only keep digits and limit to 10
      formattedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    if (name === 'pincode') {
      formattedValue = value.replace(/\D/g, '').slice(0, 6);
      if (formattedValue.length === 6) {
        handlePincodeLookup(formattedValue);
      } else {
        setPincodeLookupState('idle');
        setPincodeNotice('');
      }
    }

    onChange({
      ...address,
      [name]: formattedValue,
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Quick Location Detection & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF7EF] p-4 rounded-2xl border border-[#EEE0BC]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#5B4E38]">
          <Navigation className="w-4 h-4 text-primary shrink-0" />
          <span>Need faster checkout?</span>
        </div>

        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={geoState === 'detecting'}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#1B5E3B]/30 text-primary text-xs font-bold uppercase tracking-wider hover:bg-primary/5 active:scale-95 transition-all shadow-xs cursor-pointer"
        >
          {geoState === 'detecting' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Detecting...</span>
            </>
          ) : (
            <>
              <MapPin className="w-3.5 h-3.5 text-secondary" />
              <span>Use Current Location</span>
            </>
          )}
        </button>
      </div>

      {/* Geolocation Feedback Alert */}
      {geoState !== 'idle' && (
        <div className={cn(
          "p-3 rounded-xl text-xs flex items-start gap-2.5 transition-all",
          geoState === 'success' && "bg-emerald-50 text-emerald-900 border border-emerald-200",
          geoState === 'denied' && "bg-amber-50 text-amber-900 border border-amber-200",
          geoState === 'error' && "bg-gray-50 text-gray-800 border border-gray-200",
          geoState === 'detecting' && "bg-blue-50 text-blue-900 border border-blue-200"
        )}>
          {geoState === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
          {geoState === 'denied' && <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />}
          {geoState === 'error' && <AlertCircle className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />}
          {geoState === 'detecting' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0 mt-0.5" />}
          <div className="flex-1 leading-relaxed">
            {geoMessage}
          </div>
          {geoState !== 'detecting' && (
            <button 
              type="button" 
              onClick={() => setGeoState('idle')}
              className="text-xs opacity-60 hover:opacity-100 font-bold ml-1 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* 2. Saved Addresses Carousel (if user has saved addresses) */}
      {savedAddresses.length > 0 && (
        <div className="space-y-2">
          <div className="text-[11px] font-black uppercase tracking-wider text-[#7A6848] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-secondary" />
            <span>Select from Saved Addresses</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {savedAddresses.map((saved, idx) => {
              const isSelected = address.address === saved.address && address.pincode === saved.pincode;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSavedAddress(saved)}
                  className={cn(
                    "min-w-[190px] max-w-[240px] text-left p-3 rounded-xl border text-xs transition-all shrink-0 cursor-pointer",
                    isSelected 
                      ? "bg-emerald-50/80 border-[#1B5E3B] text-primary shadow-xs ring-1 ring-[#1B5E3B]"
                      : "bg-white border-[#DDD0B5] hover:border-primary/40 text-gray-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold uppercase text-[10px] px-2 py-0.5 rounded-full bg-white border border-[#DDD0B5]">
                      {saved.tag || 'Address'}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#1B5E3B]" />}
                  </div>
                  <div className="font-bold truncate text-gray-900">{saved.name}</div>
                  <div className="text-[11px] text-gray-600 truncate">{saved.address}</div>
                  <div className="text-[10px] text-[#7A6848] font-semibold">{saved.city}, {saved.pincode}</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Address Form with Mobile-First Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-5 sm:p-7 rounded-3xl border border-[#EEE0BC] shadow-sm">
        
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <User className="w-3 h-3 text-primary" /> Full Name *
          </label>
          <Input 
            name="name" 
            autoComplete="name"
            value={address.name} 
            onChange={(e) => handleFieldChange('name', e.target.value)} 
            placeholder="e.g. Ramesh Patel" 
            className={cn(
              "h-12 rounded-xl bg-[#FDFBFA] border-[#DDD0B5] text-sm font-semibold focus:border-primary",
              errors.name && "border-red-500 bg-red-50/30"
            )} 
          />
          {errors.name && <span className="text-[10px] text-red-600 font-bold block">{errors.name}</span>}
        </div>

        {/* Mobile Number with Indian +91 Prefix */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <Phone className="w-3 h-3 text-primary" /> Mobile Number *
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-[#7A6848] select-none pointer-events-none">
              🇮🇳 +91
            </span>
            <Input 
              name="phone" 
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={10}
              value={address.phone} 
              onChange={(e) => handleFieldChange('phone', e.target.value)} 
              placeholder="10-digit number" 
              className={cn(
                "h-12 pl-16 rounded-xl bg-[#FDFBFA] border-[#DDD0B5] text-sm font-semibold focus:border-primary",
                errors.phone && "border-red-500 bg-red-50/30"
              )} 
            />
          </div>
          {errors.phone && <span className="text-[10px] text-red-600 font-bold block">{errors.phone}</span>}
        </div>

        {/* Complete Street Address */}
        <div className="md:col-span-2 space-y-1">
          <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <Building className="w-3 h-3 text-primary" /> Flat / House No., Landmark, Street Address *
          </label>
          <Input 
            name="address" 
            autoComplete="street-address"
            value={address.address} 
            onChange={(e) => handleFieldChange('address', e.target.value)} 
            placeholder="e.g. 204, Shanti Heights, Near Gayatri Temple, Station Road" 
            className={cn(
              "h-12 rounded-xl bg-[#FDFBFA] border-[#DDD0B5] text-sm font-semibold focus:border-primary",
              errors.address && "border-red-500 bg-red-50/30"
            )} 
          />
          {errors.address && <span className="text-[10px] text-red-600 font-bold block">{errors.address}</span>}
        </div>

        {/* Pincode with Instant Auto-Verify */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              PIN Code *
            </label>
            {pincodeLookupState === 'checking' && (
              <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                <Loader2 className="w-2.5 h-2.5 animate-spin" /> Verifying
              </span>
            )}
            {pincodeLookupState === 'verified' && (
              <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified
              </span>
            )}
          </div>

          <Input 
            name="pincode" 
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            value={address.pincode} 
            onChange={(e) => handleFieldChange('pincode', e.target.value)} 
            placeholder="6-digit PIN code" 
            className={cn(
              "h-12 rounded-xl bg-[#FDFBFA] border-[#DDD0B5] text-sm font-semibold focus:border-primary",
              errors.pincode && "border-red-500 bg-red-50/30"
            )} 
          />
          {pincodeNotice && (
            <span className={cn(
              "text-[10px] font-medium block",
              pincodeLookupState === 'verified' ? "text-emerald-700" : "text-gray-500"
            )}>
              {pincodeNotice}
            </span>
          )}
          {errors.pincode && <span className="text-[10px] text-red-600 font-bold block">{errors.pincode}</span>}
        </div>

        {/* City & State (Auto-populated or Editable) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              City / District *
            </label>
            <Input 
              name="city" 
              autoComplete="address-level2"
              value={address.city} 
              onChange={(e) => handleFieldChange('city', e.target.value)} 
              placeholder="City" 
              className={cn(
                "h-12 rounded-xl bg-[#FDFBFA] border-[#DDD0B5] text-sm font-semibold focus:border-primary",
                errors.city && "border-red-500 bg-red-50/30"
              )} 
            />
            {errors.city && <span className="text-[10px] text-red-600 font-bold block">{errors.city}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              State *
            </label>
            <Input 
              name="state" 
              autoComplete="address-level1"
              value={address.state} 
              onChange={(e) => handleFieldChange('state', e.target.value)} 
              placeholder="State" 
              className="h-12 rounded-xl bg-[#FDFBFA] border-[#DDD0B5] text-sm font-semibold focus:border-primary" 
            />
          </div>
        </div>

        {/* Address Tag Selector & Save Button */}
        <div className="md:col-span-2 pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#7A6848] uppercase tracking-wider">Label as:</span>
            {(['Home', 'Work', 'Other'] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer",
                  selectedTag === tag 
                    ? "bg-primary text-white shadow-xs" 
                    : "bg-[#F5EFE1] text-[#7A6848] hover:bg-[#EEE0BC]"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSaveCurrentAddress}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer py-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Save Address</span>
          </button>
        </div>

      </div>
    </div>
  );
};
