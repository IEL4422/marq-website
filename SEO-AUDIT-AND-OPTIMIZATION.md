# Marq Website - Complete On-Page SEO Audit & Optimization Plan

## Executive Summary

This document provides a comprehensive on-page SEO audit and optimization plan for Marq (marqtrademarks.com), a U.S. trademark and brand protection service. The site currently has a solid SEO foundation with centralized metadata management through `src/utils/seo.ts`, but several pages lack optimized metadata and some URLs need strategic refinement.

**Key Findings:**
- ✅ Centralized SEO utility in place (`updatePageSEO` function)
- ✅ Strong schema markup implementation via `SchemaMarkup` component
- ❌ 12 pages missing from SEO configuration
- ❌ Some URLs not optimized for target keywords
- ⚠️ No canonical URLs for most pages
- ⚠️ Inconsistent H1 implementation across pages

---

## STEP 1: COMPLETE PAGE INVENTORY

### Indexable Pages (Total: 31)

| Page Name | Current URL | Has SEO Config | Has H1 | Has Schema | Status |
|-----------|-------------|----------------|--------|------------|--------|
| Landing Page | `/` | ✅ Yes | ✅ Yes | ✅ Yes | NEEDS UPDATE |
| Home Page | `/home` | ✅ Yes | ✅ Yes | ✅ Yes | NEEDS UPDATE |
| Pricing | `/pricing` | ✅ Yes | ✅ Yes | ⚠️ Partial | GOOD |
| About | `/about` | ✅ Yes | ✅ Yes | ⚠️ Partial | GOOD |
| Resources | `/resources` | ✅ Yes | ✅ Yes | ⚠️ Partial | GOOD |
| Blog Archive | `/blog` | ✅ Yes | ✅ Yes | ⚠️ Partial | GOOD |
| Blog Post | `/blog/:slug` | ⚠️ Dynamic | ✅ Yes | ✅ Yes | GOOD |
| Guide Page | `/resources/:slug` | ❌ No | ✅ Yes | ⚠️ Partial | NEEDS CONFIG |
| Process | `/process` | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| Contact | `/contact` | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| Trademark Registration | `/trademark-registration` | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| Trademark Search | `/trademark-search` | ✅ Yes | ⚠️ Check | ⚠️ Partial | NEEDS REVIEW |
| Trademark Search Choice | `/trademark-search-request` | ✅ Yes | ⚠️ Check | ❌ No | NEEDS UPDATE |
| DIY Search | `/diy-search` | ❌ No | ⚠️ Check | ❌ No | NEEDS CONFIG |
| Search Form | `/trademark-search-form` | ❌ No | ⚠️ Check | ❌ No | NEEDS CONFIG |
| Office Action | `/office-action` | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| Trademark Monitoring | `/trademark-monitoring` | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| Cease & Desist | `/cease-and-desist` | ✅ Yes | ✅ Yes | ✅ Yes | GOOD |
| Business Name Generator | `/business-name-generator` | ✅ Yes | ✅ Yes | ⚠️ Partial | GOOD |
| Amazon Landing | `/amazon` | ✅ Yes | ✅ Yes | ✅ Yes | EXCELLENT |
| Get Started | `/get-started` | ❌ No | ⚠️ Form | ❌ No | NEEDS CONFIG |
| Package Selection | `/select-package` | ❌ No | ✅ Yes | ❌ No | NEEDS CONFIG |
| Add-ons | `/add-ons` | ❌ No | ⚠️ Check | ❌ No | NEEDS CONFIG |
| Agreement | `/agreement` | ❌ No | ⚠️ Check | ❌ No | NO INDEX |
| Payment | `/payment` | ❌ No | ⚠️ Check | ❌ No | NO INDEX |
| Confirmation | `/confirmation` | ❌ No | ⚠️ Check | ❌ No | NO INDEX |
| Terms of Service | `/terms-of-service` | ❌ No | ⚠️ Check | ❌ No | NEEDS CONFIG |
| Privacy Policy | `/privacy-policy` | ❌ No | ⚠️ Check | ❌ No | NEEDS CONFIG |
| Glossary Term | `/glossary/:term` | ❌ No | ⚠️ Dynamic | ❌ No | NEEDS CONFIG |
| Staff Portal | `/staff` | ❌ No | ⚠️ Check | ❌ No | NO INDEX |
| Client Portal | `/client-portal` | ❌ No | ⚠️ Check | ❌ No | NO INDEX |
| Trademark Intake | `/trademark-intake` | ❌ No | ✅ Yes | ❌ No | NO INDEX |

