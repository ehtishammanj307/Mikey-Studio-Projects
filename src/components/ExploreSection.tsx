import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, FileText, Car, CarFront, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { VIEWPOINTS, EXTERIOR_FINISHES, FINISH_IMAGES, type VehicleConfig } from '@/data';

interface ExploreSectionProps {
  vehicleConfig: VehicleConfig;
  onVehicleConfigChange: (config: VehicleConfig) => void;
  onConceptBriefClick: () => void;
}

const VIEWPOINT_ICONS = [CarFront, Car, ArrowLeft, LayoutDashboard];

export default function ExploreSection({ vehicleConfig, onVehicleConfigChange, onConceptBriefClick }: ExploreSectionProps) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [errorSrc, setErrorSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const requestIdRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { finishIndex: activeFinish, viewpointIndex: activeView } = vehicleConfig;
  const currentView = VIEWPOINTS[activeView];
  const currentFinish = EXTERIOR_FINISHES[activeFinish];
  const currentImage = FINISH_IMAGES[currentFinish.id]?.[currentView.id as 'front' | 'side' | 'rear' | 'interior'] ?? FINISH_IMAGES.obsidian.front;

  // Preload the new image, then crossfade. Prevents race conditions via requestId.
  useEffect(() => {
    const reqId = ++requestIdRef.current;
    setErrorSrc(null);
    setIsLoading(true);

    const img = new Image();
    img.onload = () => {
      if (reqId !== requestIdRef.current) return;
      setLoadedSrc(currentImage);
      setErrorSrc(null);
      setIsLoading(false);
    };
    img.onerror = () => {
      if (reqId !== requestIdRef.current) return;
      setErrorSrc(currentImage);
      setIsLoading(false);
    };
    img.src = currentImage;
  }, [currentImage]);

  const handleImgError = useCallback(() => {
    setErrorSrc(currentImage);
    setIsLoading(false);
  }, [currentImage]);

  // The image currently shown to the user (either the loaded one, or the previous one while loading)
  const displayedSrc = errorSrc ? null : (loadedSrc ?? null);
  const showFallback = errorSrc !== null || (isLoading && !loadedSrc);

  return (
    <section id="explore" ref={sectionRef} className="relative bg-[#F3F0E8] py-24 lg:py-32 overflow-hidden">
      {/* Subtle atmospheric background */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(231,216,197,0.4) 0%, #F3F0E8 70%)' }} />

      <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-display text-xs tracking-[0.4em] text-[#C6A879]">08</span>
          <div className="h-px w-12 bg-[#C6A879]/40" />
          <span className="font-body text-xs tracking-[0.3em] text-[#70879A] uppercase">Explore AERO ONE</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <h2
            className="font-display font-light text-[#172536] leading-[1.1] text-balance"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 5rem)' }}
          >
            See it from<br />every angle.
          </h2>
          {/* Concept Brief action */}
          <button
            onClick={onConceptBriefClick}
            className="flex items-center gap-2 glass-button-light px-5 py-3 rounded-xl font-body text-sm text-[#172536] hover:text-[#C6A879] transition-all duration-300 self-start lg:self-auto"
          >
            <FileText size={16} className="text-[#C6A879]" />
            View Concept Brief
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main viewer */}
          <div className="lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl aspect-[16/10] bg-[#101A2A] group" style={{ boxShadow: '0 30px 80px -20px rgba(16,26,42,0.35)' }}>
              {/* Previous/loaded image — always visible until next loads */}
              {displayedSrc && (
                <img
                  src={displayedSrc}
                  alt={`${currentView.label} view of AERO ONE in ${currentFinish.name}`}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                  style={{ opacity: 1 }}
                  onError={handleImgError}
                />
              )}

              {/* Error fallback */}
              {showFallback && !displayedSrc && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#F7F6F2]">
                  <div className="font-display text-sm tracking-[0.3em] text-[#F7F6F2]/40 uppercase">AERO ONE</div>
                  <div className="font-body text-xs text-[#F7F6F2]/30">
                    {errorSrc ? `${currentView.label} view unavailable` : 'Loading…'}
                  </div>
                  {isLoading && !errorSrc && (
                    <div className="w-8 h-8 border-2 border-[#F7F6F2]/20 border-t-[#C6A879] rounded-full animate-spin mt-2" />
                  )}
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101A2A]/50 via-transparent to-transparent pointer-events-none" />

              {/* Viewpoint label */}
              <div className="absolute bottom-6 left-6">
                <span className="font-display text-sm tracking-[0.3em] text-[#F7F6F2]/80 uppercase">{currentView.label}</span>
              </div>

              {/* Finish name badge */}
              <div className="absolute bottom-6 right-6 px-4 py-2 rounded-lg" style={{ background: 'rgba(16,26,42,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(198,168,121,0.2)' }}>
                <span className="font-body text-xs text-[#DCE7EE]/80">{currentFinish.name}</span>
              </div>
            </div>

            {/* Finish selector */}
            <div className="mt-8">
              <p className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-4">Exterior Finish — Visual Studies</p>
              <div className="flex items-center gap-3 flex-wrap">
                {EXTERIOR_FINISHES.map((finish, i) => (
                  <button
                    key={finish.id}
                    onClick={() => onVehicleConfigChange({ ...vehicleConfig, finishIndex: i })}
                    className="group relative flex flex-col items-center gap-2"
                    aria-label={`Select ${finish.name} finish`}
                    aria-pressed={activeFinish === i}
                  >
                    <div
                      className="w-10 h-10 rounded-full transition-all duration-300 border-2"
                      style={{
                        backgroundColor: finish.value,
                        borderColor: activeFinish === i ? '#C6A879' : 'rgba(112,135,154,0.25)',
                        transform: activeFinish === i ? 'scale(1.15)' : 'scale(1)',
                      }}
                    >
                      {activeFinish === i && (
                        <div className="w-full h-full flex items-center justify-center">
                          <Check size={14} className={finish.value === '#0E1116' || finish.value === '#1B2A4A' ? 'text-[#F7F6F2]' : 'text-[#101A2A]'} />
                        </div>
                      )}
                    </div>
                    <span
                      className={`font-body text-[10px] transition-colors duration-300 ${
                        activeFinish === i ? 'text-[#172536]' : 'text-[#70879A]/50'
                      }`}
                    >
                      {finish.name}
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 font-body text-[11px] text-[#70879A]/50">
                Each finish is presented as a separate visual study using real automotive photography. These are not images of a single production vehicle. Concept only.
              </p>
            </div>
          </div>

          {/* Right panel: viewpoint selector + details */}
          <div className="flex flex-col gap-6">
            {/* Viewpoint buttons */}
            <div>
              <p className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-4">Viewpoint</p>
              <div className="grid grid-cols-2 gap-3">
                {VIEWPOINTS.map((view, i) => {
                  const Icon = VIEWPOINT_ICONS[i] ?? Car;
                  return (
                    <button
                      key={view.id}
                      onClick={() => onVehicleConfigChange({ ...vehicleConfig, viewpointIndex: i })}
                      className="glass-button-light px-4 py-3 rounded-xl text-left transition-all duration-300 flex items-center gap-2"
                      style={{
                        backgroundColor: activeView === i ? 'rgba(198,168,121,0.12)' : '',
                        borderColor: activeView === i ? 'rgba(198,168,121,0.4)' : '',
                      }}
                      aria-pressed={activeView === i}
                    >
                      <Icon
                        size={16}
                        strokeWidth={1.5}
                        className={activeView === i ? 'text-[#C6A879]' : 'text-[#70879A]'}
                      />
                      <span
                        className={`font-body text-sm transition-colors duration-300 ${
                          activeView === i ? 'text-[#C6A879]' : 'text-[#70879A]'
                        }`}
                      >
                        {view.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detail panel */}
            <div className="rounded-2xl p-6 flex-1" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(112,135,154,0.15)' }}>
              <div className="flex items-center gap-3 mb-4">
                <Car size={16} strokeWidth={1.5} className="text-[#C6A879]" />
                <span className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase">Currently Viewing</span>
              </div>
              <h3 className="font-display text-xl font-medium text-[#172536] mb-3">{currentView.label}</h3>
              <p className="font-body text-sm text-[#70879A] leading-relaxed">{currentView.description}</p>

              {/* Selected finish display */}
              <div className="mt-6 pt-6 border-t border-[#70879A]/15">
                <p className="font-body text-xs tracking-[0.2em] text-[#70879A] uppercase mb-2">Selected Finish</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full border border-[#70879A]/25"
                    style={{ backgroundColor: currentFinish.value }}
                  />
                  <span className="font-body text-sm text-[#172536]">{currentFinish.name}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
