'use client';

import React, { useState } from 'react';

const FAQItem = ({ question, answer, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = `faq-${index}`; // stable, SSR-safe ID

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-lg border border-gray-200 shadow-sm">
      <button
        id={id}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <h3 className="font-semibold text-gray-900 pr-4">{question}</h3>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div id={`${id}-content`} className="px-6 pb-4">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
};

function FAQs() {
  const faqData = [
    {
      question: "What is CardNest and how does it work?",
      answer:
        "CardNest is an AI-powered fraud prevention platform that secures online credit and debit card transactions in real-time...",
    },
    {
      question: "How does CardNest prevent online fraud before a transaction is completed?",
      answer:
        "CardNest's Card-At-Present engine scans, detects, and analyzes user behavior, device identity, geolocation...",
    },
    {
      question: "Does CardNest store any customer or cardholder data?",
      answer:
        "No. CardNest operates on a zero-data storage model. It does not retain card numbers, CVV, or any personally identifiable information...",
    },
    {
      question: "Can CardNest be integrated with any payment gateway or e-commerce platform?",
      answer:
        "Yes. CardNest is designed with API-first architecture and supports easy integration with most payment gateways, merchant systems...",
    },
    {
      question: "How accurate is CardNest in detecting fraud?",
      answer:
        "CardNest delivers up to 98% or more reduction in chargebacks, with highly accurate fraud detection and minimal false positives...",
    },
    {
      question: "What happens if a legitimate credit or debit card is blocked?",
      answer:
        "CardNest minimizes false positives through smart behavioral analytics and custom risk thresholds...",
    },
    {
      question: "Is CardNest suitable for small businesses or only for enterprises?",
      answer:
        "CardNest is scalable for all business sizes. Whether you process hundreds or millions of transactions monthly...",
    },
    {
      question: "How much does CardNest cost?",
      answer:
        "CardNest offers flexible billing options based on transaction volume and features needed. Pricing plans typically include pay-as-you-go...",
    },
    {
      question: "Do I need a developer to set up CardNest?",
      answer:
        "For most businesses, integration is simple and well-documented. However, a developer may be needed to plug the API into your payment flow...",
    },
    {
      question: "How do I get started with CardNest?",
      answer:
        "Visit www.cardnest.io to request a free demo or sign up. After onboarding, you'll receive API credentials, integration support...",
    },
  ];

  return (
    <section className="my-5 sm:my-5 relative min-h-screen">
      {/* Background video at bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[450px] lg:[500px] xl:h-auto z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/fliped_video.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="text-center pb-5 relative z-10">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Everything you need to know about our pricing and plans
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6 mb-8 py-10 relative z-10">
        {faqData.map((faq, index) => (
          <FAQItem
            key={index}
            index={index}
            question={faq.question}
            answer={faq.answer}
          />
        ))}
      </div>
    </section>
  );
}

export default FAQs;