---

## STEP 2: SEO STRATEGY & KEYWORD MAPPING

### Primary Keyword Assignment (No Cannibalization)

| Page | Primary Keyword Theme | Search Intent | Monthly Volume Est. |
|------|----------------------|---------------|---------------------|
| Home / Landing | trademark registration services | Commercial | High (5K+) |
| Pricing | trademark cost, trademark pricing | Commercial | High (3K+) |
| About | trademark attorneys, trademark law firm | Informational | Medium (1K+) |
| Resources | trademark resources, trademark guide | Informational | Medium (2K+) |
| Blog | trademark law blog | Informational | Low (500+) |
| Trademark Registration | trademark registration, register trademark | Commercial | Very High (10K+) |
| Trademark Search | trademark search, USPTO search | Commercial | High (4K+) |
| DIY Search | free trademark search | Commercial | Medium (2K+) |
| Office Action | office action response | Commercial | Medium (1K+) |
| Trademark Monitoring | trademark monitoring services | Commercial | Low (500+) |
| Cease & Desist | cease and desist letter trademark | Commercial | Medium (1K+) |
| Amazon Landing | amazon brand registry trademark | Commercial | High (3K+) |
| Business Name Generator | business name generator | Informational | High (8K+) |
| Process | trademark registration process | Informational | Medium (2K+) |
| Contact | trademark attorney consultation | Commercial | Low (500+) |
| Get Started | trademark application form | Commercial | Low |
| Package Selection | trademark packages, trademark services pricing | Commercial | Low |
| Terms of Service | N/A | Legal | N/A |
| Privacy Policy | N/A | Legal | N/A |

---

## STEP 3: OPTIMIZED METADATA FOR ALL PAGES

### Core Public Pages

#### 1. Home / Landing Page (/)
```javascript
{
  title: 'Trademark Registration Services | Federal USPTO Filing | Marq',
  description: 'Professional trademark registration with expert attorneys. Transparent pricing, comprehensive searches, and full USPTO support. Protect your brand nationwide starting at $899.',
  canonical: 'https://marqtrademarks.com',
  keywords: 'trademark registration, federal trademark, USPTO filing, trademark attorney, register trademark, brand protection'
}
```
**H1:** `Protect Your Brand with Professional Trademark Registration`
**Schema:** Organization, Website, Service, OfferCatalog

---

#### 2. Pricing Page (/pricing)
```javascript
{
  title: 'Trademark Pricing | Transparent Flat-Fee Registration | Marq',
  description: 'Clear trademark registration pricing with no hidden fees. Packages from $899 including search, filing, and monitoring. Office action responses from $499. Get started today.',
  canonical: 'https://marqtrademarks.com/pricing',
  keywords: 'trademark cost, trademark pricing, USPTO filing fees, trademark attorney fees, affordable trademark services'
}
```
**H1:** `Transparent, Flat-Fee Trademark Pricing`
**Schema:** Service, OfferCatalog, FAQPage

---

#### 3. About Page (/about)
```javascript
{
  title: 'About Marq | Experienced Trademark Attorneys | Marq',
  description: 'Meet the experienced trademark attorneys at Marq. We provide accessible, professional federal trademark protection across all 50 states with transparent pricing.',
  canonical: 'https://marqtrademarks.com/about',
  keywords: 'trademark attorneys, intellectual property lawyers, trademark law firm, USPTO attorneys, brand protection lawyers'
}
```
**H1:** `Expert Trademark Attorneys Protecting Brands Nationwide`
**Schema:** Organization, Attorney, LocalBusiness

