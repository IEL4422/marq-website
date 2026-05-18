import { Menu, X, ChevronDown, User, Shield, Phone, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface DropdownItem {
  path: string;
  label: string;
  description?: string;
}

interface NavItem {
  path?: string;
  label: string;
  dropdown?: DropdownItem[];
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const navItems: NavItem[] = [
    { path: '/home', label: 'Home' },
    { path: '/pricing', label: 'Pricing' },
    {
      label: 'Services',
      dropdown: [
        { path: '/trademark-search', label: 'Trademark Search', description: 'Professional search & availability analysis' },
        { path: '/trademark-registration', label: 'Trademark Registration', description: 'Complete USPTO filing by real attorneys' },
        { path: '/amazon', label: 'Amazon Brand Registry', description: 'Protect your brand on Amazon' },
        { path: '/office-action', label: 'Office Action Response', description: 'Expert responses to USPTO actions' },
        { path: '/cease-and-desist', label: 'Cease & Desist Letters', description: 'Stop infringers with attorney-drafted letters' },
        { path: '/trademark-monitoring', label: 'Trademark Monitoring', description: 'Ongoing watch for potential conflicts' },
      ]
    },
    {
      label: 'About',
      dropdown: [
        { path: '/about', label: 'About Marq', description: 'Our story and mission' },
        { path: '/process', label: 'Our Process', description: 'How trademark registration works' },
        { path: '/contact', label: 'Contact Us', description: 'Get in touch with our team' },
      ]
    },
    {
      label: 'Resources',
      dropdown: [
        { path: '/resources', label: 'Learning Center', description: 'Guides, FAQs & glossary' },
        { path: '/blog', label: 'Blog', description: 'Trademark tips and news' },
        { path: '/business-name-generator', label: 'Name Generator', description: 'Brainstorm brandable business names' },
      ]
    },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (dropdown: DropdownItem[]) =>
    dropdown.some(item => location.pathname === item.path);

  return (
    <div className="sticky top-0 z-50">
      {announcementVisible && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 text-sm py-2 px-4 text-center font-medium relative">
          <span>
            <Shield size={14} className="inline mr-1.5 mb-0.5" />
            Flat-fee trademark registration — no hourly billing, ever.{' '}
            <Link to="/pricing" className="underline font-bold hover:opacity-80 transition-opacity">
              See pricing →
            </Link>
          </span>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
            aria-label="Close announcement"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <header className={`bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md border-b border-slate-100' : 'border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18 py-3">
            <Link to="/" className="focus:outline-none flex-shrink-0">
              <Logo />
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                  onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
                >
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isDropdownActive(item.dropdown)
                            ? 'text-amber-700 bg-amber-50'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={15}
                          className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-72">
                          <div className="bg-white border border-slate-200 rounded-xl shadow-xl py-2 overflow-hidden">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.path}
                                to={dropdownItem.path}
                                onClick={handleNavClick}
                                className={`block w-full px-4 py-3 transition-colors hover:bg-slate-50 ${
                                  isActive(dropdownItem.path) ? 'bg-amber-50' : ''
                                }`}
                              >
                                <div className={`text-sm font-semibold ${isActive(dropdownItem.path) ? 'text-amber-700' : 'text-slate-800'}`}>
                                  {dropdownItem.label}
                                </div>
                                {dropdownItem.description && (
                                  <div className="text-xs text-slate-500 mt-0.5">{dropdownItem.description}</div>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path!}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(item.path!)
                          ? 'text-amber-700 bg-amber-50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/trademark-search-request"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-50 transition-all"
              >
                Free Search
              </Link>
              <Link
                to="/client-portal"
                className={`flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg border transition-all ${
                  isActive('/client-portal')
                    ? 'border-amber-500 text-amber-700 bg-amber-50'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-800'
                }`}
              >
                <User size={15} />
                Client Portal
              </Link>
              <Link
                to="/get-started"
                className="group flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-md hover:shadow-amber-300/50 hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <button
              className="lg:hidden text-slate-700 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 max-h-[80vh] overflow-y-auto">
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                          isDropdownActive(item.dropdown)
                            ? 'bg-amber-50 text-amber-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="ml-4 mt-1 space-y-1 pb-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.path}
                              to={dropdownItem.path}
                              onClick={handleNavClick}
                              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive(dropdownItem.path)
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                              }`}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.path!}
                      onClick={handleNavClick}
                      className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                        isActive(item.path!)
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-3 border-t border-slate-100 space-y-2 mt-2">
                <Link
                  to="/trademark-search-request"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2 w-full border-2 border-slate-200 text-slate-700 px-4 py-3 rounded-xl text-sm font-semibold hover:border-amber-400 hover:text-amber-700 transition-all"
                >
                  <Phone size={16} />
                  Free Trademark Search
                </Link>
                <Link
                  to="/client-portal"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-600 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  <User size={16} />
                  Client Portal
                </Link>
                <Link
                  to="/get-started"
                  onClick={handleNavClick}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-4 py-3.5 rounded-xl text-sm font-bold hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
                >
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
