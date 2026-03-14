import { useState } from 'react';
import type { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Compass, Book as BookIcon, Flower2, Clock, LogOut, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useEntryStore } from '../../stores/entryStore';
import { EmotionPicker } from '../entry/EmotionPicker';
import { SurrealBackground } from './SurrealBackground';

interface BookLayoutProps {
  children: ReactNode;
}

export function BookLayout({ children }: BookLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { draftEmotion, setDraftEmotion } = useEntryStore();
  
  const isDark = theme === 'dark';

  const navItems = [
    { path: '/', label: '此刻', icon: BookIcon, color: 'bg-blue-500' },
    { path: '/garden', label: '回响', icon: Flower2, color: 'bg-emerald-500' },
    { path: '/timeline', label: '长河', icon: Clock, color: 'bg-amber-500' },
  ];

  // Map route to page title for the left page
  const getLeftPageContent = () => {
    const activeRoute = navItems.find((nav) => nav.path === location.pathname) || navItems[0];
    
    if (activeRoute.path === '/') {
      const today = new Date();
      const dateStr = today.toLocaleDateString('zh-CN', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
      const hour = today.getHours();
      const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

      return (
        <div className="flex flex-col h-full p-8 md:p-12 text-left relative preserve-3d pointer-events-auto">
          <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
            <p className="text-[#8adefa] font-medium tracking-widest text-xs font-serif mb-2 drop-shadow-[0_0_8px_rgba(138,222,250,0.5)]">
              {dateStr}
            </p>
            <h1 className="text-3xl font-serif text-[#d0eaf8] tracking-wide mb-8">
              {greeting}
            </h1>
            <div className="w-full text-left">
               <span className="text-sm font-serif text-[#7bb0c9] tracking-widest">
                 第一卷 · 起源与回响
               </span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center relative z-20 pointer-events-auto mt-12" style={{ transform: "translateZ(30px)" }}>
            <h2 className="text-sm text-[#4c849e] mb-8 font-serif tracking-widest text-shadow-sm">【 观照微尘 · 觉察本心 】</h2>
            <div className="scale-100 md:scale-110 transform-gpu origin-center">
              <EmotionPicker selected={draftEmotion} onSelect={setDraftEmotion} />
            </div>
          </div>

          <div style={{ transform: "translateZ(10px)" }} className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
             <Compass className="w-96 h-96 spin-slow" />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center relative pointer-events-none">
        {/* Parallax elements */}
        <div style={{ transform: "translateZ(30px)" }} className="relative z-10">
          <activeRoute.icon className="w-32 h-32 mx-auto mb-8 text-[#8adefa] opacity-60 drop-shadow-[0_0_15px_rgba(138,222,250,0.3)]" />
          <h1 className="text-4xl font-bold tracking-widest text-[#d0eaf8] mb-4 font-serif text-shadow-md">
            {activeRoute.label}
          </h1>
          <p className="text-[#4c849e] text-lg max-w-[200px] mx-auto font-serif">
            翻阅凡尘的篇章
          </p>
        </div>
        
        {/* Decorative background */}
        <div style={{ transform: "translateZ(10px)" }} className="absolute inset-0 flex items-center justify-center opacity-10">
           <Compass className="w-96 h-96 spin-slow" />
        </div>
      </div>
    );
  };

  return (
    <div className={clsx(
      "fixed inset-0 overflow-hidden flex items-center justify-center perspective-[2500px] bg-[#05080f] selection:bg-[var(--accent-primary)]/30"
    )}>

      {/* The Surreal Background (ALWAYS PRESENT, shifts depth on open) */}
      <SurrealBackground isOpen={isOpen} />

      {/* The Landing Cover Screen Overlay (Only for the "Click to enter" text & trigger) */}
      <AnimatePresence>
        {!isOpen && (
           <motion.div
              key="surreal-landing"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.0, ease: "easeInOut" }}
              className="absolute inset-0 z-10 pointer-events-auto cursor-pointer"
              onClick={() => setIsOpen(true)}
           >
              <div className="absolute bottom-[6%] w-full text-center z-50 text-[#8adefa] text-xs tracking-[0.5em] font-serif uppercase animate-pulse hover:text-white transition-colors duration-500 drop-shadow-[0_0_10px_rgba(138,222,250,0.8)]">
                点击屏幕边缘 · 翻开人间之书
              </div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Book Container */}
      <motion.div
        className={clsx("relative w-[90vw] max-w-[1200px] h-[85vh] preserve-3d", !isOpen && "pointer-events-none")}
        initial={{ scale: 0.8, rotateX: 45, y: "-30vh", z: -100, opacity: 0 }}
        animate={{
          scale: isOpen ? 1 : 0.8,
          rotateX: isOpen ? 0 : 45,
          rotateY: isOpen ? 0 : 0,
          z: isOpen ? 0 : -100,
          y: isOpen ? 0 : "-30vh",
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], delay: isOpen ? 0.3 : 0 }}
      >

        {/* Bookmarks (Navigation) - Attached to the right edge */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="absolute -right-16 top-20 flex flex-col gap-4 z-[100]"
              style={{ transform: 'translateZ(100px)' }}
            >
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={clsx(
                      "pl-4 pr-6 py-3 transition-all duration-500 flex items-center shadow-lg group border-y border-r border-[#8adefa]/20 cursor-pointer",
                      isActive
                        ? "bg-[#0b162c]/60 text-[#8adefa] scale-105 shadow-[0_0_20px_rgba(138,222,250,0.3)] backdrop-blur-md"
                        : "bg-transparent text-[#4c849e] hover:bg-[#8adefa]/10 hover:text-[#7bb0c9] backdrop-blur-md"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0 drop-shadow-md mr-3" />
                    <span className="font-serif text-sm tracking-widest whitespace-nowrap">{item.label}</span>
                    {isActive && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#8adefa] shadow-[0_0_8px_#8adefa] rotate-45" />
                    )}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ====== THE REAL 3D BOOK VOLUMETRIC STRUCTURE ====== */}
        {/* We need to build a book with thickness. The book has a back cover, thick pages on the right, and a pivoting front cover. */}

        {/* 1. The Right Side (The bulk of the pages & Back Cover) */}
        {/* We wrap the right side in a parent that provides the thickness (the paper edges) */}
        <div className="absolute inset-y-0 right-0 w-1/2 rounded-r-2xl shadow-2xl preserve-3d">
          
          {/* Top Edge (Paper Thickness) */}
          <div className="absolute top-0 right-0 left-0 h-[20px] bg-[#02050f] border-b border-[#8adefa]/30 origin-top preserve-3d" 
               style={{ transform: "rotateX(-90deg) translateZ(0px) translateY(-10px)", backfaceVisibility: "hidden" }}>
             <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
          </div>

          {/* Bottom Edge (Paper Thickness) */}
          <div className="absolute bottom-0 right-0 left-0 h-[20px] bg-[#02050f] border-t border-[#8adefa]/30 origin-bottom preserve-3d" 
               style={{ transform: "rotateX(90deg) translateZ(0px) translateY(10px)", backfaceVisibility: "hidden" }}>
             <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
          </div>

          {/* Right Edge (Paper Thickness) */}
          <div className="absolute top-0 bottom-0 right-0 w-[20px] bg-[#030818] rounded-r-md border-l border-[#8adefa]/20 origin-right preserve-3d overflow-hidden" 
               style={{ transform: "rotateY(90deg) translateZ(0px) translateX(10px)", backfaceVisibility: "hidden" }}>
             {/* Glowing Paper lines texture */}
             <div className="w-full h-full bg-[repeating-linear-gradient(transparent,transparent_1px,rgba(138,222,250,0.1)_1px,rgba(138,222,250,0.1)_2px)]" />
             <div className="absolute inset-0 bg-gradient-to-b from-[#8adefa]/5 via-transparent to-[#8adefa]/5" />
          </div>

          {/* The Actual Bottom Cover (Under the pages on the right) - 暗物质晶体外壳 */}
          <div className="absolute inset-0 rounded-r-2xl bg-[#0a0d14]/40 backdrop-blur-md border border-[#8adefa]/15 preserve-3d shadow-[10px_20px_50px_rgba(0,0,0,0.4),inset_0_0_30px_rgba(138,222,250,0.05)]"
               style={{ transform: "translateZ(-10px)", backfaceVisibility: "hidden" }}>
               {/* 星尘纹理层 */}
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
               {/* 晶体折射光泽 */}
               <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#8adefa]/5 to-transparent" />
               {/* 深空星点 */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(138,222,250,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(100,180,255,0.06)_0%,transparent_40%)]" />
          </div>

          {/* Back Cover - Left side of the open book (Static bottom left cover) - 暗物质晶体外壳 */}
          <div
            className="absolute inset-y-0 right-full w-full rounded-l-2xl border-l border-y border-[#8adefa]/15 overflow-hidden preserve-3d bg-[#0a0d14]/40 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(138,222,250,0.03)]"
            style={{ transformOrigin: "right", transform: "translateZ(10px)" }}
          >
            {/* Internal Left Page (Theme aware paper) */}
            <div className="absolute inset-2 md:inset-6 rounded-xl border border-[#8adefa]/30 shadow-[inset_0_0_50px_rgba(138,222,250,0.1)] bg-transparent backdrop-blur-sm preserve-3d text-[#d0eaf8]"
                 style={{ transform: "translateZ(10px)" }}>
               <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#8adefa]/10 to-transparent pointer-events-none" />
               <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/50 to-transparent pointer-events-none z-50 mix-blend-multiply" />
               <div className="absolute inset-0 preserve-3d pointer-events-auto">
                 {getLeftPageContent()}
               </div>
            </div>
            
            {/* The absolute back of the left cover (What you see if you flip the entire book over) */}
            <div className="absolute inset-0 rounded-l-2xl bg-[#02050f] border border-[#8adefa]/30 preserve-3d" 
                 style={{ transform: "rotateY(180deg) translateZ(1px)", backfaceVisibility: "hidden" }}>
            </div>
          </div>

          {/* The Content Pages Layer (Right) */}
          <div 
            className="absolute inset-0 rounded-r-2xl shadow-inner border-r border-y border-[#8adefa]/20 overflow-hidden preserve-3d bg-transparent"
            style={{ transform: "translateZ(10px)" }}
          >
          {/* Page binding shadow mask */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/40 to-transparent pointer-events-none z-50" />
          
          <div className="absolute inset-2 md:inset-6 rounded-xl shadow-[inset_0_0_50px_rgba(138,222,250,0.05)] border border-[#8adefa]/20 bg-transparent backdrop-blur-sm text-[#d0eaf8] preserve-3d overflow-hidden flex flex-col">
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#8adefa]/10 to-transparent pointer-events-none" />
            
            {/* Header / Tools inside the page */}
            <div className="flex justify-between items-center p-4 border-b border-[#8adefa]/20 z-20">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-sm bg-[#0b162c] flex items-center justify-center shadow-[0_0_10px_rgba(138,222,250,0.3)] border border-[#8adefa]/40">
                     <span className="text-[#8adefa] font-serif text-xs px-1">魂</span>
                 </div>
                 <span className="text-sm font-serif tracking-widest text-[#7bb0c9]">{user?.nickname || '观测者'}</span>
              </div>
              
              <div className="flex gap-2 text-[#7bb0c9]">
                 <button onClick={toggleTheme} className="p-2 hover:bg-[#8adefa]/10 hover:text-[#8adefa] transition-colors rounded">
                    {isDark ? <Sun className="w-5 h-5"/> : <Moon className="w-5 h-5"/>}
                 </button>
                 <button onClick={logout} className="p-2 hover:bg-red-500/20 hover:text-red-400 transition-colors rounded">
                    <LogOut className="w-5 h-5"/>
                 </button>
              </div>
            </div>

            {/* Main Content Area mapping to routes */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 md:p-8" style={{ transform: "translateZ(20px)" }}>
              {/* Wrapping children in AnimatePresence to create page flips (fades for simplicity unless complex flipping is desired) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, rotateY: 2 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: -2 }}
                  transition={{ duration: 0.5 }}
                  className="h-full relative z-10"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
            </div> {/* End Inner Page Container */}
          </div> {/* End Content Pages Layer */}
        </div> {/* End of Right Side */}

        {/* 2. The Spine (书脊) - Changed to Cosmic dark spine */}
        <div className="absolute inset-y-0 left-1/2 w-[20px] bg-[#02050f] border-x border-[#8adefa]/30 origin-left preserve-3d z-40 shadow-[-5px_0_15px_rgba(0,0,0,0.8)]"
             style={{ transform: "translateX(-10px) rotateY(-90deg) translateZ(10px) scaleX(1.1)", backfaceVisibility: "hidden" }}>
               {/* Spine Title */}
               <div className="w-full h-full flex items-center justify-center pt-20 relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
                 <span className="text-[#4c849e] text-xs tracking-[0.5em] font-serif transition-colors relative z-10" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                   天机 · 浮生手记
                 </span>
               </div>
        </div>

        {/* 3. The Front Cover (Flips Open) */}
        <motion.div
          className="absolute inset-y-0 left-1/2 w-1/2 origin-left preserve-3d shadow-[20px_20px_50px_rgba(0,0,0,0.9)] z-50"
          initial={{ rotateY: 0, x: "-100%", z: 10 }}
          animate={{ rotateY: isOpen ? -180 : 0, x: "-100%" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* Front Cover Volume (Thick Board) */}
          <div className="absolute inset-0 rounded-l-2xl preserve-3d bg-[#02050f]">
          {/* Outside of the Front Cover */}
          <div 
             className="absolute inset-0 backface-hidden rounded-l-2xl border border-[#8adefa]/20 flex flex-col items-center justify-center pointer-events-none p-6 md:p-10 bg-[#0a0d14]/60 backdrop-blur-md transition-colors"
             style={{ transform: "translateZ(1px)" }}
          >
             {/* Subtitle foil reflection hint via linear-gradient */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#8adefa]/10 via-transparent to-transparent opacity-60 rounded-l-2xl" />
             
             <div className="w-full h-full border border-[#8adefa]/20 rounded-xl flex flex-col items-center justify-center relative overflow-hidden bg-transparent shadow-inner transition-colors">
                <Compass className="w-24 h-24 text-[#8adefa] mb-6 drop-shadow-[0_0_15px_rgba(138,222,250,0.5)]" />
                <h1 className="text-5xl font-serif text-[#d0eaf8] tracking-[0.3em] ml-[0.3em] uppercase text-center mb-8 drop-shadow-lg">星海志</h1>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#8adefa]/50 to-transparent" />
                
                {/* Spine Texture line */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/80 to-transparent border-r border-[#8adefa]/10" />
             </div>
          </div>
          
          {/* Inside of the Front Cover (What you see when opened, resting on the left) */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-r-2xl bg-[#02050f] border border-[#8adefa]/20" 
               style={{ transform: "rotateY(180deg) translateZ(1px)" }}>
              {/* Back of cover texture */}
              <div className="w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay" />
              {/* Binding shadow */}
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/80 to-transparent pointer-events-none" />
          </div>
          
          {/* Thickness of the Front Cover */}
          <div className="absolute top-0 bottom-0 left-0 w-[5px] bg-[#02050f] origin-left preserve-3d border-y border-x border-[#8adefa]/30" 
               style={{ transform: "rotateY(-90deg) translateZ(0px) translateX(-2.5px)" }} />
          
          </div> {/* End Front Cover Volume */}
        </motion.div>

      </motion.div>
    </div>
  );
}
