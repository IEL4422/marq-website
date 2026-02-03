import { useNavigate } from 'react-router-dom';
import { AlertCircle, FileText, MessageSquare, CheckCircle, Clock, Shield } from 'lucide-react';

export default function OfficeActionPage() {
  const navigate = useNavigate();
  const responseSteps = [
    {
      icon: FileText,
      title: 'Review & Analysis',
      description: 'Our attorneys thoroughly review the office action and identify all issues raised by the USPTO.'
    },
    {
      icon: MessageSquare,
      title: 'Strategy Development',
      description: 'We develop a comprehensive response strategy tailored to address each objection or requirement.'
    },
    {
      icon: FileText,
      title: 'Response Preparation',
      description: 'We draft a detailed legal response with supporting arguments and evidence as needed.'
    },
    {
      icon: CheckCircle,
      title: 'Filing & Follow-up',
      description: 'We file the response with the USPTO and monitor the application through to resolution.'
    }
  ];

  const commonIssues = [
    {
      title: 'Likelihood of Confusion',
      description: 'The USPTO believes your mark is too similar to an existing registration.'
    },
    {
      title: 'Descriptiveness',
      description: 'Your mark is considered too descriptive of the goods or services.'
    },
    {
      title: 'Specimen Issues',
      description: 'The specimen submitted does not properly show use of the mark in commerce.'
    },
    {
      title: 'Identification of Goods/Services',
      description: 'The description of your goods or services needs clarification or modification.'
    }
  ];

  return (
    <div className="bg-white">
      <section className="relative bg-gradient-to-br from-orange-900 via-red-900 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-6">
              <AlertCircle size={16} className="text-orange-400" />
              <span className="text-sm font-medium text-orange-400">Expert Response Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Office Action Response
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Received an office action from the USPTO? Don't panic. Our experienced trademark attorneys
              will craft a comprehensive response to overcome objections and move your application forward.
            </p>
            <button onClick={() => navigate('/get-started')} className="bg-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-400 transition-all hover:scale-105 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What is an Office Action?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              An office action is an official letter from the USPTO examining attorney that raises
              concerns or objections about your trademark application. Most applications receive at
              least one office action during the registration process.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-orange-50 p-8 rounded-2xl border-2 border-orange-200">
              <AlertCircle className="text-orange-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Time-Sensitive</h3>
              <p className="text-slate-700 mb-3">
                You typically have only 6 months to respond to an office action, or your application
                will be abandoned.
              </p>
              <p className="text-slate-600 text-sm">
                Don't wait - contact us immediately upon receiving an office action.
              </p>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
              <FileText className="text-blue-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Complex Legal Issues</h3>
              <p className="text-slate-700 mb-3">
                Office actions often involve complex legal arguments and require expertise in
                trademark law to overcome.
              </p>
              <p className="text-slate-600 text-sm">
                Our attorneys have extensive experience with all types of office actions.
              </p>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
              <Shield className="text-green-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-3">High Success Rate</h3>
              <p className="text-slate-700 mb-3">
                With proper legal representation, most office actions can be successfully overcome,
                allowing your application to proceed.
              </p>
              <p className="text-slate-600 text-sm">
                We develop strategic responses that maximize your chances of approval.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Office Action Response Pricing</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Our pricing is transparent and based on the complexity of the issues raised by the USPTO.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
              <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Procedural Office Action</h3>
                <div className="text-4xl font-bold text-slate-900 mb-4">$399</div>
                <p className="text-slate-600">Response to technical or administrative issues like specimen problems, classification corrections, or description clarifications.</p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm border-2 border-slate-200">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Substantive Office Action</h3>
                <div className="text-4xl font-bold text-slate-900 mb-4">$799</div>
                <p className="text-slate-600">Response to complex legal issues like likelihood of confusion, descriptiveness, or other registerability arguments requiring extensive legal research and argumentation.</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Common Office Action Issues</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Understanding the most common objections can help you prepare, but professional
              representation is essential for crafting effective responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {commonIssues.map((issue, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{issue.title}</h3>
                <p className="text-slate-600">{issue.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 p-8 rounded-2xl">
            <div className="flex items-start gap-4">
              <Clock className="text-amber-600 flex-shrink-0 mt-1" size={28} />
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Time is Critical</h3>
                <p className="text-slate-700 leading-relaxed">
                  The USPTO requires a response within 6 months of the office action date. Missing this
                  deadline results in abandonment of your application, and you'll lose your filing date
                  priority. Contact us immediately upon receiving an office action to ensure adequate time
                  for a thorough and effective response.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Response Process</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We handle every aspect of responding to your office action with professionalism and expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {responseSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-gradient-to-br from-orange-600 to-red-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Professional Representation Matters</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Office actions require careful legal analysis and strategic responses. The examining attorney
                is a trained lawyer, and responding without legal expertise puts your trademark at risk.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Our attorneys understand trademark law, USPTO procedures, and the specific requirements
                examining attorneys expect. We know how to craft persuasive arguments that address the
                examiner's concerns while protecting your interests.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Don't risk your trademark application by attempting to respond on your own. Let our
                experienced team handle your office action response.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">What You Get</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Thorough analysis of the office action</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Strategic response tailored to your case</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Professional legal arguments and citations</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Complete preparation and filing of response</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Ongoing monitoring and follow-up</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-orange-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Direct attorney communication throughout</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-orange-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Get Expert Help with Your Office Action
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Don't let an office action stop your trademark registration. Contact us today.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
            Get Started
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Fast response • Expert attorneys • Proven success rate
          </p>
        </div>
      </section>
    </div>
  );
}
