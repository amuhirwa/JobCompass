export const Footer = () => {
  return (
    <footer className="w-full bg-tabiya-dark border-t border-tabiya-medium/30">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/images/tabiya-logo.png"
                alt="JobCompass Logo"
                className="h-10 object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove(
                    'hidden'
                  );
                }}
              />
              <div className="hidden">
                <span className="text-white font-sans text-xl font-bold">
                  Job<span className="text-tabiya-accent">Compass</span>
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-white font-sans text-2xl md:text-3xl font-bold leading-tight">
                Explore Your Career Path with Tabiya
              </h3>
              <p className="text-white/80 font-sans font-medium leading-relaxed">
                Discover how jobs and skills connect in today's labor market.
              </p>
              <div className="flex gap-4">
                <button className="bg-tabiya-accent hover:bg-tabiya-accent/90 text-white font-sans font-medium px-6 py-2 rounded-lg transition-all duration-300">
                  Learn
                </button>
                <button className="border border-white/30 text-white hover:bg-white/10 font-sans font-medium px-6 py-2 rounded-lg transition-all duration-300">
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Career Insights */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-lg font-bold">
              Career Insights
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  Skill Mapping
                </a>
              </li>
              <li>
                <a
                  href="#tools"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  Job Trends
                </a>
              </li>
              <li>
                <a
                  href="#demo"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  Explore Careers
                </a>
              </li>
              <li>
                <a
                  href="#cta"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-6">
            <h4 className="text-white font-sans text-lg font-bold">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#features"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#tools"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  Key Tools
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="text-white/80 hover:text-white font-sans font-medium transition-colors duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.219-5.160 1.219-5.160s-.219-.438-.219-1.085c0-1.016.588-1.775 1.321-1.775.623 0 .924.466.924 1.025 0 .624-.396 1.559-.601 2.424-.171.718.359 1.304 1.065 1.304 1.279 0 2.262-1.349 2.262-3.296 0-1.725-1.24-2.929-3.01-2.929-2.051 0-3.253 1.537-3.253 3.127 0 .619.238 1.285.535 1.645.059.071.067.133.049.206-.054.223-.173.705-.196.803-.031.129-.101.157-.233.094-1.279-.594-2.077-2.459-2.077-3.961 0-3.230 2.343-6.198 6.759-6.198 3.552 0 6.315 2.533 6.315 5.916 0 3.533-2.229 6.373-5.327 6.373-1.040 0-2.021-.541-2.357-1.186 0 0-.516 1.967-.641 2.448-.232.893-.858 2.018-1.277 2.702.963.298 1.985.455 3.054.455 6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-all duration-300 group"
              >
                <svg
                  className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="text-center">
            <p className="text-white/60 font-sans font-medium text-sm">
              © 2025 JobCompass. Powered by Tabiya. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
