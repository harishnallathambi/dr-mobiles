'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomerDetails } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: CustomerDetails) => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
}

const initialFormState: CustomerDetails = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  pincode: '',
  orderNotes: '',
};

export default function CheckoutModal({ isOpen, onClose, onSubmit }: CheckoutModalProps) {
  const [formData, setFormData] = useState<CustomerDetails>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'fullName':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        return undefined;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          return 'Please enter a valid email address';
        return undefined;
      case 'phone':
        if (!value.trim()) return 'Phone number is required';
        if (!/^[6-9]\d{9}$/.test(value.trim()))
          return 'Enter a valid 10-digit Indian phone number';
        return undefined;
      case 'address':
        if (!value.trim()) return 'Address is required';
        if (value.trim().length < 10) return 'Please enter a complete address';
        return undefined;
      case 'city':
        if (!value.trim()) return 'City is required';
        return undefined;
      case 'pincode':
        if (!value.trim()) return 'Pincode is required';
        if (!/^\d{6}$/.test(value.trim())) return 'Enter a valid 6-digit pincode';
        return undefined;
      default:
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const fields: (keyof FormErrors)[] = ['fullName', 'email', 'phone', 'address', 'city', 'pincode'];

    fields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    // Mark all as touched
    setTouched(
      fields.reduce((acc, f) => ({ ...acc, [f]: true }), {} as Record<string, boolean>)
    );

    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name: keyof CustomerDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name: keyof CustomerDetails) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setErrors({});
    setTouched({});
    onClose();
  };

  const inputClasses = (field: keyof FormErrors) =>
    `w-full px-4 py-3 text-sm bg-white border-2 rounded-xl outline-none transition-colors duration-200 ${
      errors[field] && touched[field]
        ? 'border-red-400 focus:border-red-500'
        : 'border-gray-200 focus:border-[#D4A853]'
    }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <div>
                <h2 className="text-xl font-bold text-[#0A0A0A] font-outfit">Shipping Details</h2>
                <p className="text-sm text-gray-400 mt-0.5">Fill in your delivery information</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close checkout"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-4 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  onBlur={() => handleBlur('fullName')}
                  placeholder="Enter your full name"
                  className={inputClasses('fullName')}
                />
                {errors.fullName && touched.fullName && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.fullName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email ID <span className="text-gray-300 text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="example@email.com"
                  className={inputClasses('email')}
                />
                {errors.email && touched.email && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      handleChange('phone', val);
                    }}
                    onBlur={() => handleBlur('phone')}
                    placeholder="9876543210"
                    className={`${inputClasses('phone')} pl-12`}
                  />
                </div>
                {errors.phone && touched.phone && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Address <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  onBlur={() => handleBlur('address')}
                  placeholder="House/Flat No., Street, Landmark"
                  rows={3}
                  className={`${inputClasses('address')} resize-none`}
                />
                {errors.address && touched.address && (
                  <p className="text-xs text-red-500 mt-1 ml-1">{errors.address}</p>
                )}
              </div>

              {/* City & Pincode Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    City <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    onBlur={() => handleBlur('city')}
                    placeholder="Your city"
                    className={inputClasses('city')}
                  />
                  {errors.city && touched.city && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Pincode <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                      handleChange('pincode', val);
                    }}
                    onBlur={() => handleBlur('pincode')}
                    placeholder="600001"
                    className={inputClasses('pincode')}
                  />
                  {errors.pincode && touched.pincode && (
                    <p className="text-xs text-red-500 mt-1 ml-1">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Order Notes <span className="text-gray-300 text-xs font-normal">(optional)</span>
                </label>
                <textarea
                  value={formData.orderNotes}
                  onChange={(e) => handleChange('orderNotes', e.target.value)}
                  placeholder="Any special instructions for delivery..."
                  rows={2}
                  className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-200 rounded-xl outline-none transition-colors duration-200 focus:border-[#D4A853] resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-[#D4A853] to-[#B8860B] text-white font-semibold rounded-xl shadow-lg shadow-[#D4A853]/30 hover:shadow-xl hover:shadow-[#D4A853]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Continue to Payment
              </button>

              {/* Back Button */}
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to Cart
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
