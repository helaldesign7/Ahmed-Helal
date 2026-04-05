import { useState } from 'react';
import { Palette, Baseline, MonitorPlay, Save } from 'lucide-react';
import { useAdmin } from '../../contexts/useAdmin';
import { useOutletContext } from 'react-router-dom';

export const AppearanceSettings = () => {
  const { appearance, setAppearance } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'elements'>('colors');
  const [isSaving, setIsSaving] = useState(false);

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Theme & Appearance',
      subtitle: 'Global cinematic design system config',
      deploy: 'Deploy Changes',
      deploying: 'Deploying...',
      tabs: {
        colors: 'Colors & Glow',
        typography: 'Typography',
        elements: 'Layout & Elements'
      },
      colors: {
        title: 'Core Palette',
        accent: 'Accent Violet',
        bg: 'Background Base',
        glow: 'Universal Glow Mode',
        autoCalculated: 'Auto-calculated'
      },
      typography: {
        title: 'Typography Engine',
        fontLabel: 'Primary Font Family',
        preview: 'Preview Rendering',
        previewTitle: 'THE FUTURE IS LIQUID.',
        previewText: 'System architecture initialized. All interface elements are now synchronizing with the chosen typeface.'
      },
      elements: {
        title: 'Layout & Style Variables',
        radius: 'Border Radius (Global)',
        glass: {
          title: 'Glassmorphism Mode',
          desc: 'Enables translucent frosted overlays'
        },
        previewModule: 'Module'
      }
    },
    ar: {
      title: 'المظهر والسمات',
      subtitle: 'تكوين نظام التصميم السينمائي الشامل',
      deploy: 'تطبيق التغييرات',
      deploying: 'جاري التطبيق...',
      tabs: {
        colors: 'الألوان والوهج',
        typography: 'الخطوط',
        elements: 'تخطيط العناصر'
      },
      colors: {
        title: 'لوحة الألوان الأساسية',
        accent: 'اللون التمييزي (بنفسجي)',
        bg: 'خلفية القاعدة',
        glow: 'وضع الوهج الشامل',
        autoCalculated: 'محسوب تلقائياً'
      },
      typography: {
        title: 'محرك الخطوط',
        fontLabel: 'عائلة الخطوط الرئيسية',
        preview: 'معاينة العرض',
        previewTitle: 'المستقبل يتشكل الآن.',
        previewText: 'تم تشغيل بنية النظام. جميع عناصر الواجهة تتزامن الآن مع الخط المختار.'
      },
      elements: {
        title: 'متغيرات التخطيط والنمط',
        radius: 'انحناء الحواف (عام)',
        glass: {
          title: 'وضع الزجاج (Glassmorphism)',
          desc: 'تفعيل تراكبات شبه شفافة وضبابية'
        },
        previewModule: 'وحدة برمجية'
      }
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  const updateAppearance = (key: keyof typeof appearance, value: any) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={`space-y-8 pb-10 ${isRtl ? 'text-right' : ''}`}>
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-wider text-white mb-2">{t[lang].title}</h1>
          <p className="text-white/40 text-sm font-mono tracking-widest uppercase">{t[lang].subtitle}</p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-accent-violet hover:bg-accent-violet/80 text-white rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(139,92,246,0.3)] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">{isSaving ? t[lang].deploying : t[lang].deploy}</span>
        </button>
      </div>

      <div className={`flex gap-4 border-b border-white/5 pb-4 overflow-x-auto custom-scrollbar ${isRtl ? 'flex-row-reverse' : ''}`}>
        <button 
          onClick={() => setActiveTab('colors')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'colors' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <Palette className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].tabs.colors}</span>
        </button>
        <button 
          onClick={() => setActiveTab('typography')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'typography' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <Baseline className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].tabs.typography}</span>
        </button>
        <button 
          onClick={() => setActiveTab('elements')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === 'elements' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white/70 hover:bg-white/5'}`}
        >
          <MonitorPlay className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">{t[lang].tabs.elements}</span>
        </button>
      </div>

      <div className="bg-[#0C0C0C] border border-white/5 rounded-2xl p-6">
        {activeTab === 'colors' && (
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">{t[lang].colors.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              
              <div className="space-y-2">
                <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].colors.accent}</label>
                <div className={`flex items-center gap-3 bg-black/50 border border-white/5 p-2 rounded-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <input 
                    type="color" 
                    value={appearance.accentColor} 
                    onChange={(e) => updateAppearance('accentColor', e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={appearance.accentColor} 
                    onChange={(e) => updateAppearance('accentColor', e.target.value)}
                    className={`bg-transparent text-sm font-mono text-white w-full focus:outline-none ${isRtl ? 'text-right' : ''}`} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].colors.bg}</label>
                <div className={`flex items-center gap-3 bg-black/50 border border-white/5 p-2 rounded-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <input 
                    type="color" 
                    value={appearance.bgColor} 
                    onChange={(e) => updateAppearance('bgColor', e.target.value)}
                    className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer" 
                  />
                  <input 
                    type="text" 
                    value={appearance.bgColor} 
                    onChange={(e) => updateAppearance('bgColor', e.target.value)}
                    className={`bg-transparent text-sm font-mono text-white w-full focus:outline-none ${isRtl ? 'text-right' : ''}`} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].colors.glow}</label>
                <div className={`flex items-center gap-3 bg-black/50 border border-white/5 p-3 rounded-xl h-[52px] ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[10px] font-mono text-white/40 uppercase">{t[lang].colors.autoCalculated}</span>
                   <div 
                    className={`${isRtl ? 'mr-auto' : 'ml-auto'} w-8 h-8 rounded-lg border border-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]`}
                    style={{ backgroundColor: appearance.accentColor }}
                   />
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'typography' && (
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">{t[lang].typography.title}</h2>
            
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 ${isRtl ? 'text-right' : ''}`}>
              <div className="space-y-4">
                <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest text-xs ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].typography.fontLabel}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Inter', 'Outfit', 'Roboto', 'Syne', 'Orbitron', 'Space Grotesk'].map((font) => (
                    <button
                      key={font}
                      onClick={() => updateAppearance('fontFamily', font)}
                      className={`px-4 py-3 rounded-xl border text-sm font-black transition-all ${appearance.fontFamily === font ? 'bg-accent-violet border-accent-violet text-white' : 'bg-black/50 border-white/5 text-white/40 hover:border-white/20'}`}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-6 bg-black/50 border border-white/5 rounded-2xl">
                 <h3 className={`text-[10px] font-black uppercase tracking-widest text-white/60 mb-4 ${isRtl ? 'text-right' : ''}`}>{t[lang].typography.preview}</h3>
                 <div style={{ fontFamily: appearance.fontFamily }} className={isRtl ? 'text-right' : ''}>
                    <h4 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">{t[lang].typography.previewTitle}</h4>
                    <p className="text-sm text-white/60 leading-relaxed">{t[lang].typography.previewText}</p>
                 </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'elements' && (
          <div className="space-y-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-white border-b border-white/5 pb-4">{t[lang].elements.title}</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className={`text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest text-xs ${isRtl ? 'mr-1' : 'ml-1'}`}>{t[lang].elements.radius}</label>
                  <div className={`flex gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                    {['0px', '8px', '16px', '24px', '50px'].map((radius) => (
                      <button
                        key={radius}
                        onClick={() => updateAppearance('borderRadius', radius)}
                        className={`flex-1 py-3 rounded-lg border text-[10px] font-black transition-all ${appearance.borderRadius === radius ? 'bg-white/10 border-white/20 text-white' : 'bg-black/50 border-white/5 text-white/40'}`}
                      >
                        {radius}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`flex items-center justify-between p-4 bg-black/50 border border-white/5 rounded-2xl ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className={isRtl ? 'text-right' : ''}>
                    <h3 className="text-xs font-black uppercase tracking-widest text-white">{t[lang].elements.glass.title}</h3>
                    <p className="text-[9px] font-mono text-white/40 uppercase tracking-tighter">{t[lang].elements.glass.desc}</p>
                  </div>
                  <button 
                    onClick={() => updateAppearance('glassmorphism', !appearance.glassmorphism)}
                    className={`w-12 h-6 rounded-full transition-all relative ${appearance.glassmorphism ? 'bg-accent-violet' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${appearance.glassmorphism ? (isRtl ? 'right-7' : 'left-7') : (isRtl ? 'right-1' : 'left-1')}`} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center p-8 bg-black/50 border border-white/5 rounded-2xl overflow-hidden relative">
                 <div className="absolute inset-0 bg-linear-to-br from-accent-violet/10 to-transparent opacity-50" />
                 <div 
                   className="w-32 h-32 border border-white/10 flex items-center justify-center relative z-10"
                   style={{ 
                     borderRadius: appearance.borderRadius,
                     backgroundColor: appearance.glassmorphism ? 'rgba(255,255,255,0.05)' : 'transparent',
                     backdropFilter: appearance.glassmorphism ? 'blur(10px)' : 'none'
                   }}
                 >
                   <span className="text-[10px] font-black text-white/40 uppercase">{t[lang].elements.previewModule}</span>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
