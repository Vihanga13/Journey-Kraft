import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Globe, Landmark, Waves, Mountain, Camera, TreePine,
  UtensilsCrossed, Heart, Sparkles, Music, Users, MapPin,
  Play, ChevronLeft, ChevronRight, Film,
} from 'lucide-react';

/* ─── Section Data ─────────────────────────────────────────────────────────── */
const highlights = [
  {
    icon: Globe,
    number: '01',
    title: 'The Island That Packs a Continent Into One Trip',
    text: 'Sri Lanka is compact, but it feels endless. In a single itinerary, your guests can wake up by the ocean, have lunch in cool hill country, and end the day spotting elephants in the wild. It is a rare destination where variety is not a promise, it is the default.',
  },
  {
    icon: Landmark,
    number: '02',
    title: '2,500+ Years of Living Heritage',
    text: 'This is not "history behind glass." Ancient kingdoms, sacred cities, temples, and UNESCO sites are woven into everyday life. From carved stone ruins to vibrant rituals, Sri Lanka lets travelers experience culture that is still alive, not recreated.',
  },
  {
    icon: Waves,
    number: '03',
    title: 'Beach Days on Repeat, All Around the Map',
    text: 'Sri Lanka is ringed with coastline, which means beach experiences can be built into almost any route. Think golden sands, calm lagoons, surfing bays, whale-watching waters, and sunset beaches with laid-back cafés. Whether it is romance, family, or adventure, the sea is always close.',
  },
  {
    icon: Mountain,
    number: '04',
    title: 'Misty Mountains, Tea Valleys, and Cool-Climate Escapes',
    text: 'A few hours inland, the island changes completely. The air turns crisp, the roads wind through emerald tea estates, and viewpoints open into clouds and valleys. Train rides here are iconic for a reason — slow, scenic, and unforgettable.',
  },
  {
    icon: Camera,
    number: '05',
    title: 'Wildlife That Feels Cinematic',
    text: 'Sri Lanka delivers big moments in nature. Elephants, leopards, sloth bears, crocodiles, and incredible birdlife can be seen in well-known parks and quieter reserves. Safari here is accessible, exciting, and ideal for travelers who want "once-in-a-lifetime" without going off-grid.',
  },
  {
    icon: TreePine,
    number: '06',
    title: 'Rainforests and Hidden Trails That Still Feel Untouched',
    text: 'Beyond the famous highlights, Sri Lanka has pockets of wild that feel genuinely raw. Lush forests, waterfalls, and nature trails can be paired with eco-lodges and local guides for guests who want privacy, serenity, and discovery.',
  },
  {
    icon: UtensilsCrossed,
    number: '07',
    title: 'Food That Becomes the Travel Story',
    text: 'Sri Lankan food is bold, fresh, and full of personality. From seafood and street eats to home-cooked rice and curry, the flavors are layered and addictive. Add tropical fruit, spice gardens, and cooking experiences, and meals become a core memory, not a side activity.',
  },
  {
    icon: Heart,
    number: '08',
    title: 'Warm People, Real Smiles, and Genuine Hospitality',
    text: 'Hospitality in Sri Lanka feels personal. Travelers are welcomed, not processed. Whether it is a tea-plucker\'s story in the hills or a host setting an extra plate at dinner, the human connection is often what guests remember most.',
  },
  {
    icon: Sparkles,
    number: '09',
    title: 'Ayurveda, Wellness, and Slow Luxury',
    text: 'Sri Lanka is naturally suited for reset travel. Ayurveda therapies, wellness resorts, yoga by the ocean, and calm hill retreats create programs that suit modern travelers seeking balance. It is the kind of place where rest feels meaningful, not lazy.',
  },
  {
    icon: Music,
    number: '10',
    title: 'Festivals, Rhythm, and Color Throughout the Year',
    text: 'There is always something happening — full-moon ceremonies, cultural parades, drumming, dancing, and village celebrations. These moments add texture to an itinerary and make the destination feel vivid, not staged.',
  },
  {
    icon: Users,
    number: '11',
    title: 'Perfect for Crafting "Small Group" and "Private" Journeys',
    text: 'Sri Lanka is easy to design for premium travelers. Scenic routes, boutique stays, private guides, curated experiences, and flexible pacing make it ideal for FITs, couples, and families. You can build journeys that feel exclusive without feeling complicated.',
  },
  {
    icon: MapPin,
    number: '12',
    title: 'A Paradise That Feels Surprisingly Easy',
    text: 'The best part is how effortless it can be. Distances are short, experiences are diverse, and the island rewards even a 6 to 10 day plan. For a travel agent, it is a destination that sells well because the story is strong and the itinerary practically writes itself.',
  },
];

