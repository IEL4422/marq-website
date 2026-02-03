import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft, BookOpen, FileText } from 'lucide-react';
import { updatePageSEO } from '../utils/seo';
import SchemaMarkup, { breadcrumbSchema, organizationSchema, definedTermSchema } from '../components/SchemaMarkup';

interface GlossaryTermData {
  term: string;
  definition: string;
  detailedExplanation: string[];
  examples: string[];
  relatedTerms: string[];
  practicalTips?: string[];
}

const glossaryData: { [key: string]: GlossaryTermData } = {
  'abandonment': {
    term: 'Abandonment',
    definition: 'When trademark rights are lost due to non-use or failure to respond to USPTO actions.',
    detailedExplanation: [
      'Trademark abandonment occurs when a trademark owner loses their rights to a mark. This can happen in several ways, each with serious consequences for brand protection.',
      'Non-use abandonment happens when you stop using your trademark in commerce for three consecutive years or more. The law presumes abandonment after three years of non-use, though this presumption can be rebutted with evidence of intent to resume use.',
      'Abandonment can also occur if you fail to respond to official USPTO communications within the required timeframes. Missing a deadline for an office action response or failing to file required maintenance documents can result in your application or registration being abandoned.',
      'Once a trademark is abandoned, you lose all rights associated with it, and others may be able to register or use the same or similar mark.'
    ],
    examples: [
      'A company stops selling products under a trademarked brand name for four years without any intention to resume - the trademark rights may be considered abandoned.',
      'An applicant receives an office action from the USPTO but fails to respond within the six-month deadline - the application will be abandoned.',
      'A registered trademark owner fails to file the required maintenance documents between the 5th and 6th year after registration - the registration will be cancelled.'
    ],
    relatedTerms: ['Office Action', 'Intent to Use', 'Specimen'],
    practicalTips: [
      'Maintain continuous use of your trademark in commerce to preserve your rights.',
      'Set up calendar reminders for all USPTO deadlines, including maintenance filings.',
      'If you must temporarily suspend use of your mark, document your intent to resume use.',
      'Respond promptly to all USPTO communications, even if just to request an extension.',
      'Keep detailed records of your trademark use, including dates, locations, and sales figures.'
    ]
  },
  'goods-and-services': {
    term: 'Goods and Services',
    definition: 'The products or services associated with your trademark, categorized into classes.',
    detailedExplanation: [
      'When registering a trademark, you must identify the specific goods and services you will use the mark with. The USPTO uses the International Classification System, which divides all goods and services into 45 classes - 34 for goods and 11 for services.',
      'Your description must be specific and accurate. Generic descriptions like "retail services" are not acceptable. You must precisely identify what you sell or provide, such as "retail store services featuring clothing and accessories."',
      'The class system helps organize trademarks and determine the scope of your protection. You can only enforce your trademark rights against others using similar marks in connection with goods or services in the same or related classes.',
      'Each class you register in requires a separate filing fee, so careful consideration of which classes cover your business activities is essential for managing costs while ensuring adequate protection.'
    ],
    examples: [
      'Class 25: Clothing, footwear, headwear',
      'Class 35: Retail store services featuring athletic apparel and equipment',
      'Class 41: Entertainment services, namely, organizing and conducting athletic competitions',
      'A fitness brand might need to register in multiple classes: Class 25 for athletic clothing, Class 28 for sports equipment, and Class 41 for organizing fitness classes'
    ],
    relatedTerms: ['TEAS', 'Office Action', 'Specimen'],
    practicalTips: [
      'Work with an attorney to identify all relevant classes for your business to avoid gaps in protection.',
      'Review the USPTO\'s Acceptable Identification of Goods and Services Manual for proper terminology.',
      'Consider your business\'s expansion plans when choosing classes - it\'s easier to include additional classes initially than to file new applications later.',
      'Be as broad as permitted within your class while remaining accurate to maximize protection.',
      'Review competitor registrations to see which classes they use for similar products or services.'
    ]
  },
  'intent-to-use': {
    term: 'Intent to Use',
    definition: 'Filing basis when you plan to use the mark in commerce but haven\'t started yet.',
    detailedExplanation: [
      'An Intent-to-Use (ITU) application allows you to reserve a trademark before you actually start using it in commerce. This is valuable for businesses planning to launch a new product or service and want to secure trademark rights early.',
      'With an ITU application, you file your trademark application based on your bona fide intent to use the mark in the future. You must have a genuine intention to use the mark - you cannot file speculatively hoping to sell the mark later.',
      'After the USPTO approves your mark, you receive a Notice of Allowance. You then have six months to begin using the mark in commerce and file a Statement of Use with evidence (specimens) of that use. You can request extensions of time to file the Statement of Use, up to five 6-month extensions.',
      'The protection date for an ITU application relates back to your filing date, giving you priority over others who might start using or applying for a similar mark after your filing date.'
    ],
    examples: [
      'A tech startup files an ITU application for a new app name six months before launch to secure the trademark early.',
      'A clothing company developing a new product line files an ITU application while still in the design phase.',
      'An entrepreneur planning to open a restaurant in a year files an ITU application to protect the restaurant name while securing financing and finding a location.'
    ],
    relatedTerms: ['Specimen', 'Office Action', 'TEAS'],
    practicalTips: [
      'File your ITU application as soon as you have a concrete business plan, even if launch is months away.',
      'Budget for potential extension fees if your launch timeline extends beyond six months after approval.',
      'Keep detailed records documenting your intent to use the mark, including business plans and development timelines.',
      'Begin using your mark in commerce as soon as possible to avoid the need for multiple extensions.',
      'Remember that you cannot enforce your trademark rights until your registration is complete with an accepted Statement of Use.'
    ]
  },
  'likelihood-of-confusion': {
    term: 'Likelihood of Confusion',
    definition: 'The primary standard for determining trademark infringement—whether consumers would likely confuse the source of goods or services.',
    detailedExplanation: [
      'Likelihood of confusion is the central test for both trademark registration and infringement. The question is whether consumers seeing your mark would mistakenly believe your goods or services come from, are sponsored by, or are affiliated with the owner of a similar existing mark.',
      'The USPTO and courts consider multiple factors, including: similarity of the marks in appearance, sound, and meaning; relatedness of the goods or services; strength of the existing mark; similarity of marketing channels and customer base; evidence of actual confusion; sophistication of purchasers; and intent of the user.',
      'No single factor is determinative. The analysis looks at the overall commercial impression and whether confusion is likely in the marketplace. Even if marks are somewhat different, if they\'re used for closely related goods, confusion may still be likely.',
      'This is the most common reason for trademark application refusals and the most frequent basis for trademark infringement claims.'
    ],
    examples: [
      'A USPTO examining attorney refuses an application for "ACME Software" because "ACME Solutions" is already registered for computer programming services - the marks are similar and the services are related.',
      'A court finds infringement where a new energy drink called "Red Thunder" uses similar colors and marketing to the established "Red Bull" brand, even though the names aren\'t identical.',
      'An application for "Apple" for financial services would likely be approved because it\'s unlikely to be confused with Apple Inc.\'s computer and technology products, despite the identical name.'
    ],
    relatedTerms: ['Opposition', 'Office Action', 'Specimen'],
    practicalTips: [
      'Conduct a comprehensive trademark search before investing in branding to identify potential conflicts.',
      'Consider sound-alike marks and marks with similar meanings, not just identical matches.',
      'The more distinctive your mark, the stronger protection you\'ll have against similar marks.',
      'If you receive a likelihood of confusion refusal, work with an attorney to craft legal arguments or consider amending your application.',
      'In clearance searches, pay special attention to marks in related and overlapping industries, not just your exact business category.'
    ]
  },
  'office-action': {
    term: 'Office Action',
    definition: 'Official communication from the USPTO examining attorney regarding your trademark application.',
    detailedExplanation: [
      'An office action is a letter from a USPTO examining attorney that identifies issues with your trademark application that must be resolved before the mark can proceed to registration. Approximately 40-50% of applications receive at least one office action.',
      'Office actions can be procedural or substantive. Procedural office actions address technical issues like incorrect classification, insufficient specimens, or unclear descriptions of goods/services. These are generally easier to overcome.',
      'Substantive office actions raise legal issues such as likelihood of confusion with existing marks, descriptiveness, mere ornamentation, or failure to function as a trademark. These require careful legal arguments and may necessitate amendments to the application.',
      'You typically have six months to respond to an office action. Failure to respond or an inadequate response will result in abandonment of your application. Extensions of time may be available.'
    ],
    examples: [
      'The examining attorney issues an office action because your specimen shows the mark on a hang tag, but you\'re applying for "clothing" - you need to show the mark on the garments themselves or on labels affixed to them.',
      'You receive a likelihood of confusion refusal because there\'s an existing registration for a similar mark in a related class of goods.',
      'An office action requests clarification of your description of services because it\'s too vague or uses unacceptable terminology.',
      'The attorney issues a descriptiveness refusal, arguing that your mark merely describes a feature or characteristic of your goods.'
    ],
    relatedTerms: ['Abandonment', 'Specimen', 'Goods and Services', 'Likelihood of Confusion'],
    practicalTips: [
      'Respond to office actions promptly - don\'t wait until near the deadline in case you need to gather additional information.',
      'Consider hiring an attorney experienced in trademark prosecution to craft your response, especially for substantive issues.',
      'Read the entire office action carefully and address every issue raised - a partial response is insufficient.',
      'If you need more time, file a request for extension before the deadline expires.',
      'Keep copies of all office actions and your responses for your records.'
    ]
  },
  'opposition': {
    term: 'Opposition',
    definition: 'A proceeding where a third party challenges your trademark application before registration.',
    detailedExplanation: [
      'After your trademark application is approved by the examining attorney, it\'s published in the Official Gazette for a 30-day opposition period. During this time, any party who believes they would be damaged by registration of your mark can file an opposition.',
      'Opposition proceedings are conducted before the Trademark Trial and Appeal Board (TTAB) and function similarly to federal court litigation but with specific trademark-focused procedures. The most common ground for opposition is likelihood of confusion with the opposer\'s existing mark.',
      'The opposer must prove they have standing (a real interest in opposing) and grounds for opposition. Common grounds include likelihood of confusion, dilution of a famous mark, fraud in the application, or that the mark is merely descriptive or generic.',
      'Opposition proceedings can be expensive and time-consuming, often lasting 12-18 months or longer. They involve discovery, testimony, and legal briefs, similar to court litigation.'
    ],
    examples: [
      'A company with an established trademark for "BlueSky Technologies" files an opposition against a newly published application for "Blue Sky Tech Solutions" for similar services.',
      'A famous brand opposes a smaller company\'s application, arguing the new mark would dilute their famous trademark even though the products are different.',
      'After a mark is published, a competitor who uses a similar unregistered mark files an opposition claiming prior common law rights.'
    ],
    relatedTerms: ['Likelihood of Confusion', 'Office Action', 'TEAS'],
    practicalTips: [
      'Monitor the Official Gazette or use a watching service to identify marks similar to yours being published.',
      'If you receive a notice of opposition, consult an attorney immediately as response deadlines are strict.',
      'Consider whether settlement or coexistence agreements might resolve the dispute more efficiently than litigation.',
      'Budget for potential opposition costs when planning your trademark strategy, especially if operating in crowded trademark spaces.',
      'Conduct thorough clearance searches before filing to identify and avoid potential opposers.'
    ]
  },
  'specimen': {
    term: 'Specimen',
    definition: 'Evidence showing how you actually use your trademark in commerce with your goods or services.',
    detailedExplanation: [
      'A specimen is proof that you\'re using your trademark in commerce in the way trademark law requires. For goods, acceptable specimens include labels, tags, packaging, or the product itself showing the mark. For services, acceptable specimens include advertising materials, websites, brochures, or signage showing the mark used in connection with the services.',
      'The specimen must show the mark as it appears in the application and demonstrate use in commerce - actual sales or rendering of services. Mock-ups, digitally altered images, or promotional materials without clear association to services are generally unacceptable.',
      'For goods, the mark must appear on the goods themselves, their packaging, or labels/tags attached to them. A photograph of the product showing the mark affixed to it is ideal. For services, you must show the mark used in the sale or advertising of services, such as a website offering the services with the mark displayed.',
      'Timing is critical. For use-based applications, you submit specimens with your application. For Intent-to-Use applications, you submit specimens with your Statement of Use after you begin using the mark in commerce.'
    ],
    examples: [
      'For a clothing trademark: a photo of a t-shirt with the mark printed on the front, or a sewn-in label showing the mark.',
      'For a restaurant trademark: a menu, website, or photograph of the building\'s exterior showing the mark on signage.',
      'For software services: a screenshot of the website showing the mark in connection with offering software services, including clear indication that services are available.',
      'Unacceptable specimen: A business card showing only your mark and contact information without reference to goods or services.'
    ],
    relatedTerms: ['Intent to Use', 'Office Action', 'Goods and Services', 'TEAS'],
    practicalTips: [
      'Take clear, high-quality photographs of your specimens that clearly show the mark.',
      'Ensure your specimen shows the mark exactly as it appears in your application.',
      'For websites used as specimens, include the URL and date of access.',
      'Keep multiple examples of specimens in case the USPTO requests alternatives.',
      'If selling online, screenshots showing the product with the mark and ordering capability work well.',
      'For services, show the mark in actual use offering the services, not just general advertising of your business name.'
    ]
  },
  'teas': {
    term: 'TEAS',
    definition: 'Trademark Electronic Application System—the USPTO\'s online filing system.',
    detailedExplanation: [
      'TEAS is the USPTO\'s mandatory online platform for filing trademark applications and subsequent documents. All trademark applications must be filed electronically through TEAS - paper applications are no longer accepted.',
      'TEAS offers different filing options with different requirements and fees. TEAS Plus (currently $250 per class) requires use of pre-approved descriptions from the USPTO\'s ID Manual and agreement to receive communications electronically. TEAS Standard ($350 per class) allows more flexibility in describing goods/services.',
      'The system provides a structured format with drop-down menus, mandatory fields, and built-in validation to help ensure applications are complete and properly formatted. You can save your work and return to complete the application later.',
      'Through TEAS, you can not only file initial applications but also respond to office actions, file Statements of Use, submit maintenance documents, and manage your trademark portfolio.'
    ],
    examples: [
      'An applicant files a new trademark application using TEAS Plus, selecting pre-approved goods descriptions from the ID Manual to obtain the lower filing fee.',
      'An attorney responds to an office action by uploading a response brief and new specimens through the TEAS Response form.',
      'A trademark owner files a Section 8 Declaration of Continued Use through TEAS between the 5th and 6th year after registration to maintain the registration.',
      'A business files a Statement of Use through TEAS after receiving a Notice of Allowance on an Intent-to-Use application.'
    ],
    relatedTerms: ['Office Action', 'Intent to Use', 'Goods and Services', 'Specimen'],
    practicalTips: [
      'Create a USPTO account before starting your application so you can save your progress.',
      'Gather all necessary information before beginning: your mark, detailed description of goods/services, filing basis, and specimens.',
      'Use TEAS Plus when possible to save on filing fees, but ensure you can meet all the requirements.',
      'Review the ID Manual before filing to find pre-approved descriptions for your goods/services.',
      'Save confirmation numbers and printouts of all filings for your records.',
      'Set up email alerts through your USPTO account to receive notifications about your application status and deadlines.'
    ]
  }
};

