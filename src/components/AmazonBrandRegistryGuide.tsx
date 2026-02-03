import { useState, useEffect } from 'react';
import { CheckCircle, ChevronDown, ChevronUp, Package, Shield, TrendingUp, FileText, AlertCircle, ExternalLink, CheckSquare, Square } from 'lucide-react';

interface Step {
  number: number;
  title: string;
  description: string;
  details: string[];
  tips?: string[];
  timeline?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

const ENROLLMENT_STEPS: Step[] = [
  {
    number: 1,
    title: 'Ensure Trademark Application is Submitted',
    description: 'Your trademark application must be officially filed with the USPTO before you can enroll in Amazon Brand Registry.',
    details: [
      'Amazon accepts both registered trademarks and pending applications that have been filed with the USPTO',
      'Your application must have an official USPTO serial number (e.g., 88123456 or 98765432)',
      'The trademark can be either "registered" (fully approved) or "pending" (under review)',
      'You cannot enroll before your application is submitted to the USPTO'
    ],
    tips: [
      'You can enroll as soon as your application is filed and you receive your serial number',
      'Monitor your USPTO status through our portal or the USPTO website',
      'Registered trademarks provide the strongest protection, but pending applications are accepted'
    ],
    timeline: 'Available immediately after application filing'
  },
  {
    number: 2,
    title: 'Prepare Required Information',
    description: 'Gather all necessary documents and information before starting your Brand Registry application.',
    details: [
      'USPTO trademark serial number (for pending applications) or registration number (for approved trademarks)',
      'Brand name exactly as filed with the USPTO',
      'List of product categories your brand sells',
      'Images of your product and packaging showing the trademark',
      'Your Amazon seller or vendor account information'
    ],
    tips: [
      'Ensure your brand name matches exactly with your USPTO filing',
      'Have clear product images showing your trademark prominently displayed',
      'If you sell in multiple categories, list them all'
    ],
    timeline: '1-2 hours to gather materials'
  },
  {
    number: 3,
    title: 'Access Amazon Brand Registry',
    description: 'Navigate to Amazon Brand Registry and begin your enrollment application.',
    details: [
      'Visit brandregistry.amazon.com',
      'Sign in with your Amazon Seller Central or Vendor Central account',
      'Click "Enroll a new brand" or "Get started"',
      'Follow the prompts to begin enrollment'
    ],
    tips: [
      'Use the same Amazon account that manages your product listings',
      'Have all documents ready before starting to avoid timing out',
      'The process can be saved and resumed if needed'
    ],
    timeline: '5-10 minutes to start'
  },
  {
    number: 4,
    title: 'Complete Brand Registry Application',
    description: 'Fill out the Brand Registry enrollment form with your trademark and business information.',
    details: [
      'Enter your USPTO trademark serial number or registration number',
      'Provide your brand name exactly as it appears on your USPTO filing',
      'Upload images showing your trademark on products or packaging',
      'Select product categories',
      'Enter brand website URL if applicable',
      'Describe where your trademark appears on products'
    ],
    tips: [
      'Be precise with your trademark serial/registration number',
      'Upload high-quality images showing your mark clearly',
      'Describe your brand accurately and completely',
      'Review all information carefully before submitting'
    ],
    timeline: '15-30 minutes'
  },
  {
    number: 5,
    title: 'Verification Process',
    description: 'Amazon will review your application and may send a verification code to confirm trademark ownership.',
    details: [
      'Amazon reviews your submitted information',
      'They may send a verification code to the email or phone number on your USPTO trademark record',
      'Enter the verification code in Amazon Brand Registry when prompted',
      'Amazon validates your trademark registration with the USPTO'
    ],
    tips: [
      'Check the email and phone number on file with the USPTO',
      'Update contact information with USPTO if needed before enrolling',
      'Verification codes typically arrive within a few hours',
      'Check spam folders for verification emails'
    ],
    timeline: 'Usually within 24 hours'
  },
  {
    number: 6,
    title: 'Enrollment Approval',
    description: 'Once verified, Amazon will approve your Brand Registry enrollment and activate your account.',
    details: [
      'Amazon completes their review process',
      'You receive confirmation email of enrollment approval',
      'Your Brand Registry dashboard becomes active',
      'All Brand Registry tools and features are now available'
    ],
    tips: [
      'Total enrollment typically takes 1-3 business days after verification',
      'You can immediately access all Brand Registry features upon approval',
      'Set up your brand profile and explore available tools'
    ],
    timeline: '1-3 business days after verification'
  }
];

const FAQS: FAQ[] = [
  {
    question: 'When can I enroll in Amazon Brand Registry?',
    answer: 'You can enroll as soon as your trademark application is officially filed with the USPTO and you receive your serial number. Amazon accepts both registered trademarks and pending applications. However, you must have a valid USPTO serial number before enrollment. Registered trademarks typically take 8-12 months from filing, but you can start the Brand Registry enrollment process with a pending application.'
  },
  {
    question: 'What if I get a verification code but it does not work?',
    answer: 'Ensure you are entering the code exactly as received, without extra spaces. Codes are typically valid for a limited time. If the code expires or does not work, you can request a new one through the Brand Registry enrollment portal. If issues persist, contact Amazon Brand Registry support directly.'
  },
  {
    question: 'Can I enroll if my trademark is still pending?',
    answer: 'Yes, Amazon accepts both registered trademarks and pending applications. As long as your trademark application has been officially filed with the USPTO and you have a valid serial number, you can enroll in Brand Registry. You do not need to wait for full registration approval, though registered trademarks provide stronger legal protection.'
  },
  {
    question: 'What benefits do I get with Brand Registry?',
    answer: 'Brand Registry provides: (1) Enhanced brand protection with automated monitoring and reporting tools, (2) Access to A+ Content to showcase your products with rich media, (3) Brand analytics and insights, (4) Sponsored Brands advertising options, (5) Ability to report violations and remove counterfeit listings, (6) Stores for creating a custom branded shopping experience, and (7) Protection from unauthorized sellers using your trademark.'
  },
  {
    question: 'Do I need Brand Registry to sell on Amazon?',
    answer: 'No, Brand Registry is not required to sell on Amazon. However, it provides significant advantages for brand protection, content control, and stopping unauthorized sellers. If you own a brand and want enhanced control and protection, Brand Registry is highly recommended.'
  },
  {
    question: 'Can I enroll multiple brands?',
    answer: 'Yes, you can enroll multiple brands in Brand Registry if you have filed trademark applications or own registered trademarks for each brand. Each brand requires its own separate enrollment application and USPTO trademark serial or registration number.'
  },
  {
    question: 'What if Amazon rejects my Brand Registry application?',
    answer: 'Amazon may reject applications if: (1) The trademark application has not been filed with the USPTO, (2) Information does not match USPTO records, (3) Images do not clearly show the trademark, or (4) The trademark serial/registration number is not valid. Review the rejection reason, correct any issues, and reapply. Contact our team if you need assistance understanding or resolving the rejection.'
  },
  {
    question: 'How do I verify trademark ownership with Amazon?',
    answer: 'Amazon typically sends a verification code to the contact information (email or phone) listed on your USPTO trademark application or registration. Ensure this information is current before enrolling. If needed, you can update your contact information with the USPTO through their website.'
  },
  {
    question: 'Can I use an international trademark for Brand Registry?',
    answer: 'Amazon Brand Registry accepts trademarks from many countries including the USPTO (United States), EU IPO (European Union), and other major trademark offices. However, each Amazon marketplace has specific requirements. For selling in the US Amazon marketplace, a USPTO trademark is typically required.'
  },
  {
    question: 'What happens after I am enrolled?',
    answer: 'Once enrolled, you gain immediate access to all Brand Registry tools. You can update your product listings with A+ Content, set up automated brand protection monitoring, create a Brand Store, access analytics, and report trademark violations. Explore your Brand Registry dashboard to familiarize yourself with all available features.'
  }
];

export default function AmazonBrandRegistryGuide() {
  const [expandedStep, setExpandedStep] = useState<number | null>(1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showAllSteps, setShowAllSteps] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('amazonBrandRegistryProgress');
    if (saved) {
      setCompletedSteps(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleStep = (stepNumber: number) => {
    setExpandedStep(expandedStep === stepNumber ? null : stepNumber);
  };

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const toggleStepCompletion = (stepNumber: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
    localStorage.setItem('amazonBrandRegistryProgress', JSON.stringify(Array.from(newCompleted)));
  };

  const progressPercentage = (completedSteps.size / ENROLLMENT_STEPS.length) * 100;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Amazon Brand Registry Enrollment Guide</h2>
        </div>
        <p className="text-orange-50 text-lg mb-4">
          Follow this interactive guide to enroll your filed trademark application in Amazon Brand Registry. You can start enrollment with a pending application. Check off each step as you complete it!
        </p>

        <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-sm">Your Progress</span>
            <span className="text-sm">{completedSteps.size} of {ENROLLMENT_STEPS.length} steps completed</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {progressPercentage === 100 && (
            <div className="mt-3 flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              <span>Congratulations! You've completed all steps!</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer transform hover:scale-105">
            <Shield className="w-6 h-6 mb-2" />
            <p className="font-semibold mb-1">Brand Protection</p>
            <p className="text-sm text-orange-50">Stop counterfeiters and unauthorized sellers</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer transform hover:scale-105">
            <TrendingUp className="w-6 h-6 mb-2" />
            <p className="font-semibold mb-1">Enhanced Content</p>
            <p className="text-sm text-orange-50">Access A+ Content and Brand Stores</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm hover:bg-white/15 transition-all cursor-pointer transform hover:scale-105">
            <FileText className="w-6 h-6 mb-2" />
            <p className="font-semibold mb-1">Analytics & Insights</p>
            <p className="text-sm text-orange-50">Track brand performance and customer behavior</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">Important: Trademark Application Must Be Filed</h3>
            <p className="text-blue-800 text-sm">
              To enroll in Amazon Brand Registry, your trademark application must be officially submitted to the USPTO.
              Amazon accepts both registered trademarks (fully approved) and pending applications (under review).
              However, you must have an official USPTO serial number before you can begin the enrollment process.
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Step-by-Step Enrollment Process</h3>
          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className="text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            {showAllSteps ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
        <div className="space-y-3">
          {ENROLLMENT_STEPS.map((step) => {
            const isCompleted = completedSteps.has(step.number);
            const isExpanded = showAllSteps || expandedStep === step.number;

            return (
              <div
                key={step.number}
                className={`border-2 rounded-lg overflow-hidden bg-white transition-all ${
                  isCompleted
                    ? 'border-green-300 bg-green-50/30'
                    : 'border-slate-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center p-5">
                  <button
                    onClick={() => toggleStepCompletion(step.number)}
                    className="flex-shrink-0 mr-4 focus:outline-none group"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-7 h-7 text-green-600 group-hover:text-green-700 transition-colors" />
                    ) : (
                      <Square className="w-7 h-7 text-slate-400 group-hover:text-orange-500 transition-colors" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleStep(step.number)}
                    className="flex items-center justify-between flex-1 hover:bg-slate-50/50 -m-5 p-5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        <span className="font-bold">{step.number}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold mb-1 ${isCompleted ? 'text-green-900' : 'text-slate-900'}`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-slate-600">{step.description}</p>
                        {step.timeline && (
                          <p className="text-xs text-slate-500 mt-1 font-medium">⏱️ {step.timeline}</p>
                        )}
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t-2 border-slate-200 p-5 bg-gradient-to-br from-slate-50 to-white space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        What to do:
                      </p>
                      <ul className="space-y-2.5">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 p-2 hover:bg-white rounded-lg transition-colors">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {step.tips && step.tips.length > 0 && (
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-lg p-4 transform transition-all hover:scale-[1.02]">
                        <p className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Pro Tips:
                        </p>
                        <ul className="space-y-2">
                          {step.tips.map((tip, idx) => (
                            <li key={idx} className="text-sm text-amber-900 flex items-start gap-2">
                              <span className="text-amber-600 font-bold flex-shrink-0">💡</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!isCompleted && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepCompletion(step.number);
                        }}
                        className="w-full mt-3 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Mark as Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-slate-700" />
          Quick Links
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          <a
            href="https://brandregistry.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white border-2 border-orange-200 hover:border-orange-400 rounded-lg text-sm font-medium text-slate-900 hover:text-orange-600 transition-all transform hover:scale-105 hover:shadow-md"
          >
            <Package className="w-5 h-5 flex-shrink-0" />
            <span>Amazon Brand Registry</span>
          </a>
          <a
            href="https://sellercentral.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white border-2 border-orange-200 hover:border-orange-400 rounded-lg text-sm font-medium text-slate-900 hover:text-orange-600 transition-all transform hover:scale-105 hover:shadow-md"
          >
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
            <span>Seller Central</span>
          </a>
          <a
            href="https://www.uspto.gov/trademarks/search"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white border-2 border-orange-200 hover:border-orange-400 rounded-lg text-sm font-medium text-slate-900 hover:text-orange-600 transition-all transform hover:scale-105 hover:shadow-md"
          >
            <Shield className="w-5 h-5 flex-shrink-0" />
            <span>USPTO Status</span>
          </a>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-orange-600" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <div
              key={index}
              className="border-2 border-slate-200 rounded-lg overflow-hidden bg-white hover:border-orange-300 transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-5 hover:bg-orange-50/50 transition-colors text-left group"
              >
                <h4 className="font-semibold text-slate-900 pr-4 group-hover:text-orange-700 transition-colors">
                  {faq.question}
                </h4>
                {expandedFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0 transition-colors" />
                )}
              </button>

              {expandedFaq === index && (
                <div className="border-t-2 border-slate-200 p-5 bg-gradient-to-br from-slate-50 to-white">
                  <p className="text-sm text-slate-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Need Help?</h3>
            <p className="text-green-800 text-sm mb-3">
              If you have questions about enrolling in Amazon Brand Registry or encounter any issues during the process,
              our team is here to help. Use the Messages tab to reach out to your attorney with any questions.
            </p>
            <p className="text-green-800 text-sm">
              We are committed to ensuring your successful enrollment and helping you maximize the benefits of
              Amazon Brand Registry for your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
