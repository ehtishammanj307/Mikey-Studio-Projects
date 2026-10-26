import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Armchair, Layers, Lightbulb } from 'lucide-react';
import { IMAGES, INTERIOR_MATERIALS, type InteriorConfig } from '@/data';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

const INTERIOR_FEATURES = [
  { title: 'Floating Cockpit', text: 'A concept driver-focused dashboard that appears to hover, wrapped in premium leather with contrast ice-blue stitching.', image: IMAGES.interiorDash },
  { title: 'Ambient Lighting', text: 'A concept 128-zone ambient lighting system transitions seamlessly from warm amber to ice-blue, responding to time of day and driving mode.', image: IMAGES.interiorAmbient },
  { title: 'Sculpted Seating', text: 'Concept sixteen-way adjustable seats with massage, ventilation, and memory foam cores — designed for grand touring comfort.', image: IMAGES.interiorLeather },
  { title: 'Digital Interface', text: 'A concept 32-inch panoramic display with haptic feedback integrates navigation, media, and vehicle status in a single horizon line.', image: IMAGES.interiorModern },
];

const MATERIAL_CATEGORIES = [
  { id: 'upholstery' as const, label: 'Upholstery', icon: Armchair },
  { id: 'trim' as const, label: 'Trim', icon: Layers },
  { id: 'mood' as const, label: 'Ambient Mood', icon: Lightbulb },
];

interface InteriorSectionProps {
  interiorConfig: InteriorConfig;
  onInteriorConfigChange: (config: InteriorConfig) => void;
}

