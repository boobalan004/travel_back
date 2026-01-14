import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Press', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Contact Us', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'Community', href: '#' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'Accessibility', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    { icon: 'facebook', label: 'Facebook', href: '#' },
    { icon: 'twitter', label: 'Twitter', href: '#' },
    { icon: 'instagram', label: 'Instagram', href: '#' },
    { icon: 'youtube', label: 'YouTube', href: '#' },
    { icon: 'linkedin', label: 'LinkedIn', href: '#' },
  ];

  const paymentMethods = [
    { name: 'Visa', color: 'from-blue-600 to-blue-700' },
    { name: 'Mastercard', color: 'from-red-600 to-red-700' },
    { name: 'PayPal', color: 'from-blue-700 to-blue-800' },
    { name: 'American Express', color: 'from-emerald-600 to-emerald-700' },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      {/* Subtle gradient overlays */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-orange-500/5 to-transparent rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-1/2 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/5 to-transparent rounded-full blur-3xl -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 py-16 border-b border-slate-700/50">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              {/* Logo & Brand Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg blur opacity-50"></div>
                  <svg className="relative w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-.788 0l-7 3.5a1 1 0 1 00.788 1.894L5 6.71v9.5a1 1 0 0 0 .5.866l7 3.5a1 1 0 0 0 .788 0l7-3.5A1 1 0 0 0 20 16.21V6.71l1.106-.553a1 1 0 1 0-.788-1.894l-7 3.5z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Rohil</h3>
              </div>
              
              {/* Description */}
              <p className="text-slate-400 text-sm leading-relaxed">
                Your gateway to unforgettable travel experiences around the world.
              </p>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Follow us</p>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    title={social.label}
                    className="group relative w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center transition-all duration-300 hover:bg-gradient-to-br hover:from-orange-500/20 hover:to-red-500/20 hover:border-orange-500/30"
                  >
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 20 20">
                      {social.icon === 'facebook' && <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.07c0-2.77 1.694-4.28 4.16-4.28 1.183 0 2.202.088 2.496.127v2.894h-1.713c-1.345 0-1.605.64-1.605 1.576v2.068h3.21l-.418 3.54h-2.792V20"></path>}
                      {social.icon === 'twitter' && <path d="M19.498 3.094c-.739.331-1.529.557-2.356.658a4.114 4.114 0 001.804-2.27c-.798.469-1.682.812-2.623.996a4.106 4.106 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 6.697v.052a4.105 4.105 0 003.292 4.021 4.1 4.1 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 01.77 15.202a11.616 11.616 0 006.29 1.843c7.547 0 11.675-6.252 11.675-11.675 0-.178-.004-.355-.012-.53a8.348 8.348 0 002.046-2.127"></path>}
                      {social.icon === 'instagram' && <path d="M10 0C7.287 0 6.969.012 5.894.072c-1.067.06-1.794.264-2.431.563-.658.305-1.216.713-1.772 1.269-.557.557-.964 1.115-1.269 1.772-.3.637-.502 1.364-.563 2.431C.012 6.969 0 7.287 0 10s.012 3.031.072 4.106c.06 1.067.264 1.794.563 2.431.305.658.712 1.216 1.269 1.772.557.557 1.115.964 1.772 1.269.637.299 1.364.502 2.431.563 1.075.06 1.393.072 4.106.072s3.031-.012 4.106-.072c1.067-.06 1.794-.264 2.431-.563.658-.305 1.216-.712 1.772-1.269.557-.557.964-1.115 1.269-1.772.299-.637.502-1.364.563-2.431.06-1.075.072-1.393.072-4.106s-.012-3.031-.072-4.106c-.06-1.067-.264-1.794-.563-2.431-.305-.658-.712-1.216-1.269-1.772-.557-.557-1.115-.964-1.772-1.269-.637-.299-1.364-.502-2.431-.563C13.031.012 12.713 0 10 0zm0 1.802c2.67 0 2.987.009 4.042.058.975.045 1.504.207 1.857.344.467.182.801.398 1.151.748.35.35.566.684.748 1.151.137.353.299.882.344 1.857.049 1.055.058 1.372.058 4.042 0 2.67-.009 2.987-.058 4.042-.045.975-.207 1.504-.344 1.857-.182.467-.398.801-.748 1.151-.35.35-.684.566-1.151.748-.353.137-.882.299-1.857.344-1.055.049-1.372.058-4.042.058-2.67 0-2.987-.009-4.042-.058-.975-.045-1.504-.207-1.857-.344-.467-.182-.801-.398-1.151-.748-.35-.35-.566-.684-.748-1.151-.137-.353-.299-.882-.344-1.857-.049-1.055-.058-1.372-.058-4.042 0-2.67.009-2.987.058-4.042.045-.975.207-1.504.344-1.857.182-.467.398-.801.748-1.151.35-.35.684-.566 1.151-.748.353-.137.882-.299 1.857-.344 1.055-.049 1.372-.058 4.042-.058z"></path>}
                      {social.icon === 'youtube' && <path d="M19.615 3.654a3.001 3.001 0 0 0-2.117-2.117C15.738 1.2 12 1.2 12 1.2s-3.738 0-5.498.337a3.001 3.001 0 0 0-2.117 2.117C3.9 5.413 3.9 10 3.9 10s0 4.587.338 6.346a3.001 3.001 0 0 0 2.117 2.117c1.76.337 5.498.337 5.498.337s3.738 0 5.498-.337a3.001 3.001 0 0 0 2.117-2.117C20.1 14.587 20.1 10 20.1 10s0-4.587-.338-6.346zM9.659 13.995V6.005L15.113 10l-5.454 3.995z"></path>}
                      {social.icon === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>}
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="lg:col-span-1">
              <h4 className="font-semibold text-sm uppercase tracking-widest text-slate-300 mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href={link.href}
                      className="text-slate-400 text-sm hover:text-white transition-colors duration-300 relative group"
                    >
                      {link.label}
                      <span className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-orange-400 to-red-400 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download Apps */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-sm uppercase tracking-widest text-slate-300 mb-6">
              Download App
            </h4>
            <div className="space-y-3">
              <a
                href="#"
                className="group block p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:from-slate-800/80 hover:to-slate-900/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-slate-300 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 13.5c-.91 0-1.805.124-2.685.372.607-.913 1.005-1.968 1.005-3.117 0-3.898-3.582-7.073-8-7.073C4.582 3.682 1 6.857 1 10.755c0 3.898 3.582 7.073 8 7.073.937 0 1.834-.127 2.716-.372-.607.913-1.005 1.968-1.005 3.117 0 3.898 3.582 7.073 8 7.073s8-3.175 8-7.073c0-1.555-.56-3.05-1.622-4.318-.584-.702-1.328-1.305-2.189-1.805.913-.6 1.61-1.466 1.959-2.457h2.177z"></path>
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-slate-500">Download on</p>
                    <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">App Store</p>
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="group block p-4 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 hover:border-orange-500/50 transition-all duration-300 hover:from-slate-800/80 hover:to-slate-900/80"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-slate-300 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.6 11.48h-5v5h-2v-5h-5v-2h5V5h2v4.48h5v2z"></path>
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="text-xs text-slate-500">Get it on</p>
                    <p className="font-semibold text-slate-200 group-hover:text-white transition-colors">Google Play</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8 border-t border-slate-700/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-center">
            {/* Copyright */}
            <div className="text-slate-400 text-xs text-center sm:text-left">
              <p>© {currentYear} Rohil</p>
              <p className="text-slate-500">All rights reserved.</p>
            </div>

            {/* Payment Methods */}
            <div className="flex justify-center gap-3">
              <p className="text-xs text-slate-500 self-center mr-2">Accepted payments:</p>
              <div className="flex gap-2">
                {paymentMethods.map((method, idx) => (
                  <div
                    key={idx}
                    title={method.name}
                    className={`w-10 h-6 rounded-md bg-gradient-to-br ${method.color} flex items-center justify-center text-xs font-bold text-white hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300 cursor-pointer`}
                  >
                    {method.name.substring(0, 2).toUpperCase()}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Links */}
            <div className="flex justify-center lg:justify-end gap-6 text-xs text-slate-400">
              <a href="#" className="hover:text-slate-200 transition-colors duration-300 hover:underline">
                Privacy
              </a>
              <a href="#" className="hover:text-slate-200 transition-colors duration-300 hover:underline">
                Terms
              </a>
              <a href="#" className="hover:text-slate-200 transition-colors duration-300 hover:underline">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 hidden lg:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-xl shadow-orange-500/20 hover:shadow-2xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-110 z-40 group"
        title="Back to top"
      >
        <svg className="w-6 h-6 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </footer>
  );
};

export default Footer;
