import { useEffect } from 'react';

interface SchemaMarkupProps {
  schema: object | object[];
}

export default function SchemaMarkup({ schema }: SchemaMarkupProps) {
  useEffect(() => {
    const schemaArray = Array.isArray(schema) ? schema : [schema];
    const scriptIds: string[] = [];

    schemaArray.forEach((schemaItem, index) => {
      const scriptId = `schema-${Date.now()}-${index}`;
      scriptIds.push(scriptId);

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = scriptId;
      script.text = JSON.stringify(schemaItem);
      document.head.appendChild(script);
    });

    return () => {
      scriptIds.forEach(id => {
        const script = document.getElementById(id);
        if (script) {
          document.head.removeChild(script);
        }
      });
    };
  }, [schema]);

  return null;
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "LegalService",
  "@id": "https://marqtrademarks.com/#organization",
  "name": "Marq Legal LLC - Trademark Registration Services",
  "alternateName": "Marq Trademark Services",
  "description": "Professional trademark registration and intellectual property protection services. Expert attorneys providing flat-fee trademark registration, comprehensive searches, office action responses, and monitoring services across all 50 states. Trusted by businesses nationwide for federal USPTO trademark filing.",
  "url": "https://marqtrademarks.com",
  "logo": {
    "@type": "ImageObject",
    "url": "https://marqtrademarks.com/logo.png",
    "width": 600,
    "height": 60,
    "caption": "Marq Legal LLC Logo"
  },
  "image": "https://marqtrademarks.com/logo.png",
  "sameAs": [
    "https://www.linkedin.com/company/marqlegal",
    "https://twitter.com/marqlegal",
    "https://www.facebook.com/marqlegal"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US",
    "addressRegion": "Nationwide"
  },
  "areaServed": [
    {
      "@type": "Country",
      "name": "United States"
    },
    {
      "@type": "State",
      "name": "All 50 States"
    }
  ],
  "priceRange": "$49 - $1,500",
  "telephone": "+1-555-TRADEMARK",
  "email": "contact@marqtrademarks.com",
  "serviceType": [
    "Trademark Registration",
    "Trademark Search",
    "Office Action Response",
    "Trademark Monitoring",
    "Cease and Desist Letters",
    "Intellectual Property Protection",
    "USPTO Filing Services",
    "Brand Protection"
  ],
  "knowsAbout": [
    "Trademark Law",
    "Intellectual Property Law",
    "USPTO Procedures",
    "Brand Protection",
    "Trademark Enforcement",
    "Federal Trademark Registration"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  }
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://marqtrademarks.com/#website",
  "url": "https://marqtrademarks.com",
  "name": "Marq Legal LLC - Professional Trademark Registration Services",
  "description": "Professional trademark registration services with transparent pricing. Protect your brand with expert attorneys. Federal USPTO trademark filing, comprehensive searches, and ongoing monitoring.",
  "publisher": {
    "@id": "https://marqtrademarks.com/#organization"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://marqtrademarks.com/resources?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  },
  "inLanguage": "en-US"
};

export const professionalServiceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Marq Legal LLC Trademark Registration",
  "description": "Expert trademark registration and intellectual property protection services with transparent pricing.",
  "url": "https://marqtrademarks.com",
  "logo": "https://marqtrademarks.com/logo.png",
  "image": "https://marqtrademarks.com/logo.png",
  "telephone": "+1-555-TRADEMARK",
  "email": "contact@marqtrademarks.com",
  "priceRange": "$49 - $1,500",
  "paymentAccepted": "Credit Card, Debit Card, ACH Transfer",
  "currenciesAccepted": "USD",
  "openingHours": "Mo-Fr 09:00-17:00",
  "areaServed": "United States"
};

export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const serviceSchema = (service: {
  name: string;
  description: string;
  price: string;
  url: string;
  features?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": service.name,
  "provider": {
    "@id": "https://marqtrademarks.com/#organization"
  },
  "name": service.name,
  "description": service.description,
  "url": service.url,
  "category": "Legal Services",
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": service.name,
    "itemListElement": [{
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": service.name,
        "description": service.description
      }
    }]
  },
  "offers": {
    "@type": "Offer",
    "price": service.price.replace(/[^0-9]/g, ''),
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    "url": service.url,
    "seller": {
      "@id": "https://marqtrademarks.com/#organization"
    }
  },
  "termsOfService": "https://marqtrademarks.com/terms",
  "brand": {
    "@id": "https://marqtrademarks.com/#organization"
  }
});

