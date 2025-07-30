import React from 'react';
import { Eye, CheckCircle, Calendar, Mail, FileText, Users, ChevronDown, ChevronUp, Clock, Briefcase, FileDigit } from 'lucide-react';

const BusinessTable = ({ 
  activeTab, 
  filteredBusinesses, 
  filteredApprovedBusinesses, 
  approvedLoading, 
  handleViewDocument, 
  expandedBusiness, 
  toggleExpandBusiness 
}) => {
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (verified) => {
    const status = String(verified).toUpperCase();
    
    if (status === "1" || status === "APPROVED") {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          <span>Approved</span>
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border border-amber-200 shadow-sm transition-all duration-200 hover:shadow-md">
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          <span>Pending</span>
        </div>
      );
    }
  };

  const renderBusinessTable = (businessList, isApproved = false) => (
    <div className="overflow-hidden">
      {isApproved && approvedLoading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading approved businesses...</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[200px]">
                    Company Details
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[180px]">
                    Contact
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[150px]">
                    {isApproved ? 'Approved Date' : 'Requested Date'}
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[120px]">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {businessList.map((business) => (
                  <tr key={business.id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-105">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">{business.business_name}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <FileDigit className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-[160px]">{business.business_registration_number}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-blue-500 mr-2 transition-transform duration-200 hover:scale-110" />
                        <div className="text-sm text-gray-900 truncate max-w-[160px]">{business.user.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-purple-500 mr-2 transition-transform duration-200 hover:scale-110" />
                        <div className="text-sm text-gray-700 truncate max-w-[120px]">
                          {formatDate(isApproved ? business.updated_at : business.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(business.user.business_verified)}
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewDocument(business)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white bg-gradient-to-r bg-slate-800 hover:from-blue-800 hover:to-blue-800 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 hover:scale-110" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-1 gap-3">
              {businessList.map((business) => (
                <div key={business.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out hover:border-blue-100">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mr-3 transition-transform duration-200 hover:scale-105">
                        <Briefcase className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{business.business_name}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <FileDigit className="w-3 h-3 mr-1" />
                          <span className="truncate max-w-[180px]">{business.business_registration_number}</span>
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(business.user.business_verified)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center text-xs text-gray-700 bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100">
                      <Mail className="h-3.5 w-3.5 mr-2 text-blue-500" />
                      <span className="truncate">{business.user.email}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 bg-gray-50 rounded-lg p-2 transition-all duration-200 hover:bg-gray-100">
                      <Calendar className="h-3.5 w-3.5 mr-2 text-purple-500" />
                      <span className="truncate">{formatDate(isApproved ? business.updated_at : business.created_at)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleViewDocument(business)}
                    className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 hover:scale-110" />
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {businessList.map((business) => (
              <div key={business.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 ease-in-out hover:border-blue-100">
                <div 
                  className="p-3 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleExpandBusiness(business.id)}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{business.business_name}</h3>
                    <p className="text-xs text-gray-500 mt-1 flex items-center truncate">
                      <Mail className="w-3 h-3 mr-1 transition-transform duration-200 hover:scale-110" />
                      {business.user.email}
                    </p>
                  </div>
                  <div className="flex items-center ml-2">
                    {getStatusBadge(business.user.business_verified)}
                    {expandedBusiness === business.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-500 ml-2 transition-transform duration-200 hover:scale-125" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500 ml-2 transition-transform duration-200 hover:scale-125" />
                    )}
                  </div>
                </div>
                
                {expandedBusiness === business.id && (
                  <div className="px-3 pb-3 pt-1 border-t border-gray-100 transition-all duration-300 ease-in-out">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-gray-50 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100">
                        <p className="text-xs text-gray-500 flex items-center">
                          <FileDigit className="w-3 h-3 mr-1" />
                          Reg. Number
                        </p>
                        <p className="text-xs font-medium truncate text-gray-700">{business.business_registration_number}</p>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100">
                        <p className="text-xs text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {isApproved ? 'Approved' : 'Requested'}
                        </p>
                        <p className="text-xs font-medium truncate text-gray-700">
                          {formatDate(isApproved ? business.updated_at : business.created_at)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDocument(business)}
                      className="w-full inline-flex items-center justify-center px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-medium rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5 transition-transform duration-200 hover:scale-110" />
                      View Details
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderEmptyState = (title, description, icon) => (
    <div className="p-8 text-center rounded-xl bg-gray-50 border border-dashed border-gray-200 hover:shadow-md transition-all duration-300">
      <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-r from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 mb-3 transition-transform duration-200 hover:scale-110">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-xs max-w-md mx-auto">{description}</p>
    </div>
  );

  return (
    <div className="bg-gray-50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-sm">
      {activeTab === 'pending' && (
        <>
          {filteredBusinesses.length > 0 ? (
            renderBusinessTable(filteredBusinesses)
          ) : (
            renderEmptyState(
              'No Pending Verification Requests',
              'All verification requests have been processed. Check back later for new submissions.',
              <FileText className="h-5 w-5" />
            )
          )}
        </>
      )}

      {activeTab === 'approved' && (
        <>
          {filteredApprovedBusinesses.length > 0 || approvedLoading ? (
            renderBusinessTable(filteredApprovedBusinesses, true)
          ) : (
            renderEmptyState(
              'No Approved Businesses',
              'Approved businesses will appear here once you start verifying pending requests.',
              <Users className="h-5 w-5" />
            )
          )}
        </>
      )}
    </div>
  );
};

export default BusinessTable;