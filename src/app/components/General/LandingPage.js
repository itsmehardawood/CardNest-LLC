"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import DiagonalHeroSection from "./HeroSection";
import NavbarHomepage from "./NavbarHomepage";
import { landingPageData } from "./landingPageData";
import DeferredVideo from "./DeferredVideo";

const CryptoSection = dynamic(() => import("./CryptoSection"), {
  ssr: false,
  loading: () => (
    <section id="crypto" className="py-12 px-4 sm:px-6 bg-white">
      <div className="w-[90%] mx-auto">
        <div className="max-w-6xl mx-auto h-64 rounded-2xl bg-slate-100 animate-pulse" />
      </div>
    </section>
  ),
});

const FAQsSection = dynamic(() => import("./FAQs"), {
  ssr: false,
  loading: () => <div className="py-12 px-6 bg-white" />,
});

const ContactSectionLazy = dynamic(() => import("./ContactSection"), {
  ssr: false,
  loading: () => <div className="py-12 px-6 bg-gray-50" />,
});

const PricingSectionLazy = dynamic(() => import("./SubscriptionsCard"), {
  ssr: false,
  loading: () => <div className="py-12 px-6 bg-white" />,
});

const LazySection = ({ id, className = "", placeholderHeight = "h-64", children }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px", threshold: 0.1 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={className}>
      {isVisible ? children : <div className={`w-full ${placeholderHeight}`} aria-hidden="true" />}
    </section>
  );
};

