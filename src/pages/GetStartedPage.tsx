import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Upload, Check, Loader2, CheckCircle, XCircle, ExternalLink, AlertTriangle, Type, MessageSquare, Image as ImageIcon, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackAnalyticsEvent, trackConversion } from '../utils/tracking';

interface FormData {
  trademarkName: string;
  trademarkType: string;
  logoFile: File | null;
  logoUrl: string;
  nameInUse: string;
  nameInUseStartDate: string;
  nameInUsePlanDate: string;
  businessType: string;
  brandUsageLocations: string[];
  websiteUrl: string;
  socialMediaAccounts: string;
  productsServicesDescription: string;
  productServiceType: string;
  salesLocations: string[];
  priorTrademarkFiling: string;
  similarBusinessNames: string;
  additionalInfo: string;
  fullName: string;
  email: string;
  phone: string;
  confirmationAccurate: boolean;
  confirmationUnderstand: boolean;
}

interface TrademarkResult {
  keyword: string;
  serialNumber: string;
  registrationNumber?: string;
  markIdentification: string;
  status: string;
  statusLabel?: string;
  statusCode?: string;
  statusDate: string;
  statusDefinition?: string;
  filingDate: string;
  registrationDate?: string;
  abandonmentDate?: string;
  expirationDate?: string;
  logo?: string;
  description?: string;
  owner: string;
  goodsServices?: string;
}

