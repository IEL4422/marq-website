import { useEffect } from 'react';
import { Mail, MapPin, Phone, Clock, ChevronDown } from 'lucide-react';
import ContactForm from '../components/ContactForm';
import { updatePageSEO } from '../utils/seo';
import SchemaMarkup, {
  organizationSchema,
  localBusinessSchema,
} from '../components/SchemaMarkup';
import { useState } from 'react';

// ── FAQ data ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: 'How long does trademark registration take?',
    a: 'The USPTO process typically takes 8–14 months from filing to registration, depending on whether any office actions are issued. We keep you informed at every step.',
  },
  {
    q: 'What is the cost to file a trademark?',
    a: 'Government filing fees start at $250–$350 per class of goods/services. Our flat-rate packages cover attorney preparation, filing, and response to routine office actions.',
  },
  {
    q: 'Do I need a trademark attorney?',
    a: 'While you can file on your own, errors in the application often result in refusals and additional costs. Our attorneys maximize your chances of approval on the first attempt.',
  },
  {
    q: 'Can you help with trademark monitoring?',
    a: 'Yes. We offer ongoing monitoring services that alert you when a potentially conflicting mark is filed, so you can act quickly to protect your brand.',
  },
];

// ── Accordion item ───────────────────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start justify-between gap-3 py-4 text-left group"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-slate-800 group-hover:text-navy-900 transition-colors">
          {q}
        </span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 mt-0.5 text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-slate-500 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

// ── Contact info row ─────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gold-600" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

// ── Page ────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  useEffect(() => {
    updatePageSEO({
      title: 'Contact Us | Get in Touch | Marq Legal',
      description:
        "Get in touch with our trademark attorneys. We're here to help with your trademark registration, monitoring, and legal needs.",
      canonical: 'https://marqtrademarks.com/contact',
      keywords:
        'contact trademark attorney, trademark consultation, trademark questions, trademark legal help',
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <SchemaMarkup schema={[organizationSchema, localBusinessSchema]} />

      {/* ── Hero ── */}
      <section className="bg-navy-900 pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
            Contact Us
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
            Let's Talk About{' '}
            <span className="text-gold-400">Your Brand</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Whether you're ready to register, have a question, or need help
            defending your mark — our attorneys are here.
          </p>
        </div>
      </section>

      {/* ── Split layout ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14 items-start">

          {/* Left: Contact form (3 columns) */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-2">
                Send a Message
              </p>
              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                We respond within one business day
              </h2>
              <ContactForm />
            </div>
          </div>

          {/* Right: Info + Hours + FAQs (2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Contact information card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-4">
                Reach Us Directly
              </p>
              <div className="space-y-5">
                <InfoRow icon={Phone} label="Phone">
                  <a
                    href="tel:8778375950"
                    className="text-base font-semibold text-navy-900 hover:text-gold-600 transition-colors"
                  >
                    877-837-5950
                  </a>
                </InfoRow>

                <InfoRow icon={Mail} label="Email">
                  <a
                    href="mailto:contact@marqtrademarks.com"
                    className="text-sm text-slate-600 hover:text-gold-600 transition-colors break-all"
                  >
                    contact@marqtrademarks.com
                  </a>
                </InfoRow>

                <InfoRow icon={MapPin} label="Office">
                  <address className="text-sm text-slate-600 not-italic leading-relaxed">
                    980 N. Michigan Ave, Suite 1090
                    <br />
                    Chicago, Illinois 60611
                  </address>
                </InfoRow>
              </div>
            </div>

            {/* Office hours card */}
            <div className="bg-navy-900 rounded-2xl shadow-sm p-7">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="w-4 h-4 text-gold-400" />
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
                  Office Hours
                </p>
              </div>
              <ul className="space-y-2.5">
                <li className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Monday – Friday</span>
                  <span className="text-sm font-semibold text-white">
                    9:00 AM – 6:00 PM
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Saturday</span>
                  <span className="text-sm font-medium text-slate-400">
                    Closed
                  </span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Sunday</span>
                  <span className="text-sm font-medium text-slate-400">
                    Closed
                  </span>
                </li>
              </ul>
              <p className="mt-5 text-xs text-slate-500">
                All times are Central Standard Time (CST).
              </p>
            </div>

            {/* FAQs card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-1">
                FAQs
              </p>
              <h3 className="text-base font-bold text-navy-900 mb-4">
                Common Questions
              </h3>
              <div>
                {FAQS.map((faq) => (
                  <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