/* ─── Instagram Reels Data ──────────────────────────────────────────────── */
const igReels = [
  'DUS2TMzkbQn',
  'DSzKqcUjCQL',
  'DUDa7HJDLAa',
  'DVE9_krjB55',
  'DVEZuvKDCi_',
  'DSms27zgPpL',
  'DVNmvdiElOv',
  'DOTdAetjEgr',
];

/* ═══════════════════════════════════════════════════════════════════════════ */
export function LearnAboutSriLanka() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  /* Reels carousel */
  const reelsScrollRef = useRef<HTMLDivElement>(null);

  /* ── Intersection observer ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const scrollReels = useCallback((dir: 'left' | 'right') => {
    const el = reelsScrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
  }, []);

  return (
    <section id="learn-sri-lanka" className="lsl-section" ref={sectionRef}>
      {/* Background decorations */}
      <div className="lsl-blob lsl-blob-1" />
      <div className="lsl-blob lsl-blob-2" />
      <div className="lsl-bg-pattern" />

      <div className="lsl-container">
        {/* ── Header ── */}
        <div className={`lsl-header ${visible ? 'lsl-anim-in' : ''}`}>
          <span className="lsl-badge">Discover the Destination</span>
          <h2 className="lsl-title">
            Learn About <span className="lsl-title-accent">Sri Lanka</span>
          </h2>
          <p className="lsl-subtitle">
            A compact island with continent-sized wonders — here's why Sri Lanka
            keeps winning hearts and filling itineraries.
          </p>
        </div>

        {/* ── Highlight Cards Grid ── */}
        <div className="lsl-grid">
          {highlights.map((h, i) => {
            const Icon = h.icon;
            const isExpanded = expandedCard === i;
            return (
              <div
                key={i}
                className={`lsl-card ${visible ? 'lsl-anim-in' : ''} ${isExpanded ? 'lsl-card-expanded' : ''}`}
                style={{ animationDelay: `${0.1 + i * 0.06}s` }}
                onClick={() => setExpandedCard(isExpanded ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setExpandedCard(isExpanded ? null : i); }}
              >
                <div className="lsl-card-top">
                  <div className="lsl-card-icon">
                    <Icon style={{ width: 22, height: 22 }} />
                  </div>
                  <span className="lsl-card-number">{h.number}</span>
                </div>
                <h3 className="lsl-card-title">{h.title}</h3>
                <p className={`lsl-card-text ${isExpanded ? 'lsl-card-text-visible' : ''}`}>
                  {h.text}
                </p>
                <span className="lsl-card-toggle">
                  {isExpanded ? 'Read less' : 'Read more'}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Instagram Reels Section ── */}
        <div className={`lsl-reels-section ${visible ? 'lsl-anim-in' : ''}`} style={{ animationDelay: '0.9s' }}>
          <div className="lsl-reels-header">
            <div className="lsl-reels-icon-wrap">
              <Film style={{ width: 24, height: 24 }} />
            </div>
            <div>
              <h3 className="lsl-reels-heading">Experience Sri Lanka in Reels</h3>
              <p className="lsl-reels-sub">Swipe through stunning moments captured across the island</p>
            </div>
          </div>

          <div className="lsl-ig-reels-wrap">
            <button
              className="lsl-ig-nav lsl-ig-nav-left"
              onClick={() => scrollReels('left')}
              aria-label="Scroll reels left"
            >
              <ChevronLeft style={{ width: 24, height: 24 }} />
            </button>

            <div className="lsl-ig-reels-row" ref={reelsScrollRef}>
              {igReels.map((id, i) => (
                <div
                  key={id}
                  className={`lsl-ig-reel-card ${visible ? 'lsl-reel-pop' : ''}`}
                  style={{ animationDelay: `${1.0 + i * 0.08}s` }}
                >
                  <div className="lsl-ig-reel-glow" />
                  <div className="lsl-ig-reel-phone">
                    {/* Notch */}
                    <div className="lsl-ig-reel-notch" />
                    <div className="lsl-ig-reel-viewport">
                      <iframe
                        src={`https://www.instagram.com/reel/${id}/embed/`}
                        className="lsl-ig-reel-iframe"
                        allowTransparency
                        allow="encrypted-media"
                        title={`Instagram Reel ${id}`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="lsl-ig-nav lsl-ig-nav-right"
              onClick={() => scrollReels('right')}
              aria-label="Scroll reels right"
            >
              <ChevronRight style={{ width: 24, height: 24 }} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
