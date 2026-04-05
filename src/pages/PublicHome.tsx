import { useState, type FC } from 'react';
import { Hero } from '../sections/Hero/Hero';
import { LaptopSection } from '../sections/LaptopSection/LaptopSection';
import { FeaturedWork } from '../sections/FeaturedWork/FeaturedWork';
import { Services } from '../sections/Services/Services';
import { Marquee } from '../sections/Marquee/Marquee';
import { Process } from '../sections/Process/Process';
import { Testimonials } from '../sections/Testimonials/Testimonials';
import { Metrics } from '../sections/Metrics/Metrics';
import { AIAssistant } from '../sections/AIAssistant/AIAssistant';
import { StartProject } from '../sections/StartProject/StartProject';
import { ContactCTA } from '../sections/ContactCTA/ContactCTA';
import { Footer } from '../sections/Footer/Footer';
import { Navbar } from '../components/common/Navbar';
import { type Language } from '../data/content';
import { useAdmin } from '../contexts/useAdmin';

export const PublicHome: FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const { sections } = useAdmin();

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'ar' : 'en');
  };

  // Map IDs tightly to Components
  const sectionComponentMap: Record<string, FC<{lang: Language, id?: string}>> = {
    hero: Hero,
    laptop: LaptopSection,
    projects: FeaturedWork,
    services: Services,
    marquee: Marquee,
    process: Process,
    'start-project': StartProject,
    testimonials: Testimonials,
    metrics: Metrics,
    contact: ContactCTA
  };

  return (
    <main 
      className={`min-h-screen text-white selection:bg-accent-violet/30 ${lang === 'ar' ? 'rtl font-arabic' : 'ltr uppercase-none'}`}
    >
      <Navbar lang={lang} onLanguageToggle={toggleLanguage} />

      {/* Sections in Architectural Order injected dynamically from Admin */}
      {sections.filter(s => s.isVisible).map(section => {
        const Component = sectionComponentMap[section.id];
        if (!Component) return null;
        
        return (
          <div key={section.id} id={section.id}>
             <Component lang={lang} />
          </div>
        );
      })}

      <Footer lang={lang} />

      {/* AI Assistant Floating Layer */}
      <AIAssistant lang={lang} />
    </main>
  );
};
