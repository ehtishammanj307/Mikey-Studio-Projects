import { useEffect, useState, useMemo } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { NAV_LINKS } from '@/data';
import { useActiveSection, scrollToSection } from '@/hooks';

interface HeaderProps {
  onRegisterClick: () => void;
}

export default function Header({ onRegisterClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  // Track all major sections for accurate active state
  const sectionIds = useMemo(
    () => ['hero', 'design', 'interior', 'performance', 'technology', 'explore', 'gallery', 'next-chapter'],
    []
  );
  const activeSection = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      const bar = document.getElementById('scroll-progress-bar');
      if (bar) bar.style.width = `${progress * 100}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setMobileOpen(false);
    scrollToSection(href);
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(16, 26, 42, 0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(198, 168, 121, 0.12)' : '1px solid transparent',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-16 lg:h-20 flex items-center justify-between">
          {/* Wordmark */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="font-display text-lg lg:text-xl font-bold tracking-[0.3em] text-[#F7F6F2] transition-opacity duration-300 hover:opacity-80"
            aria-label="NOVAIR home"
          >
            NOVAIR
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`nav-link font-body text-sm tracking-wide transition-colors duration-300 ${
                    isActive ? 'active text-[#F7F6F2]' : 'text-[#70879A] hover:text-[#F7F6F2]'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={onRegisterClick}
              className="hidden sm:flex items-center gap-2 glass-button px-5 py-2.5 rounded-lg font-body text-sm text-[#F7F6F2] hover:gap-3 transition-all duration-300"
            >
              Register Interest
              <ArrowUpRight size={15} className="text-[#C6A879]" />
            </button>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-[#F7F6F2] p-2"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        <div id="scroll-progress-bar" className="absolute bottom-0 left-0 h-[2px] bg-[#C6A879] transition-all duration-150" style={{ width: '0%' }} />
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(16, 26, 42, 0.98)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between h-16 px-6">
          <span className="font-display text-lg font-bold tracking-[0.3em] text-[#F7F6F2]">NOVAIR</span>
          <button onClick={() => setMobileOpen(false)} className="text-[#F7F6F2] p-2" aria-label="Close menu">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col px-6 mt-4 gap-1 overflow-y-auto" aria-label="Mobile navigation" style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-display text-2xl font-light text-[#70879A] hover:text-[#F7F6F2] py-3 border-b border-[#70879A]/15 transition-all duration-300"
              style={{
                opacity: mobileOpen ? 1 : 0,
                transform: mobileOpen ? 'translateX(0)' : 'translateX(20px)',
                transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`,
              }}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onRegisterClick();
            }}
            className="mt-6 mb-8 flex items-center justify-center gap-2 glass-button px-6 py-4 rounded-xl font-body text-base text-[#F7F6F2]"
          >
            Register Interest
            <ArrowUpRight size={18} className="text-[#C6A879]" />
          </button>
        </nav>
      </div>
    </>
  );
}
