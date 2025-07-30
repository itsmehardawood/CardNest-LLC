import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

const StatsCards = ({ stats }) => {
  return (
    <div className="px-4 sm:px-5 pt-2 pb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600 mr-3 transition-transform duration-200 hover:scale-110">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-700 font-medium">Pending Review</p>
              <p className="text-lg font-bold text-blue-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600 mr-3 transition-transform duration-200 hover:scale-110">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-700 font-medium">Approved</p>
              <p className="text-lg font-bold text-emerald-900">{stats.approved}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;