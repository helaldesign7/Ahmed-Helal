import { motion, useScroll, useTransform } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Rocket } from 'lucide-react';
import { type Language } from '../../data/content';
import { type SectionBlueprint } from '../../types/admin';
import { LoginModal } from '../auth/LoginModal';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/useAdmin';
import { ProfileDropdown } from './ProfileDropdown';

interface NavbarProps {
  lang: Language;
  onLanguageToggle: () => void;
}

export const Navbar = ({ lang, onLanguageToggle }: NavbarProps) => {
  const { user } = useAuth();
  const { appearance, siteContent, sections } = useAdmin();
  const [activeTab, setActiveTab] = useState('Home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { scrollY } = useScroll();

  const isRtl = lang === 'ar';

  const t = {
    en: {
      startProject: 'Start Project',
      signIn: 'Sign In',
      admin: 'Admin Dashboard'
    },
    ar: {
      startProject: 'ابدأ مشروعاً',
      signIn: 'دخول',
      admin: 'لوحة التحكم'
    }
  };

  const navBackground = useTransform(
    scrollY, 
    [0, 200], 
    ["rgba(0, 0, 0, 0)", "rgba(5, 5, 5, 0.8)"]
  );
  
  const navBlur = useTransform(
    scrollY,
    [0, 200],
    ["blur(0px)", "blur(32px)"]
  );

  const logoText = siteContent.hero.title[lang];

  // 🔄 Dynamic nav items injected from Admin Sort Order
  const navItems = useMemo(() => {
    // If sections is not loaded yet or empty, provide a basic default
    const safeSections: SectionBlueprint[] = sections.length > 0 ? sections : [
      { id: 'hero', name: 'Home', isVisible: true, inNavbar: true, order: 0, navLabel: { en: 'Home', ar: 'الرئيسية' }, type: 'core' },
      { id: 'projects', name: 'Portfolio', isVisible: true, inNavbar: true, order: 1, navLabel: { en: 'Portfolio', ar: 'الأعمال' }, type: 'content' },
      { id: 'contact', name: 'Contact', isVisible: true, inNavbar: true, order: 2, navLabel: { en: 'Contact', ar: 'تواصل' }, type: 'content' }
    ];

    return safeSections
      .filter(s => s.isVisible && s.inNavbar)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(s => {
        const fallbackLabels: Record<string, { en: string, ar: string }> = {
          hero: { en: 'Home', ar: 'الرئيسية' },
          projects: { en: 'Portfolio', ar: 'الأعمال' },
          services: { en: 'Services', ar: 'خدماتي' },
          process: { en: 'Process', ar: 'المسار' },
          contact: { en: 'Contact', ar: 'تواصل' }
        };

        const name = s.navLabel || fallbackLabels[s.id] || { en: s.name, ar: s.name };

        return {
          name,
          id: s.id === 'hero' ? 'Home' : s.id.charAt(0).toUpperCase() + s.id.slice(1),
          section: s.id
        };
      });
  }, [sections]);

  useEffect(() => {
    const sectionElements = navItems.map(item => document.getElementById(item.section));
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const matched = navItems.find(item => item.section === entry.target.id);
          if (matched) setActiveTab(matched.id);
        }
      });
    }, { threshold: 0.3 });

    sectionElements.forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [navItems]);

  const scrollToSection = (id: string, section: string) => {
    setActiveTab(id);
    const element = document.getElementById(section);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <motion.nav 
        style={{ 
          backgroundColor: navBackground,
          backdropFilter: navBlur
        }}
        className={`fixed top-0 left-0 w-full z-999 transition-all duration-500 border-b border-white/5 py-5 px-8 lg:px-14 ${isRtl ? 'rtl' : 'ltr'}`}
      >
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-accent-violet/20 to-transparent opacity-50" />

        <div className={`max-w-[1700px] mx-auto flex flex-row items-center justify-between relative`}>
          
          {/* Logo */}
          <motion.div 
            onClick={() => scrollToSection('Home', 'hero')}
            className={`flex items-center gap-3 font-heading font-black text-2xl md:text-3xl tracking-tighter text-white hover:text-accent-violet transition-all duration-300 cursor-pointer select-none shrink-0 ${isRtl ? 'ml-8' : 'mr-8'}`}
          >
            {appearance?.logoUrl ? (
              <img src={appearance.logoUrl} alt="Logo" className="h-8 md:h-10 w-auto object-contain" />
            ) : (
              logoText
            )}
          </motion.div>

          {/* Navigation Pill */}
          <div className={`hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-1.5 p-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl`}>
             {navItems.map((item) => (
               <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id, item.section)}
                  className={`relative px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap z-10
                    ${activeTab === item.id ? 'text-white' : 'text-white/40 hover:text-white/70 hover:scale-105'}`}
               >
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="nav-glow-pill"
                      className="absolute inset-0 bg-accent-violet rounded-full z-[-1] shadow-[0_0_20px_var(--accent-glow)]"
                      transition={{ type: "spring", stiffness: 300, damping: 25, mass: 1 }}
                    />
                  )}
                  {item.name[lang]}
               </button>
             ))}
          </div>

          {/* Action Hub */}
          <div className={`flex items-center gap-4 shrink-0`}>

            {/* Launch CTA */}
            <motion.button 
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('Start', 'start-project')}
              className={`hidden sm:flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white text-black shadow-xl hover:shadow-accent-violet/20 transition-all group ${isRtl ? 'font-bold' : 'font-black'}`}
            >
               <Rocket className="w-3.5 h-3.5 text-accent-violet" />
               <span className="text-[10px] uppercase tracking-widest">{t[lang].startProject}</span>
            </motion.button>

            {/* Language Switch */}
            <motion.button
               whileHover={{ scale: 1.1, rotate: 5 }}
               whileTap={{ scale: 0.9 }}
               onClick={onLanguageToggle}
               className="flex items-center justify-center w-11 h-11 rounded-2xl border border-white/10 bg-white/5 text-[10px] font-mono font-black uppercase text-accent-violet hover:bg-accent-violet hover:text-white transition-all shadow-lg"
            >
               {lang === 'en' ? 'AR' : 'EN'}
            </motion.button>

            {/* Identity Cluster */}
            {user ? (
              <div className={`flex items-center gap-4`}>
                 {user.role === 'super_admin' && (
                   <Link 
                      to="/admin"
                      className="hidden sm:flex items-center justify-center w-11 h-11 rounded-2xl bg-white/5 hover:bg-accent-violet hover:scale-110 border border-white/10 text-white/40 hover:text-white transition-all group shadow-xl"
                      title={t[lang].admin}
                   >
                      <LayoutDashboard className="w-5 h-5" />
                   </Link>
                 )}
                 
                 <ProfileDropdown lang={lang} />
              </div>
            ) : (
              <button 
                onClick={() => setIsLoginModalOpen(true)} 
                className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/10 text-[10px] font-black uppercase tracking-widest"
              >
                {t[lang].signIn}
              </button>
            )}
          </div>
        </div>
      </motion.nav>

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        lang={lang}
      />
    </>
  );
};
