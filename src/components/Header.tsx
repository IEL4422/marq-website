import { Menu, X, ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

interface DropdownItem {
  path: string;
  label: string;
}

interface NavItem {
  path?: string;
  label: string;
  dropdown?: DropdownItem[];
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

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
        { path: '/cease-and-desist', label: 'Cease and Desist Letters' }
      ]
    },
    {
      label: 'About',
      dropdown: [
        { path: '/about', label: 'About Marq' },
        { path: '/process', label: 'Our Process' }
      ]
    },
    {
      label: 'Resources',
      dropdown: [
        { path: '/resources', label: 'Learning Center' },
        { path: '/blog', label: 'Blog' },
        { path: '/business-name-generator', label: 'Business Name Generator' }
      ]
    },
    { path: '/contact', label: 'Contact' }
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  const handleDropdownToggle = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const isActive = (path: string) => location.pathname === path;
  const isDropdownActive = (dropdown: DropdownItem[]) =>
    dropdown.some(item => location.pathname === item.path);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="focus:outline-none">
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-8">
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
                      onClick={() => handleDropdownToggle(item.label)}
                      className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-slate-900 ${
                        isDropdownActive(item.dropdown)
                          ? 'text-slate-900 border-b-2 border-amber-500 pb-1'
                          : 'text-slate-600'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute top-full left-0 pt-2">
                        <div className="w-60 bg-white border border-slate-200 rounded-lg shadow-lg py-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.path}
                              to={dropdownItem.path}
                              onClick={handleNavClick}
                              className={`block w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-slate-50 ${
                                isActive(dropdownItem.path)
                                  ? 'text-slate-900 bg-slate-50'
                                  : 'text-slate-600'
                              }`}
                            >
                              {dropdownItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path!}
                    className={`text-sm font-medium transition-colors hover:text-slate-900 ${
                      isActive(item.path!)
                        ? 'text-slate-900 border-b-2 border-amber-500 pb-1'
                        : 'text-slate-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/get-started"
              className="bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/trademark-search-request"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Trademark Search
            </Link>
            <Link
              to="/client-portal"
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-slate-900 border border-slate-300 px-3 py-2 rounded-lg hover:border-slate-400 ${
                isActive('/client-portal')
                  ? 'text-slate-900 border-amber-500'
                  : 'text-slate-600'
              }`}
            >
              <User size={16} />
              Client Portal
            </Link>
          </nav>

          <button
            className="md:hidden text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => handleDropdownToggle(item.label)}
                      className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isDropdownActive(item.dropdown)
                          ? 'bg-slate-100 text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.path}
                            to={dropdownItem.path}
                            onClick={handleNavClick}
                            className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isActive(dropdownItem.path)
                                ? 'bg-slate-100 text-slate-900'
                                : 'text-slate-600 hover:bg-slate-50'
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
                    className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(item.path!)
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <Link
              to="/get-started"
              onClick={handleNavClick}
              className="block w-full bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors text-center"
            >
              Get Started
            </Link>
            <Link
              to="/trademark-search-request"
              onClick={handleNavClick}
              className="block w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
            >
              Trademark Search
            </Link>
            <Link
              to="/client-portal"
              onClick={handleNavClick}
              className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                isActive('/client-portal')
                  ? 'bg-slate-100 text-slate-900 border-amber-500'
                  : 'text-slate-600 hover:bg-slate-50 border-slate-300'
              }`}
            >
              <User size={16} />
              Client Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
