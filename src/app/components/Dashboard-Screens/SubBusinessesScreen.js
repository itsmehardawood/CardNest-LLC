

"use client";

import React, { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import AddSubBusiness from './AddSubBusiness';
import SubBusinessList from '../General/SubBusinessList';

const SubBusinessesScreen = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSubBusinessAdded = (newBusiness) => {
    // Handle the new business data here
    console.log("New sub-business added:", newBusiness);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Sub-Businesses</h1>
              <p className="text-gray-400">Manage your sub-businesses and their profiles</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Sub-Business</span>
            </button>
          </div>
        </div>

        {/* Sub-Business List */}
        <SubBusinessList />
      </div>

      {/* Add Sub Business Modal */}
      {showAddModal && (
        <AddSubBusiness
          onSubBusinessAdded={handleSubBusinessAdded}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default SubBusinessesScreen;