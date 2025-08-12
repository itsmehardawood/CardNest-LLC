"use client";

import React, { useState } from "react";
import { Plus, X, Building2, Save, AlertCircle } from "lucide-react";

const AddSubBusiness = ({ onSubBusinessAdded, onClose, existingBusiness = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    sub_b_name: existingBusiness?.sub_b_name || "",
    sub_b_email: existingBusiness?.sub_b_email || "",
    sub_b_reg_no: existingBusiness?.sub_b_reg_no || "",
    sub_b_street: existingBusiness?.sub_b_street || "",
    sub_b_street_line2: existingBusiness?.sub_b_street_line2 || "",
    sub_b_city: existingBusiness?.sub_b_city || "",
    sub_b_state: existingBusiness?.sub_b_state || "",
    sub_b_zip_code: existingBusiness?.sub_b_zip_code || "",
    sub_b_country: existingBusiness?.sub_b_country || ""
  });

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'sub_b_name', 'sub_b_email', 'sub_b_reg_no', 
      'sub_b_street', 'sub_b_city', 'sub_b_state', 
      'sub_b_zip_code', 'sub_b_country'
    ];

    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });

    // Email validation
    if (formData.sub_b_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sub_b_email)) {
      newErrors.sub_b_email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const merchantId = userData.merchant_id;

      if (!merchantId) {
        throw new Error("User data not found. Please login again.");
      }

      const apiData = {
        parent_id: merchantId,
        sub_businesses: [formData]
      };

      const response = await fetch('https://admin.cardnest.io/api/superadmin/sub-business-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to save sub-business');
      }

      // Call the callback to update parent component
      onSubBusinessAdded({
        ...formData,
        id: result.data?.id || Date.now() // Use API response ID or fallback
      });

      // Show success message
      alert(isEditing ? "Sub-business updated successfully!" : "Sub-business added successfully!");
      
      // Close the form
      onClose();

    } catch (err) {
      console.error("Error saving sub-business:", err);
      alert(err.message || "Failed to save sub-business. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      sub_b_name: "Business Name",
      sub_b_email: "Business Email",
      sub_b_reg_no: "Registration Number",
      sub_b_street: "Street Address",
      sub_b_street_line2: "Street Line 2",
      sub_b_city: "City",
      sub_b_state: "State/Province",
      sub_b_zip_code: "ZIP/Postal Code",
      sub_b_country: "Country"
    };
    return labels[field] || field;
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      sub_b_name: "Enter business name",
      sub_b_email: "Enter business email",
      sub_b_reg_no: "Enter registration number",
      sub_b_street: "Enter street address",
      sub_b_street_line2: "Apartment, suite, etc. (Optional)",
      sub_b_city: "Enter city",
      sub_b_state: "Enter state/province",
      sub_b_zip_code: "Enter ZIP/postal code",
      sub_b_country: "Enter country"
    };
    return placeholders[field] || "";
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg- bg-opacity-20 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? "Edit Sub-Business" : "Add New Sub-Business"}
                </h2>
                <p className="text-indigo-100">
                  {isEditing ? "Update business information" : "Fill in the details below to add a new sub-business"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
              disabled={submitting}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Name */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_name')} *
                </label>
                <input
                  type="text"
                  value={formData.sub_b_name}
                  onChange={(e) => handleInputChange('sub_b_name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_name')}
                  disabled={submitting}
                />
                {errors.sub_b_name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_email')} *
                </label>
                <input
                  type="email"
                  value={formData.sub_b_email}
                  onChange={(e) => handleInputChange('sub_b_email', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_email')}
                  disabled={submitting}
                />
                {errors.sub_b_email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_email}
                  </p>
                )}
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_reg_no')} *
                </label>
                <input
                  type="text"
                  value={formData.sub_b_reg_no}
                  onChange={(e) => handleInputChange('sub_b_reg_no', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_reg_no ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_reg_no')}
                  disabled={submitting}
                />
                {errors.sub_b_reg_no && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_reg_no}
                  </p>
                )}
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_street')} *
                </label>
                <input
                  type="text"
                  value={formData.sub_b_street}
                  onChange={(e) => handleInputChange('sub_b_street', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_street ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_street')}
                  disabled={submitting}
                />
                {errors.sub_b_street && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_street}
                  </p>
                )}
              </div>

              {/* Street Line 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_street_line2')}
                </label>
                <input
                  type="text"
                  value={formData.sub_b_street_line2}
                  onChange={(e) => handleInputChange('sub_b_street_line2', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900"
                  placeholder={getFieldPlaceholder('sub_b_street_line2')}
                  disabled={submitting}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_city')} *
                </label>
                <input
                  type="text"
                  value={formData.sub_b_city}
                  onChange={(e) => handleInputChange('sub_b_city', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_city')}
                  disabled={submitting}
                />
                {errors.sub_b_city && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_city}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_state')} *
                </label>
                <input
                  type="text"
                  value={formData.sub_b_state}
                  onChange={(e) => handleInputChange('sub_b_state', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_state')}
                  disabled={submitting}
                />
                {errors.sub_b_state && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_state}
                  </p>
                )}
              </div>

              {/* ZIP Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_zip_code')} *
                </label>
                <input
                  type="text"
                  value={formData.sub_b_zip_code}
                  onChange={(e) => handleInputChange('sub_b_zip_code', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_zip_code ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_zip_code')}
                  disabled={submitting}
                />
                {errors.sub_b_zip_code && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_zip_code}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getFieldLabel('sub_b_country')} *
                </label>
                <input
                  type="text"
                  value={formData.sub_b_country}
                  onChange={(e) => handleInputChange('sub_b_country', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
                    errors.sub_b_country ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder={getFieldPlaceholder('sub_b_country')}
                  disabled={submitting}
                />
                {errors.sub_b_country && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sub_b_country}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all duration-200 disabled:opacity-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-slate-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-[140px]"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEditing ? "Update" : "Add"} Business</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSubBusiness;