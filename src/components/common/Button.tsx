import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className, ...props }: ButtonProps) => {
  const baseStyles = 'relative px-10 py-4 rounded-full font-black uppercase tracking-widest transition-all duration-500 group flex items-center justify-center gap-3 select-none cursor-pointer';
  
  const variants = {
    primary: 'bg-black/80 text-white',
    secondary: 'bg-white/5 backdrop-blur-md text-white border border-white/10 hover:bg-white/10',
    ghost: 'text-white/40 hover:text-white transition-opacity',
    whatsapp: 'bg-[#25D366] text-white shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_40px_rgba(37,211,102,0.5)] border border-white/10'
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {/* 1. High-Fidelity Animated Border (The "Stitch" Pro Look) */}
      {variant === 'primary' && (
        <>
            {/* The Outer Glow - Static and Soft */}
            <div className="absolute -inset-[2px] rounded-full bg-linear-to-r from-accent-violet/50 via-[#ff00ff]/30 to-cyan-400/50 opacity-40 blur-md group-hover:opacity-80 transition-opacity duration-700" />
            
            {/* The Border Beam - Moving Line */}
            <div className="absolute inset-0 rounded-full p-px overflow-hidden">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute -inset-full bg-conic-gradient from-transparent via-accent-violet to-transparent opacity-100"
                    style={{ background: 'conic-gradient(from 0deg, transparent 20%, #8b5cf6 50%, transparent 80%)' }}
                />
            </div>

            {/* Internal Surface Shadow for Depth */}
            <div className="absolute inset-px rounded-full bg-black z-0 shadow-inner" />
        </>
      )}

      {/* 2. Glass Texture & Highlights */}
      <div className={cn(
          "absolute inset-0 z-0 rounded-full opacity-100 transition-colors duration-500",
          variant === 'primary' ? "bg-linear-to-b from-white/10 to-transparent backdrop-blur-3xl" : "bg-transparent"
      )} />

      {/* 4. The Label */}
      <span className="relative z-10 flex items-center gap-3 font-black tracking-widest text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        {children}
      </span>

      {/* 5. Interactive Shine Flash on Hover */}
      {variant === 'primary' && (
        <motion.div 
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1, x: ['-100%', '100%'] }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent z-20 pointer-events-none"
        />
      )}
    </motion.button>
  );
};
