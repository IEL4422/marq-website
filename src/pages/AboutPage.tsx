import { Shield, Target, Users, Award, TrendingUp, Heart, ArrowRight, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SchemaMarkup, { organizationSchema, professionalServiceSchema } from '../components/SchemaMarkup';

export default function AboutPage() {
  const navigate = useNavigate();
  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We maintain the highest ethical standards in all our client relationships and trademark work.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'Our commitment to quality ensures every trademark application receives meticulous attention.'
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description: 'Your success is our priority. We provide personalized service and clear communication throughout.'
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Professional trademark services should be affordable and transparent for businesses of all sizes.'
    }
  ];

  const stats = [
    { number: '5,000+', label: 'Trademarks Registered' },
    { number: '50', label: 'States Served' },
    { number: '98%', label: 'Success Rate' },
    { number: '5★', label: 'Customer Rating' }
  ];

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[organizationSchema, professionalServiceSchema]} />
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Marq</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We're a modern trademark law firm dedicated to making brand protection accessible,
              affordable, and straightforward for businesses across the United States.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                At Marq, we believe that every business deserves professional trademark protection without
                the complexity and uncertainty of traditional legal pricing. Our mission is to democratize
                access to intellectual property services through transparent, flat-fee pricing and exceptional
                client service.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Founded by experienced trademark attorneys who witnessed firsthand the challenges small
                businesses face when trying to protect their brands, we set out to create a better way.
                Our streamlined process combines cutting-edge technology with personalized legal expertise
                to deliver results efficiently and affordably.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Today, we've helped thousands of businesses across all 50 states secure federal trademark
                protection, and we're proud to be their trusted partner in brand protection and growth.
              </p>
            </div>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">Why Choose Marq?</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Award className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-semibold mb-1">Experienced Legal Team</p>
                    <p className="text-slate-300 text-sm">Every application reviewed by our team of licensed trademark attorneys with years of USPTO experience.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <TrendingUp className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-semibold mb-1">Proven Track Record</p>
                    <p className="text-slate-300 text-sm">98% success rate with thousands of successfully registered trademarks.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <p className="font-semibold mb-1">Transparent Pricing</p>
                    <p className="text-slate-300 text-sm">No hidden fees, no hourly billing. Know exactly what you'll pay upfront.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Meet Our Lead Attorney</h2>
            <p className="text-xl text-slate-600">Expert guidance from an experienced trademark professional</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl shadow-lg overflow-hidden border border-slate-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 p-8 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-700">
                  <div className="relative w-48 h-48 mb-6">
                    <img
                      src="https://i.imgur.com/eXHYjog.png"
                      alt="Mary Liberty, Owner and Lead Attorney"
                      className="w-full h-full object-cover rounded-2xl shadow-xl border-4 border-amber-400"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Mary Liberty</h3>
                  <p className="text-amber-400 font-semibold mb-4">Owner & Lead Attorney</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-white/20">
                      Trademark Law
                    </span>
                    <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white border border-white/20">
                      USPTO Expert
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-2 p-8 lg:p-12">
                  <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                    Mary Liberty founded Marq with a clear vision: to make professional trademark protection accessible
                    to businesses of all sizes. As owner and lead attorney, she has assembled a dedicated team of experienced
                    trademark attorneys. With extensive experience in intellectual property law and thousands of successful
                    trademark registrations, Mary and her team bring expertise and dedication to every client relationship.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <Shield className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Comprehensive Expertise</p>
                        <p className="text-slate-600">Our team specializes in trademark registration, USPTO procedures, and brand protection strategies</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Client-Centered Approach</p>
                        <p className="text-slate-600">Our attorneys provide personalized attention to each case with clear communication and tailored guidance</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="text-amber-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-slate-900 mb-1">Proven Track Record</p>
                        <p className="text-slate-600">Our team has successfully registered thousands of trademarks for businesses nationwide</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <p className="text-slate-700 italic leading-relaxed">
                      "Every business deserves the security and confidence that comes with federal trademark protection.
                      My goal is to lead a team that makes that protection accessible, affordable, and straightforward for entrepreneurs
                      and established companies alike."
                    </p>
                    <p className="text-slate-600 text-sm mt-2">— Mary Liberty, Owner & Lead Attorney</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="mx-auto mb-6 text-amber-400" size={48} />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Streamlined Process</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            From initial consultation to federal registration, we guide you through every step
            with transparency and expertise. Typically completed in 8-12 months.
          </p>
          <button
            onClick={() => navigate('/process')}
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg"
          >
            View Detailed Process Timeline
            <ArrowRight size={20} />
          </button>
          <p className="text-sm text-slate-400 mt-4">
            See exactly what happens at each step and when
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Values</h2>
            <p className="text-xl text-slate-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                <div className="bg-gradient-to-br from-slate-900 to-slate-700 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-amber-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-slate-300">Numbers that reflect our commitment to excellence</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-amber-400 mb-2">{stat.number}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-amber-50 to-slate-50 rounded-2xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Our Commitment to You
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                When you choose Marq, you're not just getting a trademark registration service—you're
                gaining a partner invested in your brand's success. We're committed to providing clear
                communication, expert guidance, and unwavering support throughout your trademark journey.
              </p>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                From your initial consultation to receiving your registration certificate and beyond,
                we're here to ensure your intellectual property is protected and your business can thrive.
              </p>
              <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
                Start Your Trademark Application
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nationwide Service</h2>
            <p className="text-xl text-slate-600">
              Proudly serving businesses in all 50 states with federal trademark protection
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <p className="text-center text-slate-600 leading-relaxed">
              Whether you're in California, New York, Texas, Florida, or anywhere in between, our dedicated team
              of experienced trademark attorneys led by Mary Liberty is ready to help protect your brand. Federal trademark
              registration provides nationwide protection, and we make the process simple no matter where
              your business is located.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
