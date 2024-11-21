import Header from '../../components/Header';
import Footer from '../../components/Footer';
import GoToTop from '../../components/GoToTop';

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
      <GoToTop />
    </>
  );
};

export default HomePage;
