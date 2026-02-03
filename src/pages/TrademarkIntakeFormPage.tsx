import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import TrademarkIntakeForm from '../components/TrademarkIntakeForm';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function TrademarkIntakeFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const matterId = searchParams.get('matter');
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [matter, setMatter] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!matterId) {
      navigate('/client-portal');
      return;
    }
    loadMatter();
  }, [matterId, user]);

  const loadMatter = async () => {
    try {
      const { data, error } = await supabase
        .from('trademark_matters')
        .select('*')
        .eq('id', matterId)
        .eq('client_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        navigate('/client-portal');
        return;
      }

      setMatter(data);

      if (data.intake_completed_at) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error('Error loading matter:', error);
      navigate('/client-portal');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleSaveExit = () => {
    navigate('/client-portal');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle className="text-green-600" size={32} />
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              Intake Questionnaire Submitted!
            </h1>

            <p className="text-lg text-slate-600 mb-6">
              Thank you for completing the trademark intake questionnaire. Our attorneys will review your information and begin preparing your application.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-bold text-slate-900 mb-3">What Happens Next?</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">1.</span>
                  <span>Our attorneys will review your intake form within 1-2 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">2.</span>
                  <span>We'll reach out if we need any clarifications or additional information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">3.</span>
                  <span>Once finalized, we'll file your application with the USPTO</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">4.</span>
                  <span>You'll receive updates and communications through your client portal</span>
                </li>
              </ul>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              Case Status: <span className="font-semibold text-amber-600">Stage 2 – Attorney Review</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/client-portal')}
                className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-semibold"
              >
                Return to Portal
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  loadMatter();
                }}
                className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold"
              >
                Edit Responses
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-6">
              Docket: {matter?.client_docket}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/client-portal')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Client Portal
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Trademark Intake Questionnaire
          </h1>
          <p className="text-slate-600">
            Please provide detailed information about your trademark. This will help our attorneys prepare and file your application with the USPTO.
          </p>
          {matter && (
            <p className="text-sm text-slate-500 mt-2">
              Docket: {matter.client_docket}
            </p>
          )}
        </div>

        <TrademarkIntakeForm
          matterId={matterId!}
          onSubmit={handleSubmit}
          onSaveExit={handleSaveExit}
        />
      </div>
    </div>
  );
}