export const articleSchema = (article: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  tags?: string[];
  wordCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.headline,
  "description": article.description,
  "author": {
    "@type": "Person",
    "name": article.author,
    "url": "https://marqtrademarks.com/about"
  },
  "publisher": {
    "@id": "https://marqtrademarks.com/#organization"
  },
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  },
  "image": {
    "@type": "ImageObject",
    "url": article.image || "https://marqtrademarks.com/logo.png",
    "width": 1200,
    "height": 630
  },
  "keywords": article.tags?.join(", "),
  "articleSection": "Trademark Law",
  "inLanguage": "en-US",
  "wordCount": article.wordCount,
  "about": {
    "@type": "Thing",
    "name": "Trademark Law"
  }
});

export const blogPostingSchema = (post: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  url: string;
  tags?: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": post.headline,
  "description": post.description,
  "author": {
    "@type": "Person",
    "name": post.author,
    "url": "https://marqtrademarks.com/about"
  },
  "publisher": {
    "@id": "https://marqtrademarks.com/#organization"
  },
  "datePublished": post.datePublished,
  "dateModified": post.dateModified || post.datePublished,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": post.url
  },
  "image": {
    "@type": "ImageObject",
    "url": post.image || "https://marqtrademarks.com/logo.png",
    "width": 1200,
    "height": 630
  },
  "keywords": post.tags?.join(", "),
  "articleSection": "Trademark Law",
  "inLanguage": "en-US",
  "isPartOf": {
    "@type": "Blog",
    "@id": "https://marqtrademarks.com/blog"
  }
});

export const faqSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const howToSchema = (howTo: {
  name: string;
  description: string;
  steps: { name: string; text: string; image?: string }[];
  totalTime?: string;
  estimatedCost?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": howTo.name,
  "description": howTo.description,
  "totalTime": howTo.totalTime || "P8M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": howTo.estimatedCost || "1250"
  },
  "step": howTo.steps.map((step, index) => ({
    "@type": "HowToStep",
    "position": index + 1,
    "name": step.name,
    "text": step.text,
    "url": `https://marqtrademarks.com/process#step-${index + 1}`,
    "image": step.image
  })),
  "tool": [{
    "@type": "HowToTool",
    "name": "USPTO Account"
  }],
  "supply": [{
    "@type": "HowToSupply",
    "name": "Trademark Information"
  }]
});

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Attorney",
  "name": "Marq Legal LLC Trademark Services",
  "image": "https://marqtrademarks.com/logo.png",
  "@id": "https://marqtrademarks.com/#attorney",
  "url": "https://marqtrademarks.com",
  "telephone": "+1-555-TRADEMARK",
  "email": "contact@marqtrademarks.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US",
    "addressRegion": "Nationwide"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 38.8977,
    "longitude": -77.0365
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday"
    ],
    "opens": "09:00",
    "closes": "17:00"
  },
  "priceRange": "$49 - $1,500",
  "areaServed": "United States"
};

export const offerCatalogSchema = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "name": "Marq Legal LLC Trademark Services",
  "itemListElement": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Trademark Search",
        "description": "Comprehensive trademark availability search"
      },
      "price": "49",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Trademark Registration",
        "description": "Professional trademark registration service plus USPTO filing fees"
      },
      "price": "899",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Cease and Desist Letter",
        "description": "Attorney-drafted cease and desist letter"
      },
      "price": "749",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Procedural Office Action",
        "description": "Expert response to procedural office actions"
      },
      "price": "499",
      "priceCurrency": "USD"
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Substantive Office Action",
        "description": "Expert response to substantive office actions"
      },
      "price": "999",
      "priceCurrency": "USD"
    }
  ]
};

export const definedTermSchema = (term: {
  name: string;
  description: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "DefinedTerm",
  "name": term.name,
  "description": term.description,
  "url": term.url,
  "inDefinedTermSet": {
    "@type": "DefinedTermSet",
    "name": "Trademark Law Glossary",
    "url": "https://marqtrademarks.com/resources"
  }
});
