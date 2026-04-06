import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, ChevronRight, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
}

export const LoginModal = ({ isOpen, onClose, lang }: LoginModalProps) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  // ... existing state ...
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = {
    en: {
      welcome: 'Welcome Back',
      join: 'Join Us',
      sync: 'Sync your identity',
      begin: 'Begin your journey',
      login: 'Login',
      signup: 'Sign Up',
      fullName: 'Full Name',
      namePlaceholder: 'Your Name...',
      email: 'Email',
      emailPlaceholder: 'Enter your email...',
      password: 'Password',
      passwordPlaceholder: 'Enter your password...',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      secure: 'Secure 256-bit AES encryption',
      invalid: 'Invalid credentials. Please try again.',
      failed: 'Signup failed. Please try again.',
      unavailable: 'System unavailable. Please try again later.'
    },
    ar: {
      welcome: 'مرحباً بعودتك',
      join: 'انضم إلينا',
      sync: 'مزامنة هويتك الرقمية',
      begin: 'ابدأ رحلتك معنا',
      login: 'دخول',
      signup: 'تسجيل',
      fullName: 'الاسم الكامل',
      namePlaceholder: 'اكتب اسمك هنا...',
      email: 'البريد الإلكتروني',
      emailPlaceholder: 'أدخل بريدك الإلكتروني...',
      password: 'كلمة المرور',
      passwordPlaceholder: 'أدخل كلمة المرور...',
      signIn: 'دخول النظام',
      createAccount: 'إنشاء حساب',
      secure: 'تشفير آمن AES بجودة 256 بت',
      invalid: 'بيانات غير صحيحة. حاول مرة أخرى.',
      failed: 'فشل التسجيل. حاول مرة أخرى.',
      unavailable: 'النظام غير متاح حالياً. حاول لاحقاً.'
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (mode === 'signup') {
        const result = signup(name, email, password);
        if (result.success) {
          onClose();
        } else {
          setError(result.error || t[lang].failed);
        }
        return;
      }

      const success = await login(email, password);
      if (success) {
        onClose();
      } else {
        setError(t[lang].invalid);
      }
    } catch (err) {
      setError(t[lang].unavailable);
    } finally {
      setIsLoading(false);
    }
  };

  const isRtl = lang === 'ar';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-1001 flex items-center justify-center p-4 lg:p-8 ${isRtl ? 'rtl font-arabic' : 'ltr'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-lg"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-[420px] bg-[#0A0A0A]/90 border border-white/10 rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-3xl"
          >
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-violet/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent-violet/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="p-8 pb-10 relative">
              <div className={`flex items-center justify-between mb-10 ${isRtl ? 'flex-row-reverse text-right' : ''}`}>
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-accent-violet animate-pulse" />
                  </div>
                  <div className={isRtl ? 'text-right' : ''}>
                    <h2 className="text-lg font-black uppercase tracking-widest text-white">
                      {mode === 'login' ? t[lang].welcome : t[lang].join}
                    </h2>
                    <p className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                      {mode === 'login' ? t[lang].sync : t[lang].begin}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-8">
                <button
                  onClick={() => setMode('login')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${mode === 'login' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}
                >
                  <LogIn className="w-3 h-3" />
                  {t[lang].login}
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${mode === 'signup' ? 'bg-white/10 text-white shadow-xl' : 'text-white/30 hover:text-white/60'}`}
                >
                  <UserPlus className="w-3 h-3" />
                  {t[lang].signup}
                </button>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-[10px] font-mono text-red-400 uppercase tracking-widest text-center"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {mode === 'signup' && (
                    <motion.div 
                      key="name-field"
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="space-y-1.5 focus-within:translate-x-1 transition-transform overflow-hidden"
                    >
                      <label className={`text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] ${isRtl ? 'mr-2 text-right block' : 'ml-2'}`}>{t[lang].fullName}</label>
                      <div className="relative group">
                        <input 
                          type="text" 
                          required={mode === 'signup'}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent-violet focus:bg-white/8 transition-all outline-none ${isRtl ? 'pr-12 pl-6 text-right' : 'pl-12 pr-6'}`}
                          placeholder={t[lang].namePlaceholder}
                        />
                        <Sparkles className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-colors`} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform">
                  <label className={`text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] ${isRtl ? 'mr-2 text-right block' : 'ml-2'}`}>{t[lang].email}</label>
                  <div className="relative group">
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent-violet focus:bg-white/8 transition-all outline-none ${isRtl ? 'pr-12 pl-6 text-right' : 'pl-12 pr-6'}`}
                      placeholder={t[lang].emailPlaceholder}
                    />
                    <Mail className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-colors`} />
                  </div>
                </div>

                <div className="space-y-1.5 focus-within:translate-x-1 transition-transform delay-75">
                  <label className={`text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] ${isRtl ? 'mr-2 text-right block' : 'ml-2'}`}>{t[lang].password}</label>
                  <div className="relative group">
                    <input 
                      type="password" 
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-sm text-white placeholder:text-white/10 focus:outline-none focus:border-accent-violet focus:bg-white/8 transition-all outline-none ${isRtl ? 'pr-12 pl-6 text-right' : 'pl-12 pr-6'}`}
                      placeholder={t[lang].passwordPlaceholder}
                    />
                    <Lock className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-accent-violet transition-colors`} />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full relative group h-14 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.3em] overflow-hidden transition-all hover:shadow-[0_20px_40px_-12px_rgba(255,255,255,0.2)] disabled:opacity-50"
                  >
                    <div className="absolute inset-0 bg-accent-violet translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <div className={`relative flex items-center justify-center gap-2 group-hover:text-white transition-colors duration-500 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-black/20 border-t-black group-hover:border-white/20 group-hover:border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>{mode === 'login' ? t[lang].signIn : t[lang].createAccount}</span>
                          <ChevronRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isRtl ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </form>

              <p className="mt-8 text-center text-[10px] text-white/30 font-mono tracking-widest uppercase">
                {t[lang].secure}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
