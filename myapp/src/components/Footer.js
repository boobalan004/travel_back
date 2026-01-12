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

  return (
    <footer className="bg-dark text-white pt-20 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl -z-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-gray-700">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-.788 0l-7 3.5a1 1 0 1 00.788 1.894L5 6.71v9.5a1 1 0 0 0 .5.866l7 3.5a1 1 0 0 0 .788 0l7-3.5A1 1 0 0 0 20 16.21V6.71l1.106-.553a1 1 0 1 0-.788-1.894l-7 3.5z"></path>
              </svg>
              <h3 className="text-2xl font-bold text-primary">Rohil</h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your gateway to unforgettable travel experiences around the world.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 flex-wrap">
              {socialLinks.map((social, idx) => (
                <button
                  key={idx}
                  title={social.label}
                  onClick={() => window.open(social.href)}
                  className="w-10 h-10 rounded-full bg-gray-700 hover:bg-primary flex items-center justify-center transition-all transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    {social.icon === 'facebook' && <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.07c0-2.77 1.694-4.28 4.16-4.28 1.183 0 2.202.088 2.496.127v2.894h-1.713c-1.345 0-1.605.64-1.605 1.576v2.068h3.21l-.418 3.54h-2.792V20"></path>}
                    {social.icon === 'twitter' && <path d="M19.498 3.094c-.739.331-1.529.557-2.356.658a4.114 4.114 0 001.804-2.27c-.798.469-1.682.812-2.623.996a4.106 4.106 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 6.697v.052a4.105 4.105 0 003.292 4.021 4.1 4.1 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 01.77 15.202a11.616 11.616 0 006.29 1.843c7.547 0 11.675-6.252 11.675-11.675 0-.178-.004-.355-.012-.53a8.348 8.348 0 002.046-2.127"></path>}
                    {social.icon === 'instagram' && <path d="M10 0C7.287 0 6.969.012 5.894.072c-1.067.06-1.794.264-2.431.563-.658.305-1.216.713-1.772 1.269-.557.557-.964 1.115-1.269 1.772-.3.637-.502 1.364-.563 2.431C.012 6.969 0 7.287 0 10s.012 3.031.072 4.106c.06 1.067.264 1.794.563 2.431.305.658.712 1.216 1.269 1.772.557.557 1.115.964 1.772 1.269.637.299 1.364.502 2.431.563 1.075.06 1.393.072 4.106.072s3.031-.012 4.106-.072c1.067-.06 1.794-.264 2.431-.563.658-.305 1.216-.712 1.772-1.269.557-.557.964-1.115 1.269-1.772.299-.637.502-1.364.563-2.431.06-1.075.072-1.393.072-4.106s-.012-3.031-.072-4.106c-.06-1.067-.264-1.794-.563-2.431-.305-.658-.712-1.216-1.269-1.772-.557-.557-1.115-.964-1.772-1.269-.637-.299-1.364-.502-2.431-.563C13.031.012 12.713 0 10 0zm0 1.802c2.67 0 2.987.009 4.042.058.975.045 1.504.207 1.857.344.467.182.801.398 1.151.748.35.35.566.684.748 1.151.137.353.299.882.344 1.857.049 1.055.058 1.372.058 4.042 0 2.67-.009 2.987-.058 4.042-.045.975-.207 1.504-.344 1.857-.182.467-.398.801-.748 1.151-.35.35-.684.566-1.151.748-.353.137-.882.299-1.857.344-1.055.049-1.372.058-4.042.058-2.67 0-2.987-.009-4.042-.058-.975-.045-1.504-.207-1.857-.344-.467-.182-.801-.398-1.151-.748-.35-.35-.566-.684-.748-1.151-.137-.353-.299-.882-.344-1.857-.049-1.055-.058-1.372-.058-4.042 0-2.67.009-2.987.058-4.042.045-.975.207-1.504.344-1.857.182-.467.398-.801.748-1.151.35-.35.684-.566 1.151-.748.353-.137.882-.299 1.857-.344 1.055-.049 1.372-.058 4.042-.058z"></path>}
                    {social.icon === 'youtube' && <path d="M19.615 3.654a3.001 3.001 0 0 0-2.117-2.117C15.738 1.2 12 1.2 12 1.2s-3.738 0-5.498.337a3.001 3.001 0 0 0-2.117 2.117C3.9 5.413 3.9 10 3.9 10s0 4.587.338 6.346a3.001 3.001 0 0 0 2.117 2.117c1.76.337 5.498.337 5.498.337s3.738 0 5.498-.337a3.001 3.001 0 0 0 2.117-2.117C20.1 14.587 20.1 10 20.1 10s0-4.587-.338-6.346zM9.659 13.995V6.005L15.113 10l-5.454 3.995z"></path>}
                    {social.icon === 'linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>}
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx} className="lg:col-span-1">
              <h4 className="font-bold text-lg mb-6 text-primary">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <button
                      onClick={() => window.location.href = link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm bg-none border-none cursor-pointer p-0"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Download Apps */}
          <div className="lg:col-span-1">
            <h4 className="font-bold text-lg mb-6 text-primary">Download App</h4>
            <div className="space-y-3">
              <button
                onClick={() => window.open('#')}
                className="w-full flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all text-left hover:scale-105 transform"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 13.5c-.91 0-1.805.124-2.685.372.607-.913 1.005-1.968 1.005-3.117 0-3.898-3.582-7.073-8-7.073C4.582 3.682 1 6.857 1 10.755c0 3.898 3.582 7.073 8 7.073.937 0 1.834-.127 2.716-.372-.607.913-1.005 1.968-1.005 3.117 0 3.898 3.582 7.073 8 7.073s8-3.175 8-7.073c0-1.555-.56-3.05-1.622-4.318-.584-.702-1.328-1.305-2.189-1.805.913-.6 1.61-1.466 1.959-2.457h2.177z"></path>
                </svg>
                <div className="text-sm">
                  <p className="text-xs text-gray-400">Download on</p>
                  <p className="font-semibold">App Store</p>
                </div>
              </button>
              <button
                onClick={() => window.open('#')}
                className="w-full flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all text-left hover:scale-105 transform"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.6 11.48h-5v5h-2v-5h-5v-2h5V5h2v4.48h5v2z"></path>
                </svg>
                <div className="text-sm">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="font-semibold">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Copyright */}
            <div className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Rohil. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex justify-center gap-4">
              <span title="Visa" className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white hover:bg-blue-700 transition-all">
                VISA
              </span>
              <span title="Mastercard" className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-xs font-bold text-white hover:bg-red-700 transition-all">
                MC
              </span>
              <span title="PayPal" className="w-10 h-6 bg-blue-700 rounded flex items-center justify-center text-xs font-bold text-white hover:bg-blue-800 transition-all">
                PP
              </span>
              <span title="American Express" className="w-10 h-6 bg-blue-900 rounded flex items-center justify-center text-xs font-bold text-white hover:bg-blue-950 transition-all">
                AX
              </span>
            </div>

            {/* Bottom Links */}
            <div className="flex justify-center md:justify-end gap-6 text-sm text-gray-400">
              <button onClick={() => window.location.href = '#'} className="hover:text-white transition-colors bg-none border-none cursor-pointer p-0">
                Privacy
              </button>
              <button onClick={() => window.location.href = '#'} className="hover:text-white transition-colors bg-none border-none cursor-pointer p-0">
                Terms
              </button>
              <button onClick={() => window.location.href = '#'} className="hover:text-white transition-colors bg-none border-none cursor-pointer p-0">
                Cookies
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to top button area hint */}
      <div className="fixed bottom-8 right-8 hidden lg:block">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-primary hover:bg-orange-600 text-white flex items-center justify-center shadow-lg transition-all transform hover:scale-110"
          title="Back to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
