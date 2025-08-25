"use client";
import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiDownload,
  FiTrash2,
  FiUpload,
  FiFileText,
  FiCopy,
  FiExternalLink,
} from "react-icons/fi";
import { FaShieldAlt } from "react-icons/fa";
import { apiFetch } from "@/app/lib/api.js";

function DocumentsScreen({ documents, setActiveTab, handleFileUpload }) {
  const [userData, setUserData] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [securityReminderVisible, setSecurityReminderVisible] = useState(true);

  useEffect(() => {
    const fetchBusinessVerificationStatus = async () => {
      try {
        const storedUser = localStorage.getItem("userData");

        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const userObj = parsedUser.user || parsedUser;
          setUserData(userObj);

          if (userObj.id) {
            const response = await apiFetch(
              `/business-profile/business-verification-status?user_id=${userObj.id}`,
              {
                headers: {
                  Authorization: `Bearer ${userObj.token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              setVerificationData(data);
            } else {
              setApiError(
                "Failed to load verification status. Please try again later."
              );
            }
          }
        }
      } catch (error) {
        console.error("Verification status error:", error);
        setApiError("Network error occurred. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessVerificationStatus();
  }, []);

  const maskEncryptionKey = (key) => {
    if (!key || key.length <= 8) return "••••••••";
    const firstFour = key.substring(0, 4);
    const lastFour = key.substring(key.length - 4);
    const middle = "•".repeat(key.length - 8);
    return `${firstFour}${middle}${lastFour}`;
  };

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleUploadNew = () => {
    setActiveTab("profile");
    setTimeout(() => {
      const fileUploadSection = document.querySelector(
        '[data-section="document-upload"]'
      );
      if (fileUploadSection) {
        fileUploadSection.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  };

  const handleDownload = (docUrl, docName = "document") => {
    if (!docUrl) {
      console.error("No document URL provided.");
      return;
    }

    try {
      const urlObj = new URL(docUrl);

      // Basic security check
      if (urlObj.protocol !== "http:") {
        console.error("Blocked insecure document URL:", docUrl);
        return;
      }

      // More robust way to check origin, if needed
      const allowedHostnames = [
        "yourbucket.s3.amazonaws.com",
        "admin.cardnest.io",
        "cardsecuritysystem-8xdez.ondigitalocean.app"
      ];
      if (!allowedHostnames.includes(urlObj.hostname)) {
        console.error("Document URL hostname not allowed:", urlObj.hostname);
        return;
      }

      const link = document.createElement("a");
      link.href = docUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.download = docName; // May be ignored for CORS resources
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    }
  };


  


  const handleDelete = (docName, index) => {
    if (
      window.confirm(
        `Are you sure you want to permanently delete ${docName}? This action cannot be undone.`
      )
    ) {
      // console.log("Delete document:", docName);
      // Implement actual delete functionality here
    }
  };

  const handleDirectUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    // Validate file types
    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    for (let i = 0; i < e.target.files.length; i++) {
      if (!validTypes.includes(e.target.files[i].type)) {
        alert(
          "Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files only."
        );
        return;
      }

      if (e.target.files[i].size > 10 * 1024 * 1024) {
        // 10MB limit
        alert("File size exceeds 10MB limit. Please upload smaller files.");
        return;
      }
    }

    if (handleFileUpload) {
      handleFileUpload(e);
    } else {
      handleUploadNew();
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FiFileText className="text-red-500 text-xl" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <FiFileText className="text-blue-500 text-xl" />;
      case "doc":
      case "docx":
        return <FiFileText className="text-indigo-500 text-xl" />;
      default:
        return <FiFileText className="text-gray-500 text-xl" />;
    }
  };
const renderCredentialsSection = () => {
    const profile = verificationData?.data?.business_profile;
    const aesKey = verificationData?.data?.aes_key;

    if (!aesKey) return null;

    return (
      <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-6 mt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 bg-purple-900 text-purple-300 rounded-full flex items-center justify-center">
            <FaShieldAlt className="text-xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              API Credentials
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Secure credentials for API integration. Keep them confidential.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {userData?.merchant_id && (
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Merchant ID
                </label>
                <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                  Public
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 px-4 py-2 text-sm font-mono bg-black border border-gray-700 rounded-lg break-all text-white">
                  {userData.merchant_id}
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(userData.merchant_id, "merchantId")
                  }
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  aria-label="Copy Merchant ID"
                >
                  <FiCopy size={14} />
                  {copiedField === "merchantId" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {aesKey && (
            <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  AES Encryption Key
                </label>
                <span className="text-xs bg-red-900 text-red-300 px-2 py-1 rounded">
                  Private
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 px-4 py-2 text-sm font-mono bg-black border border-gray-700 rounded-lg break-all text-white">
                  {maskEncryptionKey(aesKey)}
                </div>
                <button
                  onClick={() => copyToClipboard(aesKey, "aesKey")}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                  aria-label="Copy AES Key"
                >
                  <FiCopy size={14} />
                  {copiedField === "aesKey" ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                <strong>Security Notice:</strong> This key grants full API
                access. Never share it or expose it in client-side code.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderApprovedDocuments = () => {
    const profile = verificationData?.data?.business_profile;

    return (
      <div className="space-y-6">
        <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-900 text-green-400 rounded-full flex items-center justify-center">
                <FiCheckCircle className="text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  Verified Documents
                </h2>
                <p className="text-sm text-green-400">
                  All documents have been approved
                </p>
              </div>
            </div>
            <div className="px-3 py-1 bg-green-900 text-green-300 text-sm rounded-full font-medium">
              VERIFIED
            </div>
          </div>

          <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className="text-green-400" />
              <h3 className="font-medium text-green-300">
                Verification Complete
              </h3>
            </div>
            <p className="text-green-200 text-sm">
              Your business documents have been successfully verified and your
              account is fully active.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">
              Submitted Documents
            </h3>

            {profile?.registration_document_path && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-900 text-blue-400 rounded-lg flex items-center justify-center">
                    <FiFileText className="text-xl" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      Business Registration Document
                    </p>
                    <p className="text-sm text-gray-300">Required Document</p>
                    <p className="text-xs text-gray-400">
                      Verified on{" "}
                      {new Date(profile?.updated_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full font-medium">
                    Verified
                  </span>
                  <button
                    onClick={() =>
                      handleDownload(
                        profile?.registration_document_path,
                        "Business_Registration_Document"
                      )
                    }
                    className="px-3 py-1 text-blue-400 hover:text-blue-300 text-sm hover:bg-blue-900 rounded flex items-center gap-1 transition-colors"
                    aria-label="View document"
                  >
                    <FiExternalLink className="text-sm" /> View
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
            <h4 className="font-medium text-white mb-3">
              Verified Business Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300">Business Name</p>
                <p className="font-medium text-white break-words">
                  {profile?.business_name}
                </p>
              </div>
              <div>
                <p className="text-gray-300">Registration Number</p>
                <p className="font-medium text-white break-words">
                  {profile?.business_registration_number}
                </p>
              </div>
              <div>
                <p className="text-gray-300">Account Holder</p>
                <p className="font-medium text-white break-words">
                  {profile?.account_holder_first_name}{" "}
                  {profile?.account_holder_last_name}
                </p>
              </div>
              <div>
                <p className="text-gray-300">Verification Date</p>
                <p className="font-medium text-white">
                  {new Date(profile?.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {renderCredentialsSection()}

        {securityReminderVisible && (
          <div className="bg-black rounded-xl shadow-sm border border-blue-700 p-6">
            <div className="flex items-start gap-3">
              <div className="mt-1">
                <FaShieldAlt className="text-blue-400 text-xl" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Security Reminder
                  </h3>
                  <button
                    onClick={() => setSecurityReminderVisible(false)}
                    className="text-gray-400 hover:text-gray-300"
                    aria-label="Dismiss security reminder"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Your documents contain sensitive information. Please ensure
                  you:
                </p>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      Never share your documents or credentials via unsecured
                      channels
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      Only download documents on secure, private networks
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>
                      Regularly review and update your uploaded documents
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPendingDocuments = () => {
    const profile = verificationData?.data?.business_profile;

    return (
      <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-900 text-yellow-400 rounded-full flex items-center justify-center">
              <FiClock className="text-xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Documents Under Review
              </h2>
              <p className="text-sm text-yellow-400">
                Your documents are being verified
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-yellow-900 text-yellow-300 text-sm rounded-full font-medium">
            IN REVIEW
          </div>
        </div>

        <div className="mb-6 p-4 bg-yellow-900 border border-yellow-700 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <FiClock className="text-yellow-400" />
            <h3 className="font-medium text-yellow-300">Review in Progress</h3>
          </div>
          <p className="text-yellow-200 text-sm">
            Your business documents have been submitted and are currently being
            reviewed by our team. This process typically takes 1-3 business
            days. You will receive a notification once completed.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">
            Submitted Documents
          </h3>

          {profile?.registration_document_path && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-900 text-blue-400 rounded-lg flex items-center justify-center">
                  <FiFileText className="text-xl" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    Business Registration Document
                  </p>
                  <p className="text-sm text-gray-300">Required Document</p>
                  <p className="text-xs text-gray-400">
                    Submitted on{" "}
                    {new Date(profile?.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2 py-1 bg-yellow-900 text-yellow-300 text-xs rounded-full font-medium">
                  Under Review
                </span>
              <a target="_blank">
                  <button 
                  onClick={() =>
                    handleDownload(
                      profile?.registration_document_path,
                      "Business_Registration_Document"
                    )
                  }
                  className="px-3 py-1 text-blue-400 hover:text-blue-300 text-sm hover:bg-blue-900 rounded flex items-center gap-1 transition-colors"
                  aria-label="View document"
                >
                  <FiExternalLink className="text-sm" /> View
                </button>
              </a>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <h4 className="font-medium text-white mb-3">
            Submitted Business Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-300">Business Name</p>
              <p className="font-medium text-white break-words">
                {profile?.business_name}
              </p>
            </div>
            <div>
              <p className="text-gray-300">Registration Number</p>
              <p className="font-medium text-white break-words">
                {profile?.business_registration_number}
              </p>
            </div>
            <div>
              <p className="text-gray-300">Account Holder</p>
              <p className="font-medium text-white break-words">
                {profile?.account_holder_first_name}{" "}
                {profile?.account_holder_last_name}
              </p>
            </div>
            <div>
              <p className="text-gray-300">Submission Date</p>
              <p className="font-medium text-white">
                {new Date(profile?.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-900 rounded-lg border border-blue-700">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="text-blue-400 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-300 mb-1">
                Need to update your documents?
              </h4>
              <p className="text-blue-200 text-sm">
                If you need to submit updated documents, please contact our
                support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRegularDocumentsScreen = () => {
    return (
      <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Business Documents
            </h2>
            <p className="text-sm text-gray-400">
              Upload and manage your business verification documents
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {handleFileUpload && (
              <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm cursor-pointer text-center transition-colors flex items-center justify-center gap-2">
                <FiUpload className="text-sm" /> Quick Upload
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleDirectUpload}
                  className="hidden"
                  aria-label="Upload documents"
                />
              </label>
            )}
            <button
              onClick={handleUploadNew}
              className="px-4 py-2 bg-black border border-blue-600 text-blue-400 rounded-lg hover:bg-blue-900 text-sm transition-colors flex items-center justify-center gap-2"
              aria-label="Upload new documents"
            >
              <FiFileText className="text-sm" /> Upload New
            </button>
          </div>
        </div>

        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-900 rounded-lg border border-gray-700 gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-blue-900 rounded flex items-center justify-center flex-shrink-0">
                    {getFileIcon(doc.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB • Uploaded{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(doc.url, doc.name)}
                    className="px-3 py-1 text-blue-400 hover:text-blue-300 text-sm hover:bg-blue-900 rounded transition-colors flex items-center gap-1"
                    aria-label={`Download ${doc.name}`}
                  >
                    <FiDownload className="text-sm" /> Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc.name, index)}
                    className="px-3 py-1 text-red-400 hover:text-red-300 text-sm hover:bg-red-900 rounded transition-colors flex items-center gap-1"
                    aria-label={`Delete ${doc.name}`}
                  >
                    <FiTrash2 className="text-sm" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-300 mb-4">No documents uploaded yet</p>
            <p className="text-gray-400 text-sm mb-6 px-4 max-w-md mx-auto">
              Upload your business registration documents to complete your
              profile verification process and access all features.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={handleUploadNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-colors flex items-center justify-center gap-2"
                aria-label="Go to business profile"
              >
                <FiFileText /> Go to Business Profile
              </button>
          
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">
            Document Requirements
          </h3>
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
            <h4 className="font-medium text-blue-300 mb-2">
              Upload Guidelines
            </h4>
            <ul className="text-blue-200 text-sm space-y-2">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Business registration document is required for verification
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 10MB each)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Documents must be valid, unexpired, and clearly readable
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>
                  Ensure all corners and text are visible in photos/scans
                </span>
              </li>
            </ul>
          </div>
        </div>

        {securityReminderVisible && (
          <div className="mt-6 bg-yellow-900 border border-yellow-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FaShieldAlt className="text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-yellow-300 mb-1">
                    Security Notice
                  </h4>
                  <button
                    onClick={() => setSecurityReminderVisible(false)}
                    className="text-yellow-400 hover:text-yellow-300"
                    aria-label="Dismiss security notice"
                  >
                    ×
                  </button>
                </div>
                <p className="text-yellow-200 text-sm">
                  All uploaded documents are encrypted and stored securely. Only
                  authorized personnel can access them for verification
                  purposes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-black rounded-xl shadow-sm   p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-300">
            Loading document verification status...
          </p>
          <p className="text-sm text-gray-400 mt-2">
            This may take a few moments
          </p>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-6">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="text-2xl text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-300 mb-4">{apiError}</p>
          <p className="text-sm text-gray-400 mb-6">
            If this problem persists, please contact our support team.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Retry loading"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const verificationStatus = verificationData?.data?.business_verified;

  if (verificationStatus === "APPROVED") {
    return renderApprovedDocuments();
  }

  if (verificationStatus === "PENDING") {
    return renderPendingDocuments();
  }

  return renderRegularDocumentsScreen();
}

export default DocumentsScreen;
