import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { AboutUs } from './AboutUs';
import { AIJourneyPlanner } from './AIJourneyPlanner';
import { LearnAboutSriLanka } from './LearnAboutSriLanka';
import { ValuePropositions } from './ValuePropositions';
import { HowWeWork } from './HowWeWork';
import { OurCapabilities } from './OurCapabilities';
import { DestinationServices } from './DestinationServices';
import { WhyJourneyKraft } from './WhyJourneyKraft';
import { Testimonials } from './Testimonials';
import { FAQs } from './FAQs';
import { ContactSection } from './ContactSection';
import { Footer } from './Footer';
import { MessageCircle } from 'lucide-react';

export function Home() {
  const scrollToContact = () =>
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AboutUs />
      <AIJourneyPlanner />
      <LearnAboutSriLanka />
      <ValuePropositions />
      <HowWeWork />
      <OurCapabilities />
      <DestinationServices />
      <WhyJourneyKraft />
      <Testimonials />
      <FAQs />
      <ContactSection />
      <Footer />

      {/* Floating chatbot button */}
      <button
        className="chatbot-fab"
        onClick={scrollToContact}
        aria-label="Chat with us"
        title="Chat with us"
      >
        <span className="chatbot-fab-ping" />
        <MessageCircle className="chatbot-fab-icon" />
      </button>
    </div>
  );
}
