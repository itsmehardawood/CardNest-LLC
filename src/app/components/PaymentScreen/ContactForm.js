
export default function ContactForm({
  formData,
  handleInputChange,
  handleSubmit,
  submitting
}) {
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Sales</h2>
      <p className="text-gray-600 mb-6">
        Get in touch with our sales team to discuss your custom requirements and pricing.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Your company name"
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              required
              value={formData.contactName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Your full name"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Business Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="you@company.com"
              disabled={submitting}
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="+1 (555) 123-4567"
              disabled={submitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
              Business Type *
            </label>
            <select
              id="businessType"
              name="businessType"
              required
              value={formData.businessType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={submitting}
            >
              <option value="">Select your business type</option>
              <option value="ecommerce">E-commerce</option>
              <option value="saas">SaaS/Software</option>
              <option value="marketplace">Marketplace</option>
              <option value="subscription">Subscription Business</option>
              <option value="retail">Retail/Physical Store</option>
              <option value="nonprofit">Non-profit</option>
              <option value="professional-services">Professional Services</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="monthlyVolume" className="block text-sm font-medium text-gray-700 mb-2">
              Expected Monthly Volume
            </label>
            <select
              id="monthlyVolume"
              name="monthlyVolume"
              value={formData.monthlyVolume}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              disabled={submitting}
            >
              <option value="">Select expected volume</option>
              <option value="under-10k">Under $10,000</option>
              <option value="10k-50k">$10,000 - $50,000</option>
              <option value="50k-100k">$50,000 - $100,000</option>
              <option value="100k-500k">$100,000 - $500,000</option>
              <option value="500k-1m">$500,000 - $1,000,000</option>
              <option value="over-1m">Over $1,000,000</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="currentProvider" className="block text-sm font-medium text-gray-700 mb-2">
            Current Payment Provider
          </label>
          <input
            type="text"
            id="currentProvider"
            name="currentProvider"
            value={formData.currentProvider}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="e.g., Stripe, Square, PayPal, or 'None'"
            disabled={submitting}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Tell us about your payment needs
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
            placeholder="What specific payment features or challenges are you looking to address? Any integration requirements?"
            disabled={submitting}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </>
  );
}