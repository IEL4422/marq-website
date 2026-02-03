import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Upload, X, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface TrademarkIntakeFormProps {
  matterId: string;
  onSubmit: () => void;
  onSaveExit: () => void;
}

interface FormData {
  [section: string]: {
    [field: string]: any;
  };
}

interface SpecimenEntry {
  class_number: string;
  specimen_upload: File | null;
  specimen_url: string;
  specimen_description: string;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const NICE_CLASSES = Array.from({ length: 45 }, (_, i) => ({
  value: `${i + 1}`,
  label: `Class ${i + 1}`
}));

export default function TrademarkIntakeForm({ matterId, onSubmit, onSaveExit }: TrademarkIntakeFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [saving, setSaving] = useState(false);
  const [specimens, setSpecimens] = useState<SpecimenEntry[]>([]);

  useEffect(() => {
    loadSavedData();
  }, [matterId]);

  const loadSavedData = async () => {
    try {
      const { data, error } = await supabase
        .from('trademark_intake_responses')
        .select('*')
        .eq('matter_id', matterId);

      if (error) throw error;

      const loadedData: FormData = {};
      data?.forEach((response) => {
        if (!loadedData[response.section]) {
          loadedData[response.section] = {};
        }
        loadedData[response.section][response.field_name] = response.field_value;
      });

      setFormData(loadedData);

      if (loadedData.filing_basis?.per_class_specimens) {
        setSpecimens(loadedData.filing_basis.per_class_specimens);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveField = async (section: string, fieldName: string, value: any) => {
    try {
      const { error } = await supabase
        .from('trademark_intake_responses')
        .upsert({
          matter_id: matterId,
          section,
          field_name: fieldName,
          field_value: value
        }, {
          onConflict: 'matter_id,section,field_name'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving field:', error);
    }
  };

  const updateField = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    saveField(section, field, value);
  };

  const handleFileUpload = async (section: string, fieldName: string, files: FileList) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [fieldName]: 'File size must be under 25MB' }));
      return;
    }

    setUploadingFiles(prev => ({ ...prev, [fieldName]: true }));

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${matterId}/${fieldName}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('trademark-intake-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      await supabase.from('matter_files').insert({
        matter_id: matterId,
        field_name: fieldName,
        file_name: file.name,
        file_path: fileName,
        file_type: file.type,
        file_size: file.size,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id
      });

