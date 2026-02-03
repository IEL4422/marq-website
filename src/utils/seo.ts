export interface SEOConfig {
  title: string;
  description: string;
  canonical?: string;
  ogType?: string;
  keywords?: string;
  author?: string;
  ogImage?: string;
  twitterCard?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
}

export const updatePageSEO = (config: SEOConfig) => {
  document.title = config.title;

  updateMetaTag('name', 'description', config.description);

  if (config.keywords) {
    updateMetaTag('name', 'keywords', config.keywords);
  }

  if (config.author) {
    updateMetaTag('name', 'author', config.author);
  }

  updateMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
  updateMetaTag('name', 'googlebot', 'index, follow');

  if (config.canonical) {
    updateLinkTag('canonical', config.canonical);
  }

  updateMetaTag('property', 'og:site_name', 'Marq');
  updateMetaTag('property', 'og:title', config.title);
  updateMetaTag('property', 'og:description', config.description);
  updateMetaTag('property', 'og:type', config.ogType || 'website');
  updateMetaTag('property', 'og:locale', 'en_US');

  const ogImage = config.ogImage || 'https://marqtrademarks.com/logo.png';
  updateMetaTag('property', 'og:image', ogImage);
  updateMetaTag('property', 'og:image:width', '1200');
  updateMetaTag('property', 'og:image:height', '630');
  updateMetaTag('property', 'og:image:alt', 'Marq - Professional Trademark Services');

  if (config.canonical) {
    updateMetaTag('property', 'og:url', config.canonical);
  }

  if (config.publishedTime) {
    updateMetaTag('property', 'article:published_time', config.publishedTime);
  }

  if (config.modifiedTime) {
    updateMetaTag('property', 'article:modified_time', config.modifiedTime);
  }

  if (config.articleSection) {
    updateMetaTag('property', 'article:section', config.articleSection);
  }

  if (config.articleTags) {
    config.articleTags.forEach((tag, index) => {
      updateMetaTag('property', `article:tag`, tag);
    });
  }

  const twitterCard = config.twitterCard || 'summary_large_image';
  updateMetaTag('name', 'twitter:card', twitterCard);
  updateMetaTag('name', 'twitter:site', '@MarqLegal');
  updateMetaTag('name', 'twitter:creator', '@MarqLegal');
  updateMetaTag('name', 'twitter:title', config.title);
  updateMetaTag('name', 'twitter:description', config.description);
  updateMetaTag('name', 'twitter:image', ogImage);
  updateMetaTag('name', 'twitter:image:alt', 'Marq - Professional Trademark Services');

  updateMetaTag('name', 'application-name', 'Marq');
  updateMetaTag('name', 'apple-mobile-web-app-title', 'Marq');
  updateMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
  updateMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'default');
  updateMetaTag('name', 'format-detection', 'telephone=no');
  updateMetaTag('name', 'theme-color', '#f59e0b');
};

const updateMetaTag = (attribute: string, key: string, content: string) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.href = href;
};

export const defaultSEO: SEOConfig = {
  title: 'Trademark Registration Services | Federal USPTO Filing | Marq',
  description: 'Professional trademark registration with expert attorneys. Transparent pricing, comprehensive searches, and full USPTO support. Protect your brand nationwide with our complete package at $499.',
  canonical: 'https://marqtrademarks.com',
  keywords: 'trademark registration, federal trademark, USPTO filing, trademark attorney, register trademark, brand protection',
  author: 'Marq'
};

