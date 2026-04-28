import { useEffect, useRef, useState } from 'react';
import {
  ClipboardList,
  Cpu,
  Settings2,
  CheckCircle2,
  Palmtree,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Share Your Preferences',
    description: 'Tell us your travel style, interests, and budget',
    icon: ClipboardList,
    gradient: 'linear-gradient(135deg, #01A98F, #00d4aa)',
  },
  {
    number: 2,
    title: 'Personalised Itinerary',
    description: 'Our AI generates a personalized itinerary',
    icon: Cpu,
    gradient: 'linear-gradient(135deg, #0bbf9e, #55ffd8)',
  },
  {
    number: 3,
    title: 'Review & Customize',
    description: 'Adjust your journey to perfection',
    icon: Settings2,
    gradient: 'linear-gradient(135deg, #01A98F, #0bbf9e)',
  },
  {
    number: 4,
    title: 'Book & Confirm',
    description: 'Secure your bookings with ease',
    icon: CheckCircle2,
    gradient: 'linear-gradient(135deg, #00d4aa, #01A98F)',
  },
  {
    number: 5,
    title: 'Enjoy Your Journey',
    description: 'Experience Sri Lanka with our support',
    icon: Palmtree,
    gradient: 'linear-gradient(135deg, #0bbf9e, #00d4aa)',
  },
];

export function HowWeWork() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-advance every 3s
  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      setActiveStep(prev => (prev + 1) % steps.length);
    }, 3500);
    return () => clearInterval(id);
  }, [visible, activeStep]);

  return (
    <section id="how-we-work" ref={sectionRef} className="hww-section">
      {/* Decorative elements */}
      <div className="hww-bg-orb hww-bg-orb-1" />
      <div className="hww-bg-orb hww-bg-orb-2" />
      <div className="hww-bg-grid" />

      <div className="hww-container">
        {/* ── Header ── */}
        <div className="hww-header">
          <span className={`hww-badge ${visible ? 'hww-anim-in' : ''}`}>
            Our Process
          </span>
          <h2 className={`hww-title ${visible ? 'hww-anim-in' : ''}`} style={{ animationDelay: '0.08s' }}>
            Dream to departure in
            <span className="hww-title-accent"> five steps</span>
          </h2>
          <p className={`hww-subtitle ${visible ? 'hww-anim-in' : ''}`} style={{ animationDelay: '0.16s' }}>
            A seamless journey from your first idea to touching down in Sri Lanka
          </p>
        </div>

        {/* ── Progress Track ── */}
        <div className={`hww-track ${visible ? 'hww-anim-in' : ''}`} style={{ animationDelay: '0.24s' }}>
          <div className="hww-track-bar">
            <div
              className="hww-track-fill"
              style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
          <div className="hww-track-dots">
            {steps.map((s, i) => {
              const StepIcon = s.icon;
              return (
                <button
                  key={s.number}
                  className={`hww-track-dot ${i <= activeStep ? 'hww-dot-active' : ''} ${i === activeStep ? 'hww-dot-current' : ''}`}
                  onClick={() => setActiveStep(i)}
                  aria-label={`Step ${s.number}`}
                >
                  <span className="hww-dot-num">{String(s.number).padStart(2, '0')}</span>
                  <span className="hww-dot-icon-wrap">
                    <StepIcon style={{ width: 20, height: 20 }} />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Cards Row ── */}
        <div className="hww-cards">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = i === activeStep;
            return (
              <div
                key={step.number}
                className={`hww-card ${isActive ? 'hww-card-active' : ''} ${visible ? 'hww-anim-in' : ''}`}
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                onClick={() => setActiveStep(i)}
              >
                {/* Glow backdrop */}
                <div
                  className="hww-card-glow"
                  style={{ background: step.gradient, opacity: isActive ? 0.12 : 0 }}
                />

                {/* Large faded number */}
                <span className="hww-card-watermark">{String(step.number).padStart(2, '0')}</span>

                {/* Icon circle */}
                <div
                  className="hww-card-icon"
                  style={{
                    background: isActive ? step.gradient : 'rgba(1,169,143,0.1)',
                    color: isActive ? '#fff' : 'var(--jk-primary)',
                  }}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Content */}
                <h3 className="hww-card-title">{step.title}</h3>
                <p className="hww-card-desc">{step.description}</p>

                {/* Arrow indicator */}
                <div className={`hww-card-arrow ${isActive ? 'hww-arrow-show' : ''}`}>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Bottom gradient bar */}
                <div
                  className="hww-card-bar"
                  style={{ background: step.gradient, transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </div>
            );
          })}
        </div>

        {/* ── Active Step Expanded Detail ── */}
        <div className={`hww-detail ${visible ? 'hww-anim-in' : ''}`} style={{ animationDelay: '0.8s' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            if (i !== activeStep) return null;
            return (
              <div key={step.number} className="hww-detail-inner">
                <div className="hww-detail-num" style={{ background: step.gradient }}>
                  {step.number}
                </div>
                <div className="hww-detail-content">
                  <div className="hww-detail-icon-row">
                    <Icon className="w-5 h-5" style={{ color: 'var(--jk-primary)' }} />
                    <span className="hww-detail-step-label">Step {step.number} of {steps.length}</span>
                  </div>
                  <h3 className="hww-detail-title">{step.title}</h3>
                  <p className="hww-detail-desc">{step.description}</p>
                </div>
                <div className="hww-detail-actions">
                  {activeStep < steps.length - 1 && (
                    <button
                      className="hww-detail-next"
                      onClick={() => setActiveStep(prev => prev + 1)}
                    >
                      Next Step <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}