const LandingPage = () => {
  const sectionsData = landingPageData;

  // Component to render section content
  const SectionContent = ({ data, isDark = false, sectionKey }) => {
    // Determine split count based on section - 4 for connect, 5 for others
    const splitCount = sectionKey === 'connect' ? 4 : 5;
    const shouldDivideFeatures = data.features && data.features.length > splitCount;
    
    const leftFeatures = shouldDivideFeatures
      ? data.features.slice(0, splitCount)
      : data.features;
    const rightFeatures = shouldDivideFeatures
      ? data.features.slice(splitCount, splitCount * 2)
      : [];

    const FeatureItem = ({ feature, index }) => (
      <div key={index} className="flex items-start space-x-3">
        <div
          className={`flex-shrink-0 w-5 h-5 rounded-full ${
            isDark ? "bg-green-500" : "bg-green-600"
          } flex items-center justify-center mt-1`}
        >
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h4
            className={`font-bold text-left text-base sm:text-lg ${
              isDark ? "text-white" : "text-gray-900"
            } mb-2`}
          >
            {feature.title}
          </h4>
          <p
            className={`text-sm sm:text-base text-justify  ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {feature.description}
          </p>
        </div>
      </div>
    );

    return (
      <div className={`w-full ${isDark ? "bg-slate-900" : ""}`}>
        <div className="flex flex-col max-w-[1320px] mx-auto justify-center py-10 px-4 sm:px-6">
          <div className="w-full text-center lg:text-left space-y-6">
            <h3
              className={`${
                isDark ? "text-blue-400" : "text-blue-500"
              } font-bold text-3xl text-center`}
            >
              {data.title}
            </h3>
            <h2
              className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                isDark ? "text-white" : "text-gray-900"
              } leading-tight`}
            >
              {data.heading}
            </h2>
            <p
              className={`text-base sm:text-lg ${
                isDark ? "text-gray-300" : "text-gray-600"
              } max-w-3xl mx-auto lg:mx-0`}
            >
              {data.description}
            </p>

            {/* Features */}
            {data.features && (
              <div className="mt-8">
                {shouldDivideFeatures ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      {leftFeatures.map((feature, index) => (
                        <FeatureItem
                          key={index}
                          feature={feature}
                          index={index}
                        />
                      ))}
                    </div>
                    <div className="space-y-4">
                      {rightFeatures.map((feature, index) => (
                        <FeatureItem
                          key={index + splitCount}
                          feature={feature}
                          index={index + splitCount}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leftFeatures.map((feature, index) => (
                      <FeatureItem
                        key={index}
                        feature={feature}
                        index={index}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {data.seeAlso && (
              <div className="space-y-3 mt-8">
                <p
                  className={`font-bold text-sm sm:text-base ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  See also
                </p>
                <p
                  className={`${
                    isDark ? "text-gray-400" : "text-gray-700"
                  } text-sm sm:text-base max-w-3xl`}
                >
                  {data.seeAlso}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <NavbarHomepage />

      {/* Hero Section */}
      <section id="hero">
        <DiagonalHeroSection />
      </section>

      {/* About Us Section */}

      <section id="about" className="py-5 px-6 bg-gray-100 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-bold text-3xl md:text-3xl mb-10 text-gray-900 text-center">
            Credit | Debit Card Intelligence Scan <br></br> <span className="text-lg text-teal-800">(Real-Time Fraud & Chargeback Prevention)</span>
          </h2>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Left Text Section */}
            <div className="w-full md:w-1/2 space-y-6 text-left">
              <p className="text-base md:text-lg text-gray-700 text-justify leading-relaxed">
                <strong>CardNest</strong> is a cutting-edge financial technology
                company dedicated to transforming how businesses protect
                themselves and their customers from online card fraud. Founded
                on the principle that transaction security should be proactive,
                not reactive, CardNest leverages advanced artificial
                intelligence and machine learning to detect and prevent
                fraudulent card activity before it occurs—empowering businesses
                of all sizes to operate with confidence in a digital-first
                economy. As online commerce and digital payments continue to
                scale globally, so too does the threat of payment fraud. In
                response, CardNest has a robust, real-time fraud prevention
                technology designed to scan, detect, analyze, and prevent
                fraudulent activity before a transaction even begins—within
                milliseconds—without disrupting the customer experience.
              </p>

              <p className="text-base md:text-lg text-gray-700 text-justify leading-relaxed">
                Our Artificial Intelligence models continuously analyze
                thousands of data points, including card security features,
                transaction history, device fingerprinting, location
                consistency, behavioral biometrics, and more—enabling our system
                to flag suspicious transactions with unparalleled accuracy
                before payment checkout happens.
                                  CardNest security architecture is{" "}
                  <strong>PCI/DSS compliant</strong>, ensuring that all
                  processes meet the highest global standards for payment data
                  protection. Importantly, CardNest does not store{" "}
                  <strong>sensitive cardholder information.</strong> All
                  analysis and validation are performed in real-time, minimizing
                  risk and maximizing user privacy. Designed with developers and
                  businesses in mind, CardNest offers a{" "}
                  <strong>simple, API-based integration</strong> that seamlessly
                  connects to any existing payment gateway, merchant system,
                  e-commerce platform, remittance business, or banking
                  infrastructure. Organizations using CardNest have seen{" "}
                  <strong>up to a 98% or more reduction in chargebacks</strong>,
              </p>
            </div>

            {/* Right Image/Video Section */}
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="">
                <div className="flex justify-center items-center pb-3">
                  <video autoPlay loop muted playsInline width="450" aria-label="CardNest Logo">
                    <source
                      src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20WebM%20version.webm"
                      type="video/webm"
                    />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-base md:text-lg text-gray-700 text-justify pt-7 leading-relaxed">
                
                  increased customer trust, and significant improvements in
                  operational efficiency and revenue retention. At CardNest, we
                  are not just building fraud detection software—we are
                  redefining what it means to transact safely online. By staying
                  ahead of emerging fraud tactics and continuously evolving our
                  Artificial Intelligence capabilities, we help our clients
                  maintain integrity, protect customer trust, and accelerate
                  secure digital growth.
 Whether you are a startup or an
                  enterprise-scale institution, CardNest adapts to your
                  needs—scaling protection as your transaction volume grows. Our
                  technology is currently trusted by businesses across financial
                  services, e-commerce, digital remittance, and SaaS industries.
                 
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LazySection id="crypto" className="bg-white" placeholderHeight="h-96">
        <CryptoSection />
      </LazySection>

      {/* CardNest KYC Section */}
      <section id="kyc" className="bg-slate-900">
        <div className="w-full">
          <div className="flex flex-col max-w-[1320px] mx-auto justify-center py-10 px-4 sm:px-6">
            <div className="w-full text-left space-y-6">
              <h3 className="text-blue-400 font-bold text-3xl text-center">
                CardNest KYC Verification
              </h3>
            
              <p className="text-sm sm:text-base text-gray-300 max-w-7xl text-left">
                {sectionsData.kyc.description}
              </p>

              {/* Intro paragraph */}
              {/* <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto text-center">
                {sectionsData.kyc.sections[0].content}
              </p> */}

              {/* All KYC Items */}
              <div className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Why is KYC Important */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-2xl mt-1">
                        {sectionsData.kyc.sections[1].emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-left text-base sm:text-lg text-white mb-2">
                          {sectionsData.kyc.sections[1].title}
                        </h4>
                        <p className="text-sm sm:text-base text-left text-gray-300">
                          {sectionsData.kyc.sections[1].content}
                        </p>
                        <ul className="space-y-2">
                          {sectionsData.kyc.sections[1].points.map((point, idx) => (
                            <li key={idx} className="text-gray-300 text-sm sm:text-base">• {point}</li>
                          ))}
                        </ul>
                        <p className="text-sm sm:text-base text-left text-gray-300 mt-2">
                          {sectionsData.kyc.sections[1].footer}
                        </p>
                      </div>
                    </div>

                    {/* Verification Steps 1-2 */}
                    {sectionsData.kyc.sections[2].steps.slice(0, 2).map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-2xl mt-1">
                          {step.emoji}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-left text-base sm:text-lg text-white mb-2">
                            {step.title}
                          </h4>
                          <p className="text-sm sm:text-base text-left text-gray-300">
                            {step.content}
                          </p>
                          {step.points && (
                            <ul className="space-y-2">
                              {step.points.map((point, pIdx) => (
                                <li key={pIdx} className="text-gray-300 text-sm sm:text-base">• {point}</li>
                              ))}
                            </ul>
                          )}
                          {step.footer && (
                            <p className="text-sm sm:text-base text-gray-300 mt-2">{step.footer}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Privacy & Security */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-2xl mt-1">
                        {sectionsData.kyc.sections[3].emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-left text-base sm:text-lg text-white mb-2">
                          {sectionsData.kyc.sections[3].title}
                        </h4>
                        <p className="text-sm sm:text-base text-left text-gray-300">
                          {sectionsData.kyc.sections[3].content}
                        </p>
                        <ul className="space-y-2">
                          {sectionsData.kyc.sections[3].points.map((point, idx) => (
                            <li key={idx} className="text-gray-300 text-sm sm:text-base">• {point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Verification Steps 3-4 */}
                    {sectionsData.kyc.sections[2].steps.slice(2, 4).map((step, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 text-2xl mt-1">
                          {step.emoji}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-left text-base sm:text-lg text-white mb-2">
                            {step.title}
                          </h4>
                          <p className="text-sm sm:text-base text-left text-gray-300">
                            {step.content}
                          </p>
                          {step.points && (
                            <ul className="space-y-2">
                              {step.points.map((point, pIdx) => (
                                <li key={pIdx} className="text-gray-300 text-sm sm:text-base">• {point}</li>
                              ))}
                            </ul>
                          )}
                          {step.footer && (
                            <p className="text-sm sm:text-base text-gray-300 mt-2">{step.footer}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Moving Forward */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-2xl mt-1">
                        {sectionsData.kyc.sections[4].emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-left text-base sm:text-lg text-white mb-2">
                          {sectionsData.kyc.sections[4].title}
                        </h4>
                        <p className="text-sm sm:text-base text-left text-gray-300">
                          {sectionsData.kyc.sections[4].content}
                        </p>
                        <p className="text-sm sm:text-base text-left text-gray-300 mt-2">
                          {sectionsData.kyc.sections[4].footer}
                        </p>
                      </div>
                    </div>

                    {/* Need Help During Verification */}
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 text-2xl mt-1">
                        {sectionsData.kyc.sections[5].emoji}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-left text-base sm:text-lg text-white mb-2">
                          {sectionsData.kyc.sections[5].title}
                        </h4>
                        <p className="text-sm sm:text-base text-left text-gray-300">
                          {sectionsData.kyc.sections[5].content}
                        </p>
                        <ul className="space-y-2">
                          {sectionsData.kyc.sections[5].points.map((point, idx) => (
                            <li key={idx} className="text-gray-300 text-sm sm:text-base">• {point}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

{/* Video Section */}
      <LazySection id="video" className="py-16 px-6 bg-gradient-to-br from-gray-50 to-gray-100" placeholderHeight="h-[28rem]">
        <div className="w-full mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Businesses Trust Us ?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our AI-powered fraud prevention technology protects your business in real-time
            </p>
          </div>

          <div className="relative w-[90%] mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              <DeferredVideo
                source="https://d21vkevu6wrni5.cloudfront.net/Cardnest%20Main%20Promotion%20Video.mp4"
                type="video/mp4"
                poster="/images/ss.jpg"
                ariaLabel="CardNest promo video"
                className="w-full h-auto"
                containerClassName="w-full"
                controls
                preload="none"
                placeholder={<div className="w-full min-h-[320px] bg-black" aria-hidden="true" />}
              />

              {/* Optional: Custom overlay with play button */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Video description */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 leading-relaxed max-w-3xl mx-auto">
                Watch how CardNest advanced AI technology seamlessly integrates with your existing payment systems 
                to provide millisecond fraud detection without disrupting the customer experience.
              </p>
            </div>
          </div>
        </div>
      </LazySection>



      {/* Connect Section */}
      <LazySection id="benefits" className="bg-white" placeholderHeight="h-[38rem]">
        <SectionContent data={sectionsData.connect} isDark={true} sectionKey="connect" />
      </LazySection>

      {/* Pricing Section */}
      <LazySection id="pricing" placeholderHeight="h-80">
        <PricingSectionLazy isDark={true} />
      </LazySection>

      {/* Pricing Section */}
      <LazySection id="features" placeholderHeight="h-[48rem]">
        <SectionContent data={sectionsData.features} />
      </LazySection>

      <LazySection id="faq-1" placeholderHeight="h-[24rem]">
        <FAQsSection />
      </LazySection>

      {/* Contact Section */}
      <LazySection id="contact" className="py-5 lg:py-5 px-6 bg-gray-50" placeholderHeight="h-80">
        <ContactSectionLazy />
      </LazySection>

      {/* Footer */}
      <footer className=" bg-gradient-to-br  from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
        {/* Animated top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-60 animate-pulse"></div>

        <div className="container max-w-6xl mx-auto  px-6 py-12 ">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center space-x-3">
                {/* logo footer */}
                <div className="text-xl sm:text-2xl font-bold text-white">
                  <DeferredVideo
                    source="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20WebM%20version.webm"
                    type="video/webm"
                    ariaLabel="CardNest Logo"
                    containerClassName="w-[50px] h-[50px]"
                    className="w-[50px] h-[50px] object-contain"
                    preload="metadata"
                    placeholder={<div className="w-[50px] h-[50px] rounded-full bg-slate-700" aria-hidden="true" />}
                  />
                </div>

                <div className="text-2xl font-bold text-white">CardNest</div>
              </div>
              <p className="text-gray-300 max-w-md leading-relaxed">
                Protecting your financial data with cutting-edge security
                technology. Your trust is our commitment to excellence.
              </p>

              {/* Social links */}
              <div className="flex space-x-4">
                {[
                  {
                    icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037c-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85c3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065c0-1.138.92-2.063 2.063-2.063c1.14 0 2.064.925 2.064 2.063c0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
                    label: "LinkedIn",
                    href: "https://www.linkedin.com/company/cardnest-llc",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                    aria-label={social.label}
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Navigation section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white relative">
                Navigation
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Home", href: "#hero" },
                  { name: "Features", href: "#features" },
                  { name: "Benefits", href: "#benefits" },
                  { name: "Pricing", href: "#pricing" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-200 flex items-center group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                        →
                      </span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support section */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white relative">
                Support
                <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              </h3>
              <ul className="space-y-3">
                {[
                  { name: "Help Center", href: "#" },
                  { name: "Documentation", href: "#" },
                  { name: "Contact Support", href: "#contact" },
                  { name: "FAQ", href: "#faq-1" },
                ].map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-all duration-200 flex items-center group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity mr-2">
                        →
                      </span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom section */}
          <div className="">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} CardNest. All rights reserved. Built with security in
                mind.
              </div>

              <div className="flex flex-wrap justify-center lg:justify-end space-x-6 text-sm">
                {[
                  // Add any legal links here if needed
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Security badges */}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;



