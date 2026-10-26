import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMAGES } from '@/data';

gsap.registerPlugin(ScrollTrigger);

const PHRASES = [
  { text: 'Instant Response', subtext: 'Torque delivered the moment you ask for it.' },
  { text: 'Quietly Uncompromising', subtext: 'A drive so silent, the road becomes the only sound.' },
  { text: 'Effortless Flow', subtext: 'Adaptive air suspension reads the road 1,000 times per second.' },
];

export default function PerformanceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const bgImgRef = useRef<HTMLImageElement>(null);
  const phraseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const total = PHRASES.length;

      if (reduced) {
        PHRASES.forEach((_, i) => {
          if (i < total - 1) {
            gsap.set(phraseRefs.current[i], { opacity: 0 });
            gsap.set(dotRefs.current[i], { width: 12, backgroundColor: 'rgba(112,135,154,0.3)' });
          } else {
            gsap.set(phraseRefs.current[i], { opacity: 1, y: 0, scale: 1 });
            gsap.set(dotRefs.current[i], { width: 40, backgroundColor: '#C6A879' });
          }
        });
        return;
      }

      PHRASES.forEach((_, i) => {
        gsap.set(phraseRefs.current[i], { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40, scale: i === 0 ? 1 : 0.92 });
        gsap.set(dotRefs.current[i], { width: i === 0 ? 40 : 12, backgroundColor: i === 0 ? '#C6A879' : 'rgba(112,135,154,0.3)' });
      });

      const segSize = 1 / (total - 1);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${total * 100}%`,
          pin: stickyRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeaveBack: () => {
            PHRASES.forEach((_, i) => {
              gsap.set(phraseRefs.current[i], { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40, scale: i === 0 ? 1 : 0.92 });
              gsap.set(dotRefs.current[i], { width: i === 0 ? 40 : 12, backgroundColor: i === 0 ? '#C6A879' : 'rgba(112,135,154,0.3)' });
            });
            if (bgImgRef.current) gsap.set(bgImgRef.current, { scale: 1, opacity: 0.4 });
          },
        },
      });

      tl.to(bgImgRef.current, {
        scale: 1.15,
        opacity: 0.7,
        ease: 'none',
        duration: 1,
      }, 0);

      PHRASES.forEach((_, i) => {
        if (i === 0) return;
        const segStart = (i - 1) * segSize;
        const mid = segStart + segSize * 0.5;

        tl.to(phraseRefs.current[i - 1], {
          opacity: 0, y: -40, scale: 0.92,
          duration: segSize * 0.3, ease: 'power2.in',
        }, segStart)
        .to(phraseRefs.current[i], {
          opacity: 1, y: 0, scale: 1,
          duration: segSize * 0.35, ease: 'power3.out',
        }, mid - segSize * 0.1)
        .to(dotRefs.current[i], {
          width: 40, backgroundColor: '#C6A879',
          duration: segSize * 0.15, ease: 'power2.out',
        }, mid)
        .to(dotRefs.current[i - 1], {
          width: 12, backgroundColor: 'rgba(112,135,154,0.3)',
          duration: segSize * 0.15, ease: 'power2.out',
        }, mid);
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="performance" ref={sectionRef} className="relative bg-[#172B40]">
      <div ref={stickyRef} className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Background motion blur image */}
        <div className="absolute inset-0 z-0">
          <img
            ref={bgImgRef}
            src={IMAGES.motionBlur}
            alt="AERO ONE in motion with blurred city lights"
            className="w-full h-full object-cover"
            loading="lazy"
            style={{ willChange: 'transform, opacity' }}
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#172B40] via-[#172B40]/50 to-[#172B40]" />
        </div>

        {/* Steel-blue atmospheric glow */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(112,135,154,0.15) 0%, transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">05</span>
            <div className="h-px w-12 bg-[#C6A879]/40" />
            <span className="font-body text-xs tracking-[0.3em] text-[#DCE7EE]/60 uppercase">Performance in Silence</span>
          </div>

          {/* Kinetic phrases */}
          <div className="relative" style={{ height: 'clamp(200px, 30vh, 300px)' }}>
            {PHRASES.map((phrase, i) => (
              <div
                key={i}
                ref={(el) => { phraseRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}
              >
                <h2
                  className="font-display font-bold text-[#F7F6F2] leading-[1.05] text-balance mb-6"
                  style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)' }}
                >
                  {phrase.text}
                </h2>
                <p className="font-body text-base lg:text-lg text-[#DCE7EE]/70 max-w-lg">{phrase.subtext}</p>
              </div>
            ))}
          </div>

          {/* Progress dots */}
          <div className="mt-12 flex items-center justify-center gap-3">
            {PHRASES.map((_, i) => (
              <div
                key={i}
                ref={(el) => { dotRefs.current[i] = el; }}
                className="h-1 rounded-full"
                style={{
                  width: i === 0 ? 40 : 12,
                  backgroundColor: i === 0 ? '#C6A879' : 'rgba(112,135,154,0.3)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
