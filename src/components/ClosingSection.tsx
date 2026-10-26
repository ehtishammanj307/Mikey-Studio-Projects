import { useRef, useLayoutEffect, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, ArrowRight, X } from 'lucide-react';
import { IMAGES } from '@/data';
import { scrollToSection } from '@/hooks';
import SmartImage from '@/components/SmartImage';

gsap.registerPlugin(ScrollTrigger);

interface ClosingSectionProps {
  onRegisterClick: () => void;
}

export default function ClosingSection({ onRegisterClick }: ClosingSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(bgRef.current,
        { scale: 1 },
        {
          scale: 1.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 1,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="next-chapter" ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#101A2A]">
      {/* Background vehicle image */}
      <div className="absolute inset-0 z-0">
        <div ref={bgRef} className="absolute inset-0" style={{ willChange: 'transform' }}>
          <SmartImage
            src={IMAGES.nightSilhouette}
            alt="AERO ONE concept silhouette at night in an urban environment"
            className="w-full h-full object-cover"
            loading="lazy"
            fallbackLabel="AERO ONE"
            fallbackClassName="text-[#F7F6F2]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#101A2A] via-[#101A2A]/60 to-[#101A2A]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101A2A]/80 via-transparent to-[#101A2A]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-12 text-center py-24">
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">10</span>
          <div className="h-px w-12 bg-[#C6A879]/40" />
          <span className="font-body text-xs tracking-[0.3em] text-[#70879A] uppercase">The Next Chapter</span>
        </div>

        <h2
          className="font-display font-light text-[#F7F6F2] leading-[1.05] text-balance mb-8"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
        >
          The future is<br />not waiting.
        </h2>

        <p className="font-body text-base lg:text-xl text-[#70879A] leading-relaxed max-w-xl mx-auto mb-12">
          AERO ONE is a fictional concept — a statement about what electric mobility can become when design leads and technology follows.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => scrollToSection('#explore')}
            className="glass-button px-8 py-4 rounded-xl font-body text-sm lg:text-base text-[#F7F6F2] hover:text-[#C6A879] transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Explore the Vehicle
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onRegisterClick}
            className="px-8 py-4 rounded-xl font-body text-sm lg:text-base text-[#101A2A] bg-[#C6A879] hover:bg-[#D4BB8E] transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            Register Your Interest
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

// Interest form modal
interface InterestFormProps {
  open: boolean;
  onClose: () => void;
}

export function InterestForm({ open, onClose }: InterestFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [interest, setInterest] = useState('AERO ONE Concept');
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Focus management
  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      // Focus the close button after a short delay for the transition
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      // Restore focus to the element that opened the modal
      previouslyFocusedRef.current?.focus();
      setTimeout(() => {
        if (!open) {
          setSubmitted(false);
          setName('');
          setEmail('');
          setCountry('');
          setErrors({});
        }
      }, 400);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape key + focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const validate = () => {
    const newErrors: { name?: string; email?: string } = {};
    if (!name.trim()) newErrors.name = 'Please enter your name';
    if (!email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
    }
  };

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-400"
      style={{ opacity: open ? 1 : 0, backgroundColor: 'rgba(16,26,42,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="interest-form-title"
        className="relative w-full max-w-lg bg-[#172B40] rounded-2xl border border-[#C6A879]/15 p-8 lg:p-10 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          transition: 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        <button
          ref={closeBtnRef}
          onClick={handleClose}
          className="absolute top-4 right-4 text-[#70879A] hover:text-[#F7F6F2] p-2 transition-colors duration-300"
          aria-label="Close form"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-[#C6A879]/15 flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-[#C6A879]" />
            </div>
            <h3 id="interest-form-title" className="font-display text-2xl font-medium text-[#F7F6F2] mb-3">Demo Completed</h3>
            <p className="font-body text-sm text-[#70879A] leading-relaxed max-w-sm mx-auto">
              The form was submitted successfully as a demo. Your information has not been sent to a server or stored anywhere.
            </p>
            <button
              onClick={handleClose}
              className="mt-8 glass-button px-6 py-3 rounded-xl font-body text-sm text-[#F7F6F2] transition-all duration-300"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <span className="font-display text-xs tracking-[0.3em] text-[#C6A879] mb-2 block">NOVAIR</span>
              <h3 id="interest-form-title" className="font-display text-2xl lg:text-3xl font-light text-[#F7F6F2] mb-2">Register Your Interest</h3>
              <p className="font-body text-sm text-[#70879A]/80">Be among the first to experience the AERO ONE concept.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="name" className="font-body text-xs tracking-[0.15em] text-[#70879A] uppercase mb-2 block">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#101A2A] border border-[#70879A]/20 rounded-xl px-4 py-3 font-body text-sm text-[#F7F6F2] placeholder:text-[#70879A]/40 focus:border-[#C6A879]/50 focus:outline-none transition-colors duration-300"
                  placeholder="Your name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <p id="name-error" className="mt-2 font-body text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="font-body text-xs tracking-[0.15em] text-[#70879A] uppercase mb-2 block">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#101A2A] border border-[#70879A]/20 rounded-xl px-4 py-3 font-body text-sm text-[#F7F6F2] placeholder:text-[#70879A]/40 focus:border-[#C6A879]/50 focus:outline-none transition-colors duration-300"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 font-body text-xs text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="country" className="font-body text-xs tracking-[0.15em] text-[#70879A] uppercase mb-2 block">
                  Country <span className="text-[#70879A]/50 normal-case lowercase">(optional)</span>
                </label>
                <input
                  id="country"
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-[#101A2A] border border-[#70879A]/20 rounded-xl px-4 py-3 font-body text-sm text-[#F7F6F2] placeholder:text-[#70879A]/40 focus:border-[#C6A879]/50 focus:outline-none transition-colors duration-300"
                  placeholder="Your country"
                />
              </div>

              <div>
                <label htmlFor="interest" className="font-body text-xs tracking-[0.15em] text-[#70879A] uppercase mb-2 block">
                  I'm interested in
                </label>
                <select
                  id="interest"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-[#101A2A] border border-[#70879A]/20 rounded-xl px-4 py-3 font-body text-sm text-[#F7F6F2] focus:border-[#C6A879]/50 focus:outline-none transition-colors duration-300"
                >
                  <option>AERO ONE Concept</option>
                  <option>Future Production Model</option>
                  <option>Private Viewing Event</option>
                  <option>NOVAIR Brand Updates</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-body text-sm lg:text-base text-[#101A2A] bg-[#C6A879] hover:bg-[#D4BB8E] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Submit Registration
                <ArrowRight size={16} />
              </button>

              <p className="font-body text-xs text-[#70879A]/50 text-center">
                This is a concept demonstration. No data is sent to a server or stored.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
