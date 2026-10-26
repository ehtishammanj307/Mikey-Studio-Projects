import { useState } from 'react';
import { ArrowUp, Info, X, ShieldQuestion, FileText } from 'lucide-react';
import { scrollToSection } from '@/hooks';

const FOOTER_LINKS = [
  { label: 'Discover', href: '#hero' },
  { label: 'Design', href: '#design' },
  { label: 'Interior', href: '#interior' },
  { label: 'Technology', href: '#technology' },
  { label: 'Explore', href: '#explore' },
  { label: 'Gallery', href: '#gallery' },
];

interface FooterProps {
  onRegisterClick: () => void;
}

export default function Footer({ onRegisterClick }: FooterProps) {
  const [infoPanel, setInfoPanel] = useState<'privacy' | 'terms' | null>(null);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="relative bg-[#101A2A] border-t border-[#70879A]/15 pt-16 pb-8">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Top section */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="font-display text-2xl font-bold tracking-[0.3em] text-[#F7F6F2] mb-4">NOVAIR</div>
              <p className="font-body text-sm text-[#70879A] leading-relaxed max-w-sm mb-6">
                Beyond the Shape of Motion. A fictional concept vision of electric luxury mobility.
              </p>
              <button
                onClick={onRegisterClick}
                className="glass-button px-5 py-2.5 rounded-lg font-body text-sm text-[#F7F6F2] hover:text-[#C6A879] transition-all duration-300"
              >
                Register Interest
              </button>
            </div>

            {/* Navigation */}
            <div>
              <p className="font-body text-xs tracking-[0.2em] text-[#C6A879] uppercase mb-4">Navigate</p>
              <ul className="space-y-3">
                {FOOTER_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="font-body text-sm text-[#70879A] hover:text-[#F7F6F2] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Concept info */}
            <div>
              <p className="font-body text-xs tracking-[0.2em] text-[#C6A879] uppercase mb-4">Concept</p>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setInfoPanel('privacy')}
                    className="font-body text-sm text-[#70879A] hover:text-[#F7F6F2] transition-colors duration-300 text-left"
                  >
                    Privacy Notice
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setInfoPanel('terms')}
                    className="font-body text-sm text-[#70879A] hover:text-[#F7F6F2] transition-colors duration-300 text-left"
                  >
                    Terms of Use
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleBackToTop}
                    className="font-body text-sm text-[#70879A] hover:text-[#F7F6F2] transition-colors duration-300 text-left"
                  >
                    Back to Top
                  </button>
                </li>
                <li className="flex items-start gap-2 pt-2">
                  <Info size={14} className="text-[#70879A]/50 mt-0.5 shrink-0" />
                  <span className="font-body text-xs text-[#70879A]/50 leading-relaxed">
                    NOVAIR AERO ONE is a fictional concept. No real product exists.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-[#70879A]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-[#70879A]/60">
              © 2026 NOVAIR. A fictional concept demonstration. All rights reserved.
            </p>

            <button
              onClick={handleBackToTop}
              className="group flex items-center gap-2 font-body text-xs text-[#70879A] hover:text-[#C6A879] transition-colors duration-300"
              aria-label="Back to top"
            >
              Back to top
              <span className="w-8 h-8 rounded-full border border-[#70879A]/30 flex items-center justify-center group-hover:border-[#C6A879]/50 transition-colors duration-300">
                <ArrowUp size={14} />
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* Info panel modal — Privacy / Terms */}
      {infoPanel && (
        <div
          className="fixed inset-0 z-[75] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(16,26,42,0.88)', backdropFilter: 'blur(8px)' }}
          onClick={() => setInfoPanel(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-panel-title"
            className="relative w-full max-w-lg bg-[#172B40] rounded-2xl border border-[#C6A879]/15 p-8 lg:p-10 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'infoPanelIn 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <button
              onClick={() => setInfoPanel(null)}
              className="absolute top-4 right-4 text-[#70879A] hover:text-[#F7F6F2] p-2 transition-colors duration-300"
              aria-label="Close panel"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              {infoPanel === 'privacy' ? (
                <ShieldQuestion size={20} strokeWidth={1.5} className="text-[#C6A879]" />
              ) : (
                <FileText size={20} strokeWidth={1.5} className="text-[#C6A879]" />
              )}
              <span className="font-display text-xs tracking-[0.3em] text-[#C6A879] uppercase">
                {infoPanel === 'privacy' ? 'Privacy Notice' : 'Terms of Use'}
              </span>
            </div>

            <h3 id="info-panel-title" className="font-display text-xl lg:text-2xl font-light text-[#F7F6F2] mb-4">
              {infoPanel === 'privacy' ? 'About This Concept Website' : 'About This Concept Website'}
            </h3>

            <div className="space-y-4">
              <p className="font-body text-sm text-[#DCE7EE]/80 leading-relaxed">
                NOVAIR AERO ONE is a fictional automotive concept created for demonstration purposes only.
                No real company, product, or service exists under this name.
              </p>
              <p className="font-body text-sm text-[#DCE7EE]/80 leading-relaxed">
                {infoPanel === 'privacy'
                  ? 'The registration form on this website does not transmit, save, or process any personal information. All form interactions happen entirely in your browser. No data is sent to a server or stored anywhere.'
                  : 'This website is a design study. It does not constitute an offer, commitment, or legal agreement. No warranties or guarantees are implied. All content is fictional and for illustrative purposes only.'}
              </p>
              <p className="font-body text-sm text-[#DCE7EE]/80 leading-relaxed">
                All vehicle specifications, features, and performance figures are illustrative concept targets
                and do not represent a production vehicle.
              </p>
              <p className="font-body text-sm text-[#70879A] leading-relaxed">
                No actual privacy policy, terms of service, or legal framework applies, because this is not a real product or service.
              </p>
            </div>

            <button
              onClick={() => setInfoPanel(null)}
              className="mt-8 glass-button px-6 py-3 rounded-xl font-body text-sm text-[#F7F6F2] transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
