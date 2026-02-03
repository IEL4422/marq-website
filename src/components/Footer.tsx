import { Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <div className="mb-4">
              <img src="https://i.imgur.com/1N22Mpe.png" alt="Marq Legal" className="h-30" />
            </div>
            <p className="text-sm text-slate-400">
              Professional trademark registration services available in all 50 states.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-amber-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm hover:text-amber-400 transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-amber-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm hover:text-amber-400 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-sm hover:text-amber-400 transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/trademark-registration" className="hover:text-amber-400 transition-colors">
                  Trademark Registration
                </Link>
              </li>
              <li>
                <Link to="/trademark-search" className="hover:text-amber-400 transition-colors">
                  Trademark Search
                </Link>
              </li>
              <li>
                <Link to="/office-action" className="hover:text-amber-400 transition-colors">
                  Office Action Response
                </Link>
              </li>
              <li>
                <Link to="/trademark-monitoring" className="hover:text-amber-400 transition-colors">
                  Trademark Monitoring
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-amber-400" />
                <span>contact@marqtrademarks.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-amber-400" />
                <span>Available Nationwide</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} Marq Legal LLC. All rights reserved. | marqtrademarks.com</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-of-service" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
