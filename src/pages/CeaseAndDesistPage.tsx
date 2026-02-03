import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, FileText, Mail, CheckCircle, Scale, Clock, Target } from 'lucide-react';
import { updatePageSEO } from '../utils/seo';

export default function CeaseAndDesistPage() {
  const navigate = useNavigate();
  useEffect(() => {
    updatePageSEO({
      title: 'Cease and Desist Letters | Trademark Infringement Protection | Marq Legal',
      description: 'Protect your trademark rights with professional cease and desist letters. Expert attorneys handle trademark infringement, copyright violations, and brand protection matters nationwide.',
      canonical: 'https://marqtrademarks.com/cease-and-desist',
      keywords: 'cease and desist letter, trademark infringement, brand protection, intellectual property enforcement, copyright violation, stop trademark infringement'
    });
  }, []);

  const whenToSend = [
    {
      icon: Target,
      title: 'Trademark Infringement',
      description: 'When another party is using your trademark or a confusingly similar mark without authorization, potentially causing consumer confusion.',
      examples: [
        'Unauthorized use of your brand name',
        'Similar logos or designs',
        'Confusingly similar domain names',
        'Copycat product packaging'
      ]
    },
    {
      icon: FileText,
      title: 'Copyright Violations',
      description: 'When your original creative works are being reproduced, distributed, or displayed without permission.',
      examples: [
        'Unauthorized use of your website content',
        'Copied marketing materials',
        'Stolen photography or graphics',
        'Republished written content'
      ]
    },
    {
      icon: Mail,
      title: 'Domain Name Disputes',
      description: 'When someone registers or uses a domain name that incorporates your trademark, typically for commercial gain or bad faith purposes.',
      examples: [
        'Cybersquatting on your brand name',
        'Typosquatting domains',
        'Domain names with your trademark',
        'Phishing or impersonation sites'
      ]
    },
    {
      icon: Scale,
      title: 'Unfair Competition',
      description: 'When competitors engage in deceptive practices that harm your business or mislead consumers about their relationship to your brand.',
      examples: [
        'False advertising claims',
        'Misleading product comparisons',
        'Trade dress infringement',
        'Passing off goods as yours'
      ]
    }
  ];

  const ourProcess = [
    {
      step: 1,
      title: 'Case Evaluation',
      description: 'We thoroughly review your intellectual property rights, the infringing activity, and assess the strength of your legal position.',
      timeline: '1-2 days'
    },
    {
      step: 2,
      title: 'Evidence Gathering',
      description: 'Our attorneys collect and document all relevant evidence of infringement, including screenshots, dates, and impact assessment.',
      timeline: '2-3 days'
    },
    {
      step: 3,
      title: 'Letter Drafting',
      description: 'We prepare a professionally crafted cease and desist letter clearly stating your rights, the infringement, and demanded actions.',
      timeline: '1-2 days'
    },
    {
      step: 4,
      title: 'Delivery & Follow-up',
      description: 'We send the letter via appropriate channels and monitor for compliance, negotiating resolution if necessary.',
      timeline: 'Ongoing'
    }
  ];

  const letterComponents = [
    {
      title: 'Identification of Rights',
      description: 'Clear documentation of your trademark registration, copyright, or other intellectual property rights with supporting evidence.'
    },
    {
      title: 'Description of Infringement',
      description: 'Detailed explanation of how the recipient is infringing your rights, with specific examples and documentation.'
    },
    {
      title: 'Legal Basis',
      description: 'Citation of relevant trademark law, copyright law, or other legal authorities supporting your position.'
    },
    {
      title: 'Demanded Action',
      description: 'Specific steps the recipient must take to cease the infringement and remedy the situation.'
    },
    {
      title: 'Timeline for Compliance',
      description: 'Reasonable deadline for the recipient to respond and comply with your demands, typically 10-15 days.'
    },
    {
      title: 'Consequences Statement',
      description: 'Clear explanation of potential legal action if the recipient fails to comply with the cease and desist demand.'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Protect Your Brand',
      description: 'Stop unauthorized use of your trademarks and prevent consumer confusion in the marketplace.'
    },
    {
      icon: Clock,
      title: 'Quick Resolution',
      description: 'Often resolves disputes faster and more cost-effectively than litigation, saving time and legal fees.'
    },
    {
      icon: Scale,
      title: 'Legal Foundation',
      description: 'Creates a formal record of enforcement that strengthens your position in potential future litigation.'
    },
    {
      icon: CheckCircle,
      title: 'Professional Approach',
      description: 'Attorney-drafted letters carry more weight and demonstrate serious intent to protect your rights.'
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="mx-auto mb-6 text-amber-400" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Cease and Desist Letters</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
              Protect your intellectual property rights with professionally crafted cease and desist letters.
              Stop trademark infringement and brand misuse with expert legal representation.
            </p>
            <div className="flex flex-col items-center gap-6">
              <div className="inline-block bg-amber-500/10 border-2 border-amber-400 rounded-2xl px-8 py-6">
                <div className="text-amber-400 text-sm font-semibold uppercase tracking-wide mb-2">Attorney Fee</div>
                <div className="text-5xl font-bold text-white mb-2">$499</div>
                <div className="text-slate-300">Complete cease and desist letter service</div>
              </div>
              <button onClick={() => navigate('/get-started')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                What is a Cease and Desist Letter?
              </h2>
            </div>
            <div className="space-y-4">
              <p className="text-lg text-slate-600 leading-relaxed">
                A cease and desist letter is a formal legal document demanding that an individual or business
                immediately stop engaging in activities that infringe on your intellectual property rights.
                It serves as the first step in enforcing your trademark, copyright, or other IP rights before
                escalating to costly litigation.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                When drafted by an experienced attorney, a cease and desist letter demonstrates your serious
                commitment to protecting your brand and often leads to swift resolution without the need for
                court action. It establishes a formal record of your enforcement efforts, which strengthens
                your legal position if litigation becomes necessary.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our attorneys have extensive experience crafting persuasive cease and desist letters that
                achieve results while maintaining professional standards. We understand the nuances of
                intellectual property law and know how to communicate effectively to protect your interests.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-slate-50 p-8 rounded-2xl border border-slate-200 max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Why Choose Professional Legal Help?</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">
                  <strong className="text-slate-900">Legal Expertise:</strong> Proper citation of trademark
                  law and precedent strengthens your position
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">
                  <strong className="text-slate-900">Credibility:</strong> Attorney letterhead signals
                  serious intent and legal backing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">
                  <strong className="text-slate-900">Strategic Approach:</strong> Balanced tone that's firm
                  but professional to encourage compliance
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="text-green-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">
                  <strong className="text-slate-900">Legal Protection:</strong> Avoids defamation or overreach
                  that could expose you to liability
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              When to Send a Cease and Desist Letter
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Understanding when to send a cease and desist letter is crucial for effective brand protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whenToSend.map((scenario, index) => {
              const Icon = scenario.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-amber-100 p-3 rounded-lg flex-shrink-0">
                      <Icon className="text-amber-600" size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{scenario.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{scenario.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-50 rounded-lg p-4">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                      Common Examples
                    </h4>
                    <ul className="space-y-2">
                      {scenario.examples.map((example, exIdx) => (
                        <li key={exIdx} className="flex items-start gap-2 text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Process</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We follow a systematic approach to ensure your cease and desist letter is effective and legally sound.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-slate-300 hidden md:block"></div>

              <div className="space-y-8">
                {ourProcess.map((processStep, index) => (
                  <div key={index} className="relative">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 md:w-16 flex md:justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center relative z-10 shadow-lg">
                          <span className="text-2xl font-bold text-amber-400">{processStep.step}</span>
                        </div>
                      </div>

                      <div className="flex-grow">
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                            <h3 className="text-xl font-bold text-slate-900">{processStep.title}</h3>
                            <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">
                              {processStep.timeline}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{processStep.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <FileText className="mx-auto mb-6 text-amber-400" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Components of an Effective Cease and Desist Letter
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Every cease and desist letter we draft includes these essential elements for maximum effectiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {letterComponents.map((component, index) => (
              <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="text-slate-900" size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{component.title}</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{component.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Benefits of Professional Cease and Desist Letters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
                  <div className="bg-gradient-to-br from-amber-100 to-amber-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-amber-600" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Important Considerations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Act Quickly</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Prompt action strengthens your position and may prevent the infringer from establishing
                      defenses based on your delay. However, ensure you have a solid legal basis before sending.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  <Scale className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Measure Response</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      The tone and demands should be proportionate to the infringement. Overly aggressive
                      letters can damage your credibility and potentially expose you to liability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Document Everything</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Maintain detailed records of the infringement, your enforcement efforts, and all
                      communications. This documentation is crucial if litigation becomes necessary.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle className="text-amber-400 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Be Prepared to Follow Through</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Only send a cease and desist if you're prepared to take further legal action if needed.
                      Empty threats can undermine your credibility and weaken future enforcement efforts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Protect Your Intellectual Property Rights
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Don't let trademark infringement or brand misuse go unchallenged. Take action to protect your
            business with a professionally drafted cease and desist letter.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
            Get Started
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Expert attorneys • Professional approach • Effective results
          </p>
        </div>
      </section>
    </div>
  );
}
