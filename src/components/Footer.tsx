import { Mail, MapPin, Shield, Star, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* CTA band */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 font-display">
                Ready to protect your brand?
              </h3>
              <p className="text-slate-800 mt-1">
                Flat-fee trademark registration — real attorneys, no surprises.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/trademark-search-request"
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-slate-900 font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all border border-white/40 text-sm"
              >
                Free Trademark Search
              </Link>
              <Link
                to="/get-started"
                className="flex items-center gap-2 bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-all text-sm"
              >
                Get Started
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-5">
              <img src="https://i.imgur.com/1N22Mpe.png" alt="Marq Legal" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-xs">
              Professional trademark registration by real USPTO-experienced attorneys. Flat-fee pricing, transparent process, and nationwide service.
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <Mail size={15} className="text-amber-400 flex-shrink-0" />
                <a href="mailto:contact@marqtrademarks.com" className="hover:text-amber-400 transition-colors">
                  contact@marqtrademarks.com
                </a>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-400">
                <MapPin size={15} className="text-amber-400 flex-shrink-0" />
                <span>Serving all 50 states nationwide</span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-lg px-3 py-2 text-xs text-slate-300">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span>5-Star Rated</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-lg px-3 py-2 text-xs text-slate-300">
                <Shield size={12} className="text-emerald-400" />
                <span>USPTO Attorneys</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/60 rounded-lg px-3 py-2 text-xs text-slate-300">
                <CheckCircle size={12} className="text-blue-400" />
                <span>5,000+ Filed</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/trademark-registration', label: 'Trademark Registration' },
                { to: '/trademark-search', label: 'Trademark Search' },
                { to: '/amazon', label: 'Amazon Brand Registry' },
                { to: '/office-action', label: 'Office Action Response' },
                { to: '/cease-and-desist', label: 'Cease & Desist Letters' },
                { to: '/trademark-monitoring', label: 'Trademark Monitoring' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/home', label: 'Home' },
                { to: '/about', label: 'About Marq' },
                { to: '/process', label: 'Our Process' },
                { to: '/pricing', label: 'Pricing' },
                { to: '/blog', label: 'Blog' },
                { to: '/contact', label: 'Contact Us' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              {[
                { to: '/resources', label: 'Learning Center' },
                { to: '/business-name-generator', label: 'Name Generator' },
                { to: '/trademark-search-request', label: 'Free Trademark Search' },
                { to: '/client-portal', label: 'Client Portal' },
                { to: '/privacy-policy', label: 'Privacy Policy' },
                { to: '/terms-of-service', label: 'Terms of Service' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-500 text-center sm:text-left">
              &copy; {year} Marq Legal LLC. All rights reserved. marqtrademarks.com
            </p>
            <p className="text-xs text-slate-600 text-center max-w-xl leading-relaxed">
              The information on this website is for general informational purposes only and does not constitute legal advice. Use of this site does not create an attorney-client relationship.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
