import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropertyForm from './components/PropertyForm';
import EstimateFlow from './components/EstimateFlow';
import { BedDouble, TrendingUp, MapPin, ChevronDown, Globe } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

interface FormData {
  posizione: string;
  letti: number;
  bagni_privati: number;
  bagni_condivisi: number;
  stanze_totali: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyData = any;

type FlowStep = 'idle' | 'scraping' | 'results' | 'error';

function App() {
  const [flowStep, setFlowStep] = useState<FlowStep>('idle');
  const [flowFormData, setFlowFormData] = useState<FormData | null>(null);
  const [scrapeData, setScrapeData] = useState<AnyData | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const callFunction = async (body: object) => {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/housinganywhere-property-analysis`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (!result.success) throw new Error(result.error || 'Server error');
    return result.data;
  };

  const runEstimate = async (formData: FormData) => {
    setFormError(null);
    setFlowFormData(formData);
    setScrapeData(null);
    setFlowStep('scraping');
    setFlowError(null);

    try {
      const scraped = await callFunction({
        posizione: formData.posizione,
        bagni_privati: formData.bagni_privati,
        bagni_condivisi: formData.bagni_condivisi,
      });
      setScrapeData(scraped);
      setFlowStep('results');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred.';
      console.error(err);
      setFlowStep('idle');
      setFormError(message);
    }
  };

  const handleClose = () => {
    setFlowStep('idle');
    setScrapeData(null);
    setFlowError(null);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnimatePresence>
        {flowStep !== 'idle' && flowFormData && (
          <EstimateFlow
            step={flowStep as 'scraping' | 'results' | 'error'}
            formData={flowFormData}
            scrapeData={scrapeData}
            error={flowError}
            onRetry={() => runEstimate(flowFormData)}
            onClose={handleClose}
          />
        )}
      </AnimatePresence>

      {/* ─── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-ha-border">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-[68px] flex items-center gap-5">

          {/* Logo */}
          <a href="https://housinganywhere.com" target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
            <img src="/housinganywhere-logo.svg" alt="HousingAnywhere" style={{ height: 36, width: 'auto' }} />
          </a>

          <div className="flex-1" />

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            <a
              href="https://housinganywhere.com/how-it-works"
              target="_blank" rel="noopener noreferrer"
              className="text-[14px] text-[#0D0D0D] px-3 py-2 rounded-md hover:bg-black/5 transition-colors whitespace-nowrap"
              style={{ fontFamily: 'PoppinsMedium, sans-serif' }}
            >
              How it works
            </a>
            <a
              href="https://housinganywhere.com/pricing"
              target="_blank" rel="noopener noreferrer"
              className="text-[14px] text-[#0D0D0D] px-3 py-2 rounded-md hover:bg-black/5 transition-colors"
              style={{ fontFamily: 'PoppinsMedium, sans-serif' }}
            >
              Pricing
            </a>
            <a
              href="https://help.housinganywhere.com"
              target="_blank" rel="noopener noreferrer"
              className="text-[14px] text-[#0D0D0D] px-3 py-2 rounded-md hover:bg-black/5 transition-colors"
              style={{ fontFamily: 'PoppinsMedium, sans-serif' }}
            >
              Help
            </a>

            <div className="mx-1 h-5 w-px bg-ha-border" />

            <a
              href="https://housinganywhere.com/login"
              target="_blank" rel="noopener noreferrer"
              className="text-[14px] text-[#0D0D0D] px-3 py-2 rounded-md hover:bg-black/5 transition-colors"
              style={{ fontFamily: 'PoppinsMedium, sans-serif' }}
            >
              Log in
            </a>
            <a
              href="https://housinganywhere.com/signup"
              target="_blank" rel="noopener noreferrer"
              className="text-[14px] text-[#0D0D0D] px-3 py-2 rounded-md hover:bg-black/5 transition-colors"
              style={{ fontFamily: 'PoppinsMedium, sans-serif' }}
            >
              Sign up
            </a>

            <a
              href="https://housinganywhere.com/renting-out-private--Italy"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center border border-[#0D0D0D] text-[#0D0D0D] text-[14px] px-4 py-[8px] rounded-xl hover:bg-black/5 transition-colors duration-200 flex-shrink-0 whitespace-nowrap mx-1"
              style={{ fontFamily: 'PoppinsMedium, sans-serif' }}
            >
              I'm a landlord
            </a>

            {/* Language icon */}
            <button
              className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-black/5 transition-colors text-[#0D0D0D]"
              aria-label="Language"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8l6 6" /><path d="M4 14l6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" />
                <path d="M22 22l-5-10-5 10" /><path d="M14 18h6" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Main ───────────────────────────────────────────────────────── */}
      <main className="flex-1 pt-[68px]">

        {/* ─── Hero ─────────────────────────────────────────────────── */}
        <div className="hero-bg relative overflow-hidden" style={{ height: '860px' }}>
          <div className="max-w-[1440px] mx-auto px-6 lg:px-12 flex flex-col items-center text-center pt-16 lg:pt-24 pb-8">

            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-title text-[38px] sm:text-[50px] lg:text-[58px] text-white leading-[1.2] max-w-3xl"
              style={{ fontFamily: 'PoppinsMedium, sans-serif', fontWeight: 700 }}
            >
              Discover how much your property can earn
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[16px] text-white/85 max-w-2xl mt-6 mb-10 leading-relaxed"
              style={{ fontFamily: 'PoppinsLight, sans-serif', fontWeight: 300 }}
            >
              Discover for free how much your property can earn on HousingAnywhere.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-[56rem]"
            >
              {formError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 text-[13px] text-white bg-brand-dark/60 rounded-2xl px-5 py-3 text-center"
                >
                  {formError}
                </motion.div>
              )}
              <PropertyForm onSubmit={(data) => runEstimate(data)} onCancel={() => {}} hideTitle />
            </motion.div>

          </div>

          {/* Illustration — sits above curve, partially clipped */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[5]" style={{ width: '440px', maxWidth: '80vw', bottom: '60px' }}>
            <img src="/hero-illustration.avif" alt="" className="w-full block" draggable={false} />
          </div>

          {/* Curved bottom — arch rising in center, clips illustration */}
          <div className="absolute bottom-0 left-0 right-0 z-10 leading-none">
            <svg viewBox="0 0 1440 140" preserveAspectRatio="none" className="w-full block" style={{ height: '140px' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M0,140 Q720,0 1440,140 Z" fill="#F7F4F3"/>
            </svg>
          </div>
        </div>

        {/* ─── Come funziona ───────────────────────────────────────── */}
        <div className="bg-ha-bg py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="font-title text-[32px] text-ha-dark mb-2" style={{ fontFamily: 'PoppinsMedium, sans-serif', fontWeight: 700 }}>How it works</h2>
              <p className="text-ha-gray text-[16px]">Three simple steps to discover your property's potential</p>
            </div>
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
              <div className="hidden md:block absolute top-[22px] left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-[2px] bg-ha-border" />
              {[
                {
                  icon: <MapPin size={26} color="#FF4B27" strokeWidth={1.8} />,
                  title: 'Enter the location',
                  desc: 'Enter the city where your property is located.',
                },
                {
                  icon: <BedDouble size={26} color="#FF4B27" strokeWidth={1.8} />,
                  title: 'Describe your property',
                  desc: 'Add the number of beds, bathrooms and total rooms in the apartment.',
                },
                {
                  icon: <TrendingUp size={26} color="#FF4B27" strokeWidth={1.8} />,
                  title: 'Get your estimate',
                  desc: 'Our AI analyses the local market and gives you a realistic earnings range.',
                },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-ha-peach flex items-center justify-center mb-5">
                    {item.icon}
                  </div>
                  <h3 className="font-title text-[17px] text-ha-dark mb-2" style={{ fontFamily: 'PoppinsMedium, sans-serif', fontWeight: 600 }}>{item.title}</h3>
                  <p className="text-[14px] text-ha-gray leading-relaxed max-w-[220px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* ─── Footer ──────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: '#E8ECF2' }}>
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-14 pb-10">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* Left col: logo + language + get the app */}
            <div className="flex-shrink-0 w-full lg:w-[220px]">
              <a href="https://housinganywhere.com" target="_blank" rel="noopener noreferrer">
                <img src="/housinganywhere-logo.svg" alt="HousingAnywhere" style={{ height: 28, width: 'auto' }} className="mb-4" />
              </a>
              <button className="flex items-center gap-1.5 text-[13px] text-[#0D0D0D] hover:text-ha-gray transition-colors mb-6" style={{ fontFamily: 'PoppinsLight, sans-serif' }}>
                <Globe size={15} />
                English
                <ChevronDown size={13} />
              </button>

              {/* Get the app card */}
              <div className="border border-[#C8CDD6] rounded-xl p-4 max-w-[220px]" style={{ backgroundColor: 'transparent' }}>
                <p className="text-[13px] text-[#0D0D0D] mb-1" style={{ fontFamily: 'PoppinsMedium, sans-serif' }}>Get the app</p>
                <p className="text-[12px] text-ha-gray mb-4 leading-snug">Stay ahead with faster searches and real-time notifications.</p>
                <div className="flex gap-2">
                  <a href="https://apps.apple.com/app/housinganywhere/id869814874" target="_blank" rel="noopener noreferrer">
                    <AppStoreBadge />
                  </a>
                  <a href="https://play.google.com/store/apps/details?id=com.housinganywhere" target="_blank" rel="noopener noreferrer">
                    <GooglePlayBadge />
                  </a>
                </div>
              </div>
            </div>

            {/* Link columns */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-8">

              {/* HousingAnywhere */}
              <div>
                <FooterHeading>HousingAnywhere</FooterHeading>
                {[
                  { label: 'About',               href: 'https://housinganywhere.com/about' },
                  { label: 'Careers',             href: 'https://housinganywhere.com/careers' },
                  { label: 'Press',               href: 'https://housinganywhere.com/press' },
                  { label: 'Partners',            href: 'https://housinganywhere.com/partners' },
                  { label: 'Terms & Conditions',  href: 'https://housinganywhere.com/terms-and-conditions' },
                  { label: 'Privacy policy',      href: 'https://housinganywhere.com/privacy-policy' },
                  { label: 'Cookie policy',       href: 'https://housinganywhere.com/cookie-policy' },
                  { label: 'Sitemap',             href: 'https://housinganywhere.com/sitemap' },
                ].map(l => <FooterLink key={l.label} {...l} />)}
              </div>

              {/* Tenants + Support */}
              <div>
                <FooterHeading>Tenants</FooterHeading>
                {[
                  { label: 'How it works',      href: 'https://housinganywhere.com/how-it-works' },
                  { label: 'Pricing',           href: 'https://housinganywhere.com/pricing' },
                  { label: 'Pay rent online',   href: 'https://housinganywhere.com/pay-rent-online' },
                  { label: 'Blog for tenants',  href: 'https://housinganywhere.com/blog' },
                ].map(l => <FooterLink key={l.label} {...l} />)}
                <div className="mt-6">
                  <FooterHeading>Support</FooterHeading>
                  {[
                    { label: 'Help',        href: 'https://help.housinganywhere.com' },
                    { label: 'Contact us',  href: 'https://help.housinganywhere.com/hc/en-us/requests/new' },
                  ].map(l => <FooterLink key={l.label} {...l} />)}
                </div>
              </div>

              {/* Landlords */}
              <div>
                <FooterHeading>Landlords</FooterHeading>
                {[
                  { label: 'How it works',                    href: 'https://housinganywhere.com/landlord/how-it-works' },
                  { label: 'Pricing',                         href: 'https://housinganywhere.com/pricing' },
                  { label: 'Become a landlord',               href: 'https://housinganywhere.com/landlord' },
                  { label: 'HousingAnywhere Rent Guarantee',  href: 'https://housinganywhere.com/rent-guarantee' },
                  { label: 'Collect rent online',             href: 'https://housinganywhere.com/collect-rent-online' },
                  { label: 'How-to guides',                   href: 'https://housinganywhere.com/landlord/guides' },
                  { label: 'Success stories',                 href: 'https://housinganywhere.com/landlord/success-stories' },
                  { label: 'Blog for landlords',              href: 'https://housinganywhere.com/blog' },
                  { label: 'Integrations',                    href: 'https://housinganywhere.com/integrations' },
                  { label: 'Sample rental contracts',         href: 'https://housinganywhere.com/rental-contracts' },
                ].map(l => <FooterLink key={l.label} {...l} />)}
              </div>

            </div>

            {/* Social icons — vertical */}
            <div className="flex lg:flex-col items-center gap-3 flex-wrap lg:flex-nowrap lg:pt-1">
              <SocialIcon href="https://www.facebook.com/housinganywhere" label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://twitter.com/housinganywhere" label="X">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com/company/housinganywhere" label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </SocialIcon>
              <SocialIcon href="https://www.youtube.com/c/HousingAnywhere" label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>
              </SocialIcon>
              <SocialIcon href="https://www.instagram.com/housinganywhere" label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></svg>
              </SocialIcon>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-full border border-[#B0B7C3] flex items-center justify-center text-[#0D0D0D] hover:border-[#0D0D0D] transition-colors flex-shrink-0"
    >
      {children}
    </a>
  );
}

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[12px] text-[#0D0D0D] mb-3 font-semibold"
      style={{ fontFamily: 'PoppinsMedium, sans-serif' }}
    >
      {children}
    </div>
  );
}

function FooterLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-[13px] text-[#3D4451] hover:text-[#0D0D0D] transition-colors mb-[8px] leading-snug"
      style={{ fontFamily: 'PoppinsLight, sans-serif' }}
    >
      {label}
    </a>
  );
}

function AppStoreBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 bg-[#0D0D0D] rounded-lg px-2.5 py-1.5">
      <svg width="14" height="17" viewBox="0 0 18 22" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.975 11.617c-.02-2.56 2.087-3.8 2.183-3.861-1.19-1.74-3.044-1.977-3.703-2.003-1.57-.16-3.076.928-3.874.928-.797 0-2.027-.907-3.337-.882-1.712.025-3.3 1.004-4.18 2.535-1.786 3.095-.457 7.673 1.283 10.183.856 1.228 1.874 2.603 3.21 2.553 1.293-.052 1.782-.832 3.345-.832 1.564 0 2.01.832 3.376.803 1.385-.025 2.265-1.252 3.112-2.487.985-1.42 1.388-2.8 1.41-2.87-.032-.013-2.703-1.036-2.725-4.067z"/>
        <path d="M12.467 3.797c.71-.862 1.19-2.059 1.058-3.254-1.022.042-2.26.68-2.993 1.54-.658.757-1.232 1.97-1.078 3.133 1.14.088 2.303-.58 3.013-1.42z"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-white text-[7px]" style={{ fontFamily: 'PoppinsLight, sans-serif' }}>Download on the</span>
        <span className="text-white text-[11px]" style={{ fontFamily: 'PoppinsMedium, sans-serif', lineHeight: '1.3' }}>App Store</span>
      </div>
    </div>
  );
}

function GooglePlayBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 bg-[#0D0D0D] rounded-lg px-2.5 py-1.5">
      <svg width="14" height="16" viewBox="0 0 18 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.428 0.275C0.16 0.56 0 1.01 0 1.59v16.82c0 .58.16 1.03.43 1.315l.07.065 9.42-9.42v-.225L0.498.21l-.07.065z" fill="#4285F4"/>
        <path d="M12.07 13.495l-3.14-3.14v-.225l3.14-3.14.07.04 3.72 2.113c1.063.602 1.063 1.59 0 2.195l-3.72 2.113-.07.044z" fill="#FBBC05"/>
        <path d="M12.14 13.45L8.93 10.24.428 18.74c.35.37.928.415 1.578.046l10.134-5.337" fill="#EA4335"/>
        <path d="M12.14 7.03L2.006 1.694C1.356 1.32.778 1.37.428 1.74l8.502 8.5 3.21-3.21z" fill="#34A853"/>
      </svg>
      <div className="flex flex-col leading-none">
        <span className="text-white text-[7px]" style={{ fontFamily: 'PoppinsLight, sans-serif' }}>GET IT ON</span>
        <span className="text-white text-[11px]" style={{ fontFamily: 'PoppinsMedium, sans-serif', lineHeight: '1.3' }}>Google Play</span>
      </div>
    </div>
  );
}

export default App;
