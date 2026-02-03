import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Upload, Check, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  trademarkName: string;
  logoFile: File | null;
  officeActionFile: File | null;
}

export default function OfficeActionIntakePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const serviceType = location.state?.serviceType || 'Procedural Office Action Response';
  const servicePrice = serviceType === 'Procedural Office Action Response' ? '$399' : '$799';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    trademarkName: '',
    logoFile: null,
    officeActionFile: null
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoFile' | 'officeActionFile') => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData(field, file);
    }
  };

  const uploadFile = async (file: File, bucket: string, prefix: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${prefix}-${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${prefix}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucket)
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
      formData.officeActionFile
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.officeActionFile && formData.officeActionFile.size > 10 * 1024 * 1024) {
      setError('Office action file must be less than 10MB');
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
          logoUrl = await uploadFile(formData.logoFile, 'trademark-logos', 'office-action-logos');
        } catch (err: any) {
          throw new Error(`Logo upload failed: ${err.message}`);
        }
      }

      let officeActionUrl: string | null = null;
      try {
        officeActionUrl = await uploadFile(formData.officeActionFile!, 'trademark-logos', 'office-actions');
      } catch (err: any) {
        throw new Error(`Office action upload failed: ${err.message}`);
      }

      if (!officeActionUrl) {
        throw new Error('Failed to upload office action file');
      }

      const { data: requestData, error: insertError } = await supabase
        .from('office_action_requests')
        .insert({
          user_id: user?.id || null,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          trademark_name: formData.trademarkName,
          service_type: serviceType,
          logo_url: logoUrl,
          office_action_url: officeActionUrl
        })
        .select()
        .single();

      if (insertError) throw new Error(`Database error: ${insertError.message}`);

      navigate('/agreement', {
        state: {
          selectedPackage: {
            name: serviceType,
            price: servicePrice,
            description: serviceType === 'Procedural Office Action Response'
              ? 'Response to technical issues like specimen problems or description clarifications'
              : 'Response to complex legal issues like likelihood of confusion or descriptiveness'
          },
          requestId: requestData.id,
          requestType: 'office_action'
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Office Action Response Request</h1>
          <p className="text-slate-600">
            {serviceType} - {servicePrice}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="space-y-6">
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
                  onChange={(e) => handleFileUpload(e, 'logoFile')}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upload Office Action *
              </label>
              <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                <div className="text-center">
                  <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                  <span className="text-sm text-slate-600">
                    {formData.officeActionFile ? formData.officeActionFile.name : 'Click to upload office action document'}
                  </span>
                  <p className="text-xs text-slate-500 mt-2">Max 10MB - PDF, DOC, or DOCX</p>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, 'officeActionFile')}
                  className="hidden"
                />
              </label>
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
