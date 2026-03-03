import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Upload, X, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { updatePageSEO, pageSEO } from '../utils/seo';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm';
import { notifyTrademarkSearchRequest } from '../utils/notifications';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function TrademarkSearchRequestPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO['trademark-search-request']);
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    trademarkName: '',
    logoUrl: '',
    businessDescription: ''
  });
  const [showOtherInput, setShowOtherInput] = useState(false);

  const businessTypes = [
    'Retail Store',
    'E-commerce',
    'Restaurant/Cafe',
    'Bakery',
    'Clothing/Apparel',
    'Technology/Software',
    'Consulting Services',
    'Marketing/Advertising',
    'Healthcare Services',
    'Fitness/Wellness',
    'Beauty/Salon',
    'Real Estate',
    'Legal Services',
    'Financial Services',
    'Manufacturing',
    'Construction',
    'Education/Training',
    'Entertainment/Events',
    'Photography',
    'Automotive',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const amount = 4900;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            amount,
            currency: 'usd',
            clientEmail: formData.email,
            agreementId: null,
            paymentMethodType: 'card',
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      if (!data.clientSecret) {
        throw new Error('Invalid payment response');
      }

      setClientSecret(data.clientSecret);
      setShowPayment(true);
    } catch (err) {
      console.error('Error creating payment:', err);
      setError('There was an error setting up payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      let logoUrl = formData.logoUrl;

      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('trademark-logos')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('trademark-logos')
          .getPublicUrl(filePath);

        logoUrl = urlData.publicUrl;
      }

      const { data: requestData, error: submitError } = await supabase
        .from('trademark_search_requests')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            trademark_name: formData.trademarkName,
            logo_url: logoUrl || null,
            business_description: formData.businessDescription
          }
        ])
        .select();

      if (submitError) throw submitError;

      if (requestData && requestData[0]) {
        await notifyTrademarkSearchRequest(
          formData.fullName,
          formData.email,
          formData.trademarkName,
          formData.businessDescription,
          requestData[0].id
        ).catch(err => console.error('Notification error:', err));
      }

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('There was an error submitting your request. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'businessDescription') {
      if (value === 'Other') {
        setShowOtherInput(true);
        setFormData({
          ...formData,
          [name]: ''
        });
      } else {
        setShowOtherInput(false);
        setFormData({
          ...formData,
          [name]: value
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid image file (JPG, PNG, GIF, WebP, or SVG)');
        return;
      }

      setLogoFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-12">
            <CheckCircle className="text-green-500 mx-auto mb-6" size={64} />
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Request Received!</h1>
            <p className="text-lg text-slate-700 mb-6">
              Thank you for your trademark search request. Our team will review your submission and get back to you within 1-2 business days.
            </p>
            <p className="text-slate-600 mb-8">
              We've sent a confirmation email to <strong>{formData.email}</strong>
            </p>

            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2 justify-center">
                <Shield size={20} />
                Important: Check Your Email
              </h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>Add <strong className="text-slate-900">contact@marqtrademarks.com</strong> to your contacts to ensure our emails reach your inbox</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 font-bold mt-0.5">•</span>
                  <span>Check your spam/junk folder if you don't see our response within 1-2 business days</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/')}
              className="bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPayment && clientSecret) {
    return (
      <div className="bg-white min-h-screen">
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Complete Payment</h1>
              <p className="text-xl text-slate-600">
                Secure payment for your trademark search
              </p>
            </div>

            <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm">
              <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-slate-900">Attorney Trademark Search</span>
                  <span className="text-2xl font-bold text-slate-900">$49</span>
                </div>
                <div className="text-sm text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Comprehensive federal and state database search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Professional legal analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Detailed conflict report</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Results within 24 hours</span>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-center gap-2 text-slate-600">
                <Lock size={20} />
                <span className="text-sm">Secure payment processed by Stripe</span>
              </div>

              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  amount={49}
                />
              </Elements>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Attorney Trademark Search</h1>
            <p className="text-xl text-slate-600 mb-2">
              Get a comprehensive trademark availability analysis from our legal team
            </p>
            <div className="inline-block bg-amber-100 border-2 border-amber-400 rounded-lg px-6 py-2">
              <span className="text-2xl font-bold text-slate-900">$49</span>
              <span className="text-slate-600 ml-2">one-time fee</span>
            </div>
          </div>
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-sm">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-900 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="trademarkName" className="block text-sm font-semibold text-slate-900 mb-2">
                  Name You Wish to Protect *
                </label>
                <input
                  type="text"
                  id="trademarkName"
                  name="trademarkName"
                  required
                  value={formData.trademarkName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                  placeholder="Your Brand Name"
                />
              </div>

              <div>
                <label htmlFor="logoFile" className="block text-sm font-semibold text-slate-900 mb-2">
                  Upload Logo or Image <span className="text-slate-500 font-normal">(optional)</span>
                </label>

                {!logoPreview ? (
                  <div className="relative">
                    <input
                      type="file"
                      id="logoFile"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="logoFile"
                      className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all"
                    >
                      <Upload className="text-slate-400 mb-2" size={32} />
                      <span className="text-sm font-semibold text-slate-700">Click to upload logo</span>
                      <span className="text-xs text-slate-500 mt-1">JPG, PNG, GIF, WebP, or SVG (max 5MB)</span>
                    </label>
                  </div>
                ) : (
                  <div className="relative border-2 border-slate-200 rounded-lg p-4">
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="max-h-48 mx-auto rounded"
                    />
                    <p className="text-sm text-slate-600 text-center mt-2">
                      {logoFile?.name}
                    </p>
                  </div>
                )}
                <p className="text-sm text-slate-500 mt-2">
                  If you have a logo or design element, upload it here for trademark analysis
                </p>
              </div>

              <div>
                <label htmlFor="businessDescription" className="block text-sm font-semibold text-slate-900 mb-2">
                  Type of Business *
                </label>
                <select
                  id="businessDescription"
                  name="businessDescription"
                  required={!showOtherInput}
                  value={showOtherInput ? 'Other' : formData.businessDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
                >
                  <option value="">Select your business type</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {showOtherInput && (
                  <div className="mt-3">
                    <label htmlFor="businessDescriptionOther" className="block text-sm font-semibold text-slate-900 mb-2">
                      Please describe your business
                    </label>
                    <input
                      type="text"
                      id="businessDescriptionOther"
                      name="businessDescription"
                      required
                      value={formData.businessDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="e.g., pet grooming services, custom furniture maker"
                    />
                  </div>
                )}
                <p className="text-sm text-slate-500 mt-1">
                  Select the category that best describes your business
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-500 text-white py-4 rounded-lg font-semibold hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : 'Continue to Payment ($49)'}
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mt-3">
                <Lock size={16} />
                <span>Secure payment via Stripe</span>
              </div>

              <p className="text-sm text-slate-500 text-center mt-4">
                By submitting this form, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>
          </div>

          <div className="mt-8 bg-slate-50 border-2 border-slate-200 rounded-xl p-6">
            <h3 className="font-bold text-slate-900 mb-3">What Happens Next?</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">1.</span>
                <span>Complete payment ($49) to submit your search request</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">2.</span>
                <span>Our legal team reviews your request within 1-2 business days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">3.</span>
                <span>We conduct a comprehensive search of federal, state, and common law databases</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 font-bold">4.</span>
                <span>You receive a detailed report with our professional analysis and recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
