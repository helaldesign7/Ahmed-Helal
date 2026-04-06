import { useState } from 'react';
import { Search, Plus, LayoutGrid, List, ExternalLink, HardDrive, FileText, FileVideo, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '../../contexts/useAdmin';
import { MediaManagerModal } from '../components/media/MediaManagerModal';
import type { MediaAsset } from '../../types/admin';

export const MediaManager = ({ lang = 'en' }: { lang?: 'en' | 'ar' }) => {
  const { mediaAssets, loading, deleteMedia } = useAdmin();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'image' | 'video' | 'document'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  const isRtl = lang === 'ar';

  const t = {
    en: {
      title: 'Media Hub',
      subtitle: 'Central Visual Assets Registry',
      upload: 'Upload New Asset',
      searchPlaceholder: 'Search media by name or tag...',
      stats: {
        total: 'Total Assets',
        storage: 'Storage Used',
        bandwidth: 'Monthly Bandwidth'
      },
      filters: {
        all: 'All Files',
        image: 'Images',
        video: 'Videos',
        document: 'Documents'
      },
      assetDetails: {
        title: 'Asset Metadata',
        filename: 'Filename',
        type: 'Mime Type',
        size: 'File Size',
        created: 'Upload Date',
        path: 'Storage Path',
        copy: 'Copy Public URL',
        delete: 'Delete Permanently'
      },
      empty: 'No assets matching your criteria.'
    },
    ar: {
      title: 'مركز الوسائط',
      subtitle: 'سجل الأصول البصرية المركزي',
      upload: 'رفع ملف جديد',
      searchPlaceholder: 'ابحث عن ملف بالاسم أو الوصف...',
      stats: {
        total: 'إجمالي الأصول',
        storage: 'المساحة المستخدمة',
        bandwidth: 'استهلاك البيانات'
      },
      filters: {
        all: 'جميع الملفات',
        image: 'الصور',
        video: 'الفيديو',
        document: 'الملفات'
      },
      assetDetails: {
        title: 'بيانات الملف',
        filename: 'اسم الملف',
        type: 'نوع الملف',
        size: 'الحجم',
        created: 'تاريخ الرفع',
        path: 'مسار التخزين',
        copy: 'نسخ الرابط العام',
        delete: 'حذف نهائي'
      },
      empty: 'لم يتم العثور على ملفات تطابق بحثك.'
    }
  };

  const filteredAssets = mediaAssets.filter(a => {
    const matchesSearch = a.filename?.toLowerCase().includes(search.toLowerCase()) || 
                          a.title?.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeType === 'all' || a.type === activeType;
    return matchesSearch && matchesType;
  });

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-8 ${isRtl ? 'text-right' : ''}`}>
      {/* Header Section */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
        <div>
          <div className={`flex items-center gap-3 mb-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
            <div className="w-2 h-8 bg-accent-violet rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            <h1 className="text-3xl font-black uppercase tracking-tight text-white">{t[lang].title}</h1>
          </div>
          <p className="text-xs font-mono text-white/40 uppercase tracking-[0.3em] font-medium">
            {t[lang].subtitle}
          </p>
        </div>

        <button 
          onClick={() => setShowUploadModal(true)}
          className="group flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-accent-violet hover:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-accent-violet/30 active:scale-95"
        >
          <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" /> 
          {t[lang].upload}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: HardDrive, label: t[lang].stats.total, value: mediaAssets.length, sub: 'Assets registered' },
          { icon: HardDrive, label: t[lang].stats.storage, value: '1.2 GB', sub: 'Of 10GB limited' },
          { icon: HardDrive, label: t[lang].stats.bandwidth, value: '450 MB', sub: 'Last 30 days' }
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-white/2 border border-white/5 rounded-3xl relative overflow-hidden group">
            <stat.icon className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:text-accent-violet/10 transition-colors" />
            <div className="relative z-10">
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-4">{stat.label}</p>
              <h3 className="text-2xl font-black text-white mb-1">{stat.value}</h3>
              <p className="text-[9px] font-mono text-accent-violet/60 uppercase">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className={`p-6 bg-[#0A0A0A] border border-white/5 rounded-3xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
        <div className="relative flex-1 max-w-xl">
          <input 
            type="text" 
            placeholder={t[lang].searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-xs text-white focus:outline-none focus:border-accent-violet transition-all font-mono shadow-inner ${isRtl ? 'pr-12 pl-4 text-right' : 'pl-12 pr-4'}`}
          />
          <Search className={`w-4 h-4 text-white/30 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-4' : 'left-4'}`} />
        </div>

        <div className={`flex flex-wrap items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
           {/* View Toggle */}
           <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 mr-4">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white shadow-lg' : 'text-white/20 hover:text-white/40'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/10 text-white shadow-lg' : 'text-white/20 hover:text-white/40'}`}
              >
                <List className="w-4 h-4" />
              </button>
           </div>

           {/* Filters */}
           {(['all', 'image', 'video', 'document'] as const).map(type => (
             <button 
               key={type}
               onClick={() => setActiveType(type)}
               className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                 activeType === type ? 'bg-accent-violet border-accent-violet text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20 hover:text-white'
               }`}
             >
               {t[lang].filters[type]}
             </button>
           ))}
        </div>
      </div>

      {/* Media Content */}
      <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
        <div className="flex-1">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-white/20">
              <Loader2 className="w-12 h-12 animate-spin" />
              <p className="font-mono text-xs uppercase tracking-widest">Accessing Registry...</p>
            </div>
          ) : filteredAssets.length > 0 ? (
            <div className={viewMode === 'grid' ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-3"}>
              {filteredAssets.map((asset) => (
                <motion.div 
                  layout
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`group relative overflow-hidden bg-white/2 border-2 rounded-3xl transition-all duration-300 cursor-pointer ${
                    selectedAsset?.id === asset.id ? 'border-accent-violet ring-4 ring-accent-violet/10' : 'border-white/5 hover:border-white/20'
                  } ${viewMode === 'list' ? 'flex items-center gap-6 p-4' : ''}`}
                >
                  <div className={viewMode === 'grid' ? "aspect-square relative overflow-hidden bg-white/5" : "w-16 h-16 rounded-xl overflow-hidden bg-white/5 shrink-0"}>
                    {asset.type === 'image' ? (
                      <img src={asset.full_url} alt={asset.alt_text} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {asset.type === 'video' ? <FileVideo className="w-8 h-8 text-white/20" /> : <FileText className="w-8 h-8 text-white/20" />}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className={viewMode === 'grid' ? "p-5" : "flex-1 flex items-center justify-between"}>
                    <div>
                      <h4 className="text-xs font-black text-white truncate mb-1" title={asset.filename}>{asset.filename}</h4>
                      <p className="text-[9px] font-mono text-white/30 uppercase">{formatSize(asset.size_bytes || 0)}</p>
                    </div>
                    {viewMode === 'list' && (
                      <div className="flex items-center gap-4 text-[10px] font-mono text-white/20">
                        <span className="bg-white/5 px-2 py-1 rounded">{asset.type}</span>
                        <span>{asset.created_at.split('T')[0]}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-white/10 border-2 border-dashed border-white/5 rounded-[3rem]">
               <ImageIcon className="w-16 h-16 mb-4 opacity-5" />
               <p className="font-mono text-xs uppercase tracking-widest">{t[lang].empty}</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <AnimatePresence mode="wait">
          {selectedAsset && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-96 shrink-0 space-y-6"
            >
              <div className="sticky top-24 p-8 bg-[#0A0A0A] border border-white/5 rounded-4xl shadow-2xl">
                 <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white/40">{t[lang].assetDetails.title}</h3>
                   <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                     <XCircle className="w-5 h-5" />
                   </button>
                 </div>

                 {/* Preview */}
                 <div className="aspect-video w-full rounded-2xl bg-black border border-white/5 mb-8 overflow-hidden flex items-center justify-center relative group">
                    {selectedAsset.type === 'image' ? (
                      <img src={selectedAsset.full_url} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                         {selectedAsset.type === 'video' ? <FileVideo className="w-12 h-12 text-accent-violet/40" /> : <FileText className="w-12 h-12 text-accent-violet/40" />}
                         <span className="text-[10px] font-mono text-white/20 uppercase">No Preview available</span>
                      </div>
                    )}
                    <a href={selectedAsset.full_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-black text-[9px] uppercase tracking-widest underline decoration-accent-violet decoration-2">
                       <ExternalLink className="w-4 h-4" /> Open Original
                    </a>
                 </div>

                 {/* Metadata List */}
                 <div className="space-y-6">
                    {[
                      { label: t[lang].assetDetails.filename, value: selectedAsset.filename },
                      { label: t[lang].assetDetails.type, value: selectedAsset.mime_type },
                      { label: t[lang].assetDetails.size, value: formatSize(selectedAsset.size_bytes) },
                      { label: t[lang].assetDetails.created, value: new Date(selectedAsset.created_at).toLocaleString() },
                      { label: t[lang].assetDetails.path, value: selectedAsset.storage_path, mono: true }
                    ].map((item, i) => (
                      <div key={i}>
                        <label className="block text-[8px] font-mono font-black text-white/20 uppercase mb-1.5 tracking-widest">{item.label}</label>
                        <p className={`text-[11px] text-white/80 ${item.mono ? 'font-mono bg-white/5 p-2 rounded truncate border border-white/5' : 'font-medium'}`}>{item.value}</p>
                      </div>
                    ))}
                 </div>

                 <div className="mt-10 pt-6 border-t border-white/5 space-y-3">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedAsset.full_url);
                        alert('Copied to clipboard!');
                      }}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all active:scale-95"
                    >
                      {t[lang].assetDetails.copy}
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this asset? This cannot be undone.')) {
                          await deleteMedia(selectedAsset.id);
                          setSelectedAsset(null);
                        }
                      }}
                      className="w-full py-4 text-red-500/40 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      {t[lang].assetDetails.delete}
                    </button>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showUploadModal && <MediaManagerModal onClose={() => setShowUploadModal(false)} lang={lang} />}
    </div>
  );
};

const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
