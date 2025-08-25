'use client'
import React, { useEffect } from 'react'
import Link from 'next/link';
import PricingSection from '../components/General/SubscriptionsCard';
import { useRouter } from 'next/navigation';


const PlanPage = () => {

    const router = useRouter();
  
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      if (!userData || !userData.merchant_id) {
        router.push("/login"); // Redirect to login if userData is not found
      }
    }, []);

const plans = [
  {
    name: 'STANDARD',
    subtitle: 'FOR STARTERS',
    price: '$49.99',
    period: 'PER MONTH',
    apiScans: '60 API SCANS',
    gradient: 'from-purple-500 to-purple-700',
    bgGradient: 'from-purple-100 to-purple-50',
    buttonColor: 'bg-purple-500 hover:bg-purple-600',
    features: [
      { text: 'Front-side card scan', included: true },
      { text: 'Back-side scan', included: false },
      { text: 'AI fraud detection', included: true },
      { text: 'CardNest protection', included: true },
      { text: 'ML data accuracy', included: true },
      { text: 'PCI/DSS security', included: true },
      { text: 'API integration', included: true },
      { text: '24/7 fraud watch', included: false },
      { text: '$0.50/extra scan', included: true }
    ]
  },
  {
    name: 'PREMIUM',
    subtitle: 'RECOMMENDED',
    price: '$79.99',
    period: 'PER MONTH',
    apiScans: '100 API SCANS',
    gradient: 'from-cyan-400 to-blue-500',
    bgGradient: 'from-cyan-50 to-blue-50',
    buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
    popular: true,
    features: [
      { text: 'Front-side card scan', included: true },
      { text: 'Back-side scan', included: true },
      { text: 'AI fraud detection', included: true },
      { text: 'CardNest protection', included: true },
      { text: 'ML data accuracy', included: true },
      { text: 'PCI/DSS security', included: true },
      { text: 'API integration', included: true },
      { text: '24/7 fraud watch', included: false },
      { text: '$0.50/extra scan', included: true }
    ]
  },
  {
    name: 'CUSTOM',
    subtitle: 'CONTACT SUPPORT',
    price: 'SALES',
    period: 'CUSTOM PRICING',
    apiScans: 'UNLIMITED*',
    gradient: 'from-pink-500 to-purple-600',
    bgGradient: 'from-pink-50 to-purple-50',
    buttonColor: 'bg-pink-500 hover:bg-pink-600',
    features: [
      { text: 'Front-side card scan', included: true },
      { text: 'Back-side scan', included: true },
      { text: 'AI fraud detection', included: true },
      { text: 'CardNest protection', included: true },
      { text: 'ML data accuracy', included: true },
      { text: 'PCI/DSS security', included: true },
      { text: 'API integration', included: true },
      { text: '24/7 fraud watch', included: true },
      { text: 'Custom pricing/options', included: true }
    ]
  }
];


  return (
    <>
         <div>
                {/* Navbar */}
              <nav className="bg-white backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                           <video autoPlay loop muted playsInline width="70">
<source src="https://dw1u598x1c0uz.cloudfront.net/CardNest%20Logo%20WebM%20version.webm" alt="CardNest Logo" />
              Your browser does not support the video tag.
            </video> 
                    </Link>
        
        <div className="ml-4 flex items-center space-x-4">
                      
                                        </div>
                 
        
              
        
                
                  </div>
        
        
                
                </div>
              </nav>
            </div>


              <div className="min-h-screen bg-white py-16 px-4">
  
              <PricingSection/>
    </div>
    </>
    
  
  );
};

export default PlanPage;