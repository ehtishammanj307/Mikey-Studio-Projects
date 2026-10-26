import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Lightbulb, Wind, CircleDot, Sun } from 'lucide-react';
import { IMAGES, DESIGN_HOTSPOTS } from '@/data';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

const DESIGN_HIGHLIGHTS = [
  { title: 'Silhouette', text: 'A single uninterrupted line from nose to tail — sculpted by wind, not by convention.' },
  { title: 'Proportion', text: 'A long dash-to-axle ratio and cab-rearward stance communicate motion at rest.' },
  { title: 'Surface', text: 'Hand-finished body panels with subtle concave channels that direct airflow visually and physically.' },
  { title: 'Light', text: 'Signature ice-blue lighting elements embedded flush into the front fascia and rear light bar.' },
];

const HOTSPOT_ICONS = [Lightbulb, Wind, CircleDot, Sun];

export default function DesignSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<number>(0);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(itemRefs.current, { opacity: 1, y: 0 });
        return;
      }

      gsap.to(imgRef.current, {
        scale: 1.12,
        xPercent: 3,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(textRef.current, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: highlightsRef.current, start: 'top 85%', once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const hotspot = DESIGN_HOTSPOTS[activeHotspot];

  return (
    <section id="design" ref={sectionRef} className="relative min-h-screen py-24 lg:py-32 overflow-hidden bg-[#F3F0E8]">
      {/* Section label */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-16 lg:mb-24">
        <div className="flex items-center gap-4 mb-6">
          <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">02</span>
          <div className="h-px w-12 bg-[#C6A879]/40" />
          <span className="font-body text-xs tracking-[0.3em] text-[#70879A] uppercase">Designed to Move You</span>
        </div>
      </div>

      {/* Main editorial image with parallax + hotspots */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[16/10] lg:aspect-[21/9] shadow-2xl" style={{ boxShadow: '0 30px 80px -20px rgba(16,26,42,0.4)' }}>
          <div ref={imgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
            <SmartImage
              src={IMAGES.sideProfile}
              alt="AERO ONE side profile concept — a design study showing aerodynamic silhouette"
              className="w-full h-full object-cover"
              loading="lazy"
              fallbackLabel="AERO ONE"
              fallbackClassName="text-[#F7F6F2]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#101A2A]/80 via-[#101A2A]/10 to-transparent" />

          {/* Interactive hotspots — desktop positioned on image */}
          <div className="absolute inset-0 z-10 hidden lg:block">
            {DESIGN_HOTSPOTS.map((hs, i) => {
              const Icon = HOTSPOT_ICONS[i] ?? Lightbulb;
              return (
                <button
                  key={hs.id}
                  onClick={() => setActiveHotspot(i)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${hs.x}%`, top: `${hs.y}%` }}
                  aria-label={`View detail: ${hs.label}`}
                  aria-pressed={activeHotspot === i}
                >
                  {/* Outer ring */}
                  <span
                    className="absolute inset-0 rounded-full transition-all duration-300"
                    style={{
                      width: activeHotspot === i ? 36 : 28,
                      height: activeHotspot === i ? 36 : 28,
                      left: '50%',
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      border: `1.5px solid ${activeHotspot === i ? '#C6A879' : 'rgba(247,246,242,0.5)'}`,
                      opacity: activeHotspot === i ? 0.6 : 0.3,
                    }}
                  />
                  {/* Inner dot */}
                  <span
                    className="block rounded-full transition-all duration-300 flex items-center justify-center"
                    style={{
                      width: activeHotspot === i ? 18 : 12,
                      height: activeHotspot === i ? 18 : 12,
                      backgroundColor: activeHotspot === i ? '#C6A879' : 'rgba(247,246,242,0.7)',
                      boxShadow: activeHotspot === i ? '0 0 12px rgba(198,168,121,0.5)' : 'none',
                    }}
                  />
                  {/* Label tooltip on hover */}
                  <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-body text-[10px] tracking-[0.15em] uppercase text-[#F7F6F2] bg-[#101A2A]/80 px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none flex items-center gap-1.5">
                    <Icon size={10} strokeWidth={1.5} className="text-[#C6A879]" />
                    {hs.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div ref={textRef} className="absolute bottom-0 left-0 right-0 p-8 lg:p-16" style={{ willChange: 'transform' }}>
            <h2
              className="font-display font-light text-[#F7F6F2] leading-[1.1] text-balance max-w-2xl"
              style={{ fontSize: 'clamp(1.8rem, 5vw, 4rem)' }}
            >
              Every surface<br />serves the air.
            </h2>
          </div>
        </div>

        {/* Hotspot detail panel — appears below the image, not over it */}
        <div className="mt-6 grid lg:grid-cols-5 gap-6">
          {/* Hotspot selector tabs — mobile and desktop */}
          <div className="lg:col-span-2">
            <p className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-4">Design DNA</p>
            <div className="grid grid-cols-2 gap-2">
              {DESIGN_HOTSPOTS.map((hs, i) => {
                const Icon = HOTSPOT_ICONS[i] ?? Lightbulb;
                return (
                  <button
                    key={hs.id}
                    onClick={() => setActiveHotspot(i)}
                    className="text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2"
                    style={{
                      backgroundColor: activeHotspot === i ? 'rgba(198,168,121,0.12)' : 'rgba(255,255,255,0.5)',
                      border: `1px solid ${activeHotspot === i ? 'rgba(198,168,121,0.4)' : 'rgba(112,135,154,0.15)'}`,
                    }}
                    aria-pressed={activeHotspot === i}
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.5}
                      className={activeHotspot === i ? 'text-[#C6A879]' : 'text-[#70879A]'}
                    />
                    <span
                      className={`font-body text-xs transition-colors duration-300 ${
                        activeHotspot === i ? 'text-[#C6A879]' : 'text-[#70879A]'
                      }`}
                    >
                      {hs.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(112,135,154,0.15)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-0">
              <div className="sm:col-span-2 relative aspect-[4/3] sm:aspect-auto overflow-hidden bg-[#263B50]">
                <SmartImage
                  key={hotspot.id}
                  src={hotspot.image}
                  alt={`${hotspot.title} — concept detail study`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  fallbackLabel="AERO ONE"
                  fallbackClassName="text-[#F7F6F2]"
                />
              </div>
              <div className="sm:col-span-3 p-6 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-display text-2xl font-bold text-[#C6A879]/40">0{activeHotspot + 1}</span>
                  <div className="h-px w-8 bg-[#C6A879]/50" />
                </div>
                <h3 className="font-display text-xl font-medium text-[#172536] mb-3">{hotspot.title}</h3>
                <p className="font-body text-sm text-[#70879A] leading-relaxed">{hotspot.text}</p>
                <p className="mt-3 font-body text-[11px] text-[#70879A]/50">
                  Concept design study. Aerodynamic and lighting performance described here are illustrative, not physically tested.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design highlights */}
      <div ref={highlightsRef} className="max-w-[1600px] mx-auto px-6 lg:px-12 mt-20 lg:mt-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {DESIGN_HIGHLIGHTS.map((item, i) => (
            <div
              key={item.title}
              ref={(el) => { itemRefs.current[i] = el; }}
              className="group"
            >
              <div className="mb-4 h-px w-8 bg-[#C6A879]/50 group-hover:w-16 transition-all duration-500" />
              <h3 className="font-display text-lg font-medium text-[#172536] mb-3">{item.title}</h3>
              <p className="font-body text-sm text-[#70879A] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