export const pageSEO: Record<string, SEOConfig> = {
  home: defaultSEO,
  pricing: {
    title: 'Trademark Registration Pricing | Transparent Flat Fees | Marq',
    description: 'Clear trademark pricing with no hidden fees. Affordable flat-fee trademark registration, office action responses, and cease and desist letters. Free DIY search or $49 professional attorney search. Expert attorneys for all services. Get started today.',
    canonical: 'https://marqtrademarks.com/pricing',
    keywords: 'trademark search, trademark registration cost, trademark pricing, USPTO filing fees, trademark attorney fees, affordable trademark services, flat fee trademark',
    author: 'Marq'
  },
  about: {
    title: 'About Marq | Expert Trademark Attorneys | Professional Brand Protection Services',
    description: 'Learn about Marq and our mission to provide accessible, professional trademark protection. Our experienced trademark attorneys deliver expert legal services across all 50 states with transparent pricing. Trusted by businesses nationwide for federal trademark registration.',
    canonical: 'https://marqtrademarks.com/about',
    keywords: 'trademark attorneys, intellectual property lawyers, trademark law firm, USPTO attorneys, brand protection lawyers, trademark legal services',
    author: 'Marq'
  },
  resources: {
    title: 'Free Trademark Resources & Comprehensive Guides | Legal Education | Marq',
    description: 'Access free trademark resources, comprehensive guides, and expert educational content. Learn about trademark registration, USPTO processes, intellectual property protection, brand strategy, trademark law basics, and how to protect your business name and logo.',
    canonical: 'https://marqtrademarks.com/resources',
    keywords: 'trademark guide, trademark resources, trademark education, intellectual property guide, USPTO resources, trademark FAQ, trademark glossary, how to register trademark',
    author: 'Marq'
  },
  blog: {
    title: 'Trademark Law Blog | Expert Legal Insights & USPTO News | Marq',
    description: 'Latest trademark law insights, USPTO updates, brand protection strategies, and intellectual property news. Expert legal analysis and practical advice from experienced trademark attorneys. Stay informed about trademark registration, enforcement, and IP trends.',
    canonical: 'https://marqtrademarks.com/blog',
    keywords: 'trademark law blog, trademark news, USPTO updates, intellectual property blog, brand protection, trademark tips, IP law news',
    author: 'Marq'
  },
  'trademark-registration': {
    title: 'Professional Trademark Registration | Expert Attorneys | Marq',
    description: 'Professional federal trademark registration with affordable flat-fee pricing. Includes FREE comprehensive trademark search, expert attorney preparation, USPTO filing, and ongoing support. Protect your brand nationwide with transparent pricing and proven legal expertise.',
    canonical: 'https://marqtrademarks.com/trademark-registration',
    keywords: 'trademark registration cost, USPTO filing price, affordable trademark, register trademark, brand protection pricing, file trademark cost',
    author: 'Marq'
  },
  'trademark-search': {
    title: 'Trademark Search Options | DIY or Professional Attorney Search | Marq',
    description: 'Choose from free DIY trademark search or $49 professional attorney search. DIY search provides instant results, attorney search includes comprehensive analysis delivered in 24 hours. Includes federal USPTO database, state registrations, and detailed conflict assessment.',
    canonical: 'https://marqtrademarks.com/trademark-search',
    keywords: 'trademark search, trademark availability, USPTO search, trademark conflict report, trademark clearance, comprehensive trademark search, attorney trademark search',
    author: 'Marq'
  },
  'trademark-search-request': {
    title: 'Professional Attorney Trademark Search | $49 | Results in 24 Hours',
    description: 'Get a professional trademark search by experienced attorneys for $49. Comprehensive federal and state database analysis delivered in 24 hours with professional recommendations and conflict assessment. Quality legal review at an affordable price.',
    canonical: 'https://marqtrademarks.com/trademark-search-request',
    keywords: 'attorney trademark search, professional trademark search, trademark availability check, USPTO search, comprehensive trademark search',
    author: 'Marq'
  },
  'office-action': {
    title: 'USPTO Office Action Response Services | Expert Legal Replies | Marq',
    description: 'Expert trademark office action response services from experienced USPTO attorneys. We craft persuasive legal arguments and evidence for both procedural and substantive office actions. Maximize your chances of trademark approval with professional legal representation.',
    canonical: 'https://marqtrademarks.com/office-action',
    keywords: 'office action response, USPTO office action, trademark office action, substantive office action, procedural office action, trademark refusal response',
    author: 'Marq'
  },
  'trademark-monitoring': {
    title: 'Trademark Monitoring Services | Proactive Brand Protection | Marq',
    description: 'Comprehensive trademark monitoring and watch services to protect your brand. Receive instant alerts on conflicting USPTO applications and unauthorized trademark use. Proactive brand protection with regular reports and enforcement recommendations from expert attorneys.',
    canonical: 'https://marqtrademarks.com/trademark-monitoring',
    keywords: 'trademark monitoring, trademark watch, brand monitoring, trademark protection, trademark surveillance, USPTO watch service',
    author: 'Marq'
  },
  'cease-and-desist': {
    title: 'Trademark Cease and Desist Letters | Professional Legal Enforcement | Marq',
    description: 'Professional cease and desist letter services for trademark infringement. Attorney-drafted legal notices to stop unauthorized use of your trademark. Effective brand protection and enforcement with expert legal representation.',
    canonical: 'https://marqtrademarks.com/cease-and-desist',
    keywords: 'cease and desist letter, trademark infringement, trademark enforcement, stop trademark infringement, trademark violation letter',
    author: 'Marq'
  },
  process: {
    title: 'Trademark Registration Process | Complete Step-by-Step Guide | Marq',
    description: 'Detailed guide to our trademark registration process from start to finish. From initial consultation and comprehensive search through federal USPTO application filing and final registration. Learn how we protect your brand at every step with transparent communication and expert legal guidance.',
    canonical: 'https://marqtrademarks.com/process',
    keywords: 'trademark registration process, trademark filing process, USPTO application process, how to register trademark, trademark steps',
    author: 'Marq'
  },
  contact: {
    title: 'Contact Marq | Speak with Trademark Attorneys | Free Consultation',
    description: 'Get in touch with our experienced trademark attorneys for a free consultation. We\'re here to help with trademark registration, brand protection, USPTO filing, office actions, and all your intellectual property legal needs. Available nationwide in all 50 states.',
    canonical: 'https://marqtrademarks.com/contact',
    keywords: 'contact trademark attorney, trademark consultation, trademark questions, trademark legal help, speak with trademark lawyer, free trademark consultation',
    author: 'Marq'
  },
  'business-name-generator': {
    title: 'Free Business Name Generator | Check Trademark Availability | Marq',
    description: 'Generate unique, memorable business names instantly with our free business name generator. Create professional brand names and check trademark availability. Perfect for startups and entrepreneurs looking for the ideal business name.',
    canonical: 'https://marqtrademarks.com/business-name-generator',
    keywords: 'business name generator, company name generator, brand name generator, free business name ideas, trademark name generator, startup name generator, business name ideas',
    author: 'Marq'
  },
  amazon: {
    title: 'Amazon Brand Registry Trademark Registration | Fast Federal Trademark for Sellers | Marq Legal',
    description: 'Get your federal trademark for Amazon Brand Registry. Protect your brand, access enhanced content, and stop hijackers. Expert trademark registration starting at $499 with fast turnaround for Amazon sellers.',
    canonical: 'https://marqtrademarks.com/amazon',
    keywords: 'amazon brand registry, amazon trademark, amazon seller trademark, federal trademark amazon, brand registry trademark, amazon brand protection, trademark for amazon sellers',
    author: 'Marq'
  },
  'diy-search': {
    title: 'Free DIY Trademark Search | Instant USPTO Database Results',
    description: 'Search the USPTO trademark database for free. Instant results with comprehensive federal and state trademark records. Check trademark availability before filing.',
    canonical: 'https://marqtrademarks.com/diy-search',
    keywords: 'free trademark search, DIY trademark search, USPTO database search, trademark availability check',
    author: 'Marq'
  },
  'trademark-search-form': {
    title: 'Professional Trademark Search Form | Request Attorney Review',
    description: 'Submit your trademark search request. Our attorneys will conduct a comprehensive search and deliver results in 24 hours.',
    canonical: 'https://marqtrademarks.com/trademark-search-form',
    keywords: 'trademark search form, request trademark search, attorney trademark search',
    author: 'Marq'
  },
  'get-started': {
    title: 'Start Your Trademark Application | Professional Filing | Marq',
    description: 'Begin your trademark registration journey. Complete our quick questionnaire and get expert legal support for federal trademark protection.',
    canonical: 'https://marqtrademarks.com/get-started',
    keywords: 'trademark application form, start trademark registration, apply for trademark, file trademark',
    author: 'Marq'
  },
  'select-package': {
    title: 'Choose Your Trademark Package | Registration Options | Marq',
    description: 'Select the trademark registration package that fits your needs. From basic filing to premium protection with monitoring. Transparent pricing and expert support.',
    canonical: 'https://marqtrademarks.com/select-package',
    keywords: 'trademark packages, trademark registration options, trademark service packages',
    author: 'Marq'
  },
  'add-ons': {
    title: 'Select Add-On Services | Trademark Registration | Marq',
    description: 'Enhance your trademark package with additional services like monitoring, priority filing, and office action protection.',
    canonical: 'https://marqtrademarks.com/add-ons',
    author: 'Marq'
  },
  'terms-of-service': {
    title: 'Terms of Service | Legal Terms & Conditions | Marq',
    description: 'Terms of service for Marq trademark registration services. Review our legal terms, conditions, and service agreements.',
    canonical: 'https://marqtrademarks.com/terms-of-service',
    author: 'Marq Legal Team'
  },
  'privacy-policy': {
    title: 'Privacy Policy | Data Protection & Security | Marq',
    description: 'Marq privacy policy. Learn how we protect your personal information, data security practices, and compliance with privacy regulations.',
    canonical: 'https://marqtrademarks.com/privacy-policy',
    author: 'Marq Legal Team'
  }
};

export const updateNoIndexPage = (title: string, description: string) => {
  document.title = title;

  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'robots', 'noindex, nofollow');
};
