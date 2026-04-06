import { useAdmin } from '../../contexts/useAdmin';
import { useOutletContext } from 'react-router-dom';
import type { Content } from '../../data/content';
import { MediaPickerField } from './media/MediaPickerField';

interface DictionaryNodeProps {
  nodeKey: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  data: any;
  path: string;
  sectionKey: keyof Content;
  lang: 'en' | 'ar';
}

const isMediaField = (key: string, path: string) => {
  const mediaKeys = [
    'image', 'avatar', 'logo', 'thumbnail', 'background', 
    'graphic', 'icon', 'cover', 'banner', 'photo', 'url'
  ];
  const lowerKey = key.toLowerCase();
  const lowerPath = path.toLowerCase();
  
  // If it's explicitly one of the media keys
  if (mediaKeys.some(m => lowerKey.includes(m))) return true;
  
  // If the path contains media-related terms (e.g., hero.background.url)
  if (lowerPath.includes('background') || lowerPath.includes('media') || lowerPath.includes('image')) return true;

  return false;
};

const DictionaryNode = ({ nodeKey, data, path, sectionKey, lang }: DictionaryNodeProps) => {
  const { updateText } = useAdmin();
  const isRtl = lang === 'ar';
  
  if (data && typeof data === 'object' && 'en' in data && 'ar' in data) {
    return (
      <div className={`mb-5 bg-white/2 p-5 rounded-2xl border border-white/5 hover:border-accent-violet/30 transition-colors ${isRtl ? 'text-right' : ''}`}>
        <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-4">
          {nodeKey.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
           <div className="space-y-2">
             <span className={`text-[8px] uppercase font-black text-accent-violet tracking-widest block ${isRtl ? 'text-right' : ''}`}>English</span>
             <input 
               className="bg-black/50 border border-white/10 rounded-xl w-full px-4 py-3 text-sm text-white focus:border-accent-violet outline-none transition-all" 
               value={data.en} 
               onChange={(e) => updateText(sectionKey, path, 'en', e.target.value)} 
               placeholder="English..." 
               dir="ltr" 
             />
           </div>
           <div className="space-y-2">
             <span className={`text-[8px] uppercase font-black text-accent-violet tracking-widest block ${isRtl ? 'text-right' : ''}`}>عربي</span>
             <input 
               className="bg-black/50 border border-white/10 rounded-xl w-full px-4 py-3 text-sm text-white focus:border-accent-violet outline-none text-right font-arabic transition-all" 
               value={data.ar} 
               onChange={(e) => updateText(sectionKey, path, 'ar', e.target.value)} 
               placeholder="أدخل النص بالعربية..." 
               dir="rtl" 
             />
           </div>
        </div>
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
       <div className={`mb-8 border-accent-violet/10 py-2 mt-4 space-y-4 ${isRtl ? 'border-r-2 pr-6' : 'border-l-2 pl-6'}`}>
         <label className={`text-[11px] font-black text-white uppercase tracking-widest flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
           <span className="w-5 h-5 rounded-lg bg-accent-violet/20 border border-accent-violet/30 flex items-center justify-center text-[10px] text-accent-violet font-mono">{data.length}</span>
           {nodeKey.replace(/([A-Z])/g, ' $1').trim()} {isRtl ? '(قائمة)' : '(List)'}
         </label>
         <div className="space-y-6">
           {data.map((item, idx) => (
              <div key={idx} className="relative">
                  <DictionaryNode nodeKey={`${nodeKey} ${isRtl ? 'عنصر' : 'Item'} ${idx + 1}`} data={item} path={`${path}.${idx}`} sectionKey={sectionKey} lang={lang} />
              </div>
           ))}
         </div>
       </div>
    );
  }

  if (typeof data === 'object' && data !== null) {
      return (
         <div className="mb-6">
            {path !== '' && (
              <h4 className={`text-[11px] font-black py-2 border-b border-white/5 text-white/60 mb-6 uppercase tracking-[0.2em] ${isRtl ? 'text-right' : ''}`}>
                {nodeKey.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
            )}
            <div className={isRtl ? 'pr-2' : 'pl-2'}>
              {Object.keys(data).map(k => (
                 <DictionaryNode key={k} nodeKey={k} data={data[k]} path={path ? `${path}.${k}` : k} sectionKey={sectionKey} lang={lang} />
              ))}
            </div>
         </div>
      );
  }

  if (typeof data === 'string' || typeof data === 'number') {
    if (typeof data === 'string' && isMediaField(nodeKey, path)) {
      return (
        <MediaPickerField 
          label={nodeKey.replace(/([A-Z])/g, ' $1').trim()}
          value={data}
          onChange={(url) => updateText(sectionKey, path, 'raw', url)}
          lang={lang}
        />
      );
    }

    return (
      <div className={`mb-5 bg-white/2 p-5 rounded-2xl border border-white/5 ${isRtl ? 'text-right' : ''}`}>
        <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
          {nodeKey.replace(/([A-Z])/g, ' $1').trim()}
        </label>
        <input 
          className={`bg-black/50 border border-white/10 rounded-xl w-full px-4 py-3 text-sm text-white focus:border-accent-violet outline-none transition-all ${isRtl ? 'text-right' : ''}`} 
          value={data} 
          onChange={(e) => updateText(sectionKey, path, 'raw', e.target.value)} 
        />
      </div>
    );
  }
  return null;
};

export const DictionaryEditor = ({ sectionId }: { sectionId: string }) => {
  const { siteContent } = useAdmin();
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  
  const contentKeyMap: Record<string, keyof Content> = {
    'hero': 'hero',
    'projects': 'featuredWork',
    'services': 'services',
    'process': 'process',
    'testimonials': 'testimonials',
    'metrics': 'metrics',
    'start-project': 'startProject',
    'contact': 'contact'
  };
  
  const sectionKey = (contentKeyMap[sectionId] || sectionId) as keyof Content;
  const sectionData = siteContent[sectionKey];

  if (!sectionData) {
    return (
      <div className="p-12 text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em] border border-dashed border-white/10 rounded-3xl bg-white/2">
        {lang === 'ar' ? 'لم يتم العثور على بيانات هذا القسم' : 'Fragment Data Not Found'}
      </div>
    );
  }

  return (
    <div className="p-8 bg-black/60 rounded-3xl border border-white/5 shadow-2xl">
       <DictionaryNode nodeKey={sectionKey} data={sectionData} path="" sectionKey={sectionKey} lang={lang} />
    </div>
  );
};