---

#### 4. Resources Page (/resources)
```javascript
{
  title: 'Free Trademark Resources & Legal Guides | Marq',
  description: 'Free trademark resources, comprehensive legal guides, and expert educational content. Learn about USPTO processes, trademark registration, and intellectual property protection.',
  canonical: 'https://marqtrademarks.com/resources',
  keywords: 'trademark guide, trademark resources, trademark education, intellectual property guide, USPTO resources, trademark FAQ'
}
```
**H1:** `Free Trademark Resources & Expert Guides`
**Schema:** Organization, WebSite

---

#### 5. Blog Archive (/blog)
```javascript
{
  title: 'Trademark Law Blog | Expert Legal Insights | Marq',
  description: 'Latest trademark law insights, USPTO updates, brand protection strategies, and IP news. Expert legal analysis from experienced trademark attorneys.',
  canonical: 'https://marqtrademarks.com/blog',
  keywords: 'trademark law blog, trademark news, USPTO updates, intellectual property blog, brand protection'
}
```
**H1:** `Trademark Law Insights & Expert Analysis`
**Schema:** Blog, Organization

---

#### 6. Trademark Registration (/trademark-registration)
```javascript
{
  title: 'Federal Trademark Registration | Expert Attorneys | Marq',
  description: 'Complete federal trademark registration service with comprehensive search, expert preparation, USPTO filing, and monitoring. Packages start at $899. Protect your brand nationwide.',
  canonical: 'https://marqtrademarks.com/trademark-registration',
  keywords: 'trademark registration, federal trademark, register trademark, USPTO filing, brand protection'
}
```
**H1:** `Professional Federal Trademark Registration`
**Schema:** Service, HowTo, Breadcrumb, FAQ

---

#### 7. Trademark Search (/trademark-search)
```javascript
{
  title: 'Trademark Search Services | Free DIY or $49 Attorney Search',
  description: 'Choose free DIY trademark search or $49 professional attorney search with comprehensive USPTO database analysis. Results in 24 hours with expert recommendations.',
  canonical: 'https://marqtrademarks.com/trademark-search',
  keywords: 'trademark search, USPTO search, trademark availability, comprehensive trademark search, attorney trademark search'
}
```
**H1:** `Professional Trademark Search Services`
**Schema:** Service, HowTo

---

#### 8. DIY Trademark Search (/diy-search)
**NEW ENTRY**
```javascript
{
  title: 'Free DIY Trademark Search | Instant USPTO Database Results',
  description: 'Search the USPTO trademark database for free. Instant results with comprehensive federal and state trademark records. Check trademark availability before filing.',
  canonical: 'https://marqtrademarks.com/diy-search',
  keywords: 'free trademark search, DIY trademark search, USPTO database search, trademark availability check'
}
```
**H1:** `Free DIY Trademark Search Tool`
**Schema:** Service, HowTo

---

#### 9. Professional Search Request (/trademark-search-request)
```javascript
{
  title: 'Request Professional Trademark Search | $49 Attorney Review',
  description: 'Get a comprehensive trademark search by experienced attorneys for $49. Federal and state database analysis delivered in 24 hours with professional recommendations.',
  canonical: 'https://marqtrademarks.com/trademark-search-request',
  keywords: 'attorney trademark search, professional trademark search, trademark clearance search, USPTO attorney search'
}
```
**H1:** `Request Professional Attorney Trademark Search`
**Schema:** Service, Offer

---

#### 10. Office Action Response (/office-action)
```javascript
{
  title: 'USPTO Office Action Response | Expert Legal Services | Marq',
  description: 'Expert trademark office action response services from experienced USPTO attorneys. Procedural and substantive office action responses. Maximize your approval chances.',
  canonical: 'https://marqtrademarks.com/office-action',
  keywords: 'office action response, USPTO office action, trademark office action, substantive office action, procedural office action'
}
```
**H1:** `Expert USPTO Office Action Response Services`
**Schema:** Service, HowTo

---

