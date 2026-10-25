import { useRef, useLayoutEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { IMAGES } from '@/data';
import { scrollToSection } from '@/hooks';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.15 });
      tl.fromTo(wordmarkRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .fromTo(headlineRef.current, { opacity: 0, y: 60, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' }, '-=0.4')
        .fromTo(subRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
        .fromTo(ctaRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo(scrollRef.current, { opacity: 0 }, { opacity: 0.6, duration: 0.6, ease: 'power2.out' }, '-=0.3');

      gsap.to(imgRef.current, {
        scale: 1.15,
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to(overlayRef.current, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.to([wordmarkRef.current, headlineRef.current, subRef.current, ctaRef.current], {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '60% top',
          scrub: 1,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#101A2A]">
      {/* Background image */}
      <div ref={imgRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
        <img
          src={IMAGES.hero}
          alt="AERO ONE — futuristic luxury electric GT vehicle in cinematic lighting"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#101A2A]/60 via-[#101A2A]/20 to-[#101A2A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101A2A]/60 via-transparent to-[#172B40]/40" />
      </div>

      {/* Atmospheric blue glow */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 30%, rgba(112,135,154,0.12) 0%, transparent 70%)' }} />

      {/* Transition overlay — fades to midnight at bottom for seamless handoff to Design section */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-5 pointer-events-none"
        style={{ opacity: 0, background: 'linear-gradient(180deg, transparent 50%, #F3F0E8 100%)' }}
      />

      {/* Light sweep */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <div className="light-sweep" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-[1600px] mx-auto w-full px-6 lg:px-12 pt-20">
        {/* Wordmark */}
        <div ref={wordmarkRef} style={{ opacity: 0 }}>
          <span className="font-display text-sm tracking-[0.4em] text-[#C6A879]">NOVAIR — AERO ONE</span>
        </div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="font-display font-bold text-[#F7F6F2] leading-[1.05] tracking-tight text-balance mt-8"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', opacity: 0, willChange: 'transform, opacity, filter' }}
        >
          BEYOND THE
          <br />
          <span className="shimmer-text">SHAPE OF MOTION</span>
        </h1>

        {/* Supporting text */}
        <p
          ref={subRef}
          className="mt-8 max-w-xl font-body text-base lg:text-lg text-[#DCE7EE]/80 leading-relaxed"
          style={{ opacity: 0 }}
        >
          Introducing AERO ONE — a fully electric grand tourer that redefines presence through silence, light, and aerodynamic purity.
        </p>

        {/* CTA */}
        <div ref={ctaRef} className="mt-10 flex items-center gap-4" style={{ opacity: 0 }}>
          <button
            onClick={() => scrollToSection('#design')}
            className="glass-button px-7 py-3.5 rounded-xl font-body text-sm lg:text-base text-[#F7F6F2] hover:text-[#C6A879] transition-all duration-300 flex items-center gap-2"
          >
            Discover AERO ONE
            <ArrowDown size={16} className="scroll-pulse" />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ opacity: 0 }}
      >
        <span className="font-body text-[10px] tracking-[0.3em] text-[#DCE7EE]/50 uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[#70879A]/50 to-transparent" />
      </div>
    </section>
  );
}