      updateField(section, fieldName, fileName);
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(prev => ({ ...prev, [fieldName]: 'Upload failed. Please try again.' }));
    } finally {
      setUploadingFiles(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const validateSection = (step: number): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (step) {
      case 0:
        if (!formData.client_contact?.contact_full_name) {
          newErrors.contact_full_name = 'Full name is required';
        }
        if (!formData.client_contact?.contact_email) {
          newErrors.contact_email = 'Email is required';
        }
        if (!formData.client_contact?.contact_phone) {
          newErrors.contact_phone = 'Phone is required';
        }
        if (!formData.client_contact?.preferred_contact_method) {
          newErrors.preferred_contact_method = 'Preferred contact method is required';
        }
        break;

      case 1:
        if (!formData.owner?.owner_type) {
          newErrors.owner_type = 'Owner type is required';
        }
        if (!formData.owner?.owner_legal_name) {
          newErrors.owner_legal_name = 'Legal name is required';
        }
        if (formData.owner?.owner_type === 'Individual' && !formData.owner?.owner_citizenship) {
          newErrors.owner_citizenship = 'Citizenship is required for individuals';
        }
        if (formData.owner?.owner_type !== 'Individual' && !formData.owner?.owner_entity_state) {
          newErrors.owner_entity_state = 'State of formation is required for entities';
        }
        if (!formData.owner?.owner_street) {
          newErrors.owner_street = 'Street address is required';
        }
        if (!formData.owner?.owner_city) {
          newErrors.owner_city = 'City is required';
        }
        if (!formData.owner?.owner_state_province) {
          newErrors.owner_state_province = 'State/Province is required';
        }
        if (!formData.owner?.owner_postal_code) {
          newErrors.owner_postal_code = 'Postal code is required';
        }
        if (!formData.owner?.owner_country) {
          newErrors.owner_country = 'Country is required';
        }
        break;

      case 2:
        if (!formData.the_mark?.mark_type) {
          newErrors.mark_type = 'Mark type is required';
        }
        if (formData.the_mark?.mark_type?.includes('Word') && !formData.the_mark?.mark_text) {
          newErrors.mark_text = 'Mark text is required for word marks';
        }
        if (formData.the_mark?.mark_type !== 'Standard Character (Word)' && !formData.the_mark?.mark_design_upload) {
          newErrors.mark_design_upload = 'Design file is required for design/logo marks';
        }
        if (formData.the_mark?.mark_type !== 'Standard Character (Word)' && !formData.the_mark?.mark_description) {
          newErrors.mark_description = 'Mark description is required';
        }
        break;

      case 4:
        if (!formData.goods_services?.goods_services_plain) {
          newErrors.goods_services_plain = 'Goods/services description is required';
        }
        if (formData.goods_services?.ok_use_preapproved_id === undefined) {
          newErrors.ok_use_preapproved_id = 'Please indicate if you approve pre-approved IDs';
        }
        break;

      case 5:
        if (!formData.filing_basis?.filing_basis) {
          newErrors.filing_basis = 'Filing basis is required';
        }
        if (formData.filing_basis?.filing_basis === '1(a) Use in Commerce') {
          if (!formData.filing_basis?.first_use_anywhere) {
            newErrors.first_use_anywhere = 'First use date is required';
          }
          if (!formData.filing_basis?.first_use_in_commerce) {
            newErrors.first_use_in_commerce = 'First use in commerce date is required';
          }
          if (specimens.length === 0) {
            newErrors.specimens = 'At least one specimen is required for 1(a) filing basis';
          }
        }
        if (formData.filing_basis?.filing_basis === '1(b) Intent to Use' && !formData.filing_basis?.ita_confirm) {
          newErrors.ita_confirm = 'You must confirm understanding of ITU requirements';
        }
        break;

      case 8:
        if (!formData.signatory?.signatory_name) {
          newErrors.signatory_name = 'Signatory name is required';
        }
        if (!formData.signatory?.signatory_title) {
          newErrors.signatory_title = 'Signatory title is required';
        }
        if (!formData.signatory?.authority_confirmation) {
          newErrors.authority_confirmation = 'You must confirm authority to sign';
        }
        if (!formData.signatory?.declaration_truth) {
          newErrors.declaration_truth = 'You must confirm truthfulness';
        }
        if (!formData.signatory?.email_consent) {
          newErrors.email_consent = 'Email consent is required';
        }
        if (!formData.signatory?.limited_poA_to_marq) {
          newErrors.limited_poA_to_marq = 'Authorization is required';
        }
        if (!formData.signatory?.typed_signature) {
          newErrors.typed_signature = 'Signature is required';
        }
        break;

      case 9:
        if (!formData.final?.confirm_review) {
          newErrors.confirm_review = 'You must confirm you reviewed everything';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateSection(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSaveExit = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaving(false);
    onSaveExit();
  };

  const handleFinalSubmit = async () => {
    if (!validateSection(currentStep)) {
      return;
    }

    setSaving(true);

    try {
      await supabase.rpc('generate_client_docket');

      const estimatedClasses = formData.goods_services?.class_estimate?.length || 1;
      const specimenReady = formData.filing_basis?.filing_basis === '1(a) Use in Commerce' && specimens.length > 0;
      const teasCandidate = formData.goods_services?.ok_use_preapproved_id ? 'TEAS Plus' : 'TEAS Standard';

      await supabase
        .from('trademark_matters')
        .update({
          stage: 'Stage 2 – Attorney Review',
          progress: 20,
          intake_completed_at: new Date().toISOString(),
          specimen_ready: specimenReady,
          teas_candidate: teasCandidate,
          estimated_class_count: estimatedClasses
        })
        .eq('id', matterId);

      await supabase
        .from('matter_todos')
        .update({ completed_at: new Date().toISOString() })
        .eq('matter_id', matterId)
        .eq('title', 'Complete Trademark Intake Questionnaire');

      onSubmit();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addSpecimen = () => {
    setSpecimens([...specimens, {
      class_number: '',
      specimen_upload: null,
      specimen_url: '',
      specimen_description: ''
    }]);
  };

  const removeSpecimen = (index: number) => {
    const updated = specimens.filter((_, i) => i !== index);
    setSpecimens(updated);
    updateField('filing_basis', 'per_class_specimens', updated);
  };

  const updateSpecimen = (index: number, field: string, value: any) => {
    const updated = [...specimens];
    updated[index] = { ...updated[index], [field]: value };
    setSpecimens(updated);
    updateField('filing_basis', 'per_class_specimens', updated);
  };

  const steps = [
    {
      title: 'Client & Contact',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Your Full Legal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.client_contact?.contact_full_name || ''}
              onChange={(e) => updateField('client_contact', 'contact_full_name', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.contact_full_name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.contact_full_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Your Role with the Brand
            </label>
            <input
              type="text"
              placeholder="Owner, CEO, Manager, etc."
              value={formData.client_contact?.contact_title_role || ''}
              onChange={(e) => updateField('client_contact', 'contact_title_role', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.client_contact?.contact_email || ''}
              onChange={(e) => updateField('client_contact', 'contact_email', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.contact_email && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.contact_email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.client_contact?.contact_phone || ''}
              onChange={(e) => updateField('client_contact', 'contact_phone', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.contact_phone && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.contact_phone}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Preferred Contact Method <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.client_contact?.preferred_contact_method || ''}
              onChange={(e) => updateField('client_contact', 'preferred_contact_method', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select method</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
              <option value="Portal Messages">Portal Messages</option>
            </select>
            {errors.preferred_contact_method && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.preferred_contact_method}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Order Reference Number
            </label>
            <input
              type="text"
              placeholder="Your purchase/order # (if known)"
              value={formData.client_contact?.order_reference || ''}
              onChange={(e) => updateField('client_contact', 'order_reference', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Owner of the Mark',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Owner Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.owner?.owner_type || ''}
              onChange={(e) => updateField('owner', 'owner_type', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="Individual">Individual</option>
              <option value="LLC">LLC</option>
              <option value="Corporation">Corporation</option>
              <option value="Partnership">Partnership</option>
              <option value="Sole Proprietor">Sole Proprietor</option>
              <option value="Trust">Trust</option>
              <option value="Non-profit">Non-profit</option>
              <option value="Other">Other</option>
            </select>
            {errors.owner_type && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.owner_type}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Legal Name <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-slate-600 mb-2">
              {formData.owner?.owner_type === 'Individual'
                ? 'Enter your full legal name exactly as it appears on official documents'
                : 'Enter the exact registered entity name'}
            </p>
            <input
              type="text"
              value={formData.owner?.owner_legal_name || ''}
              onChange={(e) => updateField('owner', 'owner_legal_name', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.owner_legal_name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.owner_legal_name}
              </p>
            )}
          </div>

          {formData.owner?.owner_type === 'Individual' && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Country of Citizenship <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner?.owner_citizenship || ''}
                onChange={(e) => updateField('owner', 'owner_citizenship', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.owner_citizenship && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.owner_citizenship}
                </p>
              )}
            </div>
          )}

          {formData.owner?.owner_type && formData.owner?.owner_type !== 'Individual' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  State of Formation/Incorporation <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.owner?.owner_entity_state || ''}
                  onChange={(e) => updateField('owner', 'owner_entity_state', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="">Select state</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.owner_entity_state && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.owner_entity_state}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Country of Formation
                </label>
                <input
                  type="text"
                  value={formData.owner?.owner_entity_country || 'United States'}
                  onChange={(e) => updateField('owner', 'owner_entity_country', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner?.owner_street || ''}
                onChange={(e) => updateField('owner', 'owner_street', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.owner_street && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.owner_street}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner?.owner_city || ''}
                onChange={(e) => updateField('owner', 'owner_city', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.owner_city && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.owner_city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                State/Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner?.owner_state_province || ''}
                onChange={(e) => updateField('owner', 'owner_state_province', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.owner_state_province && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.owner_state_province}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.owner?.owner_postal_code || ''}
                onChange={(e) => updateField('owner', 'owner_postal_code', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.owner_postal_code && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.owner_postal_code}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.owner?.owner_country || ''}
              onChange={(e) => updateField('owner', 'owner_country', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.owner_country && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.owner_country}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Website
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              value={formData.owner?.owner_website || ''}
              onChange={(e) => updateField('owner', 'owner_website', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Social Media Links
            </label>
            <textarea
              placeholder="Instagram, TikTok, shop URLs, etc. (one per line)"
              value={formData.owner?.social_links || ''}
              onChange={(e) => updateField('owner', 'social_links', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      )
    },
    {
      title: 'The Mark',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Mark Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.the_mark?.mark_type || ''}
              onChange={(e) => updateField('the_mark', 'mark_type', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select type</option>
              <option value="Standard Character (Word)">Standard Character (Word)</option>
              <option value="Stylized/Design (Logo)">Stylized/Design (Logo)</option>
              <option value="Word + Logo">Word + Logo</option>
              <option value="Sound">Sound</option>
              <option value="Other">Other</option>
            </select>
            {errors.mark_type && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.mark_type}
              </p>
            )}
          </div>

          {formData.the_mark?.mark_type?.includes('Word') && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Mark Text <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-amber-600 mb-2 flex items-center gap-1">
                <AlertCircle size={14} /> Do not include ™, ©, or ® symbols
              </p>
              <input
                type="text"
                value={formData.the_mark?.mark_text || ''}
                onChange={(e) => updateField('the_mark', 'mark_text', e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              {errors.mark_text && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.mark_text}
                </p>
              )}
            </div>
          )}

          {formData.the_mark?.mark_type && formData.the_mark?.mark_type !== 'Standard Character (Word)' && (
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Upload Mark Design <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-slate-600 mb-2">
                PNG, JPG, or SVG format. Maximum 10MB.
              </p>
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={(e) => e.target.files && handleFileUpload('the_mark', 'mark_design_upload', e.target.files)}
                  className="hidden"
                  id="mark-design-upload"
                />
                <label
                  htmlFor="mark-design-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {uploadingFiles.mark_design_upload ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                  ) : (
                    <>
                      <Upload className="text-slate-400 mb-2" size={32} />
                      <span className="text-slate-600 font-medium">Click to upload</span>
                      {formData.the_mark?.mark_design_upload && (
                        <span className="text-green-600 text-sm mt-2 flex items-center gap-1">
                          <CheckCircle size={16} /> File uploaded
                        </span>
                      )}
                    </>
                  )}
                </label>
              </div>
              {errors.mark_design_upload && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.mark_design_upload}
                </p>
              )}
            </div>
          )}

          {formData.the_mark?.mark_type && formData.the_mark?.mark_type !== 'Standard Character (Word)' && (
            <>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.the_mark?.mark_color_claim || false}
                    onChange={(e) => updateField('the_mark', 'mark_color_claim', e.target.checked)}
                    className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
                  />
                  <span className="text-sm font-semibold text-slate-900">
                    Claim specific colors in the mark
                  </span>
                </label>
              </div>

              {formData.the_mark?.mark_color_claim && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      List Colors <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Red (PMS 185), Blue, White"
                      value={formData.the_mark?.color_list || ''}
                      onChange={(e) => updateField('the_mark', 'color_list', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-2">
                      Color Location Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Describe where each color appears in the mark"
                      value={formData.the_mark?.color_location_description || ''}
                      onChange={(e) => updateField('the_mark', 'color_location_description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Mark Description <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-slate-600 mb-2">
                  Describe the mark exactly as it appears, including all design elements
                </p>
                <textarea
                  value={formData.the_mark?.mark_description || ''}
                  onChange={(e) => updateField('the_mark', 'mark_description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                {errors.mark_description && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.mark_description}
                  </p>
                )}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Translation (if applicable)
            </label>
            <p className="text-sm text-slate-600 mb-2">
              If your mark contains non-English words, provide translation
            </p>
            <textarea
              value={formData.the_mark?.mark_translation || ''}
              onChange={(e) => updateField('the_mark', 'mark_translation', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Transliteration (if applicable)
            </label>
            <p className="text-sm text-slate-600 mb-2">
              If your mark uses non-Latin characters, provide transliteration
            </p>
            <textarea
              value={formData.the_mark?.mark_transliteration || ''}
              onChange={(e) => updateField('the_mark', 'mark_transliteration', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Names/Portraits',
      component: (
        <div className="space-y-6">
          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.names_portraits?.contains_name_or_portrait || false}
                onChange={(e) => updateField('names_portraits', 'contains_name_or_portrait', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-semibold text-slate-900">
                The mark contains a person's name or portrait
              </span>
            </label>
          </div>

          {formData.names_portraits?.contains_name_or_portrait && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Whose Name/Portrait? <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Provide details about whose name or portrait appears in the mark"
                  value={formData.names_portraits?.name_portrait_details || ''}
                  onChange={(e) => updateField('names_portraits', 'name_portrait_details', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Upload Written Consent (recommended)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => e.target.files && handleFileUpload('names_portraits', 'consent_upload', e.target.files)}
                    className="hidden"
                    id="consent-upload"
                  />
                  <label
                    htmlFor="consent-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    {uploadingFiles.consent_upload ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                    ) : (
                      <>
                        <Upload className="text-slate-400 mb-2" size={32} />
                        <span className="text-slate-600 font-medium">Click to upload</span>
                        {formData.names_portraits?.consent_upload && (
                          <span className="text-green-600 text-sm mt-2 flex items-center gap-1">
                            <CheckCircle size={16} /> File uploaded
                          </span>
                        )}
                      </>
                    )}
                  </label>
                </div>
              </div>
            </>
          )}

          {!formData.names_portraits?.contains_name_or_portrait && (
            <div className="text-center py-8 text-slate-500">
              No additional information needed for this section
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Goods/Services & Classes',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Describe Your Goods/Services <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-slate-600 mb-2">
              In plain language, describe what you sell or plan to sell. One item per line.
            </p>
            <p className="text-sm text-slate-500 italic mb-2">
              Example: T-shirts; hoodies; online retail store services featuring apparel
            </p>
            <textarea
              value={formData.goods_services?.goods_services_plain || ''}
              onChange={(e) => updateField('goods_services', 'goods_services_plain', e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.goods_services_plain && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.goods_services_plain}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Estimated Classes (if known)
            </label>
            <p className="text-sm text-slate-600 mb-2">
              Select any Nice classes you think apply (our attorneys will finalize this)
            </p>
            <select
              multiple
              value={formData.goods_services?.class_estimate || []}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, option => option.value);
                updateField('goods_services', 'class_estimate', selected);
              }}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              size={8}
            >
              {NICE_CLASSES.map(cls => (
                <option key={cls.value} value={cls.value}>{cls.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.goods_services?.ok_use_preapproved_id || false}
                onChange={(e) => updateField('goods_services', 'ok_use_preapproved_id', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-semibold text-slate-900">
                Okay using USPTO pre-approved ID language <span className="text-red-500">*</span>
              </span>
            </label>
            <p className="text-sm text-slate-600 ml-7 mt-1">
              Pre-approved IDs may lower filing fees but are more rigid. Our attorneys will recommend the best approach.
            </p>
            {errors.ok_use_preapproved_id && (
              <p className="mt-1 ml-7 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.ok_use_preapproved_id}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Competitor Examples (optional but helpful)
            </label>
            <textarea
              placeholder="Share 1-3 competitor product/service pages to help us draft accurate IDs"
              value={formData.goods_services?.competitor_examples || ''}
              onChange={(e) => updateField('goods_services', 'competitor_examples', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      )
    },
    {
      title: 'Filing Basis',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Filing Basis <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.filing_basis?.filing_basis || ''}
              onChange={(e) => updateField('filing_basis', 'filing_basis', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="">Select basis</option>
              <option value="1(a) Use in Commerce">1(a) Use in Commerce</option>
              <option value="1(b) Intent to Use">1(b) Intent to Use</option>
              <option value="Unsure">Unsure</option>
            </select>
            {errors.filing_basis && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.filing_basis}
              </p>
            )}
          </div>

          {formData.filing_basis?.filing_basis === '1(a) Use in Commerce' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    First Use Anywhere <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.filing_basis?.first_use_anywhere || ''}
                    onChange={(e) => updateField('filing_basis', 'first_use_anywhere', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {errors.first_use_anywhere && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.first_use_anywhere}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    First Use in Commerce <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.filing_basis?.first_use_in_commerce || ''}
                    onChange={(e) => updateField('filing_basis', 'first_use_in_commerce', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {errors.first_use_in_commerce && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.first_use_in_commerce}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-semibold text-slate-900">
                    Specimens by Class <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={addSpecimen}
                    className="text-sm bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
                  >
                    Add Specimen
                  </button>
                </div>

                <p className="text-sm text-slate-600 mb-3">
                  Upload specimens showing how you use the mark with your goods/services. Examples: product labels, packaging, website product pages with cart button, service ads.
                </p>

                {specimens.map((specimen, index) => (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-slate-900">Specimen {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeSpecimen(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">
                          Class Number <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={specimen.class_number}
                          onChange={(e) => updateSpecimen(index, 'class_number', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                          <option value="">Select class</option>
                          {NICE_CLASSES.map(cls => (
                            <option key={cls.value} value={cls.value}>{cls.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">
                          Upload Specimen <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="file"
                          accept="image/*,.pdf,video/*"
                          onChange={(e) => e.target.files && updateSpecimen(index, 'specimen_upload', e.target.files[0])}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">
                          Specimen URL (optional)
                        </label>
                        <input
                          type="url"
                          placeholder="Link to sales page"
                          value={specimen.specimen_url}
                          onChange={(e) => updateSpecimen(index, 'specimen_url', e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-900 mb-1">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          placeholder="Explain how the specimen shows the mark used with goods/services"
                          value={specimen.specimen_description}
                          onChange={(e) => updateSpecimen(index, 'specimen_description', e.target.value)}
                          rows={2}
                          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {specimens.length === 0 && (
                  <div className="text-center py-6 bg-slate-50 rounded-lg">
                    <p className="text-slate-600">No specimens added yet. Click "Add Specimen" to get started.</p>
                  </div>
                )}

                {errors.specimens && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} /> {errors.specimens}
                  </p>
                )}
              </div>
            </>
          )}

          {formData.filing_basis?.filing_basis === '1(b) Intent to Use' && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.filing_basis?.ita_confirm || false}
                  onChange={(e) => updateField('filing_basis', 'ita_confirm', e.target.checked)}
                  className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm font-semibold text-slate-900">
                  I understand we'll need a later Statement of Use and additional USPTO fees per class <span className="text-red-500">*</span>
                </span>
              </label>
              {errors.ita_confirm && (
                <p className="mt-1 ml-7 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.ita_confirm}
                </p>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Disclaimers & Other',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Descriptive Terms to Disclaim (optional)
            </label>
            <p className="text-sm text-slate-600 mb-2">
              List any descriptive or generic words in your mark that may need disclaiming (e.g., "Coffee" for coffee beans)
            </p>
            <textarea
              value={formData.disclaimers?.descriptive_terms_to_disclaim || ''}
              onChange={(e) => updateField('disclaimers', 'descriptive_terms_to_disclaim', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Prior U.S. Registrations (optional)
            </label>
            <textarea
              placeholder="Related U.S. registration/serial numbers (if any)"
              value={formData.disclaimers?.prior_us_registrations || ''}
              onChange={(e) => updateField('disclaimers', 'prior_us_registrations', e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.disclaimers?.foreign_priority || false}
                onChange={(e) => updateField('disclaimers', 'foreign_priority', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500"
              />
              <span className="text-sm font-semibold text-slate-900">
                Claim foreign priority
              </span>
            </label>
          </div>

          {formData.disclaimers?.foreign_priority && (
            <div className="ml-7 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Foreign Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.disclaimers?.foreign_country || ''}
                  onChange={(e) => updateField('disclaimers', 'foreign_country', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Foreign Application Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.disclaimers?.foreign_app_number || ''}
                  onChange={(e) => updateField('disclaimers', 'foreign_app_number', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Foreign Application Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.disclaimers?.foreign_app_date || ''}
                  onChange={(e) => updateField('disclaimers', 'foreign_app_date', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Attachments',
      component: (
        <div className="space-y-6">
          <p className="text-slate-600">
            The following attachments are optional but can help our attorneys prepare your application more accurately.
          </p>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Brand Style Guide
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => e.target.files && handleFileUpload('attachments', 'brand_style_guide', e.target.files)}
                className="hidden"
                id="style-guide-upload"
              />
              <label
                htmlFor="style-guide-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploadingFiles.brand_style_guide ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                ) : (
                  <>
                    <Upload className="text-slate-400 mb-2" size={32} />
                    <span className="text-slate-600 font-medium">Click to upload</span>
                    {formData.attachments?.brand_style_guide && (
                      <span className="text-green-600 text-sm mt-2 flex items-center gap-1">
                        <CheckCircle size={16} /> File uploaded
                      </span>
                    )}
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Packaging or Label Photos
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload('attachments', 'packaging_or_label_photos', e.target.files)}
                className="hidden"
                id="packaging-upload"
              />
              <label
                htmlFor="packaging-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploadingFiles.packaging_or_label_photos ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                ) : (
                  <>
                    <Upload className="text-slate-400 mb-2" size={32} />
                    <span className="text-slate-600 font-medium">Click to upload</span>
                    {formData.attachments?.packaging_or_label_photos && (
                      <span className="text-green-600 text-sm mt-2 flex items-center gap-1">
                        <CheckCircle size={16} /> File uploaded
                      </span>
                    )}
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Website Screenshots
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files && handleFileUpload('attachments', 'website_screenshots', e.target.files)}
                className="hidden"
                id="screenshots-upload"
              />
              <label
                htmlFor="screenshots-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                {uploadingFiles.website_screenshots ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
                ) : (
                  <>
                    <Upload className="text-slate-400 mb-2" size={32} />
                    <span className="text-slate-600 font-medium">Click to upload</span>
                    {formData.attachments?.website_screenshots && (
                      <span className="text-green-600 text-sm mt-2 flex items-center gap-1">
                        <CheckCircle size={16} /> File uploaded
                      </span>
                    )}
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Signatory & Authorization',
      component: (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Signatory Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.signatory?.signatory_name || ''}
              onChange={(e) => updateField('signatory', 'signatory_name', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.signatory_name && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.signatory_name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Signatory Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Owner, Member, Officer, Managing Agent, etc."
              value={formData.signatory?.signatory_title || ''}
              onChange={(e) => updateField('signatory', 'signatory_title', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.signatory_title && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.signatory_title}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.signatory?.authority_confirmation || false}
                onChange={(e) => updateField('signatory', 'authority_confirmation', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500 mt-0.5"
              />
              <span className="text-sm font-semibold text-slate-900">
                I am authorized to sign for the owner/applicant <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.authority_confirmation && (
              <p className="mt-1 ml-7 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.authority_confirmation}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.signatory?.declaration_truth || false}
                onChange={(e) => updateField('signatory', 'declaration_truth', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500 mt-0.5"
              />
              <span className="text-sm font-semibold text-slate-900">
                The facts above are true to the best of my knowledge <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.declaration_truth && (
              <p className="mt-1 ml-7 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.declaration_truth}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.signatory?.email_consent || false}
                onChange={(e) => updateField('signatory', 'email_consent', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500 mt-0.5"
              />
              <span className="text-sm font-semibold text-slate-900">
                I agree to receive all USPTO/firm communications electronically <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.email_consent && (
              <p className="mt-1 ml-7 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.email_consent}
              </p>
            )}
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.signatory?.limited_poA_to_marq || false}
                onChange={(e) => updateField('signatory', 'limited_poA_to_marq', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500 mt-0.5"
              />
              <span className="text-sm font-semibold text-slate-900">
                I authorize Marq to prepare/file my application and communicate with the USPTO on my behalf <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.limited_poA_to_marq && (
              <p className="mt-1 ml-7 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.limited_poA_to_marq}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Type Your Full Name as Signature <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.signatory?.typed_signature || ''}
              onChange={(e) => updateField('signatory', 'typed_signature', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {errors.typed_signature && (
              <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.typed_signature}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-1">
              By typing your name, you are electronically signing this intake form on {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )
    },
    {
      title: 'Final Review',
      component: (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <AlertCircle className="text-amber-600" size={24} />
              Important Notice
            </h3>
            <p className="text-slate-700 mb-2">
              This intake form collects information needed to prepare your trademark application. Submission of this form does NOT constitute filing with the USPTO.
            </p>
            <p className="text-slate-700">
              After submitting, our attorneys will review your information, finalize the application details, and file with the USPTO on your behalf.
            </p>
          </div>

          <div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.final?.confirm_review || false}
                onChange={(e) => updateField('final', 'confirm_review', e.target.checked)}
                className="w-5 h-5 text-amber-500 border-slate-300 rounded focus:ring-amber-500 mt-0.5"
              />
              <span className="text-sm font-semibold text-slate-900">
                I have reviewed all information and understand this is an intake form, not the actual filing <span className="text-red-500">*</span>
              </span>
            </label>
            {errors.confirm_review && (
              <p className="mt-1 ml-7 text-sm text-red-500 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.confirm_review}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Additional Notes for Attorney (optional)
            </label>
            <textarea
              placeholder="Any additional information or questions for our team"
              value={formData.final?.notes_for_attorney || ''}
              onChange={(e) => updateField('final', 'notes_for_attorney', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      )
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm font-semibold text-slate-700">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{steps[currentStep].title}</h2>
        {steps[currentStep].component}
      </div>

      <div className="flex justify-between items-center">
        <div>
          {currentStep > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold"
            >
              <ChevronLeft size={20} />
              Back
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSaveExit}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-semibold disabled:opacity-50"
          >
            <Save size={20} />
            Save & Exit
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-semibold"
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleFinalSubmit}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Submit Intake Form
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}