#### 11. Trademark Monitoring (/trademark-monitoring)
```javascript
{
  title: 'Trademark Monitoring Service | Proactive Brand Protection',
  description: 'Comprehensive trademark monitoring and watch services. Instant alerts on conflicting USPTO applications and unauthorized use. Protect your brand with ongoing surveillance.',
  canonical: 'https://marqtrademarks.com/trademark-monitoring',
  keywords: 'trademark monitoring, trademark watch, brand monitoring, trademark protection, trademark surveillance, USPTO watch'
}
```
**H1:** `Proactive Trademark Monitoring & Watch Services`
**Schema:** Service

---

#### 12. Cease and Desist (/cease-and-desist)
```javascript
{
  title: 'Trademark Cease and Desist Letters | Legal Enforcement | Marq',
  description: 'Professional cease and desist letter services for trademark infringement. Attorney-drafted legal notices to stop unauthorized use and protect your brand.',
  canonical: 'https://marqtrademarks.com/cease-and-desist',
  keywords: 'cease and desist letter, trademark infringement, trademark enforcement, stop trademark infringement'
}
```
**H1:** `Professional Trademark Cease and Desist Letters`
**Schema:** Service

---

#### 13. Amazon Brand Registry (/amazon)
```javascript
{
  title: 'Amazon Brand Registry Trademark | Fast Federal Filing | Marq',
  description: 'Get your federal trademark for Amazon Brand Registry. Protect listings, stop hijackers, and access enhanced content. Expert registration starting at $899 for Amazon sellers.',
  canonical: 'https://marqtrademarks.com/amazon',
  keywords: 'amazon brand registry, amazon trademark, amazon seller trademark, federal trademark amazon, brand registry trademark'
}
```
**H1:** `Amazon Brand Registry Trademark Registration`
**Schema:** Service, HowTo, FAQ

---

#### 14. Business Name Generator (/business-name-generator)
```javascript
{
  title: 'Free Business Name Generator | Check Trademark Availability',
  description: 'Generate unique, memorable business names instantly. Create professional brand names and check trademark availability. Perfect for startups and entrepreneurs.',
  canonical: 'https://marqtrademarks.com/business-name-generator',
  keywords: 'business name generator, company name generator, brand name generator, free business name ideas, startup name generator'
}
```
**H1:** `Free Business Name Generator with Trademark Check`
**Schema:** WebApplication

---

#### 15. Process Page (/process)
```javascript
{
  title: 'Trademark Registration Process | Step-by-Step Guide | Marq',
  description: 'Complete guide to our trademark registration process from consultation through USPTO filing and final registration. Transparent communication and expert legal guidance.',
  canonical: 'https://marqtrademarks.com/process',
  keywords: 'trademark registration process, trademark filing process, USPTO application process, how to register trademark'
}
```
**H1:** `Our Trademark Registration Process: Start to Finish`
**Schema:** HowTo, Service

---

#### 16. Contact Page (/contact)
```javascript
{
  title: 'Contact Marq | Speak with Trademark Attorneys | Free Consultation',
  description: 'Get in touch with our experienced trademark attorneys for a free consultation. Available nationwide in all 50 states for trademark registration and brand protection.',
  canonical: 'https://marqtrademarks.com/contact',
  keywords: 'contact trademark attorney, trademark consultation, trademark questions, trademark legal help, free trademark consultation'
}
```
**H1:** `Get in Touch with Our Trademark Attorneys`
**Schema:** Organization, LocalBusiness, ContactPage

---

#### 17. Get Started Form (/get-started)
**NEW ENTRY**
```javascript
{
  title: 'Start Your Trademark Application | Professional Filing | Marq',
  description: 'Begin your trademark registration journey. Complete our quick questionnaire and get expert legal support for federal trademark protection.',
  canonical: 'https://marqtrademarks.com/get-started',
  keywords: 'trademark application form, start trademark registration, apply for trademark, file trademark'
}
```
**H1:** `Start Your Trademark Application Today`
**Schema:** Service

---

