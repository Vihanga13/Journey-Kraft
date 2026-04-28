import { useEffect, useRef, useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'How does the AI journey planner work?',
    answer: 'Our AI analyzes your preferences, travel dates, and interests to create a personalized itinerary. It considers factors like travel time between destinations, local events, weather patterns, and your budget to craft the perfect journey.',
  },
  {
    question: 'Can I customize the AI-generated itinerary?',
    answer: 'Absolutely! The AI-generated plan is a starting point. You can modify any aspect — add or remove activities, change hotels, adjust timings, or completely restructure days. Our team will work with you to perfect every detail.',
  },
  {
    question: 'What is included in the tour packages?',
    answer: 'Our packages typically include accommodation, transportation, guided tours, entrance fees to attractions, and specified meals. We can customize packages to include additional services like airport transfers, travel insurance, and special experiences.',
  },
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking 2–3 months in advance for peak season (December–March) and at least 1 month ahead for other times. However, we can often accommodate last-minute bookings subject to availability.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Cancellations made 30+ days before departure receive a full refund minus processing fees. 15–29 days: 50% refund. Less than 15 days: no refund. We strongly recommend travel insurance to protect your investment.',
  },
  {
    question: 'Do you provide travel insurance?',
    answer: 'Yes, we offer comprehensive travel insurance options covering trip cancellation, medical emergencies, lost baggage, and more. We highly recommend it for all international travelers.',
  },
];

export function FAQs() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="faq-section" ref={sectionRef}>
      <div className="faq-bg-image" />
      <div className="faq-blob faq-blob-1" />
      <div className="faq-blob faq-blob-2" />
      <div className="faq-bg-grid" />

      <div className="faq-container">
        {/* Header */}
        <div className={`faq-header ${visible ? 'faq-anim-in' : ''}`}>
          <span className="faq-badge">FAQ</span>
          <h2 className="faq-title">
            Common <span className="faq-title-accent">Questions</span>
          </h2>
          <p className="faq-subtitle">
            Everything you need to know about planning your Sri Lankan adventure with JourneyKraft
          </p>
        </div>

        {/* Accordion */}
        <div className="faq-list">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={`faq-item ${isOpen ? 'faq-item-open' : ''} ${visible ? 'faq-anim-in' : ''}`}
                style={{ animationDelay: `${0.15 + i * 0.07}s` }}
              >
                <button
                  className="faq-btn"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  {/* Question icon */}
                  <span className={`faq-q-icon ${isOpen ? 'faq-q-icon-active' : ''}`}>
                    <HelpCircle style={{ width: 18, height: 18 }} />
                  </span>

                  <span className="faq-question">{faq.question}</span>

                  <span
                    className="faq-chevron"
                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <ChevronDown style={{ width: 20, height: 20 }} />
                  </span>
                </button>

                {/* Answer — CSS height transition */}
                <div
                  className="faq-answer-wrap"
                  style={{
                    maxHeight: isOpen ? '300px' : '0px',
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <div className="faq-answer">
                    <div className="faq-answer-bar" />
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}