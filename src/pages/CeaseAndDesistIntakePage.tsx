import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Check, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  trademarkName: string;
  logoFile: File | null;
  trademarkFiledDate: string;
  trademarkAcceptedDate: string;
  infringerName: string;
  infringerContact: string;
  infringementDescription: string;
  desiredOutcome: string;
  additionalInfo: string;
}

export default function CeaseAndDesistIntakePage() {
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    trademarkName: '',
    logoFile: null,
    trademarkFiledDate: '',
    trademarkAcceptedDate: '',
    infringerName: '',
    infringerContact: '',
    infringementDescription: '',
    desiredOutcome: '',
    additionalInfo: ''
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData('logoFile', file);
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cease-desist-logo-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `cease-desist-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('trademark-logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('trademark-logos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message || 'Unknown error'}`);
    }
  };

  const validateForm = (): boolean => {
    return !!(
      formData.fullName &&
      formData.email &&
      formData.phone &&
      formData.trademarkName &&
      formData.trademarkFiledDate &&
      formData.infringerName &&
      formData.infringementDescription &&
      formData.desiredOutcome
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.logoFile && formData.logoFile.size > 5 * 1024 * 1024) {
      setError('Logo file must be less than 5MB');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      let logoUrl: string | null = null;
      if (formData.logoFile) {
        try {
          logoUrl = await uploadFile(formData.logoFile);
        } catch (err: any) {
          throw new Error(`Logo upload failed: ${err.message}`);
        }
      }

      const { data: requestData, error: insertError } = await supabase
        .from('cease_and_desist_requests')
        .insert({
          user_id: user?.id || null,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          trademark_name: formData.trademarkName,
          logo_url: logoUrl,
          trademark_filed_date: formData.trademarkFiledDate,
          trademark_accepted_date: formData.trademarkAcceptedDate || null,
          infringer_name: formData.infringerName,
          infringer_contact: formData.infringerContact || null,
          infringement_description: formData.infringementDescription,
          desired_outcome: formData.desiredOutcome,
          additional_info: formData.additionalInfo || null
        })
        .select()
        .single();

      if (insertError) throw new Error(`Database error: ${insertError.message}`);

      navigate('/agreement', {
        state: {
          selectedPackage: {
            name: 'Cease and Desist Letter',
            price: '$499',
            description: 'Professional attorney-drafted letter to stop trademark infringement and protect your brand rights'
          },
          requestId: requestData.id,
          requestType: 'cease_and_desist'
        }
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError(error.message || 'There was an error submitting your request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Cease and Desist Letter Request</h1>
          <p className="text-slate-600">
            $499 - Professional attorney-drafted letter
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Your Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            <div className="border-b border-slate-200 pb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Trademark Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Trademark Name or Slogan *
                  </label>
                  <input
                    type="text"
                    value={formData.trademarkName}
                    onChange={(e) => updateFormData('trademarkName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Enter your trademark name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload Logo (Optional)
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                      <span className="text-sm text-slate-600">
                        {formData.logoFile ? formData.logoFile.name : 'Click to upload logo'}
                      </span>
                      <p className="text-xs text-slate-500 mt-2">Max 5MB - PNG, JPG, or SVG</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    When was your trademark filed? *
                  </label>
                  <input
                    type="date"
                    value={formData.trademarkFiledDate}
                    onChange={(e) => updateFormData('trademarkFiledDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    When was your trademark accepted? (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.trademarkAcceptedDate}
                    onChange={(e) => updateFormData('trademarkAcceptedDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <p className="text-sm text-slate-500 mt-1">Leave blank if still pending</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Infringement Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Name of Infringing Party *
                  </label>
                  <input
                    type="text"
                    value={formData.infringerName}
                    onChange={(e) => updateFormData('infringerName', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Company or individual name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Infringing Party Contact Information (Optional)
                  </label>
                  <textarea
                    value={formData.infringerContact}
                    onChange={(e) => updateFormData('infringerContact', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Email, phone, address, website, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Describe the Infringement *
                  </label>
                  <textarea
                    value={formData.infringementDescription}
                    onChange={(e) => updateFormData('infringementDescription', e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Provide detailed information about how your trademark is being infringed. Include specifics such as where the infringement is occurring (website, storefront, social media), what products/services are involved, and any evidence you have."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    What is your desired outcome? *
                  </label>
                  <textarea
                    value={formData.desiredOutcome}
                    onChange={(e) => updateFormData('desiredOutcome', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="What do you want the infringing party to do? (e.g., stop using the trademark, remove products from their website, change their business name, etc.)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Any other relevant information or context"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-400 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/pricing')}
            className="px-6 py-3 rounded-lg font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all"
          >
            Back to Pricing
          </button>

          <button
            onClick={handleSubmit}
            disabled={!validateForm() || isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
              validateForm() && !isSubmitting
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:shadow-xl'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              <>
                <Check size={20} />
                Continue to Agreement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