#### 18. Package Selection (/select-package)
**NEW ENTRY**
```javascript
{
  title: 'Choose Your Trademark Package | Registration Options | Marq',
  description: 'Select the trademark registration package that fits your needs. From basic filing to premium protection with monitoring. Transparent pricing and expert support.',
  canonical: 'https://marqtrademarks.com/select-package',
  keywords: 'trademark packages, trademark registration options, trademark service packages, trademark filing options'
}
```
**H1:** `Select Your Trademark Registration Package`
**Schema:** OfferCatalog

---

#### 19. Terms of Service (/terms-of-service)
**NEW ENTRY**
```javascript
{
  title: 'Terms of Service | Legal Terms & Conditions | Marq',
  description: 'Terms of service for Marq trademark registration services. Review our legal terms, conditions, and service agreements.',
  canonical: 'https://marqtrademarks.com/terms-of-service',
  author: 'Marq Legal Team'
}
```
**H1:** `Terms of Service`
**Schema:** WebPage
**Robots:** index, follow

---

#### 20. Privacy Policy (/privacy-policy)
**NEW ENTRY**
```javascript
{
  title: 'Privacy Policy | Data Protection & Security | Marq',
  description: 'Marq privacy policy. Learn how we protect your personal information, data security practices, and compliance with privacy regulations.',
  canonical: 'https://marqtrademarks.com/privacy-policy',
  author: 'Marq Legal Team'
}
```
**H1:** `Privacy Policy`
**Schema:** WebPage
**Robots:** index, follow

---

### Conversion Pages (Should be NO INDEX)

#### 21. Add-ons Page (/add-ons)
```javascript
{
  title: 'Select Add-On Services | Trademark Registration | Marq',
  description: 'Enhance your trademark package with additional services like monitoring, priority filing, and office action protection.',
  robots: 'noindex, follow'
}
```
**H1:** `Enhance Your Trademark Package`
**No Schema Required**

---

#### 22. Agreement Page (/agreement)
```javascript
{
  title: 'Service Agreement | Trademark Registration | Marq',
  description: 'Review and sign your trademark registration service agreement.',
  robots: 'noindex, nofollow'
}
```

---

#### 23. Payment Page (/payment)
```javascript
{
  title: 'Complete Payment | Trademark Registration | Marq',
  description: 'Secure payment processing for trademark registration services.',
  robots: 'noindex, nofollow'
}
```

---

#### 24. Confirmation Page (/confirmation)
```javascript
{
  title: 'Thank You | Registration Started | Marq',
  description: 'Your trademark registration has been initiated. Check your email for next steps.',
  robots: 'noindex, nofollow'
}
```

---

### Portal Pages (Should be NO INDEX)

#### 25. Staff Portal (/staff)
```javascript
{
  title: 'Staff Portal | Marq',
  description: 'Internal staff portal for trademark case management.',
  robots: 'noindex, nofollow'
}
```

---

#### 26. Client Portal (/client-portal)
```javascript
{
  title: 'Client Portal | Track Your Trademark | Marq',
  description: 'Access your client portal to track trademark application progress and communicate with your attorney.',
  robots: 'noindex, follow'
}
```

---

#### 27. Trademark Intake Form (/trademark-intake)
```javascript
{
  title: 'Trademark Intake Questionnaire | Marq',
  description: 'Complete your trademark application intake questionnaire.',
  robots: 'noindex, follow'
}
```

---

### Dynamic Pages

#### 28. Blog Post (/blog/:slug)
**Dynamic - Already well-configured**
- Title: `{post.title} | Marq Blog`
- Description: `{post.excerpt}`
- Schema: Article, BlogPosting, Breadcrumb

---

#### 29. Guide Page (/resources/:slug)
**NEW ENTRY - Dynamic**
```javascript
{
  title: '{guide.title} | Trademark Guide | Marq',
  description: '{guide.description}',
  canonical: 'https://marqtrademarks.com/resources/{slug}',
  keywords: '{guide.topics.join(", ")}'
}
```
**Schema:** Article, HowTo, Breadcrumb

