import { Check, X, Shield, Lock, CreditCard } from 'lucide-react';

export default function PlanDetails({ plan, userData }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Complete Your Subscription
        </h1>
        <p className="text-gray-600">
          You are subscribing to the {plan.name} plan
        </p>
        {/* {userData && (
          <p className="text-sm text-gray-500 mt-2">
            Merchant ID: {(userData.user || userData).merchant_id}
          </p>
        )} */}
      </div>

      {/* Plan Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Plan Header */}
        <div className={`bg-gradient-to-br ${plan.gradient} p-6 text-white`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold">{plan.name}</h2>
              <p className="text-white/80">{plan.subtitle}</p>
            </div>
            {plan.popular && (
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">
                RECOMMENDED
              </span>
            )}
          </div>
          
          <div className="flex items-baseline">
            <span className="text-4xl font-bold">{plan.price}</span>
            {plan.price !== 'SALES' && plan.price !== 'Free' && (
              <span className="text-white/80 ml-2">per month</span>
            )}
          </div>
          <p className="text-white/80 mt-1">{plan.apiScans}</p>
        </div>

        {/* Plan Features */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">What is included:</h3>
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-green-500" />
          Security & Trust
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-2 text-green-500" />
            PCI/DSS Compliant
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            256-bit SSL Encryption
          </div>
          <div className="flex items-center">
            <CreditCard className="w-4 h-4 mr-2 text-green-500" />
            Secure Payment Processing
          </div>
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2 text-green-500" />
            Secure Online Card Detection
          </div>
        </div>
      </div>
    </div>
  );
}
