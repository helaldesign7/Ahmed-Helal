import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CosmicBackground: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const [stars] = useState(() => Array.from({ length: isMobile ? 30 : 70 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * (isMobile ? 1 : 1.5) + 0.5,
        duration: Math.random() * 3 + 2,
        delay: Math.random() * 5
    })));
    const [meteors, setMeteors] = useState<{ id: number; top: string; left: string; duration: number }[]>([]);

    useEffect(() => {
        // Periodically spawn meteors
        const interval = setInterval(() => {
            if (Math.random() > 0.4) { // Only sometimes
                setMeteors(prev => [
                    ...prev.slice(-1), // Keep at most one active to avoid clutter
                    {
                        id: Date.now(),
                        top: `${Math.random() * 40}%`,
                        left: `${Math.random() * 100}%`,
                        duration: Math.random() * 1 + 1.2
                    }
                ]);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-primary-black">
            {/* Soft Ambient Nebula Glows */}
            <div className="hidden md:block absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-violet/5 blur-[120px] rounded-full animate-pulse" />
            <div className="hidden md:block absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full animate-pulse-slow" />

            {/* Static Content Overlay - Fine Grid */}
            <div 
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Twinkling Stars */}
            {stars.map(star => (
                <motion.div
                    key={star.id}
                    className="absolute bg-white rounded-full"
                    style={{
                        top: star.top,
                        left: star.left,
                        width: star.size,
                        height: star.size,
                        boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                    }}
                    animate={{
                        opacity: [0.1, 0.8, 0.1],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{
                        duration: star.duration,
                        delay: star.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}

            {/* Shooting Stars (Meteors) */}
            {meteors.map(meteor => (
                <motion.div
                    key={meteor.id}
                    className="absolute h-px bg-linear-to-l from-white via-accent-violet/50 to-transparent"
                    style={{
                        top: meteor.top,
                        left: meteor.left,
                        width: '150px',
                        transform: 'rotate(-35deg)'
                    }}
                    initial={{ x: -200, opacity: 0 }}
                    animate={{ x: 1200, opacity: [0, 1, 0] }}
                    transition={{
                        duration: meteor.duration,
                        ease: "linear"
                    }}
                />
            ))}

            {/* Subtle Speed Lines (Slow Moving) */}
            <div className="absolute inset-0 overflow-hidden opacity-[0.05]">
                <div className="absolute top-1/4 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent animate-slide-right" />
                <div className="absolute top-1/2 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent animate-slide-left" />
                <div className="absolute top-3/4 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent animate-slide-right" />
            </div>
        </div>
    );
};

export default CosmicBackground;
