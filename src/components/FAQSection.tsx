import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs: FAQ[];
  className?: string;
}

export default function FAQSection({ title = "Frequently Asked Questions", faqs, className = "" }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={`bg-slate-50 py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
          {title}
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-slate-900 pr-8">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp size={24} className="text-amber-500 flex-shrink-0" />
                ) : (
                  <ChevronDown size={24} className="text-slate-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <div className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const trademarkFAQs: FAQ[] = [
  {
    question: "What is a trademark and why do I need one?",
    answer: "A trademark is a unique symbol, word, phrase, design, or combination that identifies and distinguishes your products or services from others. Federal trademark registration provides nationwide legal protection, exclusive rights to use the mark, the ability to sue for infringement, and enhanced brand value. It's essential for protecting your business identity and preventing others from using similar marks that could confuse customers."
  },
  {
    question: "How long does the trademark registration process take?",
    answer: "The complete trademark registration process typically takes 8-12 months from filing to final registration. Initial filing is done within 1-2 business days, USPTO examination takes 3-6 months, publication for opposition takes 30 days, and final registration takes another 2-3 months. Our attorneys monitor your application throughout the entire process and handle any office actions that may arise."
  },
  {
    question: "What's included in your trademark registration service?",
    answer: "Our comprehensive $499 trademark registration package includes: comprehensive trademark search, professional application preparation by experienced attorneys, USPTO filing in one trademark class, client portal access, ongoing support throughout the 8-12 month registration process, priority filing with expedited processing, and Amazon Brand Registry enrollment guide. USPTO filing fees ($350 per class) are additional. Total for one class: $849."
  },
  {
    question: "How much does trademark registration cost?",
    answer: "Our attorney fee is $499. USPTO filing fees ($350 per class) are additional. Total for one class: $849. We also offer additional services including cease and desist letters ($499), procedural office action responses ($399), and substantive office action responses ($799)."
  },
  {
    question: "What is a trademark class and how do I choose one?",
    answer: "The USPTO organizes goods and services into 45 trademark classes (Classes 1-34 for goods, Classes 35-45 for services). Your trademark must be registered in each class where you use or plan to use your mark. For example, if you sell clothing and also provide retail services, you would need two classes. Our attorneys help you identify the correct classes during the application process to ensure proper protection."
  },
  {
    question: "What happens if someone opposes my trademark application?",
    answer: "During the 30-day publication period, any party who believes they may be harmed by your trademark registration can file an opposition. If this happens, our attorneys will work with you to respond to the opposition. While opposition proceedings require additional legal work beyond our standard service, we provide experienced representation and strategic guidance to protect your rights and achieve successful registration."
  },
  {
    question: "Can I trademark a name that's already in use?",
    answer: "It depends on several factors including how similar the marks are, whether they're used in related industries, and the likelihood of customer confusion. This is why our comprehensive trademark search is so important - it identifies potential conflicts before you invest in registration. If a similar mark exists, our attorneys can advise on whether your application is likely to succeed or if modifications might be needed."
  },
  {
    question: "Do I need to trademark my business name and logo separately?",
    answer: "Yes, if you want protection for both. A word mark protects your business name in any font or style, while a design mark protects your specific logo design. Many businesses register both to ensure comprehensive protection. We can help you determine the best filing strategy based on your branding and budget, and offer multi-mark discounts for registering multiple trademarks."
  },
  {
    question: "What's the difference between TM and ® symbols?",
    answer: "The TM symbol can be used immediately to indicate you're claiming trademark rights, even without registration. The ® symbol can only be used after your trademark is officially registered with the USPTO. Using ® before registration is illegal and can result in penalties. Once your registration is complete, you should use ® to put others on notice of your federal registration and maximize your legal protections."
  },
  {
    question: "How long does trademark protection last?",
    answer: "Federal trademark registration lasts 10 years and can be renewed indefinitely as long as you continue using the mark in commerce. You must file a Declaration of Use between years 5-6 to maintain your registration, then renew every 10 years. As long as you continue to use your trademark and maintain your registration, your protection can last forever. We offer monitoring services to help you track important deadlines."
  }
];

export const pricingFAQs: FAQ[] = [
  {
    question: "What's included in the trademark registration service?",
    answer: "Our comprehensive $499 trademark registration package includes: comprehensive trademark search and legal analysis, professional application preparation by experienced attorneys, USPTO filing in one trademark class, client portal access, full support throughout the 8-12 month registration process, priority filing with expedited processing, and Amazon Brand Registry enrollment guide. USPTO filing fees ($350 per class) are additional. Total for one class: $849."
  },
  {
    question: "What if I need to register in multiple classes?",
    answer: "Each USPTO trademark application covers one class of goods or services. If your business operates in multiple categories, you'll need to register in multiple classes. Our attorney fee is $499 per application, and each additional class requires an additional USPTO filing fee of $350. Our attorneys will help you identify all relevant classes during the consultation to ensure complete protection for your brand."
  },
  {
    question: "Do I have to pay upfront?",
    answer: "We require payment before filing your trademark application with the USPTO. This covers both our attorney fees ($499) and the USPTO filing fees ($350 per class). Once paid, we begin work on your application immediately."
  },
  {
    question: "What happens if my trademark application receives an office action?",
    answer: "If the USPTO issues an office action (objection), our attorneys will review it and determine the appropriate response strategy. Procedural office actions (technical issues like classification corrections) are handled for $399. Substantive office actions (complex legal arguments about registrability) are $799. These fees are only charged if needed. Our attorneys have a high success rate in overcoming office actions through persuasive legal arguments and evidence."
  }
];

export const processFAQs: FAQ[] = [
  {
    question: "How quickly can you file my trademark application?",
    answer: "Once you provide all necessary information and approve the application, we typically file with the USPTO within 1-2 business days. Our streamlined process ensures accuracy while moving quickly. The sooner you file, the sooner you establish your filing date, which is crucial for priority rights."
  },
  {
    question: "Will I be able to review the application before filing?",
    answer: "Absolutely. Before filing with the USPTO, we'll send you a complete draft of your trademark application for review and approval. This gives you the opportunity to verify all information is accurate and that you're comfortable with how your mark is represented. We don't file anything without your explicit approval."
  },
  {
    question: "What information do I need to provide?",
    answer: "We'll need basic information about your business, the trademark you want to register (name, logo, or both), a description of your goods or services, when you first used the mark in commerce, and a specimen showing how you use the mark. Our intake process is simple and we guide you through everything needed for a complete application."
  },
  {
    question: "Can I make changes after filing?",
    answer: "Minor changes are possible, but significant changes to the mark itself cannot be made after filing - you would need to file a new application. However, you can amend your description of goods/services and other application details in response to USPTO office actions. This is why our thorough review process before filing is so important."
  }
];

export const amazonBrandRegistryFAQs: FAQ[] = [
  {
    question: "Can I enroll in Amazon Brand Registry with a pending trademark application?",
    answer: "Yes! Amazon Brand Registry accepts trademark applications that have been filed with the USPTO and are pending. You don't need to wait for full registration. Once we file your application, you'll receive your USPTO serial number and can begin the Brand Registry enrollment process immediately. This allows you to access Brand Registry protections months before your trademark is fully registered."
  },
  {
    question: "How long does it take to get my trademark filed so I can enroll in Brand Registry?",
    answer: "With our Amazon Brand Registry Package, your application is filed within 1-2 business days. Once filed, you'll receive your USPTO serial number which you can use to start your Brand Registry enrollment. The filing happens first, then you can begin enrollment while your trademark is pending with the USPTO."
  },
  {
    question: "What benefits does Amazon Brand Registry provide?",
    answer: "Amazon Brand Registry provides powerful brand protection tools including: enhanced content capabilities (A+ Content), increased control over product listings, powerful search and reporting tools to find and report violations, predictive automation that helps remove suspected infringing or inaccurate content, and eligibility for Amazon's Transparency program to prevent counterfeit products."
  },
  {
    question: "Do I need a registered trademark or can I use a pending application?",
    answer: "Amazon accepts pending trademark applications for Brand Registry enrollment. You don't need to wait for full registration, which typically takes 8-12 months. As soon as we file your application with the USPTO and you receive your serial number, you can begin enrolling in Brand Registry. This allows you to access critical brand protection tools immediately."
  },
  {
    question: "Does your trademark registration work for Amazon Brand Registry?",
    answer: "Yes! Our $499 trademark registration package is designed to work seamlessly with Amazon Brand Registry. It includes: Amazon Brand Registry enrollment guide with step-by-step instructions, priority filing with expedited processing to get you enrolled faster, and Amazon-specific documentation support to ensure smooth enrollment. This package streamlines the entire process for sellers who want to access Brand Registry protection quickly."
  },
  {
    question: "What if my trademark application is refused by the USPTO?",
    answer: "Our comprehensive trademark search significantly reduces the risk of refusal. If the USPTO issues an office action, our experienced attorneys will work with you to respond appropriately. While we can't guarantee approval (no attorney can), we have a high success rate in overcoming office actions. Note that Amazon Brand Registry enrollment continues as long as your application is pending, even if you're responding to an office action."
  },
  {
    question: "Can I register my brand name, logo, or both for Amazon Brand Registry?",
    answer: "Amazon Brand Registry accepts both word marks (text-based trademarks) and design marks (logos). Most sellers register their brand name as a word mark, which provides the broadest protection. If you also have a distinctive logo, you can register both separately. Our attorneys will help you determine the best filing strategy based on your branding and Amazon selling needs."
  }
];

export const officeActionFAQs: FAQ[] = [
  {
    question: "What is a trademark office action?",
    answer: "An office action is an official letter from a USPTO examining attorney identifying issues with your trademark application that must be resolved before registration can proceed. About 40-50% of applications receive at least one office action. Office actions can address procedural issues (like incorrect specimens) or substantive legal issues (like likelihood of confusion with existing marks)."
  },
  {
    question: "What's the difference between procedural and substantive office actions?",
    answer: "Procedural office actions address technical or administrative issues such as specimen problems, classification errors, or unclear descriptions of goods/services. These are generally easier to resolve. Substantive office actions raise legal issues about whether your mark is registrable, such as likelihood of confusion with existing marks, descriptiveness, or genericness. These require detailed legal arguments and evidence, and are more complex to overcome."
  },
  {
    question: "How much time do I have to respond to an office action?",
    answer: "You have six months from the issue date to respond to an office action. However, we strongly recommend responding as quickly as possible. The sooner you respond with a complete, persuasive argument, the sooner the examining attorney can review it and move your application forward. Waiting until the deadline can delay your registration by months."
  },
  {
    question: "What happens if I don't respond to an office action?",
    answer: "If you don't respond within the six-month deadline, your application will be abandoned. You would lose your filing date and all the time and money invested in the application. If you want to proceed after abandonment, you must file a new application with a new filing date, losing your priority over anyone who filed after your original application."
  },
  {
    question: "Can you guarantee my office action response will be successful?",
    answer: "No attorney can guarantee success with an office action response, as the final decision rests with the USPTO examining attorney. However, our experienced trademark attorneys have a high success rate in overcoming office actions through persuasive legal arguments, supporting evidence, and strategic amendments. We thoroughly analyze each office action and develop the strongest possible response strategy."
  },
  {
    question: "What's included in your office action response service?",
    answer: "Our office action response service includes: comprehensive analysis of the examining attorney's objections, research of applicable trademark law and precedent cases, strategic recommendations for overcoming the refusal, drafting of persuasive legal arguments and supporting evidence, amendments to your application if beneficial, and filing of the complete response with the USPTO. We handle all aspects of responding to give your application the best chance of success."
  }
];

export const trademarkMonitoringFAQs: FAQ[] = [
  {
    question: "Why do I need trademark monitoring?",
    answer: "Trademark monitoring protects your registered trademark by alerting you to potential infringement and conflicting applications. The USPTO doesn't notify you when someone files a similar mark, and competitors or infringers may use your mark without your knowledge. Regular monitoring allows you to identify and address these issues early, before they become costly legal problems or damage your brand."
  },
  {
    question: "What does your trademark monitoring service include?",
    answer: "Our comprehensive monitoring service includes: regular surveillance of new USPTO trademark applications for marks similar to yours, monitoring of federal trademark registrations, analysis of potential conflicts and likelihood of confusion, instant email alerts when similar marks are detected, detailed reports on flagged applications with our legal analysis, and recommendations for enforcement action when necessary. We monitor continuously and provide quarterly summary reports."
  },
  {
    question: "How often will I receive monitoring reports?",
    answer: "You'll receive instant email alerts whenever we detect a potentially conflicting trademark application or use. These real-time notifications allow you to take timely action. In addition, you'll receive comprehensive quarterly reports summarizing all monitoring activity, flagged marks, and the status of any concerns. This ensures you stay informed about all potential threats to your trademark."
  },
  {
    question: "What happens if a conflicting trademark is found?",
    answer: "When our monitoring service identifies a potentially conflicting mark, we immediately alert you with a detailed analysis of the conflict, including likelihood of confusion assessment and recommended actions. If opposition or enforcement action is warranted, we can help you file an opposition with the USPTO (during the 30-day publication period) or send cease and desist letters to infringers. Quick action is crucial to protect your rights."
  },
  {
    question: "Does trademark monitoring include watching for infringement on Amazon, social media, or websites?",
    answer: "Our core monitoring service focuses on USPTO trademark applications and registrations. This catches potential legal conflicts before they become registered trademarks. For broader marketplace and online monitoring (Amazon, social media, domain names, websites), we can provide custom monitoring solutions. Contact us to discuss comprehensive brand protection that includes both trademark office monitoring and marketplace surveillance."
  },
  {
    question: "When should I start trademark monitoring?",
    answer: "We recommend starting monitoring as soon as your trademark is registered, though monitoring can begin while your application is pending. Early monitoring helps you identify and address conflicts quickly, making enforcement easier and less expensive. Our trademark monitoring service ($149/year) provides comprehensive protection to help ensure your brand stays secure."
  }
];

export const ceaseAndDesistFAQs: FAQ[] = [
  {
    question: "When should I send a cease and desist letter?",
    answer: "Send a cease and desist letter when you discover someone using your trademark (or a confusingly similar mark) without permission. This includes unauthorized use on products, services, websites, social media, advertising, or domain names. A cease and desist letter is often the first and most cost-effective step in trademark enforcement, allowing you to resolve the issue without expensive litigation."
  },
  {
    question: "What's included in your cease and desist letter service?",
    answer: "Our $749 cease and desist letter service includes: analysis of your trademark rights and the infringement, research to identify the infringer and gather evidence, drafting of a professional attorney letter documenting your rights and the infringement, specific demands for action with reasonable deadlines, explanation of legal consequences and potential damages, professional delivery via certified mail or email, and follow-up communication if the infringer responds. We handle the entire process strategically and professionally."
  },
  {
    question: "Will a cease and desist letter definitely stop the infringement?",
    answer: "While most cease and desist letters successfully resolve trademark disputes (many infringers stop once they receive an attorney letter), we can't guarantee results. Some infringers may ignore the letter, dispute your rights, or refuse to stop. However, a well-drafted attorney letter significantly increases the likelihood of compliance and creates an important record if legal action becomes necessary. It demonstrates that you're serious about protecting your trademark."
  },
  {
    question: "What if the infringer doesn't respond or refuses to stop?",
    answer: "If the infringer doesn't respond or refuses to comply, you have several options: send a follow-up letter with stronger language, file a complaint with the platform where the infringement is occurring (like Amazon, Etsy, or social media), or pursue legal action such as a lawsuit or filing a dispute resolution proceeding. We can advise on the best next steps based on the specific situation and help you escalate enforcement as needed."
  },
  {
    question: "Do I need a registered trademark to send a cease and desist letter?",
    answer: "No, you can send a cease and desist letter based on common law trademark rights (rights you acquire through use of a mark in commerce) even without federal registration. However, a federal trademark registration significantly strengthens your position, provides legal presumptions of ownership and validity, and makes enforcement easier and more effective. Registration gives you the strongest foundation for enforcement."
  },
  {
    question: "How quickly can you send a cease and desist letter?",
    answer: "Once you provide the necessary information about your trademark and the infringement, we typically draft and send cease and desist letters within 3-5 business days. For urgent situations (such as ongoing financial damage or imminent product launches), we can expedite the process. Quick action is often important in trademark enforcement to stop the damage and demonstrate your commitment to protecting your rights."
  }
];
