import Link from 'next/link';

export default function PaymentHeader() {
  return (
    <div className=''>
      <nav className="bg-white backdrop-blur-md fixed top-0 left-0 right-0 z-50">
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
              {/* Additional header items can be added here */}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}