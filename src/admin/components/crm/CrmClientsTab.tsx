import { Search, Plus, Mail, Phone, Building } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAdmin } from '../../../contexts/useAdmin';
import type { CRMClient } from '../../../types/admin';

export const CrmClientsTab = () => {
  const { lang } = useOutletContext<{ lang: 'en' | 'ar' }>();
  const { crmClients, addCrmClient, deleteCrmClient } = useAdmin();
  const isRtl = lang === 'ar';

  const t = {
    en: {
      searchPlaceholder: 'Search clients, brands, or emails...',
      newClient: 'New Client',
      clientInfo: 'Client Identity',
      contact: 'Contact Matrix',
      source: 'Acquisition Source',
      status: 'Status',
      actions: 'Actions',
      addClientModalTitle: 'Initialize Client Form',
      empty: 'No clients found. The matrix is empty.',
      save: 'Establish Connection',
      cancel: 'Abort',
      addSuccess: 'Client successfully integrated',
      deleteConfirm: 'Are you sure you want to permanently erase this client?'
    },
    ar: {
      searchPlaceholder: 'ابحث عن العملاء، العلامات التجارية، أو البريد الإلكتروني...',
      newClient: 'عميل جديد',
      clientInfo: 'هوية العميل',
      contact: 'مصفوفة الاتصال',
      source: 'مصدر الاكتساب',
      status: 'الحالة',
      actions: 'أفعال',
      addClientModalTitle: 'إنشاء ملف العميل',
      empty: 'لم يتم العثور على عملاء. المصفوفة فارغة.',
      save: 'إنشاء اتصال',
      cancel: 'إلغاء',
      addSuccess: 'تم دمج العميل بنجاح',
      deleteConfirm: 'هل أنت متأكد من رغبتك في محو هذا العميل نهائيًا؟'
    }
  };

  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState<Partial<CRMClient>>({
    name: '', brand_company: '', email: '', phone_whatsapp: '', source: 'Manual',
    notes: '', preferred_contact: 'both', status: 'active', last_interaction_date: new Date().toISOString()
  });

  const filteredClients = useMemo(() => {
    return crmClients.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.brand_company.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [crmClients, search]);

  const handleSave = async () => {
    if (!formData.name) return;
    await addCrmClient(formData as Omit<CRMClient, 'id' | 'created_at' | 'updated_at'>);
    setShowAddModal(false);
    setFormData({
      name: '', brand_company: '', email: '', phone_whatsapp: '', source: 'Manual',
      notes: '', preferred_contact: 'both', status: 'active', last_interaction_date: new Date().toISOString()
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm(t[lang].deleteConfirm)) {
      await deleteCrmClient(id);
    }
  };

  return (
    <div className={`space-y-6 ${isRtl ? 'text-right' : ''}`}>
       {/* Toolbar */}
       <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-black/20 p-4 border border-white/5 rounded-xl ${isRtl ? 'flex-row-reverse' : ''}`}>
          <div className="relative w-full max-w-sm">
            <input 
              type="text" 
              placeholder={t[lang].searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full bg-black/50 border border-white/10 rounded-lg py-2.5 text-sm text-white focus:outline-none focus:border-accent-violet/50 transition-colors font-mono ${isRtl ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4'}`}
            />
            <Search className={`w-4 h-4 text-white/40 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-white/90 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isRtl ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-3.5 h-3.5" /> {t[lang].newClient}
          </button>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <div key={client.id} className="bg-[#0C0C0C] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all group">
              <div className={`flex items-start justify-between mb-6 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Building className="w-5 h-5 text-accent-violet" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white tracking-wider">{client.name}</div>
                    <div className="text-[10px] font-mono text-white/40 mt-0.5">{client.brand_company || 'Independent'}</div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(client.id)}
                  className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[9px] hover:bg-red-500/20 font-black uppercase transition-all"
                >
                  Delete
                </button>
              </div>

              <div className="space-y-4">
                <div className={`flex justify-between items-center ${isRtl ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest">{t[lang].status}</span>
                   <span className="px-2 py-0.5 bg-accent-violet/10 text-accent-violet border border-accent-violet/20 rounded text-[9px] font-black uppercase">{client.status}</span>
                </div>
                <div className={`flex items-center gap-2 text-[10px] text-white/60 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Mail className="w-3 h-3 block opacity-40" />
                  <span className="truncate">{client.email || 'N/A'}</span>
                </div>
                <div className={`flex items-center gap-2 text-[10px] text-white/60 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Phone className="w-3 h-3 block opacity-40" />
                  <span>{client.phone_whatsapp || 'N/A'}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
             <div className="col-span-full p-20 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
               <p className="text-white/30 font-mono text-xs uppercase text-center tracking-widest">{t[lang].empty}</p>
             </div>
          )}
       </div>

       {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0C0C0C] border border-white/10 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl">
            <div className={`p-6 border-b border-white/5 flex justify-between items-center bg-black/40 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <h2 className="text-lg font-black uppercase text-white tracking-widest">{t[lang].addClientModalTitle}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData(p => ({...p, name: e.target.value}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet" />
              <input type="text" placeholder="Brand / Company" value={formData.brand_company} onChange={e => setFormData(p => ({...p, brand_company: e.target.value}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet" />
              <input type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData(p => ({...p, email: e.target.value}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet" />
              <input type="text" placeholder="Phone / WhatsApp" value={formData.phone_whatsapp} onChange={e => setFormData(p => ({...p, phone_whatsapp: e.target.value}))} className="w-full bg-black border border-white/10 py-3 px-4 rounded-xl text-sm text-white focus:outline-none focus:border-accent-violet" />
            </div>
            <div className={`p-6 border-t border-white/5 flex gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <button onClick={handleSave} className="flex-1 py-3 font-black text-xs uppercase tracking-widest bg-white text-black hover:bg-white/90 rounded-xl transition">
                {t[lang].save}
              </button>
              <button onClick={() => setShowAddModal(false)} className="px-6 py-3 font-black text-xs uppercase tracking-widest bg-white/5 text-white/60 hover:bg-white/10 hover:text-white rounded-xl transition border border-white/10">
                {t[lang].cancel}
              </button>
            </div>
          </div>
        </div>
       )}
    </div>
  );
};
