"use client";

import React, { useState } from "react";
import { RefreshCcw, UserRound, Hash, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { apiFetch } from "@/app/lib/api.js";

const RenewalSubscriptionSection = () => {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [merchantId, setMerchantId] = useState("");
  const [renewalMode, setRenewalMode] = useState("default");
  const [customApiCount, setCustomApiCount] = useState("");
  const [renewalDate, setRenewalDate] = useState(getTodayDate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedMerchantId = merchantId.trim();
    if (!normalizedMerchantId) {
      showNotification("Merchant ID is required", "error");
      return;
    }

    const isCustomMode = renewalMode === "custom";
    const parsedCount = Number(customApiCount);

    if (isCustomMode && (!Number.isInteger(parsedCount) || parsedCount <= 0)) {
      showNotification("Custom API count must be a positive integer", "error");
      return;
    }

    if (isCustomMode && !renewalDate) {
      showNotification("Date is required for new user setup", "error");
      return;
    }

    const payload = isCustomMode
      ? {
          merchant_id: normalizedMerchantId,
          is_new_user: true,
          custom_api_count: parsedCount,
          date: renewalDate,
        }
      : {
          merchant_id: normalizedMerchantId,
        };

    setIsSubmitting(true);
    try {
      const response = await apiFetch("/Subscriptions/setup-renewal", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || data.status === false) {
        throw new Error(data.message || "Failed to set up renewal subscription");
      }

      showNotification(data.message || "Renewal subscription configured successfully", "success");
      setMerchantId("");
      setRenewalMode("default");
      setCustomApiCount("");
      setRenewalDate(getTodayDate());
    } catch (error) {
      showNotification(error.message || "Something went wrong while setting up renewal", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {notification && (
        <div className="fixed right-4 top-20 z-50 w-[90vw] max-w-sm animate-[fadeIn_0.2s_ease-out]">
          <div
            className={`flex items-start gap-2 rounded-lg border px-3 py-3 text-sm shadow-lg backdrop-blur-sm ${
              notification.type === "success"
                ? "border-emerald-700 bg-emerald-900/95 text-emerald-200"
                : "border-red-700 bg-red-900/95 text-red-200"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <RefreshCcw className="h-5 w-5" />
          Renewal Subscription
        </h2>
        <p className="mt-1 text-sm text-gray-300">
          Enable auto-renewal for a merchant by Merchant ID. For a new user, provide custom API count and a start date.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-200">Merchant ID</label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={merchantId}
              onChange={(e) => setMerchantId(e.target.value)}
              placeholder="Enter merchant ID"
              className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <p className="mb-2 block text-sm font-medium text-gray-200">Renewal Setup Type</p>
          <div className="space-y-2 rounded-lg border border-gray-800 bg-gray-900 p-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-200">
              <input
                type="radio"
                name="renewalMode"
                value="default"
                checked={renewalMode === "default"}
                onChange={() => setRenewalMode("default")}
                className="h-4 w-4"
              />
              <span>Normal setup (Merchant ID only)</span>
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-200">
              <input
                type="radio"
                name="renewalMode"
                value="custom"
                checked={renewalMode === "custom"}
                onChange={() => setRenewalMode("custom")}
                className="h-4 w-4"
              />
              <span>New user setup (provide custom API count, date, and send is_new_user: true)</span>
            </label>
          </div>
        </div>

        {renewalMode === "custom" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">Custom API Count</label>
              <div className="relative">
                <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={customApiCount}
                  onChange={(e) => setCustomApiCount(e.target.value)}
                  placeholder="Enter custom API count"
                  className="w-full rounded-lg border border-gray-700 bg-gray-900 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-200">Start Date</label>
              <input
                type="date"
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
          {isSubmitting ? "Submitting..." : "Enable Auto Renewal"}
        </button>
      </form>
      </div>
    </>
  );
};

export default RenewalSubscriptionSection;
