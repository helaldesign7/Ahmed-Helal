import { Search, Link, XCircle, Image as ImageIcon, FileVideo, HardDrive, FileText, Upload, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../../contexts/useAdmin';
import { useState } from 'react';
import type { MediaAsset } from '../../../types/admin';

export const MediaManagerModal = ({ 
  onClose, 
  onSelect,
  mode = 'manage',
  lang = 'en'
}: { 
  onClose: () => void;
  onSelect?: (asset: MediaAsset) => void;
  mode?: 'manage' | 'pick';
  lang?: 'en' | 'ar';
}) => {
  const { mediaAssets, uploadMedia, deleteMedia } = useAdmin();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [isRegistering, setIsRegistering] = useState(false);
  const [newAssetData, setNewAssetData] = useState({
    title: '',
    category: 'General',
    alt_text: ''
  });

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Media Library',
      subtitle: 'Hela.OS Assets Registry',
      modes: {
        pick: 'Selection Mode',
        manage: 'Management'
      },
      registerBtn: 'Register New Asset',
      searchPlaceholder: 'Search registry...',
      filters: {
        all: 'All',
        image: 'Images',
        video: 'Videos',
        document: 'Files'
      },
      add: {
        name: 'Asset Name',
        url: 'Source URL (G-Drive/External)',
        category: 'Category',
        placeholder: 'e.g. Hero Cinematic',
        categories: ['General', 'Branding', 'UIs', 'Cinematics', 'Models']
      },
      assetActions: {
        select: 'Select Asset',
        copy: 'Copy Link',
        delete: 'Delete Registry'
      },
      empty: 'No matching assets found',
      confirmDelete: 'Remove asset from registry?',
      uploading: 'Uploading to Cloud...',
      drop: 'Drop file to upload',
      browse: 'Click to browse'
    },
    ar: {
      title: 'مكتبة الوسائط',
      subtitle: 'سجل أصول Hela.OS',
      modes: {
        pick: 'وضع الاختيار',
        manage: 'الإدارة العامة'
      },
      registerBtn: 'تسجيل أصل جديد',
      searchPlaceholder: 'ابحث في السجل...',
      filters: {
        all: 'الكل',
        image: 'صور',
        video: 'فيديو',
        document: 'ملفات'
      },
      add: {
        name: 'اسم الملف',
        url: 'رابط المصدر (Drive/خارجي)',
        category: 'التصنيف',
        placeholder: 'مثال: عرض البداية',
        categories: ['عام', 'هوية بصرية', 'واجهات', 'سينمائي', 'نماذج']
      },
      assetActions: {
        select: 'اختيار الملف',
        copy: 'نسخ الرابط',
        delete: 'حذف السجل'
      },
      empty: 'لم يتم العثور على أصول مطابقة',
      confirmDelete: 'هل تريد إزالة هذا الأصل من السجل؟',
      uploading: 'جاري الرفع للسحاب...',
      drop: 'أفلت الملف للرفع',
      browse: 'اضغط لاختيار ملف'
    }
  };

  const filteredAssets = mediaAssets.filter(a => {
    const matchesSearch = a.filename?.toLowerCase().includes(search.toLowerCase()) || 
                          a.title?.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === 'all' || a.type === activeType;
    return matchesSearch && matchesType;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      await uploadMedia(file, {
        category: newAssetData.category,
        title: newAssetData.title || file.name,
        alt_text: newAssetData.alt_text
      });
      setIsRegistering(false);
      setNewAssetData({ title: '', category: 'General', alt_text: '' });
    } catch (error: unknown) {
      console.error("Upload Error Details:", error);
      const err = error as Record<string, unknown>;
      const msg = err?.message || err?.error_description || (error instanceof Error ? error.message : JSON.stringify(error)) || 'Upload failed';
      setUploadError(`Failed: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t[lang].confirmDelete)) {
      try {
        await deleteMedia(id);
      } catch {
        alert("Delete failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
      <div className={`w-full max-w-5xl bg-[#080808] border border-white/10 rounded-3xl shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col h-[85vh] overflow-hidden ${isRtl ? 'text-right' : ''}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-8 border-b border-white/5 shrink-0 bg-linear-to-b from-white/2 to-transparent ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div>
            <h2 className={`text-2xl font-black tracking-tight uppercase text-white flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <span className="w-2 h-8 bg-accent-violet rounded-full" />
              {t[lang].title}
            </h2>
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mt-2">
              {t[lang].subtitle} / {mode === 'pick' ? t[lang].modes.pick : t[lang].modes.manage}
            </p>
          </div>
          <div className={`flex items-center gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <button 
              onClick={() => setIsRegistering(true)}
              className="flex items-center gap-2 px-6 py-3 bg-accent-violet hover:bg-accent-violet/90 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-accent-violet/20"
            >
              <Upload className="w-4 h-4" /> {t[lang].registerBtn}
            </button>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-white/20 hover:text-white transition-colors border border-white/5">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Register Overlay */}
        <AnimatePresence>
          {isRegistering && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`px-8 py-8 border-b border-white/10 bg-accent-violet/5 grid grid-cols-1 md:grid-cols-4 gap-6 items-end relative overflow-hidden ${isRtl ? 'rtl' : ''}`}
            >
              <div className="md:col-span-1">
                <label className="block text-[10px] font-mono font-black text-white/40 uppercase mb-2">{t[lang].add.name}</label>
                <input 
                  type="text" 
                  value={newAssetData.title}
                  onChange={e => setNewAssetData(p => ({ ...p, title: e.target.value }))}
                  className={`w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-violet transition-colors ${isRtl ? 'text-right' : ''}`}
                  placeholder={t[lang].add.placeholder}
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-[10px] font-mono font-black text-white/40 uppercase mb-2">{t[lang].add.category}</label>
                <select 
                  value={newAssetData.category}
                  onChange={e => setNewAssetData(p => ({ ...p, category: e.target.value }))}
                  className={`w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-xs text-white focus:outline-none focus:border-accent-violet appearance-none ${isRtl ? 'text-right' : ''}`}
                >
                  {t[lang].add.categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-mono font-black text-white/40 uppercase mb-2">Secure Upload</label>
                <div className="relative group/zone">
                  <input 
                    type="file" 
                    onChange={handleUpload}
                    disabled={isUploading}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  <div className={`w-full h-12 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center gap-3 transition-all group-hover/zone:border-accent-violet/50 ${isUploading ? 'bg-white/5' : ''}`}>
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-accent-violet" />
                        <span className="text-[10px] font-black uppercase text-white/60 animate-pulse">{t[lang].uploading}</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-white/20 group-hover/zone:text-accent-violet transition-colors" />
                        <span className="text-[10px] font-black uppercase text-white/30 group-hover/zone:text-white transition-colors">{t[lang].browse}</span>
                      </>
                    )}
                  </div>
                </div>
                {uploadError && <p className="text-[9px] text-red-500 mt-2 font-mono uppercase tracking-widest">{uploadError}</p>}
              </div>

              <button 
                onClick={() => setIsRegistering(false)}
                className="absolute top-2 right-2 p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-all"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar */}
        <div className={`px-8 py-5 border-b border-white/5 flex flex-col md:flex-row items-center gap-6 bg-black/20 shrink-0 ${isRtl ? 'flex-row-reverse' : ''}`}>
           <div className="relative w-full max-w-sm">
             <input 
               type="text" 
               placeholder={t[lang].searchPlaceholder}
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className={`w-full bg-black border border-white/10 rounded-xl py-3 text-xs text-white focus:outline-none focus:border-accent-violet transition-all font-mono ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
             />
             <Search className={`w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'}`} />
           </div>
           
           <div className={`flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide ${isRtl ? 'flex-row-reverse' : ''}`}>
             {(['all', 'image', 'video', 'document'] as const).map(type => (
               <button 
                 key={type}
                 onClick={() => setActiveType(type)}
                 className={`flex items-center gap-2 px-5 py-2.5 text-[9px] font-black uppercase tracking-widest transition-all rounded-full border ${
                   activeType === type ? 'bg-accent-violet border-accent-violet text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                 } ${isRtl ? 'flex-row-reverse' : ''}`}
               >
                  {type === 'image' && <ImageIcon className="w-3 h-3" />}
                  {type === 'video' && <FileVideo className="w-3 h-3" />}
                  {type === 'document' && <FileText className="w-3 h-3" />}
                  {t[lang].filters[type]}
               </button>
             ))}
           </div>
        </div>

        {/* Grid View */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#040404] custom-scrollbar">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <div 
                key={asset.id} 
                onClick={() => onSelect?.(asset)}
                className={`group flex flex-col bg-[#0C0C0C] border rounded-4xl overflow-hidden transition-all duration-500 cursor-pointer relative ${
                  mode === 'pick' ? 'hover:ring-2 hover:ring-accent-violet/50' : ''
                } border-white/5 hover:border-accent-violet/30 hover:-translate-y-1 shadow-lg`}
              >
                 <div className="aspect-square flex items-center justify-center relative overflow-hidden bg-white/2">
                    {asset.type === 'video' ? <FileVideo className="w-12 h-12 text-white/10 group-hover:text-accent-violet/40 transition-colors" /> : 
                     asset.type === 'document' ? <FileText className="w-12 h-12 text-white/10 group-hover:text-accent-violet/40 transition-colors" /> :
                     <ImageIcon className="w-12 h-12 text-white/10 group-hover:text-accent-violet/40 transition-colors" />}
                    
                    {/* Source Icon Overlay */}
                    <div className={`absolute top-4 p-2 bg-black/40 backdrop-blur-md rounded-xl border border-white/10 ${isRtl ? 'right-4' : 'left-4'}`}>
                      {asset.source === 'upload' ? <Upload className="w-4 h-4 text-accent-violet" /> : asset.source === 'drive' ? <HardDrive className="w-4 h-4 text-green-400" /> : <Link className="w-4 h-4 text-blue-400" />}
                    </div>

                    {/* Quick Badge */}
                    <div className={`absolute top-4 px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] font-mono font-black uppercase text-white/40 ${isRtl ? 'left-4' : 'right-4'}`}>
                      {asset.category}
                    </div>
                    
                    {/* Hover Actions */}
                    <AnimatePresence>
                      <div className="absolute inset-0 bg-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-4 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        {mode === 'pick' ? (
                          <button className="bg-white text-black font-black text-[10px] uppercase tracking-widest px-8 py-3 rounded-xl hover:bg-accent-violet hover:text-white transition-colors">
                            {t[lang].assetActions.select}
                          </button>
                        ) : (
                          <>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(asset.full_url);
                              }}
                              className="w-3/4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.2em] py-3 rounded-xl transition-all"
                            >
                              {t[lang].assetActions.copy}
                            </button>
                            <button 
                              onClick={(e) => handleDelete(asset.id, e)}
                              className="text-red-500 hover:text-red-400 font-black text-[10px] uppercase tracking-[0.2em] transition-colors"
                            >
                              {t[lang].assetActions.delete}
                            </button>
                          </>
                        )}
                      </div>
                    </AnimatePresence>
                 </div>
                 
                 <div className={`p-5 bg-black/40 border-t border-white/5 ${isRtl ? 'text-right' : ''}`}>
                    <div className="text-sm font-black text-white truncate mb-1" title={asset.title}>{asset.title}</div>
                    <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className="text-[9px] font-mono text-white/20 uppercase tracking-widest">{asset.id}</div>
                      <div className="text-[9px] font-mono text-accent-violet/60 font-black uppercase">{asset.type}</div>
                    </div>
                 </div>
              </div>
            ))}
            
            {filteredAssets.length === 0 && (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-[3rem]">
                <Search className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-mono text-sm uppercase tracking-[0.4em]">{t[lang].empty}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
