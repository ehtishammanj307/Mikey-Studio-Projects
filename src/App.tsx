import { useState, useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SmoothScroll from '@/components/SmoothScroll';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import DesignSection from '@/components/DesignSection';
import PrecisionSection from '@/components/PrecisionSection';
import InteriorSection from '@/components/InteriorSection';
import PerformanceSection from '@/components/PerformanceSection';
import ConceptSpecsSection from '@/components/ConceptSpecsSection';
import TechnologySection from '@/components/TechnologySection';
import ExploreSection from '@/components/ExploreSection';
import GallerySection from '@/components/GallerySection';
import ClosingSection, { InterestForm } from '@/components/ClosingSection';
import Footer from '@/components/Footer';
import ConceptBriefModal from '@/components/ConceptBriefModal';
import type { VehicleConfig, InteriorConfig } from '@/data';

function App() {
  const [formOpen, setFormOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [vehicleConfig, setVehicleConfig] = useState<VehicleConfig>({ finishIndex: 0, viewpointIndex: 0 });
  const [interiorConfig, setInteriorConfig] = useState<InteriorConfig>({
    upholsteryId: 'nappa-noir',
    trimId: 'brushed-aluminum',
    moodId: 'mood-ice-blue',
  });

  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      clearTimeout(refreshTimer);
      window.removeEventListener('load', onLoad);
    };
  }, []);

  return (
    <SmoothScroll>
      <div className="relative bg-[#101A2A] min-h-screen">
        <div className="grain" />
        <Header onRegisterClick={() => setFormOpen(true)} />
        <main>
          <Hero />
          <DesignSection />
          <PrecisionSection />
          <InteriorSection
            interiorConfig={interiorConfig}
            onInteriorConfigChange={setInteriorConfig}
          />
          <PerformanceSection />
          <ConceptSpecsSection />
          <TechnologySection />
          <ExploreSection
            vehicleConfig={vehicleConfig}
            onVehicleConfigChange={setVehicleConfig}
            onConceptBriefClick={() => setBriefOpen(true)}
          />
          <GallerySection />
          <ClosingSection onRegisterClick={() => setFormOpen(true)} />
        </main>
        <Footer onRegisterClick={() => setFormOpen(true)} />
        <InterestForm open={formOpen} onClose={() => setFormOpen(false)} />
        <ConceptBriefModal
          open={briefOpen}
          onClose={() => setBriefOpen(false)}
          vehicleConfig={vehicleConfig}
          interiorConfig={interiorConfig}
        />
      </div>
    </SmoothScroll>
  );
}

export default App;