export default function GetStartedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const packageFromPricing = location.state?.package || '';
  const hasTrackedStart = useRef(false);
  const sessionId = useRef(`form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const [currentScreen, setCurrentScreen] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('Trademark Registration Package');
  const [savedResponseId, setSavedResponseId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TrademarkResult[]>([]);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    trademarkName: '',
    trademarkType: '',
    logoFile: null,
    logoUrl: '',
    nameInUse: '',
    nameInUseStartDate: '',
    nameInUsePlanDate: '',
    businessType: '',
    brandUsageLocations: [],
    websiteUrl: '',
    socialMediaAccounts: '',
    productsServicesDescription: '',
    productServiceType: '',
    salesLocations: [],
    priorTrademarkFiling: '',
    similarBusinessNames: '',
    additionalInfo: '',
    fullName: '',
    email: '',
    phone: '',
    confirmationAccurate: false,
    confirmationUnderstand: false,
  });

  const totalScreens = packageFromPricing ? 7 : 8;

  useEffect(() => {
    if (!hasTrackedStart.current) {
      trackAnalyticsEvent('get_started_form_started', {
        package_from_pricing: packageFromPricing || null,
        session_id: sessionId.current
      });
      hasTrackedStart.current = true;
    }
  }, [packageFromPricing]);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCheckbox = (field: 'brandUsageLocations' | 'salesLocations', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const performTrademarkSearch = async () => {
    setSearching(true);
    setSearchCompleted(false);
    setSearchError('');
    setSearchResults([]);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-uspto-trademarks`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          searchTerm: formData.trademarkName.trim(),
          status: 'all'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.unavailable) {
        setSearchError('api_unavailable');
        setSearchCompleted(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search trademarks');
      }

      if (data.trademarks && Array.isArray(data.trademarks)) {
        const formattedResults: TrademarkResult[] = data.trademarks.map((tm: any) => ({
          keyword: tm.keyword || formData.trademarkName,
          serialNumber: tm.serialNumber || 'N/A',
          registrationNumber: tm.registrationNumber,
          markIdentification: tm.markIdentification || formData.trademarkName,
          status: tm.status || 'Unknown',
          statusLabel: tm.statusLabel,
          statusCode: tm.statusCode,
          statusDate: tm.statusDate || '',
          statusDefinition: tm.statusDefinition,
          filingDate: tm.filingDate || '',
          registrationDate: tm.registrationDate,
          abandonmentDate: tm.abandonmentDate,
          expirationDate: tm.expirationDate,
          logo: tm.logo,
          description: tm.description,
          owner: tm.owner || 'Not Available',
          goodsServices: tm.goodsServices
        }));
        setSearchResults(formattedResults);
      } else {
        setSearchResults([]);
      }

      setSearchCompleted(true);
    } catch (err) {
      console.error('Search error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setSearchError('Search timed out. The trademark database may be slow to respond.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setSearchError(`Unable to search: ${errorMessage}`);
      }
      setSearchCompleted(true);
    } finally {
      setSearching(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateFormData('logoFile', file);
  };

  const uploadLogo = async (): Promise<string | null> => {
    if (!formData.logoFile) return null;

    const fileExt = formData.logoFile.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trademark-logos')
      .upload(filePath, formData.logoFile);

    if (uploadError) {
      console.error('Error uploading logo:', uploadError);
      return null;
    }

    const { data } = supabase.storage
      .from('trademark-logos')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const validateScreen = (): boolean => {
    switch (currentScreen) {
      case 1:
        return !!(formData.trademarkName && formData.trademarkType);
      case 2:
        return searchCompleted;
      case 3:
        const hasBaseFields = !!(formData.nameInUse && formData.businessType && formData.brandUsageLocations.length > 0);
        if (!hasBaseFields) return false;

        if (formData.nameInUse === 'Yes, I\'m already using it') {
          if (!formData.nameInUseStartDate) return false;
          if ((formData.brandUsageLocations.includes('Website') || formData.brandUsageLocations.includes('Social media')) &&
              !formData.websiteUrl && !formData.socialMediaAccounts) {
            return false;
          }
        }
        if (formData.nameInUse === 'No, I plan to use it soon') {
          return !!formData.nameInUsePlanDate;
        }
        return true;
      case 4:
        return !!(formData.productsServicesDescription && formData.productServiceType && formData.salesLocations.length > 0);
      case 5:
        return !!(formData.priorTrademarkFiling && formData.similarBusinessNames);
      case 6:
        return !!(formData.fullName && formData.email && formData.phone);
      case 7:
        return formData.confirmationAccurate && formData.confirmationUnderstand;
      case 8:
        return !!selectedPackage;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (validateScreen()) {
      if (currentScreen === 1 && !searchCompleted) {
        await performTrademarkSearch();
      }

      const nextScreen = Math.min(currentScreen + 1, totalScreens);

      if (currentScreen === 6 && !savedResponseId) {
        try {
          const logoUrl = formData.logoFile ? await uploadLogo() : null;
          const { data: { user } } = await supabase.auth.getUser();

          const { data, error } = await supabase
            .from('trademark_questionnaire_responses')
            .insert({
              user_id: user?.id || null,
              trademark_name: formData.trademarkName || null,
              trademark_type: formData.trademarkType || null,
              logo_url: logoUrl,
              name_in_use: formData.nameInUse || null,
              name_in_use_start_date: formData.nameInUseStartDate || null,
              name_in_use_plan_date: formData.nameInUsePlanDate || null,
              business_type: formData.businessType || null,
              brand_usage_locations: formData.brandUsageLocations,
              website_url: formData.websiteUrl || null,
              social_media_accounts: formData.socialMediaAccounts || null,
              products_services_description: formData.productsServicesDescription || null,
              product_service_type: formData.productServiceType || null,
              sales_locations: formData.salesLocations,
              prior_trademark_filing: formData.priorTrademarkFiling || null,
              similar_business_names: formData.similarBusinessNames || null,
              additional_info: formData.additionalInfo || null,
              full_name: formData.fullName,
              email: formData.email,
              phone: formData.phone || null,
              package_selected: null,
              confirmation_accurate: false,
              confirmation_understand: false,
            })
            .select()
            .single();

          if (!error && data) {
            setSavedResponseId(data.id);
          }
        } catch (error) {
          console.error('Error saving partial form:', error);
        }
      }

      setCurrentScreen(nextScreen);

      trackAnalyticsEvent('get_started_form_progress', {
        session_id: sessionId.current,
        screen: currentScreen,
        next_screen: nextScreen,
        form_data: {
          trademarkName: formData.trademarkName,
          trademarkType: formData.trademarkType,
          nameInUse: formData.nameInUse,
          nameInUseStartDate: formData.nameInUseStartDate,
          nameInUsePlanDate: formData.nameInUsePlanDate,
          businessType: formData.businessType,
          brandUsageLocations: formData.brandUsageLocations,
          websiteUrl: formData.websiteUrl,
          socialMediaAccounts: formData.socialMediaAccounts,
          productsServicesDescription: formData.productsServicesDescription,
          productServiceType: formData.productServiceType,
          salesLocations: formData.salesLocations,
          priorTrademarkFiling: formData.priorTrademarkFiling,
          similarBusinessNames: formData.similarBusinessNames,
          additionalInfo: formData.additionalInfo,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          hasLogo: !!formData.logoFile,
          selectedPackage: selectedPackage
        }
      });
    }
  };

  const handleBack = () => {
    setCurrentScreen(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateScreen()) return;

    setIsSubmitting(true);

    try {
      const logoUrl = await uploadLogo();

      const { data: { user } } = await supabase.auth.getUser();

      const finalPackageName = packageFromPricing || selectedPackage;

      const packageDetails: { [key: string]: { price: string; description: string } } = {
        'Trademark Registration Package': {
          price: '$499',
          description: 'Complete trademark registration with comprehensive support'
        }
      };

      const selectedPackageDetails = packageDetails[finalPackageName] || packageDetails['Trademark Registration Package'];

      let error;

      if (savedResponseId) {
        const result = await supabase
          .from('trademark_questionnaire_responses')
          .update({
            trademark_name: formData.trademarkName,
            trademark_type: formData.trademarkType,
            logo_url: logoUrl || undefined,
            name_in_use: formData.nameInUse,
            name_in_use_start_date: formData.nameInUseStartDate || null,
            name_in_use_plan_date: formData.nameInUsePlanDate || null,
            business_type: formData.businessType,
            brand_usage_locations: formData.brandUsageLocations,
            website_url: formData.websiteUrl || null,
            social_media_accounts: formData.socialMediaAccounts || null,
            products_services_description: formData.productsServicesDescription,
            product_service_type: formData.productServiceType,
            sales_locations: formData.salesLocations,
            prior_trademark_filing: formData.priorTrademarkFiling,
            similar_business_names: formData.similarBusinessNames,
            additional_info: formData.additionalInfo || null,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            package_selected: finalPackageName,
            confirmation_accurate: formData.confirmationAccurate,
            confirmation_understand: formData.confirmationUnderstand,
          })
          .eq('id', savedResponseId);
        error = result.error;
      } else {
        const result = await supabase
          .from('trademark_questionnaire_responses')
          .insert({
            user_id: user?.id || null,
            trademark_name: formData.trademarkName,
            trademark_type: formData.trademarkType,
            logo_url: logoUrl,
            name_in_use: formData.nameInUse,
            name_in_use_start_date: formData.nameInUseStartDate || null,
            name_in_use_plan_date: formData.nameInUsePlanDate || null,
            business_type: formData.businessType,
            brand_usage_locations: formData.brandUsageLocations,
            website_url: formData.websiteUrl || null,
            social_media_accounts: formData.socialMediaAccounts || null,
            products_services_description: formData.productsServicesDescription,
            product_service_type: formData.productServiceType,
            sales_locations: formData.salesLocations,
            prior_trademark_filing: formData.priorTrademarkFiling,
            similar_business_names: formData.similarBusinessNames,
            additional_info: formData.additionalInfo || null,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            package_selected: finalPackageName,
            confirmation_accurate: formData.confirmationAccurate,
            confirmation_understand: formData.confirmationUnderstand,
          });
        error = result.error;
      }

      if (error) throw error;

      trackAnalyticsEvent('get_started_form_completed', {
        session_id: sessionId.current,
        package_selected: finalPackageName,
        trademark_type: formData.trademarkType,
        name_in_use: formData.nameInUse,
        business_type: formData.businessType,
        product_service_type: formData.productServiceType
      });

      trackConversion('AW-17829534784/mFlKCN60kd0bEMC45LVC', {
        value: 1.0,
        currency: 'USD'
      });

      navigate('/add-ons', {
        state: {
          selectedPackage: {
            name: finalPackageName,
            price: selectedPackageDetails.price,
            description: selectedPackageDetails.description
          }
        }
      });
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      alert('There was an error submitting your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextOrSubmit = async () => {
    if (!validateScreen()) return;

    if (currentScreen === 7 && packageFromPricing) {
      await handleSubmit();
    } else if (currentScreen === 8) {
      await handleSubmit();
    } else {
      await handleNext();
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900">Get Started</h1>
            <span className="text-sm font-medium text-slate-600">
              Step {currentScreen} of {totalScreens}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentScreen / totalScreens) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          {currentScreen === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Trademark Basics</h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What is the name you want to trademark? *
                </label>
                <input
                  type="text"
                  value={formData.trademarkName}
                  onChange={(e) => updateFormData('trademarkName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter trademark name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What are you trying to trademark? *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'Name', icon: Type },
                    { value: 'Slogan', icon: MessageSquare },
                    { value: 'Name and Logo', icon: Sparkles },
                    { value: 'Logo', icon: ImageIcon }
                  ].map(option => (
                    <label key={option.value} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="radio"
                        name="trademarkType"
                        value={option.value}
                        checked={formData.trademarkType === option.value}
                        onChange={(e) => updateFormData('trademarkType', e.target.value)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <option.icon className="ml-3 text-amber-600" size={20} />
                      <span className="ml-2 text-slate-700">{option.value}</span>
                    </label>
                  ))}
                </div>
              </div>

              {(formData.trademarkType === 'Logo' || formData.trademarkType === 'Name and Logo') && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload your logo (optional)
                  </label>
                  <p className="text-sm text-slate-600 mb-3">If you don't have one yet, you can skip this.</p>
                  <label className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                      <span className="text-sm text-slate-600">
                        {formData.logoFile ? formData.logoFile.name : 'Click to upload logo'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          {currentScreen === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Trademark Availability Check</h2>

              {searching && (
                <div className="text-center py-12">
                  <Loader2 size={48} className="animate-spin text-amber-500 mx-auto mb-4" />
                  <p className="text-lg text-slate-600">Searching USPTO database...</p>
                  <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                </div>
              )}

              {searchError && searchError === 'api_unavailable' && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Search Unavailable</h3>
                      <p className="text-slate-700 mb-3">
                        The USPTO search is temporarily unavailable. You can continue with your application and we'll conduct a comprehensive search as part of our service.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {searchError && searchError !== 'api_unavailable' && (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">Search Error</h3>
                      <p className="text-slate-700">{searchError}</p>
                    </div>
                  </div>
                </div>
              )}

              {searchCompleted && !searching && !searchError && (() => {
                const activeMarks = searchResults.filter(r => {
                  const status = r.status.toLowerCase();
                  return !status.includes('abandoned') && !status.includes('cancelled') && !status.includes('dead');
                });

                if (activeMarks.length === 0) {
                  return (
                    <div className="bg-green-50 border-2 border-green-500 rounded-lg p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="bg-green-500 p-3 rounded-full">
                          <CheckCircle size={32} className="text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-green-900 mb-2">
                            Good news! This name appears available
                          </h3>
                          <p className="text-lg text-slate-700 mb-4">
                            We found no active trademarks matching "{formData.trademarkName}". This is a positive sign!
                          </p>
                          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                            <p className="text-slate-700 text-sm">
                              <span className="font-semibold">Note:</span> While no exact matches were found in the federal database, our comprehensive attorney search will also check state registrations, common law uses, and similar marks before filing.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6 mb-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-red-500 p-3 rounded-full">
                            <XCircle size={32} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-red-900 mb-2">
                              {activeMarks.length === 1 ? 'Potential Conflict Found' : `${activeMarks.length} Potential Conflicts Found`}
                            </h3>
                            <p className="text-lg text-slate-700 mb-4">
                              We found {activeMarks.length} active trademark{activeMarks.length !== 1 ? 's' : ''} that may conflict with "{formData.trademarkName}".
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 mb-6">
                        <h4 className="font-semibold text-slate-900">Conflicting Trademarks:</h4>
                        {activeMarks.slice(0, 3).map((result, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 flex items-start gap-3">
                                {result.logo && (
                                  <img
                                    src={result.logo}
                                    alt={result.markIdentification}
                                    className="w-16 h-16 object-contain bg-slate-50 rounded border border-slate-200"
                                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                  />
                                )}
                                <div className="flex-1">
                                  <h5 className="font-bold text-slate-900 mb-1">
                                    {result.markIdentification}
                                  </h5>
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                      <XCircle size={12} className="mr-1" />
                                      {result.statusLabel || result.status}
                                    </span>
                                    <span className="text-xs text-red-600 font-semibold">
                                      Active Conflict
                                    </span>
                                  </div>
                                  <div className="text-sm text-slate-600">
                                    <span className="font-semibold">Owner:</span> {result.owner}
                                  </div>
                                </div>
                              </div>
                              <a
                                href={`https://tsdr.uspto.gov/#caseNumber=${result.serialNumber}&caseType=SERIAL_NO&searchType=statusSearch`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs font-medium flex-shrink-0"
                              >
                                View
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        ))}
                        {activeMarks.length > 3 && (
                          <p className="text-sm text-slate-600 italic">
                            And {activeMarks.length - 3} more active trademark{activeMarks.length - 3 !== 1 ? 's' : ''}...
                          </p>
                        )}
                      </div>

                      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-lg p-4 mb-6">
                        <p className="text-slate-700 text-sm">
                          <span className="font-semibold">Note:</span> This search does not include pending applications. Additionally, the registered trademarks may not be registered in the same field or business type. We recommend an attorney search to make sure your business name is available.
                        </p>
                      </div>

                      <div className="bg-white rounded-lg border-2 border-slate-300 p-6 space-y-4">
                        <h4 className="font-bold text-slate-900 text-lg">Your Options:</h4>

                        <div className="space-y-3">
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                1
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-slate-900 mb-2">
                                  Request a Professional Search ($49)
                                </h5>
                                <p className="text-sm text-slate-700 mb-3">
                                  Our attorney will conduct a comprehensive search including federal, state, and common law trademarks, plus provide a detailed conflict analysis and recommendation.
                                </p>
                                <button
                                  onClick={() => navigate('/trademark-search-request')}
                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                                >
                                  Request Professional Search
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                            <div className="flex items-start gap-3">
                              <div className="bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                                2
                              </div>
                              <div className="flex-1">
                                <h5 className="font-semibold text-slate-900 mb-2">
                                  Continue with Your Application
                                </h5>
                                <p className="text-sm text-slate-700">
                                  You can continue with your trademark application. Our comprehensive search (included in all packages) will provide a detailed analysis, and we'll contact you if we identify significant conflicts before filing.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })()}
            </div>
          )}

          {currentScreen === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Business & Usage Details</h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Is this name already in use? *
                </label>
                <div className="space-y-2">
                  {['Yes, I\'m already using it', 'No, I plan to use it soon', 'I\'m not sure yet'].map(option => (
                    <label key={option} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="radio"
                        name="nameInUse"
                        value={option}
                        checked={formData.nameInUse === option}
                        onChange={(e) => {
                          updateFormData('nameInUse', e.target.value);
                          updateFormData('nameInUseStartDate', '');
                          updateFormData('nameInUsePlanDate', '');
                        }}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.nameInUse === 'Yes, I\'m already using it' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    When did you start using this name? *
                  </label>
                  <input
                    type="date"
                    value={formData.nameInUseStartDate}
                    onChange={(e) => updateFormData('nameInUseStartDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              )}

              {formData.nameInUse === 'No, I plan to use it soon' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    When do you plan to start using this name? *
                  </label>
                  <input
                    type="date"
                    value={formData.nameInUsePlanDate}
                    onChange={(e) => updateFormData('nameInUsePlanDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What type of business is this? *
                </label>
                <div className="space-y-2">
                  {['Individual / Sole proprietor', 'LLC', 'Corporation', 'Partnership', 'Not formed yet'].map(option => (
                    <label key={option} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="radio"
                        name="businessType"
                        value={option}
                        checked={formData.businessType === option}
                        onChange={(e) => updateFormData('businessType', e.target.value)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Where do you currently use (or plan to use) this brand name? *
                </label>
                <p className="text-sm text-slate-600 mb-3">Check all that apply</p>
                <div className="space-y-2">
                  {['Website', 'Social media', 'Amazon', 'Etsy', 'Shopify or online store', 'In-person business', 'Not in use yet'].map(option => (
                    <label key={option} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.brandUsageLocations.includes(option)}
                        onChange={() => toggleCheckbox('brandUsageLocations', option)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500 rounded"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.nameInUse === 'Yes, I\'m already using it' &&
               (formData.brandUsageLocations.includes('Website') || formData.brandUsageLocations.includes('Social media')) && (
                <div className="space-y-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-semibold text-slate-700">Please provide your website or social media accounts</p>

                  {formData.brandUsageLocations.includes('Website') && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        value={formData.websiteUrl}
                        onChange={(e) => updateFormData('websiteUrl', e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  )}

                  {formData.brandUsageLocations.includes('Social media') && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Social Media Accounts
                      </label>
                      <textarea
                        value={formData.socialMediaAccounts}
                        onChange={(e) => updateFormData('socialMediaAccounts', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        placeholder="List your social media accounts (e.g., Instagram: @yourbrand, Facebook: facebook.com/yourbrand)"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentScreen === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">What You Sell</h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  What products or services will this trademark cover? *
                </label>
                <p className="text-sm text-slate-600 mb-3">Describe what you sell in plain English.</p>
                <textarea
                  value={formData.productsServicesDescription}
                  onChange={(e) => updateFormData('productsServicesDescription', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., I sell handmade jewelry including necklaces, bracelets, and earrings made from natural stones..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Do you sell physical products, services, or both? *
                </label>
                <div className="space-y-2">
                  {['Physical products', 'Services', 'Both'].map(option => (
                    <label key={option} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="radio"
                        name="productServiceType"
                        value={option}
                        checked={formData.productServiceType === option}
                        onChange={(e) => updateFormData('productServiceType', e.target.value)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Where do you sell or plan to sell? *
                </label>
                <p className="text-sm text-slate-600 mb-3">Check all that apply</p>
                <div className="space-y-2">
                  {['United States only', 'Internationally', 'Online only', 'In-person only', 'Both online and in-person'].map(option => (
                    <label key={option} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.salesLocations.includes(option)}
                        onChange={() => toggleCheckbox('salesLocations', option)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500 rounded"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScreen === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Prior Filings & Risks</h2>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Have you ever filed a trademark for this name before? *
                </label>
                <div className="space-y-2">
                  {['Yes', 'No', 'Not sure'].map(option => (
                    <label key={option} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="radio"
                        name="priorTrademarkFiling"
                        value={option}
                        checked={formData.priorTrademarkFiling === option}
                        onChange={(e) => updateFormData('priorTrademarkFiling', e.target.value)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Are you aware of any similar business names? *
                </label>
                <div className="space-y-2">
                  {['Yes', 'No', 'Not sure'].map(option => (
                    <label key={option} className="flex items-center p-4 border border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                      <input
                        type="radio"
                        name="similarBusinessNames"
                        value={option}
                        checked={formData.similarBusinessNames === option}
                        onChange={(e) => updateFormData('similarBusinessNames', e.target.value)}
                        className="w-4 h-4 text-amber-500 focus:ring-amber-500"
                      />
                      <span className="ml-3 text-slate-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Is there anything else we should know about your brand or situation? (optional)
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Any additional information that might be helpful..."
                />
              </div>
            </div>
          )}

          {currentScreen === 6 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Contact Information</h2>
                <p className="text-slate-600">We'll use this to reach out about your trademark application.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full name *
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
                  Email address *
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
                  Phone number *
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
          )}

          {currentScreen === 7 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Confirmation</h2>
                <p className="text-slate-600">Please review and confirm before proceeding.</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-6 space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Trademark Name</p>
                    <p className="text-slate-900">{formData.trademarkName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Business Type</p>
                    <p className="text-slate-900">{formData.businessType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Contact Name</p>
                    <p className="text-slate-900">{formData.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Email</p>
                    <p className="text-slate-900">{formData.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start p-4 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.confirmationAccurate}
                    onChange={(e) => updateFormData('confirmationAccurate', e.target.checked)}
                    className="w-5 h-5 text-amber-500 focus:ring-amber-500 rounded mt-0.5"
                  />
                  <span className="ml-3 text-slate-700">
                    I confirm that the information provided is accurate to the best of my knowledge. *
                  </span>
                </label>

                <label className="flex items-start p-4 border-2 border-slate-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.confirmationUnderstand}
                    onChange={(e) => updateFormData('confirmationUnderstand', e.target.checked)}
                    className="w-5 h-5 text-amber-500 focus:ring-amber-500 rounded mt-0.5"
                  />
                  <span className="ml-3 text-slate-700">
                    I understand that submitting this information does not guarantee trademark approval. If my trademark is not available I understand that I have 30 days to request a refund or submit a new name to be trademarked. *
                  </span>
                </label>
              </div>
            </div>
          )}

          {currentScreen === 8 && (
            <div className="space-y-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Select Your Package</h2>
                <p className="text-slate-600">Choose the package that best fits your needs.</p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
                <p className="text-slate-700 text-sm">
                  <span className="font-semibold">Note:</span> You'll be able to choose a payment plan or pay in full on the next screen.
                </p>
              </div>

              <div className="flex justify-center px-4">
                <div
                  onClick={() => setSelectedPackage('Trademark Registration Package')}
                  className="relative p-6 sm:p-8 rounded-xl border-2 border-amber-500 bg-amber-50 shadow-lg max-w-xl w-full cursor-pointer transition-all hover:shadow-xl"
                >
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <Check className="text-amber-600" size={24} />
                  </div>
                  <div className="inline-block bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4">
                    PROFESSIONAL PACKAGE
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-2 sm:mb-3 pr-8">Trademark Registration</h3>
                  <p className="text-4xl sm:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
                    $499
                  </p>
                  <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6">Plus USPTO filing fee ($350 per class)</p>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>Comprehensive trademark search</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>Client Portal Access</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>USPTO application preparation & filing</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>Unlimited attorney support</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>Application monitoring</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>Post-approval guidance & certificate support</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>Priority filing - expedited processing</span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-slate-700 text-sm sm:text-base">
                      <Check className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                      <span>Amazon Brand Registry enrollment guide</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  Plus required USPTO filing fee of $350 per class
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={currentScreen === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              currentScreen === 1
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            <ChevronLeft size={20} />
            Back
          </button>

          {((currentScreen < 7) || (currentScreen === 7 && !packageFromPricing)) ? (
            <button
              onClick={handleNextOrSubmit}
              disabled={!validateScreen()}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                validateScreen()
                  ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:shadow-xl'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleNextOrSubmit}
              disabled={!validateScreen() || isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                validateScreen() && !isSubmitting
                  ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Check size={20} />
                  Submit & Continue
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
