import React from "react";
import DeferredVideo from "./DeferredVideo";

const CryptoSection = () => {
  return (
    <section id="crypto" className="py-12 px-4 sm:px-6 bg-white">
      <div className="w-[90%] mx-auto">
        <div className="max-w-6xl mx-auto mb-8 sm:mb-10">
          <h2 className="font-bold text-3xl md:text-3xl mb-6 text-gray-900 text-center">
            Crypto Security Verification
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 h-full">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-800 mb-2">
                Real-Time Wallet Verification
              </h3>
              <p className="text-gray-800 text-sm sm:text-base leading-relaxed text-justify">
                  CardNest Crypto Security Verification is an advanced security feature within the CardNest ecosystem, purpose-built to safeguard digital asset transactions. This innovative platform provides real-time verification and authentication of recipient crypto wallet addresses before any transfer is completed, ensuring that transactions are directed accurately and securely.
              </p>
            </div>

            <div className="rounded-2xl border border-teal-100 bg-teal-50 p-5 h-full">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-teal-800 mb-2">
                Compliance and Risk Screening
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
                By integrating intelligent validation protocols and compliance screening, the solution proactively identifies and flags any transactions associated with sanctioned or high-risk wallet addresses, enabling clients to review and take appropriate action before funds are moved. This not only minimizes the risk of fraud and misdirected payments but also strengthens regulatory compliance.
              </p>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-5 h-full">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-indigo-800 mb-2">
                Trust and Transaction Confidence
              </h3>
              <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-justify">
                CardNest Crypto Security Verification enhances transparency, trust, and confidence across all crypto activities, empowering users and organizations to execute transactions with greater assurance, precision, and security in an increasingly complex digital financial landscape.
              </p>
            </div>
          </div>
        </div>

        <DeferredVideo
          source="https://d21vkevu6wrni5.cloudfront.net/CardNest%20Crypto%20Video.MP4"
          type="video/mp4"
          poster="/images/css.png"
          ariaLabel="CardNest Crypto Video"
          containerClassName="relative rounded-2xl overflow-hidden shadow-2xl bg-black"
          className="w-full h-auto"
          placeholder={
            <div className="w-full h-full min-h-[320px] bg-gradient-to-br from-slate-950 to-slate-800 flex items-center justify-center text-white">
              <p className="text-sm sm:text-base text-slate-200">Loading crypto video...</p>
            </div>
          }
        />
      </div>
    </section>
  );
};

export default CryptoSection;
