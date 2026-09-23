import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/sections/Marquee';
import Automation from '@/components/sections/Automation';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import CaseStudies from '@/components/sections/CaseStudies';
import Pricing from '@/components/sections/Pricing';
import Faq from '@/components/sections/Faq';
import Booking from '@/components/sections/Booking';
import Contact from '@/components/sections/Contact';

export default async function Home({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  setRequestLocale(locale);

  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Marquee />
        <Automation />
        <Services />
        <Process />
        <CaseStudies />
        <Pricing />
        <Faq />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
