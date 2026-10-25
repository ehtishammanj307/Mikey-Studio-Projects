import { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMAGES } from '@/data';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  { src: IMAGES.gallery1, alt: 'Concept automotive design study in a futuristic showroom setting', span: 'lg:col-span-2 lg:row-span-2', aspect: 'aspect-[4/3]' },
  { src: IMAGES.gallery3, alt: 'Close-up of automotive aerodynamic bodywork — concept detail study', span: '', aspect: 'aspect-square' },
  { src: IMAGES.gallery6, alt: 'Vehicle in a dark architectural environment — concept study', span: '', aspect: 'aspect-square' },
  { src: IMAGES.gallery7, alt: 'Silver concept vehicle in a modern auto show — design study', span: 'lg:col-span-2', aspect: 'aspect-[16/9]' },
  { src: IMAGES.gallery5, alt: 'Vehicle in a monochrome showroom setting — concept study', span: '', aspect: 'aspect-square' },
  { src: IMAGES.gallery8, alt: 'High-performance vehicle in a dim garage — concept study', span: '', aspect: 'aspect-square' },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(itemRefs.current, { opacity: 1, y: 0 });
        return;
      }

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            delay: i * 0.08,
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="gallery" ref={sectionRef} className="relative bg-[#F3F0E8] py-24 lg:py-32 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">09</span>
          <div className="h-px w-12 bg-[#C6A879]/40" />
          <span className="font-body text-xs tracking-[0.3em] text-[#70879A] uppercase">A Different Perspective</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-end mb-16">
          <h2
            className="font-display font-light text-[#172536] leading-[1.1] text-balance"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
          >
            Photographed<br />like architecture.
          </h2>
          <p className="font-body text-base lg:text-lg text-[#70879A] leading-relaxed max-w-lg">
            AERO ONE exists between machine and sculpture. These images are design studies exploring the vehicle as a design object within architectural space.
          </p>
        </div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-auto">
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              ref={(el) => { itemRefs.current[i] = el; }}
              className={`group relative overflow-hidden rounded-2xl ${item.span} ${item.aspect} bg-[#263B50]`}
              style={{ boxShadow: '0 15px 40px -12px rgba(16,26,42,0.25)' }}
            >
              <SmartImage
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                fallbackLabel="AERO ONE"
                fallbackClassName="text-[#F7F6F2]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101A2A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
