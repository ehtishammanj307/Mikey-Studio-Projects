import { useEffect, useRef, useCallback } from 'react';
import { X, FileText } from 'lucide-react';
import { EXTERIOR_FINISHES, VIEWPOINTS, CONCEPT_SPECS, CONCEPT_BRIEF_PHILOSOPHY, INTERIOR_MATERIALS, CONCEPT_DISCLAIMER, type VehicleConfig, type InteriorConfig } from '@/data';

interface ConceptBriefModalProps {
  open: boolean;
  onClose: () => void;
  vehicleConfig: VehicleConfig;
  interiorConfig: InteriorConfig;
}

export default function ConceptBriefModal({ open, onClose, vehicleConfig, interiorConfig }: ConceptBriefModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Body scroll lock + focus management
  useEffect(() => {
    if (open) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      previouslyFocusedRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Escape + focus trap
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

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) return null;

  const finish = EXTERIOR_FINISHES[vehicleConfig.finishIndex];
  const viewpoint = VIEWPOINTS[vehicleConfig.viewpointIndex];
  const upholstery = INTERIOR_MATERIALS.find(m => m.id === interiorConfig.upholsteryId);
  const trim = INTERIOR_MATERIALS.find(m => m.id === interiorConfig.trimId);
  const mood = INTERIOR_MATERIALS.find(m => m.id === interiorConfig.moodId);

  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center p-4 transition-opacity duration-400"
      style={{ opacity: open ? 1 : 0, backgroundColor: 'rgba(16,26,42,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="concept-brief-title"
        className="relative w-full max-w-2xl bg-[#172B40] rounded-2xl border border-[#C6A879]/15 p-8 lg:p-10 max-h-[90vh] overflow-y-auto"
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
          aria-label="Close concept brief"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <FileText size={18} strokeWidth={1.5} className="text-[#C6A879]" />
          <span className="font-display text-xs tracking-[0.3em] text-[#C6A879]">CONCEPT BRIEF</span>
        </div>

        <h3 id="concept-brief-title" className="font-display text-2xl lg:text-3xl font-light text-[#F7F6F2] mb-6">AERO ONE — Design Summary</h3>

        {/* Philosophy */}
        <div className="mb-8">
          <h4 className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-3">Design Philosophy</h4>
          <p className="font-body text-sm text-[#DCE7EE]/80 leading-relaxed">{CONCEPT_BRIEF_PHILOSOPHY}</p>
        </div>

        {/* Selected configuration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="rounded-xl p-5 bg-[#101A2A] border border-[#70879A]/15">
            <h4 className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-3">Exterior Configuration</h4>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-6 rounded-full border border-[#70879A]/25" style={{ backgroundColor: finish.value }} />
              <span className="font-body text-sm text-[#F7F6F2]">{finish.name}</span>
            </div>
            <p className="font-body text-xs text-[#70879A]">Viewpoint: {viewpoint.label}</p>
            <p className="mt-1 font-body text-[10px] text-[#70879A]/50">Visual study — not a single production vehicle</p>
          </div>

          <div className="rounded-xl p-5 bg-[#101A2A] border border-[#70879A]/15">
            <h4 className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-3">Interior Direction</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-[#70879A]/20" style={{ backgroundColor: upholstery?.swatch }} />
                <span className="font-body text-xs text-[#F7F6F2]">{upholstery?.name ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-[#70879A]/20" style={{ backgroundColor: trim?.swatch }} />
                <span className="font-body text-xs text-[#F7F6F2]">{trim?.name ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-[#70879A]/20" style={{ backgroundColor: mood?.swatch }} />
                <span className="font-body text-xs text-[#F7F6F2]">{mood?.name ?? '—'} ambient</span>
              </div>
            </div>
          </div>
        </div>

        {/* Concept targets */}
        <div className="mb-8">
          <h4 className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-4">Illustrative Concept Targets</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CONCEPT_SPECS.map(spec => (
              <div key={spec.label} className="rounded-xl p-4 bg-[#101A2A] border border-[#70879A]/10">
                <span className="font-body text-[10px] tracking-[0.2em] text-[#C6A879]/70 uppercase block mb-2">{spec.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl font-light text-[#F7F6F2]">{spec.value}</span>
                  {spec.unit && <span className="font-display text-sm text-[#70879A]">{spec.unit}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="rounded-xl p-4 bg-[#101A2A]/60 border border-[#C6A879]/10">
          <p className="font-body text-xs text-[#70879A] leading-relaxed">{CONCEPT_DISCLAIMER}</p>
        </div>

        <p className="mt-4 font-body text-xs text-[#70879A]/50 text-center">
          This summary is generated locally in your browser. No configuration is saved remotely.
        </p>
      </div>
    </div>
  );
}
