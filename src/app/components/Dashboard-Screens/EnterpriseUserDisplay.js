"use client";

import React from "react";
import { Building2, Users, ArrowRight, Crown, CheckCircle } from "lucide-react";

const EnterpriseUserDisplay = ({ onNavigateToSubBusinesses }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-8 border border-gray-700 shadow-lg">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Enterprise Account
            </h2>
            <p className="text-purple-400 font-medium">
              Premium Business Management
            </p>
          </div> 
    
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full shadow-md border border-gray-600">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-300">Active Enterprise</span>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6 shadow-md border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">
          Welcome to Your Enterprise Dashboard
        </h3>
        <p className="text-gray-300 leading-relaxed">
          As an enterprise user, you have access to advanced business management features. 
          You can manage multiple sub-businesses, track their performance, and oversee 
          all operations from this centralized dashboard. Your enterprise account provides 
          enhanced capabilities for scaling your business operations efficiently.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">Multi-Business Management</span>
          </div>
          <p className="text-sm text-gray-400">
            Manage multiple sub-businesses under one account
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">Team Collaboration</span>
          </div>
          <p className="text-sm text-gray-400">
            Collaborate with team members across different businesses
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">Advanced Analytics</span>
          </div>
          <p className="text-sm text-gray-400">
            Detailed insights and reporting across all businesses
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Crown className="w-5 h-5 text-purple-400" />
            <span className="font-medium text-white">Priority Support</span>
          </div>
          <p className="text-sm text-gray-400">
            24/7 dedicated enterprise support and assistance
          </p>
        </div>
      </div>

      {/* Quick Stats (Optional) */}
      <div className="mt-6 pt-6 border-t border-gray-700">
        <div className="flex flex-wrap gap-6 text-center">
          <div className="flex-1 min-w-[120px]">
            <div className="text-2xl font-bold text-purple-400">∞</div>
            <div className="text-sm text-gray-400">API Calls</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-2xl font-bold text-purple-400">24/7</div>
            <div className="text-sm text-gray-400">Support</div>
          </div>
          <div className="flex-1 min-w-[120px]">
            <div className="text-2xl font-bold text-purple-400">∞</div>
            <div className="text-sm text-gray-400">Sub-Businesses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseUserDisplay;
