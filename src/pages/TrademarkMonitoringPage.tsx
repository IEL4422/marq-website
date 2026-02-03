import { useNavigate } from 'react-router-dom';
import { Eye, Bell, Shield, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

export default function TrademarkMonitoringPage() {
  const navigate = useNavigate();
  const monitoringFeatures = [
    {
      icon: Eye,
      title: 'Continuous Monitoring',
      description: 'We continuously monitor USPTO filings for new applications that may conflict with your mark.'
    },
    {
      icon: Bell,
      title: 'Instant Alerts',
      description: 'Receive immediate notifications when potentially infringing applications are filed.'
    },
    {
      icon: Shield,
      title: 'Opposition Support',
      description: 'Expert guidance on filing oppositions to protect your trademark rights.'
    },
    {
      icon: TrendingUp,
      title: 'Marketplace Monitoring',
      description: 'Optional monitoring of marketplace use and domain registrations.'
    }
  ];

  const whyMonitor = [
    'Catch infringement early before it becomes costly',
    'Protect your brand investment proactively',
    'Maintain the strength of your trademark',
    'Prevent brand dilution and confusion',
    'Exercise your rights before they\'re lost',
    'Stop competitors from registering similar marks'
  ];

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-br from-green-900 via-emerald-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
              <Eye size={16} className="text-green-400" />
              <span className="text-sm font-medium text-green-400">Proactive Protection</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trademark Monitoring Services
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Protect your brand investment with continuous monitoring of new trademark applications.
              Stay ahead of potential infringement and enforce your rights before problems escalate.
            </p>
            <button onClick={() => navigate('/get-started')} className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-400 transition-all hover:scale-105 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Trademark Monitoring is Essential</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Getting your trademark registered is just the first step. Ongoing monitoring ensures
              your rights are protected and that no one else registers confusingly similar marks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-200">
              <AlertTriangle className="text-red-600 mb-4" size={32} />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">The Risk of Not Monitoring</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Competitors may register similar marks without your knowledge</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Brand confusion can develop in the marketplace</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Your mark may become diluted or weakened</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Enforcement becomes more difficult and expensive over time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-600 font-bold">•</span>
                  <span>You may lose your window to oppose problematic applications</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
              <CheckCircle className="text-green-600 mb-4" size={32} />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Benefits of Active Monitoring</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Early detection of potentially conflicting marks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Opportunity to oppose before registration is granted</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Maintain the exclusivity and strength of your brand</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Lower enforcement costs by catching issues early</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">•</span>
                  <span>Peace of mind knowing your brand is protected</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Our Monitoring Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We provide comprehensive monitoring services to keep your trademark protected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {monitoringFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-gradient-to-br from-green-600 to-emerald-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Understanding the Opposition Window</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                When a trademark application is approved for publication, there is a 30-day window
                for anyone to file an opposition. This is your opportunity to challenge potentially
                infringing marks before they become registered.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Without monitoring, you may miss this critical window. Once a mark is registered,
                it becomes much more difficult and expensive to challenge. Our monitoring service
                ensures you never miss an opportunity to protect your brand.
              </p>
              <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-xl">
                <h4 className="font-bold text-slate-900 mb-2">30-Day Opposition Period</h4>
                <p className="text-slate-700 text-sm">
                  The USPTO publishes approved applications in the Official Gazette. From the publication
                  date, there is a 30-day window to file an opposition. Our monitoring catches these
                  publications immediately, giving you time to evaluate and act.
                </p>
              </div>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Why Monitor with Marq Legal?</h3>
              <ul className="space-y-4">
                {whyMonitor.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Comprehensive Protection</h2>
            <p className="text-xl text-slate-300 mb-12 text-center leading-relaxed">
              Our monitoring service goes beyond just USPTO watch services. We provide comprehensive
              protection for your brand across multiple channels.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-3">USPTO Monitoring</h3>
                <p className="text-slate-400 text-sm">
                  Daily monitoring of new trademark applications and publications for potential conflicts.
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-3">Status Updates</h3>
                <p className="text-slate-400 text-sm">
                  Regular reports on the status of your trademark registrations and any detected conflicts.
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl">
                <h3 className="text-lg font-bold mb-3">Legal Support</h3>
                <p className="text-slate-400 text-sm">
                  Expert guidance on enforcement actions, oppositions, and protecting your rights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-green-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Protect Your Trademark Today
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Don't wait for infringement to happen. Start monitoring your trademark now.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
            Get Started
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Continuous monitoring • Expert support • Peace of mind
          </p>
        </div>
      </section>
    </div>
  );
}
