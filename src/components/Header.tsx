import { Menu, X, ChevronDown, User, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DropdownItem { path: string; label: string }
interface NavItem { path?: string; label: string; dropdown?: DropdownItem[] }

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
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
        { path: '/trademark-search', label: 'Trademark Search' },
        { path: '/trademark-registration', label: 'Trademark Registration' },
        { path: '/amazon', label: 'Amazon Brand Registry' },
        { path: '/office-action', label: 'Office Action' },
        { path: '/cease-and-desist', label: 'Cease & Desist Letters' },
        { path: '/trademark-monitoring', label: 'Trademark Monitoring' },
      ],
    },
    {
      label: 'About',
      dropdown: [
        { path: '/about', label: 'About Marq' },
        { path: '/process', label: 'Our Process' },
      ],
    },
    {
      label: 'Resources',
      dropdown: [
        { path: '/resources', label: 'Learning Center' },
        { path: '/blog', label: 'Blog' },
        { path: '/business-name-generator', label: 'Business Name Generator' },
      ],
    },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (dd: DropdownItem[]) => dd.some(d => location.pathname === d.path);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-navy-100'
          : 'bg-white border-b border-slate-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none">
            <div className="w-9 h-9 bg-navy-900 rounded-lg flex items-center justify-center group-hover:bg-navy-800 transition-colors">
              <Shield size={18} className="text-gold-500" />
            </div>
            <div>
              <div className="text-navy-900 font-bold text-lg leading-none tracking-tight">Marq Legal</div>
              <div className="text-gold-600 text-[10px] font-medium uppercase tracking-widest leading-none mt-0.5">Trademark Attorneys</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
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
                          ? 'text-navy-900 bg-navy-50'
                          : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 pt-1">
                        <div className="w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 overflow-hidden">
                          {item.dropdown.map(d => (
                            <Link
                              key={d.path}
                              to={d.path}
                              className={`block px-4 py-2.5 text-sm font-medium transition-colors hover:bg-navy-50 hover:text-navy-900 ${
                                isActive(d.path) ? 'text-navy-900 bg-navy-50' : 'text-slate-600'
                              }`}
                            >
                              {d.label}
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
                        ? 'text-navy-900 bg-navy-50'
                        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/client-portal"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-navy-900 border border-slate-200 rounded-lg hover:border-navy-300 transition-all"
            >
              <User size={14} />
              Portal
            </Link>
            <Link
              to="/trademark-search-request"
              className="px-4 py-2 text-sm font-medium text-navy-900 bg-gold-100 hover:bg-gold-200 border border-gold-300 rounded-lg transition-all"
            >
              Free Search
            </Link>
            <Link
              to="/get-started"
              className="px-4 py-2 text-sm font-semibold text-white bg-navy-900 hover:bg-navy-800 rounded-lg transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>

          <button
            className="lg:hidden p-2 text-slate-600 hover:text-navy-900 hover:bg-slate-50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 shadow-lg">
          <div className="px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
            {navItems.map(item => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      {item.label}
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {item.dropdown.map(d => (
                          <Link
                            key={d.path}
                            to={d.path}
                            className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                              isActive(d.path) ? 'bg-navy-50 text-navy-900 font-medium' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {d.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path!}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path!) ? 'bg-navy-50 text-navy-900' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-3 space-y-2 border-t border-slate-100">
              <Link to="/get-started" className="block w-full text-center bg-navy-900 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:bg-navy-800 transition-colors">
                Get Started
              </Link>
              <Link to="/trademark-search-request" className="block w-full text-center border border-gold-400 text-navy-900 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gold-50 transition-colors">
                Free Trademark Search
              </Link>
              <Link to="/client-portal" className="flex items-center justify-center gap-2 w-full border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                <User size={14} />
                Client Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
