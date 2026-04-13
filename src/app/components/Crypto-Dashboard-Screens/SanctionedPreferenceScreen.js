'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle2, Edit2, X, Check, AlertCircle, Clock } from 'lucide-react';
import { cryptoApiFetch } from '@/app/lib/api.js';

const OPTIONS = ['approve', 'reject', 'review'];

function SanctionedPreferenceScreen() {
  const [merchantId, setMerchantId] = useState('');
  const [selectedPreference, setSelectedPreference] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [initialPreference, setInitialPreference] = useState('');

  const getMerchantIdFromStorage = () => {
    try {
      const stored = localStorage.getItem('userData');
      if (!stored) return '';
      const parsed = JSON.parse(stored);
      const user = parsed?.user || parsed;
      return user?.merchant_id || '';
    } catch {
      return '';
    }
  };

  const extractPreference = (payload) => {
    const data = payload?.data || payload;
    const preference =
      data?.sanctioned_preference ||
      data?.sanctionedPreference ||
      data?.preference ||
      '';

    return typeof preference === 'string' ? preference.toLowerCase() : '';
  };

  const fetchPreference = async (currentMerchantId) => {
    setLoading(true);
    setError('');

    if (!currentMerchantId) {
      setError('Merchant ID not found. Please log in again.');
      setSelectedPreference('');
      setLoading(false);
      return;
    }

    try {
      const response = await cryptoApiFetch(
        `/crypto/sanctioned-preference?merchant_id=${encodeURIComponent(currentMerchantId)}`,
        { method: 'GET' }
      );

      if (!response.ok) {
        throw new Error(`Failed to load preference (${response.status})`);
      }

      const payload = await response.json();
      const preference = extractPreference(payload);
      const validPreference = OPTIONS.includes(preference) ? preference : '';
      setSelectedPreference(validPreference);
      setInitialPreference(validPreference);
      setIsEditing(!validPreference);
    } catch (err) {
      setError(err?.message || 'Failed to load sanctioned preference.');
      setSelectedPreference('');
      setInitialPreference('');
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentMerchantId = getMerchantIdFromStorage();
    setMerchantId(currentMerchantId);
    fetchPreference(currentMerchantId);
  }, []);

  const handleSave = async () => {
    setError('');
    setSuccess('');

    if (!merchantId) {
      setError('Merchant ID not found. Please log in again.');
      return;
    }

    if (!selectedPreference) {
      setError('Please select a sanctioned preference option.');
      return;
    }

    setSaving(true);

    try {
      const response = await cryptoApiFetch('/crypto/sanctioned-preference', {
        method: 'POST',
        body: JSON.stringify({
          merchant_id: merchantId,
          sanctioned_preference: selectedPreference,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to save preference (${response.status})`);
      }

      setSuccess('Sanctioned preference saved successfully.');
      setInitialPreference(selectedPreference);
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || 'Failed to save sanctioned preference.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedPreference(initialPreference);
    setIsEditing(false);
    setError('');
  };

  return (
    <div className="p-8 space-y-8 text-white w-full">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-lg">
            <AlertCircle className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Sanctioned Preference</h1>
            <p className="text-gray-400 text-base mt-1">Define your policy for sanctioned addresses</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current Preference Display */}
        {!isEditing && selectedPreference && !loading && (
          <div className="relative overflow-hidden rounded-xl border border-green-500/30 bg-gradient-to-r from-green-900/20 to-green-900/10 p-6 shadow-lg backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-transparent" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-600/30 border border-green-500/30 flex items-center justify-center">
                  <Check className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-green-300/70">Active Policy</p>
                  <p className="text-3xl font-bold text-green-300 capitalize mt-2">{selectedPreference}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
            <p className="text-gray-300 font-medium">Loading your preference...</p>
          </div>
        )}

        {/* Edit Mode - Preference Options */}
        {!loading && isEditing && (
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-300/70">Select Your Preference</p>
            <div className="space-y-3">
              {/* Approve Option */}
              <label className="group cursor-pointer">
                <div className={`relative flex items-start gap-4 rounded-xl border-2 transition-all duration-200 p-5 ${ selectedPreference === 'approve' ? 'border-green-500 bg-green-900/20 shadow-lg shadow-green-500/20' : 'border-gray-700 bg-gray-800/40 group-hover:border-gray-600 group-hover:bg-gray-800/60' }`}>
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="radio"
                      name="sanctioned_preference"
                      value="approve"
                      checked={selectedPreference === 'approve'}
                      onChange={(e) => setSelectedPreference(e.target.value)}
                      className="w-5 h-5 accent-green-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-300 flex items-center gap-2">
                      <Check className="w-4 h-4" /> Approve
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Validate addresses even if they appear on sanctioned lists.</p>
                  </div>
                </div>
              </label>

              {/* Reject Option */}
              <label className="group cursor-pointer">
                <div className={`relative flex items-start gap-4 rounded-xl border-2 transition-all duration-200 p-5 ${ selectedPreference === 'reject' ? 'border-red-500 bg-red-900/20 shadow-lg shadow-red-500/20' : 'border-gray-700 bg-gray-800/40 group-hover:border-gray-600 group-hover:bg-gray-800/60' }`}>
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="radio"
                      name="sanctioned_preference"
                      value="reject"
                      checked={selectedPreference === 'reject'}
                      onChange={(e) => setSelectedPreference(e.target.value)}
                      className="w-5 h-5 accent-red-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-red-300 flex items-center gap-2">
                      <X className="w-4 h-4" /> Reject
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Block validation and fail immediately for sanctioned addresses.</p>
                  </div>
                </div>
              </label>

              {/* Review Option */}
              <label className="group cursor-pointer">
                <div className={`relative flex items-start gap-4 rounded-xl border-2 transition-all duration-200 p-5 ${ selectedPreference === 'review' ? 'border-yellow-500 bg-yellow-900/20 shadow-lg shadow-yellow-500/20' : 'border-gray-700 bg-gray-800/40 group-hover:border-gray-600 group-hover:bg-gray-800/60' }`}>
                  <div className="flex-shrink-0 mt-1">
                    <input
                      type="radio"
                      name="sanctioned_preference"
                      value="review"
                      checked={selectedPreference === 'review'}
                      onChange={(e) => setSelectedPreference(e.target.value)}
                      className="w-5 h-5 accent-yellow-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-yellow-300 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Review
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Flag sanctioned addresses for manual review before validation.</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Information Panel */}
        <div className="rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-blue-900/10 p-6 space-y-4 backdrop-blur-sm">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-300/70 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" /> How This Works
          </p>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-400">Approve Policy</p>
                <p className="text-sm text-gray-300 mt-1">Addresses will pass validation even if flagged on sanctioned lists. Use when you need to override automated checks.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-400">Reject Policy</p>
                <p className="text-sm text-gray-300 mt-1">Addresses will be blocked immediately and validation will fail. Highest security - maintains compliance strictest.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-400">Review Policy</p>
                <p className="text-sm text-gray-300 mt-1">Addresses will be flagged for your team to review manually. Balanced approach for careful verification.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="rounded-lg border border-red-500/50 bg-red-900/20 px-5 py-4 text-sm text-red-300 flex items-start gap-3 backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-green-500/50 bg-green-900/20 px-5 py-4 text-sm text-green-300 flex items-start gap-3 backdrop-blur-sm">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>{success}</div>
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-purple-900 disabled:to-purple-900 disabled:cursor-not-allowed px-6 py-3 text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Preference'}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed px-6 py-3 text-sm font-semibold transition-all duration-200"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SanctionedPreferenceScreen;