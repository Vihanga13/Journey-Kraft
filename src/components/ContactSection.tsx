import { useState, useRef, useEffect, FormEvent } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const contactInfo = [
  { icon: Phone, label: 'Phone', lines: ['+94 77 8987 615'] },
  { icon: Mail, label: 'Email', lines: ['hello@journeykraft.com'] },
  { icon: MapPin, label: 'Office', lines: ['123 Galle Road', 'Colombo 03, Sri Lanka'] },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const res = await fetch('https://formspree.io/f/mzdawelj', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        const data = await res.json().catch(() => ({}));
        setFormError((data as any)?.error ?? 'Something went wrong. Please try again.');
      }
    } catch {
      setFormError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="ct-section" ref={sectionRef}>
      <div className="ct-blob ct-blob-1" />
      <div className="ct-blob ct-blob-2" />
      <div className="ct-bg-grid" />

      <div className="ct-container">
        {/* Header */}
        <div className={`ct-header ${visible ? 'ct-anim-in' : ''}`}>
          <span className="ct-badge">Contact Us</span>
          <h2 className="ct-title">
            Start Your <span className="ct-title-accent">Journey</span>
          </h2>
          <p className="ct-subtitle">
            Ready to plan? Our travel experts are here to turn your dream trip into reality.
          </p>
        </div>

        <div className="ct-grid">
          {/* Form card */}
          <div className={`ct-form-card ${visible ? 'ct-anim-in' : ''}`} style={{ animationDelay: '0.2s' }}>
            {submitted ? (
              <div className="ct-success">
                <div className="ct-success-icon">
                  <CheckCircle2 style={{ width: 40, height: 40, color: '#01A98F' }} />
                </div>
                <h3 className="ct-success-title">Message Sent!</h3>
                <p className="ct-success-sub">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="ct-form">
                <h3 className="ct-form-title">Send Us a Message</h3>
                {formError && (
                  <div className="ct-form-error">{formError}</div>
                )}

                {[{ id: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', required: true },
                  { id: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
                  { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 8900', required: false },
                ].map((f) => (
                  <div key={f.id} className="ct-field">
                    <label className="ct-label" htmlFor={f.id}>
                      {f.label}{f.required && ' *'}
                    </label>
                    <input
                      id={f.id}
                      name={f.id}
                      type={f.type}
                      required={f.required}
                      value={(formData as any)[f.id]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      className={`ct-input ${focused === f.id ? 'ct-input-focused' : ''}`}
                      onFocus={() => setFocused(f.id)}
                      onBlur={() => setFocused(null)}
                    />
                  </div>
                ))}

                <div className="ct-field">
                  <label className="ct-label" htmlFor="message">Your Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your dream Sri Lankan journey..."
                    className={`ct-input ct-textarea ${focused === 'message' ? 'ct-input-focused' : ''}`}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                  />
                </div>

                <button type="submit" className="ct-submit" disabled={submitting}>
                  {submitting ? (
                    <span className="ct-submit-spinner" />
                  ) : (
                    <Send style={{ width: 18, height: 18 }} />
                  )}
                  {submitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Info column */}
          <div className="ct-info-col">
            {/* Contact info card */}
            <div className={`ct-info-card ${visible ? 'ct-anim-in' : ''}`} style={{ animationDelay: '0.32s' }}>
              <h3 className="ct-info-title">Get In Touch</h3>
              <div className="ct-info-list">
                {contactInfo.map((c, i) => (
                  <div key={i} className="ct-info-item">
                    <div className="ct-info-icon">
                      <c.icon style={{ width: 20, height: 20 }} />
                    </div>
                    <div>
                      <p className="ct-info-label">{c.label}</p>
                      {c.lines.map((l, j) => <p key={j} className="ct-info-line">{l}</p>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours card */}
            <div className={`ct-hours-card ${visible ? 'ct-anim-in' : ''}`} style={{ animationDelay: '0.44s' }}>
              <div className="ct-hours-mesh" />
              <h3 className="ct-hours-title">Business Hours</h3>
              <div className="ct-hours-list">
                <div className="ct-hours-row">
                  <span>Mon – Fri</span>
                  <span>9:00 AM – 6:00 PM</span>
                </div>
                <div className="ct-hours-row">
                  <span>Saturday</span>
                  <span>9:00 AM – 2:00 PM</span>
                </div>
                <div className="ct-hours-row">
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
              <div className="ct-hours-divider" />
              <p className="ct-hours-emergency">
                📞 24/7 Emergency Support Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

