import { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMAGES } from '@/data';

gsap.registerPlugin(ScrollTrigger);

const SCENES = [
  {
    title: 'The Silhouette',
    image: IMAGES.sideProfile,
    text: 'A single uninterrupted line from nose to tail — sculpted by wind, not by convention.',
    label: 'Exterior',
  },
  {
    title: 'Front Lighting',
    image: IMAGES.frontDark,
    text: 'A crystalline lighting signature with individually addressable micro-LEDs projecting an ice-blue blade of light.',
    label: 'Detail',
  },
  {
    title: 'Aerodynamic Profile',
    image: IMAGES.aeroPanel,
    text: 'Active aero channels open and close in response to speed, balancing downforce and drag in real time.',
    label: 'Detail',
  },
  {
    title: 'Sculpted Body',
    image: IMAGES.blackStudio,
    text: 'Hand-finished panels flow into one another with seamless precision. Every surface serves the air.',
    label: 'Bodywork',
  },
  {
    title: 'The Interior',
    image: IMAGES.interiorDash,
    text: 'A floating cockpit with ambient ice-blue lighting and a panoramic digital interface — a sanctuary in motion.',
    label: 'Interior',
  },
];

export default function PrecisionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const onMq = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onMq);
    return () => mq.removeEventListener('change', onMq);
  }, []);

  useLayoutEffect(() => {
    if (isDesktop === false) return;

    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const section = sectionRef.current!;
      const totalScenes = SCENES.length;

      if (reduced) {
        SCENES.forEach((_, i) => {
          if (imgRefs.current[i]) gsap.set(imgRefs.current[i], { opacity: i === 0 ? 1 : 0 });
          if (textRefs.current[i]) gsap.set(textRefs.current[i], { opacity: i === 0 ? 1 : 0, y: 0 });
          if (dotRefs.current[i]) gsap.set(dotRefs.current[i], { backgroundColor: i === 0 ? '#C6A879' : 'rgba(112,135,154,0.2)', width: i === 0 ? 40 : 20 });
        });
        return;
      }

      SCENES.forEach((_, i) => {
        if (i > 0) {
          gsap.set(imgRefs.current[i], { opacity: 0, scale: 1.08 });
          gsap.set(textRefs.current[i], { opacity: 0, y: 40 });
        }
        gsap.set(dotRefs.current[i], { backgroundColor: i === 0 ? '#C6A879' : 'rgba(112,135,154,0.2)' });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScenes * 90}%`,
          pin: stickyRef.current,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeaveBack: () => {
            SCENES.forEach((_, i) => {
              gsap.set(imgRefs.current[i], { opacity: i === 0 ? 1 : 0, scale: i === 0 ? 1 : 1.08 });
              gsap.set(textRefs.current[i], { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 40 });
            });
            if (numberRef.current) numberRef.current.textContent = '01';
            SCENES.forEach((_, i) => {
              gsap.set(dotRefs.current[i], { backgroundColor: i === 0 ? '#C6A879' : 'rgba(112,135,154,0.2)', width: i === 0 ? 40 : 20 });
            });
          },
        },
      });

      const segSize = 1 / (totalScenes - 1);

      SCENES.forEach((_, i) => {
        if (i === 0) return;
        const segStart = (i - 1) * segSize;
        const transitionMid = segStart + segSize * 0.4;

        tl.to(imgRefs.current[i - 1], {
          opacity: 0,
          scale: 1.12,
          duration: segSize * 0.5,
          ease: 'power2.inOut',
        }, segStart)
        .to(imgRefs.current[i], {
          opacity: 1,
          scale: 1,
          duration: segSize * 0.5,
          ease: 'power2.inOut',
        }, segStart)
        .to(textRefs.current[i - 1], {
          opacity: 0,
          y: -30,
          duration: segSize * 0.25,
          ease: 'power2.in',
        }, segStart)
        .to(textRefs.current[i], {
          opacity: 1,
          y: 0,
          duration: segSize * 0.3,
          ease: 'power3.out',
        }, transitionMid)
        .to(numberRef.current, {
          duration: 0.01,
          onStart: () => {
            if (numberRef.current) numberRef.current.textContent = String(i + 1).padStart(2, '0');
          },
        }, transitionMid)
        .to(dotRefs.current[i], {
          backgroundColor: '#C6A879',
          width: 40,
          duration: segSize * 0.15,
          ease: 'power2.out',
        }, transitionMid)
        .to(dotRefs.current[i - 1], {
          backgroundColor: 'rgba(112,135,154,0.2)',
          width: 20,
          duration: segSize * 0.15,
          ease: 'power2.out',
        }, transitionMid);
      });

      tl.to(stickyRef.current, {
        opacity: 0.7,
        duration: 0.1,
        ease: 'none',
      }, 0.92);
    }, sectionRef);

    return () => ctx.revert();
  }, [isDesktop]);

  if (!isDesktop) {
    return (
      <section id="precision" ref={sectionRef} className="relative bg-[#172B40]">
        {SCENES.map((scene, i) => (
          <MobileScene key={i} scene={scene} index={i} />
        ))}
      </section>
    );
  }

  return (
    <section id="precision" ref={sectionRef} className="relative bg-[#172B40]">
      <div ref={stickyRef} className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* Atmospheric gradient */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 60% 30%, rgba(38,59,80,0.6) 0%, transparent 70%)' }} />

        {/* Background images — stacked for crossfade */}
        <div className="absolute inset-0 z-0">
          {SCENES.map((scene, i) => (
            <div
              key={i}
              ref={(el) => { imgRefs.current[i] = el; }}
              className="absolute inset-0"
              style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}
            >
              <img
                src={scene.image}
                alt={`${scene.title} — AERO ONE ${scene.label}`}
                className="w-full h-full object-cover"
                loading={i < 2 ? 'eager' : 'lazy'}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#172B40] via-[#172B40]/40 to-[#172B40]/5" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172B40]/90 via-transparent to-[#172B40]/30" />
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 lg:px-12 grid lg:grid-cols-2 gap-8 items-center">
          {/* Left: scene text */}
          <div className="relative" style={{ minHeight: 'clamp(200px, 30vh, 320px)' }}>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">03</span>
              <div className="h-px w-12 bg-[#C6A879]/40" />
              <span className="font-body text-xs tracking-[0.3em] text-[#DCE7EE]/60 uppercase">Form Meets Precision</span>
            </div>

            {SCENES.map((scene, i) => (
              <div
                key={i}
                ref={(el) => { textRefs.current[i] = el; }}
                className="absolute top-0 left-0 right-0"
                style={{ opacity: i === 0 ? 1 : 0, willChange: 'opacity, transform' }}
              >
                <span className="font-body text-xs tracking-[0.3em] text-[#C6A879]/80 uppercase block mb-4">
                  {scene.label}
                </span>
                <h3
                  className="font-display font-light text-[#F7F6F2] leading-[1.1] text-balance mb-5"
                  style={{ fontSize: 'clamp(1.6rem, 4vw, 3.5rem)' }}
                >
                  {scene.title}
                </h3>
                <p className="font-body text-sm lg:text-base text-[#DCE7EE]/80 leading-relaxed max-w-md">
                  {scene.text}
                </p>
              </div>
            ))}

            {/* Scene progress indicators */}
            <div className="absolute bottom-0 left-0 flex items-center gap-2">
              {SCENES.map((_, i) => (
                <div
                  key={i}
                  ref={(el) => { dotRefs.current[i] = el; }}
                  className="h-1 rounded-full"
                  style={{
                    width: i === 0 ? 40 : 20,
                    backgroundColor: i === 0 ? '#C6A879' : 'rgba(112,135,154,0.2)',
                    transition: 'width 0.3s ease, background-color 0.3s ease',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right: large number */}
          <div className="hidden lg:flex items-center justify-end">
            <span
              ref={numberRef}
              className="font-display font-bold text-[#263B50] leading-none select-none"
              style={{ fontSize: 'clamp(8rem, 20vw, 18rem)', opacity: 0.5 }}
            >
              01
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MobileScene({ scene, index }: { scene: typeof SCENES[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="relative min-h-[65vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={scene.image}
          alt={`${scene.title} — AERO ONE ${scene.label}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172B40] via-[#172B40]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172B40]/90 via-transparent to-[#172B40]/20" />
      </div>
      <div className="relative z-10 max-w-[1600px] mx-auto w-full px-6 py-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-display text-xs tracking-[0.3em] text-[#C6A879]">{String(index + 1).padStart(2, '0')}</span>
          <div className="h-px w-8 bg-[#C6A879]/40" />
          <span className="font-body text-xs tracking-[0.2em] text-[#C6A879]/80 uppercase">{scene.label}</span>
        </div>
        <h3
          className="font-display font-light text-[#F7F6F2] leading-[1.1] text-balance mb-4"
          style={{ fontSize: 'clamp(1.5rem, 7vw, 2.5rem)' }}
        >
          {scene.title}
        </h3>
        <p className="font-body text-sm text-[#DCE7EE]/80 leading-relaxed max-w-sm">
          {scene.text}
        </p>
      </div>
    </div>
  );
}
