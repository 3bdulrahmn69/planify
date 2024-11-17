import Header from '../../components/Header';
import Footer from '../../components/Footer';

import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import PricingSection from './PricingSection';
import ContactSection from './ContactSection';
import FrequentlySection from './FrequentlySection';

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <PricingSection />
        <ContactSection />
        <FrequentlySection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