export default function InteriorSection({ interiorConfig, onInteriorConfigChange }: InteriorSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const heroImgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const materialsRef = useRef<HTMLDivElement>(null);
  const [previewImage, setPreviewImage] = useState<string>(IMAGES.interiorDash);

  // Update preview when material selection changes
  useEffect(() => {
    const selected = INTERIOR_MATERIALS.find(m =>
      m.id === interiorConfig.upholsteryId ||
      m.id === interiorConfig.trimId ||
      m.id === interiorConfig.moodId
    );
    if (selected) {
      setPreviewImage(selected.image);
    }
  }, [interiorConfig]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduced) {
        gsap.set(bgRef.current, { opacity: 1 });
        gsap.set(headlineRef.current, { opacity: 1, y: 0 });
        featureRefs.current.forEach((el) => {
          if (el) gsap.set(el, { opacity: 1, y: 0 });
        });
        return;
      }

      gsap.to(bgRef.current, {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      });

      gsap.to(heroImgRef.current, {
        scale: 1.08,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });

      gsap.fromTo(headlineRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: headlineRef.current, start: 'top 85%', once: true },
        }
      );

      featureRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(el,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            delay: i * 0.12,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        );
      });

      if (materialsRef.current) {
        gsap.fromTo(materialsRef.current,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: materialsRef.current, start: 'top 85%', once: true },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMaterialSelect = (materialId: string, category: 'upholstery' | 'trim' | 'mood') => {
    onInteriorConfigChange({
      ...interiorConfig,
      [category === 'upholstery' ? 'upholsteryId' : category === 'trim' ? 'trimId' : 'moodId']: materialId,
    });
  };

  const selectedUpholstery = INTERIOR_MATERIALS.find(m => m.id === interiorConfig.upholsteryId);
  const selectedTrim = INTERIOR_MATERIALS.find(m => m.id === interiorConfig.trimId);
  const selectedMood = INTERIOR_MATERIALS.find(m => m.id === interiorConfig.moodId);

  return (
    <section id="interior" ref={sectionRef} className="relative bg-[#E7D8C5] overflow-hidden">
      {/* Transition gradient */}
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          opacity: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(231,216,197,0.4) 30%, rgba(231,216,197,0.8) 70%, #E7D8C5 100%)',
        }}
      />

      {/* Main hero interior image */}
      <div className="relative z-10 pt-24 lg:pt-32 pb-16">
        <div ref={headlineRef} className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">04</span>
            <div className="h-px w-12 bg-[#C6A879]/40" />
            <span className="font-body text-xs tracking-[0.3em] text-[#70879A] uppercase">Enter the Interior</span>
          </div>

          <h2
            className="font-display font-light text-[#172536] leading-[1.1] text-balance max-w-3xl mb-12"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
          >
            A sanctuary<br />in motion.
          </h2>
        </div>

        {/* Large interior image */}
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[16/9] lg:aspect-[21/9] bg-[#263B50]" style={{ boxShadow: '0 30px 80px -20px rgba(16,26,42,0.35)' }}>
            <div ref={heroImgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
              <SmartImage
                src={IMAGES.interiorDash}
                alt="AERO ONE concept interior cockpit with ambient lighting and digital dashboard"
                className="w-full h-full object-cover"
                loading="lazy"
                fallbackLabel="AERO ONE"
                fallbackClassName="text-[#F7F6F2]"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#101A2A]/50 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Feature grid with alternating layout */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-12">
          {INTERIOR_FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              ref={(el) => { featureRefs.current[i] = el; }}
              className={`group relative overflow-hidden rounded-2xl ${i % 2 === 1 ? 'lg:translate-y-16' : ''}`}
              style={{
                boxShadow: '0 20px 50px -15px rgba(16,26,42,0.25)',
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#263B50]">
                <SmartImage
                  src={feature.image}
                  alt={`${feature.title} — concept interior study`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  fallbackLabel="AERO ONE"
                  fallbackClassName="text-[#F7F6F2]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101A2A]/60 to-transparent pointer-events-none" />
              </div>
              <div className="mt-6 px-2">
                <h3 className="font-display text-xl lg:text-2xl font-medium text-[#172536] mb-3">{feature.title}</h3>
                <p className="font-body text-sm lg:text-base text-[#70879A] leading-relaxed max-w-md">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Materials personalization explorer */}
      <div ref={materialsRef} className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 pb-24 lg:pb-32">
        <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(20px)', border: '1px solid rgba(112,135,154,0.15)' }}>
          <div className="grid lg:grid-cols-5 gap-0">
            {/* Preview image — honestly labeled as a material reference, not a full cabin render */}
            <div className="lg:col-span-2 relative aspect-[4/3] lg:aspect-auto lg:min-h-[400px] overflow-hidden bg-[#263B50]">
              <SmartImage
                key={previewImage}
                src={previewImage}
                alt="Interior material reference preview — concept study"
                className="w-full h-full object-cover transition-opacity duration-500"
                loading="lazy"
                fallbackLabel="AERO ONE"
                fallbackClassName="text-[#F7F6F2]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101A2A]/40 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4">
                <span className="font-display text-xs tracking-[0.2em] text-[#F7F6F2]/80 uppercase">Material Reference</span>
              </div>
            </div>

            {/* Material selectors */}
            <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-[#C6A879]" />
                <span className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase">Personalize Your Cabin</span>
              </div>
              <h3 className="font-display text-xl lg:text-2xl font-medium text-[#172536] mb-6">Concept Materials Explorer</h3>

              {/* Category sections */}
              <div className="space-y-6">
                {MATERIAL_CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const materials = INTERIOR_MATERIALS.filter(m => m.category === cat.id);
                  const selectedId = cat.id === 'upholstery' ? interiorConfig.upholsteryId : cat.id === 'trim' ? interiorConfig.trimId : interiorConfig.moodId;
                  const selected = cat.id === 'upholstery' ? selectedUpholstery : cat.id === 'trim' ? selectedTrim : selectedMood;

                  return (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon size={16} strokeWidth={1.5} className="text-[#C6A879]" />
                          <p className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase">{cat.label}</p>
                        </div>
                        <span className="font-body text-xs text-[#172536]">{selected?.name ?? '—'}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        {materials.map(mat => (
                          <button
                            key={mat.id}
                            onClick={() => handleMaterialSelect(mat.id, cat.id)}
                            className="group relative flex flex-col items-center gap-1.5"
                            aria-label={`Select ${mat.name}`}
                            aria-pressed={selectedId === mat.id}
                          >
                            <div
                              className="w-9 h-9 rounded-full transition-all duration-300 border-2"
                              style={{
                                backgroundColor: mat.swatch,
                                borderColor: selectedId === mat.id ? '#C6A879' : 'rgba(112,135,154,0.25)',
                                transform: selectedId === mat.id ? 'scale(1.12)' : 'scale(1)',
                              }}
                            />
                            <span
                              className={`font-body text-[9px] transition-colors duration-300 ${
                                selectedId === mat.id ? 'text-[#172536]' : 'text-[#70879A]/50'
                              }`}
                            >
                              {mat.name}
                            </span>
                          </button>
                        ))}
                      </div>
                      {selected && (
                        <p className="mt-2 font-body text-[11px] text-[#70879A] leading-relaxed">{selected.description}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="mt-6 font-body text-[11px] text-[#70879A]/50 leading-relaxed">
                Concept study only. The preview shows a material reference image, not a fully rendered cabin combining all selections. Material names and finishes are illustrative and do not represent certified production materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
