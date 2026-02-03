import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import { updatePageSEO, pageSEO, defaultSEO } from './utils/seo';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ResourcesPage from './pages/ResourcesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import GuidePage from './pages/GuidePage';
import ProcessPage from './pages/ProcessPage';
import GlossaryTermPage from './pages/GlossaryTermPage';
import TrademarkRegistrationPage from './pages/TrademarkRegistrationPage';
import TrademarkSearchPage from './pages/TrademarkSearchPage';
import TrademarkSearchChoicePage from './pages/TrademarkSearchChoicePage';
import DIYTrademarkSearchPage from './pages/DIYTrademarkSearchPage';
import TrademarkSearchRequestPage from './pages/TrademarkSearchRequestPage';
import OfficeActionPage from './pages/OfficeActionPage';
import TrademarkMonitoringPage from './pages/TrademarkMonitoringPage';
import CeaseAndDesistPage from './pages/CeaseAndDesistPage';
import AgreementPage from './pages/AgreementPage';
import AgreementConfirmationPage from './pages/AgreementConfirmationPage';
import AddOnSelectionPage from './pages/AddOnSelectionPage';
import PaymentPage from './pages/PaymentPage';
import ContactPage from './pages/ContactPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import StaffPortalPage from './pages/StaffPortalPage';
import ClientPortalPage from './pages/ClientPortalPage';
import TrademarkIntakeFormPage from './pages/TrademarkIntakeFormPage';
import BusinessNameGeneratorPage from './pages/BusinessNameGeneratorPage';
import AmazonLandingPage from './pages/AmazonLandingPage';
import GetStartedPage from './pages/GetStartedPage';
import PackageSelectionPage from './pages/PackageSelectionPage';
import OfficeActionIntakePage from './pages/OfficeActionIntakePage';
import CeaseAndDesistIntakePage from './pages/CeaseAndDesistIntakePage';
import PaymentMethodSelectionPage from './pages/PaymentMethodSelectionPage';
import PaymentPlanConfirmationPage from './pages/PaymentPlanConfirmationPage';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function SEOUpdater() {
  const location = useLocation();

  useEffect(() => {
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
      '/diy-search': 'diy-search',
      '/trademark-search-form': 'trademark-search-form',
      '/office-action': 'office-action',
      '/trademark-monitoring': 'trademark-monitoring',
      '/cease-and-desist': 'cease-and-desist',
      '/process': 'process',
      '/business-name-generator': 'business-name-generator',
      '/amazon': 'amazon',
      '/get-started': 'get-started',
      '/select-package': 'select-package',
      '/add-ons': 'add-ons',
      '/terms-of-service': 'terms-of-service',
      '/privacy-policy': 'privacy-policy'
    };

    const currentPageKey = pathToPageMap[location.pathname] || 'home';
    const seoConfig = pageSEO[currentPageKey] || defaultSEO;
    updatePageSEO(seoConfig);
  }, [location.pathname]);

  return null;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ScrollToTop />
      <SEOUpdater />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/resources/:slug" element={<GuidePage />} />
          <Route path="/glossary/:term" element={<GlossaryTermPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/trademark-registration" element={<TrademarkRegistrationPage />} />
          <Route path="/trademark-search" element={<TrademarkSearchPage />} />
          <Route path="/trademark-search-request" element={<TrademarkSearchChoicePage />} />
          <Route path="/diy-search" element={<DIYTrademarkSearchPage />} />
          <Route path="/trademark-search-form" element={<TrademarkSearchRequestPage />} />
          <Route path="/office-action" element={<OfficeActionPage />} />
          <Route path="/trademark-monitoring" element={<TrademarkMonitoringPage />} />
          <Route path="/cease-and-desist" element={<CeaseAndDesistPage />} />
          <Route path="/office-action-request" element={<OfficeActionIntakePage />} />
          <Route path="/cease-and-desist-request" element={<CeaseAndDesistIntakePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/get-started" element={<GetStartedPage />} />
          <Route path="/select-package" element={<PackageSelectionPage />} />
          <Route path="/add-ons" element={<AddOnSelectionPage />} />
          <Route path="/agreement" element={<AgreementPage />} />
          <Route path="/payment-method-selection" element={<PaymentMethodSelectionPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment-plan-confirmation" element={<PaymentPlanConfirmationPage />} />
          <Route path="/confirmation" element={<AgreementConfirmationPage />} />
          <Route path="/terms-of-service" element={<TermsOfServicePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/staff" element={<StaffPortalPage />} />
          <Route path="/client-portal" element={<ClientPortalPage />} />
          <Route path="/trademark-intake" element={<TrademarkIntakeFormPage />} />
          <Route path="/business-name-generator" element={<BusinessNameGeneratorPage />} />
          <Route path="/amazon" element={<AmazonLandingPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
