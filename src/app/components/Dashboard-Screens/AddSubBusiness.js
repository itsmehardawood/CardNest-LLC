"use client";

import React, { useState } from "react";
import { Plus, X, Building2, Save, AlertCircle, User, Upload, FileText, Trash2, Copy, CheckCircle, XCircle } from "lucide-react";

// Custom Alert Component
const CustomAlert = ({ isOpen, onClose, type = 'info', title, message }) => {
  if (!isOpen) return null;

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
          buttonBg: 'bg-green-600 hover:bg-green-700'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <XCircle className="w-6 h-6 text-red-600" />,
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          buttonBg: 'bg-red-600 hover:bg-red-700'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
          titleColor: 'text-yellow-800',
          messageColor: 'text-yellow-700',
          buttonBg: 'bg-yellow-600 hover:bg-yellow-700'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <AlertCircle className="w-6 h-6 text-blue-600" />,
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          buttonBg: 'bg-blue-600 hover:bg-blue-700'
        };
    }
  };

  const styles = getAlertStyles();

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg max-w-md w-full p-6 transform transition-all duration-200 scale-100`}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${styles.titleColor} mb-2`}>
              {title}
            </h3>
            <p className={`text-sm ${styles.messageColor} mb-4`}>
              {message}
            </p>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className={`px-4 py-2 ${styles.buttonBg} text-white rounded-lg font-medium transition-colors duration-200`}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddSubBusiness = ({ onSubBusinessAdded, onClose, existingBusiness = null, isEditing = false }) => {
  const [subBusinesses, setSubBusinesses] = useState([
    {
      id: 1,
      formData: {
        // Business Information
        sub_b_name: existingBusiness?.sub_b_name || "",
        sub_b_email: existingBusiness?.sub_b_email || "",
        sub_b_reg_no: existingBusiness?.sub_b_reg_no || "",
        sub_b_street: existingBusiness?.sub_b_street || "",
        sub_b_street_line2: existingBusiness?.sub_b_street_line2 || "",
        sub_b_city: existingBusiness?.sub_b_city || "",
        sub_b_state: existingBusiness?.sub_b_state || "",
        sub_b_zip_code: existingBusiness?.sub_b_zip_code || "",
        sub_b_country: existingBusiness?.sub_b_country || "",
        
        // Account Holder Information
        account_holder_first_name: existingBusiness?.account_holder_first_name || "",
        account_holder_last_name: existingBusiness?.account_holder_last_name || "",
        account_holder_email: existingBusiness?.account_holder_email || "",
        account_holder_date_of_birth: existingBusiness?.account_holder_date_of_birth || "",
        account_holder_street: existingBusiness?.account_holder_street || "",
        account_holder_city: existingBusiness?.account_holder_city || "",
        account_holder_state: existingBusiness?.account_holder_state || "",
        account_holder_zip_code: existingBusiness?.account_holder_zip_code || "",
        account_holder_country: existingBusiness?.account_holder_country || "",
        account_holder_id_type: existingBusiness?.account_holder_id_type || "",
        account_holder_id_number: existingBusiness?.account_holder_id_number || "",
      },
      files: {
        registration_document: null,
        account_holder_id_document: null
      },
      errors: {}
    }
  ]);

  const [activeBusinessIndex, setActiveBusinessIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('business'); // 'business' or 'account'
  const [submitting, setSubmitting] = useState(false);
  
  // Custom Alert State
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Helper function to show alerts
  const showAlert = (type, title, message) => {
    setAlert({
      isOpen: true,
      type,
      title,
      message
    });
  };

  const closeAlert = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  const addNewSubBusiness = () => {
    const newId = Math.max(...subBusinesses.map(sb => sb.id)) + 1;
    const newSubBusiness = {
      id: newId,
      formData: {
        sub_b_name: "",
        sub_b_email: "",
        sub_b_reg_no: "",
        sub_b_street: "",
        sub_b_street_line2: "",
        sub_b_city: "",
        sub_b_state: "",
        sub_b_zip_code: "",
        sub_b_country: "",
        account_holder_first_name: "",
        account_holder_last_name: "",
        account_holder_email: "",
        account_holder_date_of_birth: "",
        account_holder_street: "",
        account_holder_city: "",
        account_holder_state: "",
        account_holder_zip_code: "",
        account_holder_country: "",
        account_holder_id_type: "",
        account_holder_id_number: "",
      },
      files: {
        registration_document: null,
        account_holder_id_document: null
      },
      errors: {}
    };

    setSubBusinesses(prev => [...prev, newSubBusiness]);
    setActiveBusinessIndex(subBusinesses.length);
  };

  const removeSubBusiness = (index) => {
    if (subBusinesses.length === 1) {
      showAlert('warning', 'Cannot Remove Business', 'You must have at least one sub-business.');
      return;
    }

    setSubBusinesses(prev => prev.filter((_, i) => i !== index));
    
    // Adjust active index if necessary
    if (activeBusinessIndex >= subBusinesses.length - 1) {
      setActiveBusinessIndex(Math.max(0, subBusinesses.length - 2));
    }
  };

  const duplicateSubBusiness = (index) => {
    const businessToDuplicate = subBusinesses[index];
    const newId = Math.max(...subBusinesses.map(sb => sb.id)) + 1;
    
    const duplicatedBusiness = {
      id: newId,
      formData: { ...businessToDuplicate.formData },
      files: {
        registration_document: null,
        account_holder_id_document: null
      },
      errors: {}
    };

    setSubBusinesses(prev => [...prev, duplicatedBusiness]);
    setActiveBusinessIndex(subBusinesses.length);
  };

  const handleInputChange = (businessIndex, field, value) => {
    setSubBusinesses(prev => prev.map((business, index) => {
      if (index === businessIndex) {
        return {
          ...business,
          formData: {
            ...business.formData,
            [field]: value
          },
          errors: {
            ...business.errors,
            [field]: null // Clear error when user starts typing
          }
        };
      }
      return business;
    }));
  };

  const handleFileChange = (businessIndex, field, file) => {
    // Validate PDF file type
    if (file && file.type !== 'application/pdf') {
      showAlert('error', 'Invalid File Type', 'Please upload only PDF files.');
      return;
    }

    setSubBusinesses(prev => prev.map((business, index) => {
      if (index === businessIndex) {
        return {
          ...business,
          files: {
            ...business.files,
            [field]: file
          },
          errors: {
            ...business.errors,
            [field]: null // Clear error when user selects file
          }
        };
      }
      return business;
    }));
  };

  const validateAllForms = () => {
    let allValid = true;
    const updatedBusinesses = subBusinesses.map((business, businessIndex) => {
      const newErrors = {};
      
      // Required business fields
      const requiredBusinessFields = [
        'sub_b_name', 'sub_b_email', 'sub_b_reg_no', 
        'sub_b_street', 'sub_b_city', 'sub_b_state', 
        'sub_b_zip_code', 'sub_b_country'
      ];

      // Required account holder fields
      const requiredAccountFields = [
        'account_holder_first_name', 'account_holder_last_name', 'account_holder_email', 'account_holder_date_of_birth',
        'account_holder_street', 'account_holder_city', 'account_holder_state',
        'account_holder_zip_code', 'account_holder_country', 'account_holder_id_type',
        'account_holder_id_number'
      ];

      // Validate business fields
      requiredBusinessFields.forEach(field => {
        if (!business.formData[field].trim()) {
          newErrors[field] = 'This field is required';
          allValid = false;
        }
      });

      // Validate account holder fields
      requiredAccountFields.forEach(field => {
        if (!business.formData[field].trim()) {
          newErrors[field] = 'This field is required';
          allValid = false;
        }
      });

      // Email validation
      if (business.formData.sub_b_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.formData.sub_b_email)) {
        newErrors.sub_b_email = 'Please enter a valid email address';
        allValid = false;
      }

      if (business.formData.account_holder_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.formData.account_holder_email)) {
        newErrors.account_holder_email = 'Please enter a valid email address';
        allValid = false;
      }

      // File validation
      if (!business.files.registration_document && !isEditing) {
        newErrors.registration_document = 'Registration document is required';
        allValid = false;
      }

      if (!business.files.account_holder_id_document && !isEditing) {
        newErrors.account_holder_id_document = 'Account holder ID document is required';
        allValid = false;
      }

      return {
        ...business,
        errors: newErrors
      };
    });

    setSubBusinesses(updatedBusinesses);
    return allValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAllForms()) {
      showAlert('error', 'Validation Error', 'Please fix all validation errors before submitting.');
      return;
    }

    setSubmitting(true);

    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const merchantId = userData.merchant_id;

      if (!merchantId) {
        showAlert('error', 'Authentication Error', 'User data not found. Please login again.');
        setSubmitting(false);
        return;
      }

      // Create FormData
      const apiFormData = new FormData();
      
      // Add parent_id
      apiFormData.append('parent_id', merchantId);
      
      // Add all sub-businesses with proper indexing
      subBusinesses.forEach((business, index) => {
        // Only add non-empty form fields to avoid validation issues
        Object.keys(business.formData).forEach(key => {
          const value = business.formData[key];
          if (value && value.trim && value.trim() !== '') {
            apiFormData.append(`sub_businesses[${index}][${key}]`, value.trim());
          } else if (value) {
            apiFormData.append(`sub_businesses[${index}][${key}]`, value);
          }
        });
        
        // Add files only if they exist
        if (business.files.registration_document) {
          apiFormData.append(`sub_businesses[${index}][registration_document]`, business.files.registration_document);
        }
        
        if (business.files.account_holder_id_document) {
          apiFormData.append(`sub_businesses[${index}][account_holder_id_document]`, business.files.account_holder_id_document);
        }
      });

      // Debug: Log FormData contents (remove in production)
      console.log('Submitting FormData:');
      for (let pair of apiFormData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch('https://admin.cardnest.io/api/superadmin/sub-business-store', {
        method: 'POST',
        body: apiFormData,
        // Note: Don't set Content-Type header when using FormData - browser sets it automatically with boundary
      });

      let result;
      try {
        result = await response.json();
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        // Enhanced error handling for 422 responses
        if (response.status === 422) {
          const errorMessage = result.message || 'Validation failed on server';
          const validationErrors = result.errors || result.data || {};
          
          console.error('422 Validation Error Details:', {
            message: errorMessage,
            errors: validationErrors,
            status: response.status
          });
          
          // If there are specific field errors, show them
          if (validationErrors && typeof validationErrors === 'object') {
            const errorDetails = Object.entries(validationErrors)
              .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
              .join('\n');
            
            showAlert('error', 'Server Validation Error', `${errorMessage}\n\nDetails:\n${errorDetails}`);
          } else {
            showAlert('error', 'Server Validation Error', errorMessage);
          }
          return;
        }
        
        throw new Error(result.message || `Server error: ${response.status}`);
      }

      // Call the callback to update parent component
      if (onSubBusinessAdded) {
        onSubBusinessAdded(subBusinesses.map(business => ({
          ...business.formData,
          id: result.data?.id || Date.now()
        })));
      }

      // Show success message
      showAlert('success', 'Success!', `${subBusinesses.length} sub-business${subBusinesses.length > 1 ? 'es' : ''} ${isEditing ? 'updated' : 'added'} successfully!`);
      
      // Close the form after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      console.error("Error saving sub-businesses:", err);
      showAlert('error', 'Error', err.message || "Failed to save sub-businesses. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      // Business fields
      sub_b_name: "Business Name",
      sub_b_email: "Business Email",
      sub_b_reg_no: "Registration Number",
      sub_b_street: "Street Address",
      sub_b_street_line2: "Street Line 2",
      sub_b_city: "City",
      sub_b_state: "State/Province",
      sub_b_zip_code: "ZIP/Postal Code",
      sub_b_country: "Country",
      
      // Account holder fields
      account_holder_first_name: "First Name",
      account_holder_last_name: "Last Name",
      account_holder_email: "Account Holder Email",
      account_holder_date_of_birth: "Date of Birth",
      account_holder_street: "Street Address",
      account_holder_city: "City",
      account_holder_state: "State/Province",
      account_holder_zip_code: "ZIP/Postal Code",
      account_holder_country: "Country",
      account_holder_id_type: "ID Type",
      account_holder_id_number: "ID Number",
      
      // File fields
      registration_document: "Registration Document (PDF only)",
      account_holder_id_document: "Account Holder ID Document (PDF only)"
    };
    return labels[field] || field;
  };

  const getFieldPlaceholder = (field) => {
    const placeholders = {
      // Business fields
      sub_b_name: "Enter business name",
      sub_b_email: "Enter business email",
      sub_b_reg_no: "Enter registration number",
      sub_b_street: "Enter street address",
      sub_b_street_line2: "Apartment, suite, etc. (Optional)",
      sub_b_city: "Enter city",
      sub_b_state: "Enter state/province",
      sub_b_zip_code: "Enter ZIP/postal code",
      sub_b_country: "Enter country",
      
      // Account holder fields
      account_holder_first_name: "Enter first name",
      account_holder_last_name: "Enter last name",
      account_holder_email: "Enter account holder email",
      account_holder_date_of_birth: "YYYY-MM-DD",
      account_holder_street: "Enter street address",
      account_holder_city: "Enter city",
      account_holder_state: "Enter state/province",
      account_holder_zip_code: "Enter ZIP/postal code",
      account_holder_country: "Enter country",
      account_holder_id_type: "e.g., Passport, Driver's License",
      account_holder_id_number: "Enter ID number without dashes and spaces"
    };
    return placeholders[field] || "";
  };

  const currentBusiness = subBusinesses[activeBusinessIndex];

  const renderFormField = (field, type = "text", isRequired = true, isSelectField = false, selectOptions = []) => {
    const fieldValue = currentBusiness.formData[field];
    const fieldError = currentBusiness.errors[field];

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getFieldLabel(field)} {isRequired && "*"}
        </label>
        {isSelectField ? (
          <select
            value={fieldValue}
            onChange={(e) => handleInputChange(activeBusinessIndex, field, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
              fieldError ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={submitting}
          >
            <option value="">Select {getFieldLabel(field)}</option>
            {selectOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={fieldValue}
            onChange={(e) => handleInputChange(activeBusinessIndex, field, e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white text-gray-900 ${
              fieldError ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder={getFieldPlaceholder(field)}
            disabled={submitting}
          />
        )}
        {fieldError && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {fieldError}
          </p>
        )}
      </div>
    );
  };

  const renderFileField = (field, isRequired = true) => {
    const fieldFile = currentBusiness.files[field];
    const fieldError = currentBusiness.errors[field];

    return (
      <div className="lg:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {getFieldLabel(field)} {isRequired && "*"}
        </label>
        <button
          type="button"
          className={`w-full flex items-center justify-center px-4 py-4 border-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            fieldError ? 'border-red-500 bg-red-50' : 'border-indigo-400 bg-indigo-50 hover:bg-indigo-100'
          }`}
          onClick={() => {
            document.getElementById(`file-input-${field}-${activeBusinessIndex}`).click();
          }}
          disabled={submitting}
        >
          <FileText className="w-6 h-6 text-indigo-600 mr-3" />
          <span className="text-base text-indigo-800 font-medium">
            {fieldFile ? fieldFile.name : `Click to upload PDF ${getFieldLabel(field).toLowerCase()}`}
          </span>
        </button>
        <input
          id={`file-input-${field}-${activeBusinessIndex}`}
          type="file"
          style={{ display: 'none' }}
          onChange={(e) => handleFileChange(activeBusinessIndex, field, e.target.files[0])}
          accept=".pdf"
          disabled={submitting}
        />
        <p className="mt-1 text-xs text-gray-500">Only PDF files are accepted</p>
        {fieldError && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {fieldError}
          </p>
        )}
      </div>
    );
  };

  const renderBusinessFields = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Business Name */}
      <div className="lg:col-span-2">
        {renderFormField('sub_b_name')}
      </div>

      {/* Email & Registration Number */}
      {renderFormField('sub_b_email', 'email')}
      {renderFormField('sub_b_reg_no')}

      {/* Address Fields */}
      {renderFormField('sub_b_street')}
      <div>{renderFormField('sub_b_street_line2', 'text', false)}</div>
      {renderFormField('sub_b_city')}
      {renderFormField('sub_b_state')}
      {renderFormField('sub_b_zip_code')}
      {renderFormField('sub_b_country')}

      {/* Registration Document */}
      {renderFileField('registration_document')}
    </div>
  );

  const idTypeOptions = [
    { value: "passport", label: "Passport" },
    { value: "drivers_license", label: "Driver's License" },
    { value: "national_id", label: "National ID" },
    { value: "other", label: "Other" }
  ];

  const renderAccountHolderFields = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Account Holder Info */}
      {renderFormField('account_holder_first_name')}
      {renderFormField('account_holder_last_name')}
      {renderFormField('account_holder_email', 'email')}
      {renderFormField('account_holder_date_of_birth', 'date')}
      {renderFormField('account_holder_id_type', 'text', true, true, idTypeOptions)}
      {renderFormField('account_holder_id_number')}

      {/* Account Holder Address */}
      <div className="lg:col-span-2">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Account Holder Address</h4>
      </div>
      {renderFormField('account_holder_street')}
      {renderFormField('account_holder_city')}
      {renderFormField('account_holder_state')}
      {renderFormField('account_holder_zip_code')}
      {renderFormField('account_holder_country')}

      {/* ID Document */}
      {renderFileField('account_holder_id_document')}
    </div>
  );

  return (
    <>
      {/* Custom Alert */}
      <CustomAlert
        isOpen={alert.isOpen}
        onClose={closeAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
      />
      
      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditing ? "Edit Sub-Business" : "Add Sub-Businesses"}
                </h2>
                <p className="text-slate-100">
                  {isEditing ? "Update business information" : `Managing ${subBusinesses.length} sub-business${subBusinesses.length > 1 ? 'es' : ''}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={addNewSubBusiness}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
                disabled={submitting}
              >
                <Plus className="w-4 h-4" />
                <span>Add Business</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                disabled={submitting}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Business Tabs */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Sub-Businesses</h3>
            <span className="text-sm text-gray-500">Total: {subBusinesses.length}</span>
          </div>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {subBusinesses.map((business, index) => (
              <div key={business.id} className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setActiveBusinessIndex(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 whitespace-nowrap ${
                    activeBusinessIndex === index
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Business {index + 1}</span>
                  {business.formData.sub_b_name && (
                    <span className="text-xs opacity-75">
                      ({business.formData.sub_b_name.substring(0, 10)}...)
                    </span>
                  )}
                </button>
                <div className="flex space-x-1">
                  <button
                    type="button"
                    onClick={() => duplicateSubBusiness(index)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Duplicate this business"
                    disabled={submitting}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {subBusinesses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSubBusiness(index)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Remove this business"
                      disabled={submitting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Tabs */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('business')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'business'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Business Information</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('account')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                activeTab === 'account'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Account Holder</span>
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 max-h-[calc(95vh-300px)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'business' ? renderBusinessFields() : renderAccountHolderFields()}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
              <div className="flex space-x-4">
                {activeTab === 'business' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('account')}
                    className="px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 font-medium transition-all duration-200"
                    disabled={submitting}
                  >
                    Next: Account Holder →
                  </button>
                )}
                {activeTab === 'account' && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('business')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-all duration-200"
                    disabled={submitting}
                  >
                    ← Back: Business Info
                  </button>
                )}
              </div>

              <div className="flex space-x-4">
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
                      <span>
                        {isEditing ? "Update" : "Save All"} ({subBusinesses.length})
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
};

export default AddSubBusiness;