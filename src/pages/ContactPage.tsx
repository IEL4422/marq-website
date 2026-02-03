import { useEffect } from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { updatePageSEO } from '../utils/seo';
import SchemaMarkup, { organizationSchema, localBusinessSchema } from '../components/SchemaMarkup';

export default function ContactPage() {
  useEffect(() => {
    updatePageSEO({
      title: 'Contact Us | Get in Touch | Marq Legal',
      description: 'Get in touch with our trademark attorneys. We\'re here to help with your trademark registration, monitoring, and legal needs.',
      canonical: 'https://marqtrademarks.com/contact',
      keywords: 'contact trademark attorney, trademark consultation, trademark questions, trademark legal help'
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <SchemaMarkup schema={[organizationSchema, localBusinessSchema]} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions about trademark registration or need legal assistance? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a href="tel:877-837-5950" className="text-gray-600 hover:text-blue-600 transition-colors text-lg font-semibold">
                      877-837-5950
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a href="mailto:contact@marqtrademarks.com" className="text-gray-600 hover:text-blue-600 transition-colors">
                      contact@marqtrademarks.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600">
                      980 N. Michigan Ave<br />
                      Suite 1090<br />
                      Chicago, Illinois 60611
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Office Hours</h2>
              <div className="space-y-2 text-blue-100">
                <div className="flex justify-between">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-white">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday</span>
                  <span className="font-semibold text-white">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-semibold text-white">Closed</span>
                </div>
              </div>
              <p className="mt-6 text-sm text-blue-100">
                All times are in Central Standard Time (CST)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
