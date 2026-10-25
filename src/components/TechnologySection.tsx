import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Scan, Wifi, Lightbulb } from 'lucide-react';
import { IMAGES } from '@/data';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

const TECH_FEATURES = [
  {
    title: 'Adaptive Intelligence',
    text: 'A concept sensor suite of 12 cameras, 8 radar units, and 5 LiDAR scanners create a live 360° model of the world around you.',
    image: IMAGES.dashControls,
    icon: Scan,
  },
  {
    title: 'Connected Experience',
    text: 'Concept over-the-air updates refine driving dynamics, add features, and improve efficiency throughout the vehicle\'s life.',
    image: IMAGES.chargingStation,
    icon: Wifi,
  },
  {
    title: 'Intelligent Lighting',
    text: 'Concept matrix headlights selectively dim segments to avoid dazzling oncoming traffic while illuminating everything else.',
    image: IMAGES.headlightLux,
    icon: Lightbulb,
  },
];

export default function TechnologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(imgRefs.current, { opacity: 1, x: 0 });
        gsap.set(textRefs.current, { opacity: 1, y: 0 });
        return;
      }

      TECH_FEATURES.forEach((_, i) => {
        const img = imgRefs.current[i];
        const txt = textRefs.current[i];
        if (img) {
          gsap.fromTo(img,
            { opacity: 0, x: i % 2 === 0 ? -40 : 40 },
            {
              opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { trigger: img, start: 'top 85%', once: true },
            }
          );
        }
        if (txt) {
          gsap.fromTo(txt,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
              delay: 0.1,
              scrollTrigger: { trigger: txt, start: 'top 85%', once: true },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="technology" ref={sectionRef} className="relative bg-[#DCE7EE] py-24 lg:py-32 overflow-hidden">
      {/* Background subtle gradient */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(112,135,154,0.1) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">07</span>
          <div className="h-px w-12 bg-[#C6A879]/40" />
          <span className="font-body text-xs tracking-[0.3em] text-[#70879A] uppercase">Intelligent by Design</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-20">
          <h2
            className="font-display font-light text-[#172536] leading-[1.1] text-balance"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
          >
            Technology that<br />feels like instinct.
          </h2>
          <p className="font-body text-base lg:text-lg text-[#70879A] leading-relaxed max-w-lg">
            Every system in AERO ONE works in concert — anticipating, adapting, and disappearing into the background so you can focus on the road ahead.
          </p>
        </div>

        {/* Feature blocks - editorial layout */}
        <div className="space-y-8 lg:space-y-12">
          {TECH_FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                  i % 2 === 1 ? 'lg:[direction:rtl]' : ''
                }`}
              >
                {/* Image */}
                <div
                  ref={(el) => { imgRefs.current[i] = el; }}
                  className="relative overflow-hidden rounded-2xl aspect-[16/10] group lg:[direction:ltr] bg-[#263B50]"
                  style={{ boxShadow: '0 20px 50px -15px rgba(16,26,42,0.2)' }}
                >
                  <SmartImage
                    src={feature.image}
                    alt={`${feature.title} — concept technology study`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    fallbackLabel="AERO ONE"
                    fallbackClassName="text-[#F7F6F2]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101A2A]/30 to-transparent pointer-events-none" />
                </div>

                {/* Text */}
                <div
                  ref={(el) => { textRefs.current[i] = el; }}
                  className="lg:[direction:ltr]"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon size={20} strokeWidth={1.5} className="text-[#C6A879]" />
                    <span className="font-display text-3xl font-bold text-[#C6A879]/40">0{i + 1}</span>
                    <div className="h-px w-8 bg-[#C6A879]/50" />
                  </div>
                  <h3 className="font-display text-2xl lg:text-3xl font-medium text-[#172536] mb-4">{feature.title}</h3>
                  <p className="font-body text-base text-[#70879A] leading-relaxed max-w-md">{feature.text}</p>
                  <p className="mt-3 font-body text-[11px] text-[#70879A]/50">
                    Concept feature. Not verified for production.
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