---

#### 30. Glossary Term (/glossary/:term)
**NEW ENTRY - Dynamic**
```javascript
{
  title: '{term} - Trademark Glossary Definition | Marq',
  description: 'Definition and explanation of {term} in trademark law. Part of our comprehensive trademark glossary.',
  canonical: 'https://marqtrademarks.com/glossary/{slug}',
}
```
**Schema:** DefinedTerm

---

## STEP 4: H1 HEADING AUDIT & CORRECTIONS

### Current H1 Status

| Page | Current H1 | Recommended H1 | Action |
|------|-----------|----------------|--------|
| Home/Landing | "Protect Your Brand with Professional Trademark Registration" | Keep | ✅ Good |
| Pricing | Check page | "Transparent, Flat-Fee Trademark Pricing" | Update |
| Trademark Registration | "Trademark Registration Services" | "Professional Federal Trademark Registration" | Update |
| Amazon | Excellent | Keep | ✅ Good |
| Get Started | May be missing | "Start Your Trademark Application Today" | Add |
| Package Selection | "Select Your Package" | "Select Your Trademark Registration Package" | Update |

### H1 Best Practices Applied:
1. Each page has exactly ONE H1
2. H1 includes primary keyword naturally
3. H1 differs from title tag (not exact duplicate)
4. H1 is compelling and human-friendly
5. H2/H3 structure follows logical hierarchy

---

## STEP 5: SCHEMA MARKUP IMPLEMENTATION

### Sitewide Schema (Apply to ALL pages)

```json
{
  "@context": "https://schema.org",
  "@type": "LegalService",
  "name": "Marq Legal LLC - Trademark Registration Services",
  "url": "https://marqtrademarks.com",
  "logo": "https://marqtrademarks.com/logo.png",
  "description": "Professional trademark registration and intellectual property protection services with transparent pricing.",
  "telephone": "+1-555-TRADEMARK",
  "email": "contact@marqtrademarks.com",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "areaServed": "United States",
  "priceRange": "$49 - $1,500"
}
```

### Page-Specific Schema Requirements

| Page Type | Required Schema | Priority |
|-----------|----------------|----------|
| Home | Organization, WebSite, Service, OfferCatalog | Critical |
| Service Pages | Service, HowTo, Breadcrumb | Critical |
| Pricing | OfferCatalog, FAQPage | High |
| Blog Posts | Article, BlogPosting, Breadcrumb | Critical |
| Process | HowTo, Service | High |
| Resources | CollectionPage | Medium |
| Contact | ContactPage, LocalBusiness | High |
| About | Organization, Attorney | Medium |

---

## STEP 6: IMPLEMENTATION INSTRUCTIONS

### A. Update SEO Configuration File

**File:** `src/utils/seo.ts`

Add the following entries to the `pageSEO` object:

```typescript
export const pageSEO: Record<string, SEOConfig> = {
  // ... existing entries ...

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
```

### B. Update App.tsx Route Mapper

**File:** `src/App.tsx`

Update the `pathToPageMap` in the `SEOUpdater` component:

```typescript
const pathToPageMap: Record<string, string> = {
  '/': 'home',
  '/home': 'home',
  '/pricing': 'pricing',
  '/about': 'about',
  '/resources': 'resources',
  '/blog': 'blog',
  '/contact': 'contact',
  '/trademark-registration': 'trademark-registration',
  '/trademark-search': 'trademark-search',
  '/trademark-search-request': 'trademark-search-request',
  '/diy-search': 'diy-search',  // NEW
  '/trademark-search-form': 'trademark-search-form',  // NEW
  '/office-action': 'office-action',
  '/trademark-monitoring': 'trademark-monitoring',
  '/cease-and-desist': 'cease-and-desist',
  '/process': 'process',
  '/business-name-generator': 'business-name-generator',
  '/amazon': 'amazon',
  '/get-started': 'get-started',  // NEW
  '/select-package': 'select-package',  // NEW
  '/add-ons': 'add-ons',  // NEW
  '/terms-of-service': 'terms-of-service',  // NEW
  '/privacy-policy': 'privacy-policy'  // NEW
};
```

