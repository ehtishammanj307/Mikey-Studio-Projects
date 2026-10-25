import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BatteryCharging, Gauge, Zap, Monitor, type LucideIcon } from 'lucide-react';
import { CONCEPT_SPECS, CONCEPT_DISCLAIMER } from '@/data';

gsap.registerPlugin(ScrollTrigger);

const SPEC_ICONS: Record<string, LucideIcon> = {
  BatteryCharging,
  Gauge,
  Zap,
  Monitor,
};

export default function ConceptSpecsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const noteRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(itemRefs.current, { opacity: 1, y: 0 });
        gsap.set(noteRef.current, { opacity: 1 });
        return;
      }

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            delay: i * 0.1,
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
          }
        );
      });

      gsap.fromTo(noteRef.current,
        { opacity: 0 },
        {
          opacity: 1, duration: 0.6, ease: 'power2.out', delay: 0.5,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#263B50] py-20 lg:py-24 overflow-hidden">
      {/* Atmospheric gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(112,135,154,0.08) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section label — clean numbering instead of "05b" */}
        <div className="flex items-center gap-4 mb-12">
          <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">06</span>
          <div className="h-px w-12 bg-[#C6A879]/40" />
          <span className="font-body text-xs tracking-[0.3em] text-[#DCE7EE]/60 uppercase">Concept Snapshot</span>
        </div>

        {/* Four specification points */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#70879A]/15 rounded-2xl overflow-hidden">
          {CONCEPT_SPECS.map((spec, i) => {
            const Icon = SPEC_ICONS[spec.icon] ?? Zap;
            return (
              <div
                key={spec.label}
                ref={(el) => { itemRefs.current[i] = el; }}
                className="bg-[#263B50] px-6 py-8 lg:px-8 lg:py-10 flex flex-col"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <Icon size={18} strokeWidth={1.5} className="text-[#C6A879]/80" />
                  <span className="font-body text-[10px] tracking-[0.25em] text-[#C6A879]/80 uppercase">{spec.label}</span>
                </div>
                <div className="flex items-baseline gap-1.5 mb-4">
                  <span
                    className="font-display font-light text-[#F7F6F2] leading-none"
                    style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
                  >
                    {spec.value}
                  </span>
                  {spec.unit && (
                    <span className="font-display text-lg text-[#70879A]">{spec.unit}</span>
                  )}
                </div>
                <div className="h-px w-8 bg-[#C6A879]/30 mb-4" />
                <p className="font-body text-xs lg:text-sm text-[#DCE7EE]/60 leading-relaxed">{spec.description}</p>
              </div>
            );
          })}
        </div>

        {/* Disclaimer note */}
        <p
          ref={noteRef}
          className="mt-8 font-body text-xs text-[#70879A] leading-relaxed max-w-2xl"
        >
          {CONCEPT_DISCLAIMER}
        </p>
      </div>
    </section>
  );
}
