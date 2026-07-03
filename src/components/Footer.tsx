import { Mail, MapPin, Phone, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-400">
      {/* CTA band */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-b border-navy-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-1">Ready to protect your brand?</p>
              <h3 className="text-2xl font-bold text-white">Start Your Trademark Today</h3>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/get-started"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-gold-500/30 text-sm"
              >
                Get Started <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 border border-white/20 text-white hover:bg-white/10 px-6 py-3 rounded-xl transition-all text-sm font-medium"
              >
                Talk to an Attorney
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-navy-700 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-gold-400" />
              </div>
              <span className="text-white font-bold text-lg">Marq Legal LLC</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-6">
              Professional trademark attorneys offering flat-fee registration services nationwide. Protect your brand with confidence.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href="tel:877-837-5950" className="flex items-center gap-2.5 hover:text-gold-400 transition-colors group">
                <Phone size={15} className="text-gold-500 group-hover:text-gold-400 flex-shrink-0" />
                877-837-5950
              </a>
              <a href="mailto:contact@marqtrademarks.com" className="flex items-center gap-2.5 hover:text-gold-400 transition-colors group">
                <Mail size={15} className="text-gold-500 group-hover:text-gold-400 flex-shrink-0" />
                contact@marqtrademarks.com
              </a>
              <div className="flex items-start gap-2.5">
                <MapPin size={15} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <span>980 N. Michigan Ave, Suite 1090<br />Chicago, IL 60611</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Trademark Registration', '/trademark-registration'],
                ['Trademark Search', '/trademark-search'],
                ['Office Action Response', '/office-action'],
                ['Trademark Monitoring', '/trademark-monitoring'],
                ['Cease & Desist', '/cease-and-desist'],
                ['Amazon Brand Registry', '/amazon'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['About Us', '/about'],
                ['Our Process', '/process'],
                ['Pricing', '/pricing'],
                ['Contact', '/contact'],
                ['Client Portal', '/client-portal'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                ['Learning Center', '/resources'],
                ['Blog', '/blog'],
                ['Glossary', '/glossary'],
                ['Business Name Generator', '/business-name-generator'],
                ['DIY Trademark Search', '/diy-search'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-gold-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-navy-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {year} Marq Legal LLC. All rights reserved. | marqtrademarks.com</p>
            <div className="flex gap-6">
              <Link to="/privacy-policy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-4 max-w-3xl">
            Attorney advertising. Prior results do not guarantee a similar outcome. Marq Legal LLC is a law firm providing legal services in all 50 states.
          </p>
        </div>
      </div>
    </footer>
  );
}