### C. Add Robots Meta Tags for Non-Indexable Pages

Create a new function in `src/utils/seo.ts`:

```typescript
export const updateNoIndexPage = (title: string, description: string) => {
  document.title = title;
  updateMetaTag('name', 'description', description);
  updateMetaTag('name', 'robots', 'noindex, nofollow');
};
```

Then apply to pages like:
- `/agreement`
- `/payment`
- `/confirmation`
- `/staff`

### D. Implement Dynamic SEO for Guide Pages

**File:** `src/pages/GuidePage.tsx`

Add at the top of the component:

```typescript
useEffect(() => {
  if (guide) {
    updatePageSEO({
      title: `${guide.title} | Trademark Guide | Marq`,
      description: guide.meta_description || guide.description,
      canonical: `https://marqtrademarks.com/resources/${slug}`,
      keywords: guide.topics?.join(', '),
      author: 'Marq'
    });
  }
}, [guide, slug]);
```

### E. Add Missing Schema Markup

Example for Pricing Page - add after existing schema:

```typescript
const faqSchemaData = faqSchema([
  {
    question: "How much does trademark registration cost?",
    answer: "Our trademark registration packages start at $899, which includes comprehensive search, application preparation, USPTO filing, and monitoring."
  },
  // Add 4-6 more FAQs
]);

// Then in the SchemaMarkup component:
<SchemaMarkup schema={[serviceSchemaData, offerCatalogSchema, faqSchemaData]} />
```

---

## STEP 7: PRIORITY ACTION ITEMS

### Immediate (Week 1)
1. ✅ Add 7 missing SEO configs to `seo.ts`
2. ✅ Update `App.tsx` route mapper
3. ✅ Add canonical URLs to all public pages
4. ⚠️ Review and update H1 tags on key pages

### High Priority (Week 2)
5. ✅ Implement dynamic SEO for guide pages
6. ✅ Add FAQ schema to pricing and service pages
7. ✅ Set noindex on conversion/portal pages
8. ⚠️ Audit all H2/H3 hierarchy

### Medium Priority (Weeks 3-4)
9. ⚠️ Create XML sitemap
10. ⚠️ Implement breadcrumb schema on all pages
11. ⚠️ Add LocalBusiness schema to contact page
12. ⚠️ Optimize existing meta descriptions for CTR

---

## STEP 8: ONGOING MAINTENANCE

### Monthly SEO Checklist
- [ ] Audit new blog posts for proper schema
- [ ] Check for duplicate title tags
- [ ] Review Search Console for indexing issues
- [ ] Update canonical URLs if site structure changes
- [ ] Monitor page load speeds (Core Web Vitals)
- [ ] Check for broken internal links

### Quarterly Reviews
- [ ] Full site crawl with Screaming Frog
- [ ] Update outdated content and metadata
- [ ] Refresh keyword targeting based on search trends
- [ ] Add new FAQ schema based on customer questions

---

## CONCLUSION

This SEO audit reveals a solid foundation with room for strategic improvements. By implementing the recommendations above, Marq will have:

✅ **Unique metadata** on every indexable page
✅ **Strategic keyword targeting** without cannibalization
✅ **Comprehensive schema markup** for rich snippets
✅ **Proper robots directives** on conversion pages
✅ **Clean URL structure** aligned with search intent
✅ **Optimized H1 hierarchy** on all pages

**Expected Impact:**
- Improved organic visibility for trademark-related queries
- Higher click-through rates from search results
- Better indexation and crawl efficiency
- Enhanced rich snippet opportunities
- Stronger topical authority in trademark law space

**Next Steps:**
1. Implement Phase 1 updates (SEO configs)
2. Test all pages for proper metadata display
3. Submit updated sitemap to Google Search Console
4. Monitor Search Console for indexation improvements
5. Track rankings for target keywords weekly

---

**Prepared by:** SEO Audit Team
**Date:** January 2026
**Version:** 1.0