export default function GlossaryTermPage() {
  const { term } = useParams<{ term: string }>();
  const navigate = useNavigate();
  const termData = term ? glossaryData[term] : undefined;

  useEffect(() => {
    if (termData) {
      updatePageSEO({
        title: `${termData.term} - Trademark Glossary Definition | Marq`,
        description: `${termData.definition} Learn about ${termData.term} in trademark law with detailed explanations, examples, and practical tips.`,
        canonical: `https://marqtrademarks.com/glossary/${term}`,
        keywords: `${termData.term}, trademark glossary, ${termData.relatedTerms.join(', ')}`,
        author: 'Marq',
        ogType: 'article'
      });
    }
  }, [termData, term]);

  if (!termData) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Resources</span>
          </button>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Term Not Found</h1>
            <p className="text-slate-600">The glossary term you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const termSchema = termData ? definedTermSchema({
    name: termData.term,
    description: termData.definition,
    url: `https://marqtrademarks.com/glossary/${term}`
  }) : null;

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://marqtrademarks.com' },
    { name: 'Resources', url: 'https://marqtrademarks.com/resources' },
    { name: termData?.term || 'Glossary', url: `https://marqtrademarks.com/glossary/${term}` }
  ]);

  return (
    <div className="bg-white min-h-screen">
      {termData && termSchema && (
        <SchemaMarkup schema={[organizationSchema, termSchema, breadcrumbs]} />
      )}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Resources</span>
          </button>
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="text-amber-400" size={40} />
            <h1 className="text-4xl md:text-5xl font-bold">{termData.term}</h1>
          </div>
          <p className="text-xl text-slate-300">{termData.definition}</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FileText className="text-amber-500" size={28} />
              Detailed Explanation
            </h2>
            <div className="space-y-4">
              {termData.detailedExplanation.map((paragraph, index) => (
                <p key={index} className="text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Examples</h2>
            <ul className="space-y-4">
              {termData.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-amber-100 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-slate-700 leading-relaxed">{example}</p>
                </li>
              ))}
            </ul>
          </div>

          {termData.practicalTips && termData.practicalTips.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-slate-50 rounded-2xl p-8 mb-8 border border-amber-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Practical Tips</h2>
              <ul className="space-y-3">
                {termData.practicalTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="bg-amber-500 text-white rounded-full w-2 h-2 flex-shrink-0 mt-2"></div>
                    <p className="text-slate-700 leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-slate-900 text-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Related Terms</h2>
            <div className="flex flex-wrap gap-3">
              {termData.relatedTerms.map((relatedTerm, index) => (
                <span
                  key={index}
                  className="bg-slate-800 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium border border-slate-700"
                >
                  {relatedTerm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need Help With Your Trademark?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Our experienced attorneys can guide you through every step of the trademark process.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
            Start Your Application Today
          </button>
        </div>
      </section>
    </div>
  );
}
