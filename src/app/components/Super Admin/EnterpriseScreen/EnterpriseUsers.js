import React, { useState, useEffect } from 'react';
import { Building2, Mail, Calendar, MapPin, User, CheckCircle, Clock, AlertCircle, XCircle, Search } from 'lucide-react';
import { apiFetch } from '@/app/lib/api.js';
import SubBusinessModal from './EnterprisesSubUsers';

const EnterpriseUsers = () => {
  const [enterprises, setEnterprises] = useState([]);
  const [filteredEnterprises, setFilteredEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiFetch('/superadmin/get-enterprise-sub-business', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add any authentication headers you need
            // 'Authorization': `Bearer ${your_token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data && data.data) {
          setEnterprises(data.data);
          setFilteredEnterprises(data.data);
        } else {
          console.error('Invalid data structure received:', data);
          setEnterprises([]);
          setFilteredEnterprises([]);
        }
        
      } catch (error) {
        console.error('Error fetching enterprise data:', error);
        setError(error.message);
        setEnterprises([]);
        setFilteredEnterprises([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter enterprises based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredEnterprises(enterprises);
    } else {
      const filtered = enterprises.filter(enterprise => {
        const businessName = enterprise.enterprise_user.business_profile?.business_name?.toLowerCase() || '';
        const email = enterprise.enterprise_user.email.toLowerCase();
        const merchantId = enterprise.enterprise_user.merchant_id.toLowerCase();
        const city = enterprise.enterprise_user.business_profile?.city?.toLowerCase() || '';
        const country = enterprise.enterprise_user.business_profile?.country?.toLowerCase() || '';
        const status = enterprise.enterprise_user.business_verified.toLowerCase();

        const searchLower = searchTerm.toLowerCase();
        
        return (
          businessName.includes(searchLower) ||
          email.includes(searchLower) ||
          merchantId.includes(searchLower) ||
          city.includes(searchLower) ||
          country.includes(searchLower) ||
          status.includes(searchLower)
        );
      });
      setFilteredEnterprises(filtered);
    }
  }, [searchTerm, enterprises]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'APPROVED': { color: 'bg-green-900/30 text-green-400 border-green-500/30', icon: CheckCircle },
      'PENDING': { color: 'bg-yellow-900/30 text-yellow-400 border-yellow-500/30', icon: Clock },
      'INCOMPLETE': { color: 'bg-red-900/30 text-red-400 border-red-500/30', icon: AlertCircle },
      'INCOMPLETE PROFILE': { color: 'bg-red-900/30 text-red-400 border-red-500/30', icon: XCircle }
    };
    
    const config = statusConfig[status] || statusConfig['PENDING'];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openModal = (enterprise) => {
    setSelectedEnterprise(enterprise);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEnterprise(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading enterprise data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-red-900/30 rounded-full p-3 w-16 h-16 mx-auto mb-4 border border-red-500/30">
            <AlertCircle className="h-10 w-10 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Failed to Load Data</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Enterprise Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Manage your enterprise users and their sub-businesses
          </p>
          
          {/* Search Bar */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Search enterprises by name, email, ID, location or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XCircle className="h-5 w-5 text-gray-400 hover:text-gray-300" />
              </button>
            )}
          </div>
          
          <div className="mt-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 rounded-full p-3">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Total Enterprise Users</p>
                  <p className="text-2xl font-bold text-white">
                    {filteredEnterprises.length} {searchTerm && <span className="text-sm text-gray-400">of {enterprises.length}</span>}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Users Grid */}
        {filteredEnterprises.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnterprises.map((enterprise) => (
              <div
                key={enterprise.enterprise_user.merchant_id}
                className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:shadow-xl hover:border-gray-600 transition-all duration-300 cursor-pointer"
                onClick={() => openModal(enterprise)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-blue-900/30 rounded-full p-2 border border-blue-500/30">
                      <Building2 className="h-5 w-5 text-blue-400" />
                    </div>
                    {getStatusBadge(enterprise.enterprise_user.business_verified)}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {enterprise.enterprise_user.business_profile?.business_name || 'Incomplete Profile'}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-500" />
                      {enterprise.enterprise_user.email}
                    </div>
                    
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      ID: {enterprise.enterprise_user.merchant_id}
                    </div>
                    
                    {enterprise.enterprise_user.business_profile && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        {enterprise.enterprise_user.business_profile.city}, {enterprise.enterprise_user.business_profile.country}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      {formatDate(enterprise.enterprise_user.created_at)}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Sub-businesses</span>
                      <span className="bg-blue-900/30 text-blue-400 text-sm font-medium px-2.5 py-0.5 rounded-full border border-blue-500/30">
                        {enterprise.sub_businesses_count}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-8 text-center">
            <Search className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              {searchTerm ? 'No matching enterprises found' : 'No enterprises available'}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Try a different search term' : 'There are currently no enterprise users to display'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Sub-Business Modal */}
        <SubBusinessModal
          isOpen={isModalOpen}
          onClose={closeModal}
          enterprise={selectedEnterprise}
        />
      </div>
    </div>
  );
};

export default EnterpriseUsers;