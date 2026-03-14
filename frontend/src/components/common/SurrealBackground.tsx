import { useState } from 'react';
import { motion } from 'framer-motion';

interface Droplet {
  id: number;
  left: string;
  width: string;
  height: string;
  opacity: number;
  duration: number;
  delay: number;
}

interface TextRainItem {
  id: number;
  text: string;
  left: string;
  duration: number;
  delay: number;
  opacity: number;
  fontSize: string;
}

const QUOTES = [
  "世界以痛吻我，要我报之以歌。", "生活中没有什么可怕的东西，只有需要理解的东西。",
  "你若爱，生活哪里都可爱；你若恨，生活哪里都可恨。", "一个人可以被毁灭，但不能被打败。",
  "我们把世界看错了，却说世界欺骗了我们。", "人生如同一条奔流不息的河流，我们既是水中的漂流者，也是河流本身的一部分。",
  "在这广阔的世界里，每个人都在寻找属于自己的那一盏灯。", "时间会带走一切，也会留下最安静的答案。",
  "有些人活在记忆里，有些人活在未来里，而真正的生活在此刻。", "当你真正理解一件事情时，你会发现，世界比你想象得更加辽阔。",
  "孤独不是没有人陪伴，而是心里有话却不知道对谁说。", "有时候，一个人走在夜里，世界反而变得更加清晰。",
  "真正的孤独，是在人群之中仍然感觉自己像一座孤岛。", "当世界渐渐安静下来，人才能听见自己心里的声音。",
  "有些路只能一个人走，有些风景也只能一个人看见。", "夜晚很长，长到足够让一个人慢慢与自己和解。",
  "人总是在最安静的时候，才看见自己真实的模样。", "孤独像一片海，有时平静，有时汹涌。",
  "有些沉默不是无话可说，而是话太多却无处可说。", "当所有灯都熄灭时，心里的光才会慢慢亮起来。",
  "一个人坐在窗前的时候，世界会变得很远。", "有些人离开之后，房间依旧安静得像从未有人来过。",
  "孤独并不可怕，可怕的是习惯了沉默。", "有些夜晚，人只是静静地看着时间流过。",
  "有时候我们不是在等待谁，只是在等待自己慢慢变好。", "风经过城市的时候，没有人知道它来自哪里。",
  "每个人心里都有一间房间，只有自己才能进去。", "有些情绪像雾一样弥漫，却说不清来自哪里。",
  "当城市睡着的时候，孤独的人才开始醒来。", "一个人的路很长，但也很安静。",
  "有时候沉默，是人与世界最温柔的距离。", "人群像海浪，而孤独像一座灯塔。",
  "夜晚让人明白，很多事情只能慢慢想清楚。", "有些人只是走着走着，就走进了自己的世界。",
  "孤独不是黑暗，它只是光暂时离开的地方。", "在没有人说话的时刻，心会变得很清澈。",
  "时间会带走很多声音，留下的往往是沉默。", "人总要在某些夜晚，学会独自面对自己。",
  "世界很大，而一个人的心事却很小。", "有些人不是孤独，只是在与世界保持距离。"
];

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createDroplets(): Droplet[] {
  return Array.from({ length: 40 }, (_, index) => ({
    id: index,
    left: `${randomBetween(0, 100)}%`,
    width: `${randomBetween(1, 4)}px`,
    height: `${randomBetween(20, 80)}px`,
    opacity: randomBetween(0.2, 0.7),
    duration: randomBetween(0.4, 1.2),
    delay: randomBetween(0, 2),
  }));
}

function createTextRain(): TextRainItem[] {
  return Array.from({ length: 60 }, (_, index) => ({
    id: index,
    text: QUOTES[index % QUOTES.length],
    left: `${randomBetween(2, 97)}%`,
    duration: randomBetween(15, 40),
    delay: randomBetween(-30, 0),
    opacity: randomBetween(0.3, 0.9),
    fontSize: `${randomBetween(12, 16)}px`,
  }));
}

function BoatSilhouette() {
  return (
    <svg viewBox="0 0 200 100" className="w-[120px] md:w-[160px] h-auto fill-[#0a0a0c]">
      <path d="M 20 60 C 50 62, 120 62, 170 55 C 175 55, 180 50, 185 45 C 187 40, 185 40, 185 40 L 10 40 C 8 45, 12 55, 20 60 Z" />
      <path d="M 85 40 L 85 18 C 85 14, 95 14, 95 18 L 95 40 Z" />
      <circle cx="90" cy="8" r="6" />
      <ellipse cx="90" cy="4" rx="10" ry="2" />
      <path d="M 82 20 L 98 20 L 105 35 L 100 37 L 95 25 L 95 40 L 85 40 Z" />
      <line x1="90" y1="30" x2="130" y2="70" stroke="#0a0a0c" strokeWidth="3" fill="none" />
      <line x1="90" y1="30" x2="70" y2="10" stroke="#0a0a0c" strokeWidth="2" fill="none" />
      <rect x="12" y="32" width="10" height="15" rx="2" />
    </svg>
  );
}

// Draw the inverted, floating open book at the top
function HeavenlyBookSilhouette() {
  return (
    <div className="w-full max-w-[1400px] mx-auto h-[25vh] relative pt-0 md:pt-4 px-4 overflow-visible flex items-start justify-center">
       <svg viewBox="0 0 800 250" className="w-[90%] md:w-[75%] h-auto drop-shadow-[0_20px_50px_rgba(132,196,216,0.5)] opacity-100 z-50 relative pointer-events-none">
         <defs>
           <filter id="book-glow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="10" result="blur" />
             <feMerge>
               <feMergeNode in="blur"/>
               <feMergeNode in="SourceGraphic"/>
             </feMerge>
           </filter>
           <filter id="light-glow" x="-20%" y="-20%" width="140%" height="140%">
             <feGaussianBlur stdDeviation="4" result="blur" />
             <feMerge>
               <feMergeNode in="blur"/>
               <feMergeNode in="SourceGraphic"/>
             </feMerge>
           </filter>
           {/* Gradients to give volume to the pages */}
           <linearGradient id="page-face-left" x1="1" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#ffffff" />
             <stop offset="60%" stopColor="#87a0ab" />
             <stop offset="100%" stopColor="#415b69" />
           </linearGradient>
           <linearGradient id="page-face-right" x1="0" y1="0" x2="1" y2="1">
             <stop offset="0%" stopColor="#ffffff" />
             <stop offset="60%" stopColor="#87a0ab" />
             <stop offset="100%" stopColor="#415b69" />
           </linearGradient>
         </defs>

         {/* 1. Behind Cover (Hardcover Exterior - Double Curved 'M' shape from below) */}
         {/* Left Side Cover Ext */}
         <path d="M 400 10 C 280 15, 180 -10, 50 80 L 70 110 C 190 30, 310 50, 400 50 Z" fill="#1a2b3c" stroke="#3b5d7d" strokeWidth="1" />
         {/* Right Side Cover Ext */}
         <path d="M 400 10 C 520 15, 620 -10, 750 80 L 730 110 C 610 30, 490 50, 400 50 Z" fill="#1a2b3c" stroke="#3b5d7d" strokeWidth="1" />
         
         {/* 2. Paper Stack (showing the thickness of the pages dropping down due to gravity) */}
         {/* Left Stack */}
         <path d="M 395 50 C 310 50, 190 30, 70 110 L 90 150 C 200 65, 315 75, 395 90 Z" fill="#4a6370" />
         {/* Right Stack */}
         <path d="M 405 50 C 490 50, 610 30, 730 110 L 710 150 C 600 65, 485 75, 405 90 Z" fill="#4a6370" />

         {/* Paper texture lines inside the block */}
         <path d="M 395 62 C 310 65, 195 45, 78 122" stroke="#7a97a6" strokeWidth="1.5" fill="none" opacity="0.6" />
         <path d="M 395 72 C 310 75, 198 56, 85 134" stroke="#7a97a6" strokeWidth="1" fill="none" opacity="0.4" />
         
         <path d="M 405 62 C 490 65, 605 45, 722 122" stroke="#7a97a6" strokeWidth="1.5" fill="none" opacity="0.6" />
         <path d="M 405 72 C 490 75, 602 56, 715 134" stroke="#7a97a6" strokeWidth="1" fill="none" opacity="0.4" />

         {/* 3. The Face of the Open Pages (The inner surface facing downwards, classic double-arch) */}
         {/* Left Page inner surface */}
         <path d="M 400 50 C 315 75, 200 65, 90 150 C 160 170, 290 140, 400 95 Z" fill="url(#page-face-left)" filter="url(#light-glow)" />
         {/* Right Page inner surface */}
         <path d="M 400 50 C 485 75, 600 65, 710 150 C 640 170, 510 140, 400 95 Z" fill="url(#page-face-right)" filter="url(#light-glow)" />

         {/* 4. Center Spine Fold Deep Crease where pages join */}
         {/* The deep shaded valley in the center */}
         <path d="M 395 60 C 400 100, 400 100, 400 95 C 400 100, 400 100, 405 60 Z" fill="#203340" />
         <path d="M 400 45 L 400 95" stroke="#ffffff" strokeWidth="3" filter="url(#book-glow)" />

         {/* 5. Glowing Magic Singularity Source (Water/Energy origin from the deep spine) */}
         <ellipse cx="400" cy="80" rx="35" ry="12" fill="#ffffff" filter="url(#book-glow)" />
         <ellipse cx="400" cy="80" rx="15" ry="5" fill="#aee2ff" filter="url(#book-glow)" />
       </svg>
    </div>
  );
}

export function SurrealBackground({ isOpen }: { isOpen?: boolean }) {
  const [droplets] = useState(createDroplets);
  const [textRain] = useState(createTextRain);

  return (
    <motion.div 
       className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-[#0a0d14] flex flex-col items-center justify-between"
       animate={{
         scale: isOpen ? 0.95 : 1,
         opacity: isOpen ? 0.3 : 1,
         filter: isOpen ? 'blur(4px)' : 'blur(0px)'
       }}
       transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Dark Texture Grain */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-60 mix-blend-overlay z-50 pointer-events-none" />
      
      {/* Deep Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#02040a_110%)] z-40 pointer-events-none" />

      {/* T O P : Floating Inverted Book (The Source) */}
      <div className="absolute top-0 left-0 right-0 z-30 opacity-100">
         <HeavenlyBookSilhouette />
      </div>

      {/* M I D D L E : The Text Waterfall falling out of the top Book */}
      <div className="absolute top-[18%] bottom-[15%] w-[70vw] min-w-[320px] flex justify-center z-10 pointer-events-none overflow-hidden"
           style={{ WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, black 80%, rgba(0,0,0,0.1) 100%)', maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, black 80%, rgba(0,0,0,0.1) 100%)' }}>
        
        {/* Soft background glow column representing the knowledge flowing */}
        <div className="absolute inset-y-0 w-[40%] bg-[#8bc3d6] opacity-30 blur-[60px]" style={{ WebkitMaskImage: "linear-gradient(to bottom, black, transparent)", maskImage: "linear-gradient(to bottom, black, transparent)" }}/>
        <div className="absolute inset-y-0 w-[60%] bg-[#5daac4] opacity-20 blur-[90px]" />
        <div className="absolute top-0 w-[30%] h-[50%] bg-[#fff] opacity-20 blur-[70px]" />

        {/* Realistic fast falling water droplets / laser streams */}
        <div className="absolute inset-0 z-20 mix-blend-screen opacity-60 pointer-events-none" style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 2%, black 20%, black 80%, transparent)' }}>
           {droplets.map((d) => (
             <motion.div 
                key={`drop-${d.id}`}
                className="absolute top-0 blur-[1px] bg-gradient-to-b from-transparent via-[#c8eefc] to-[#fff]"
                style={{ 
                  left: d.left, 
                  width: d.width,
                  height: d.height,
                  opacity: d.opacity,
                  borderRadius: '10px'
                }}
                animate={{ y: ["-20vh", "120vh"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: d.duration, delay: d.delay }}
             />
           ))}
        </div>

        {/* Dense falling Chinese Text Rain (Matrix style) */}
        <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none" 
             style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 15%, black 85%, transparent)' }}>
           {textRain.map((t) => (
              <motion.div 
                key={`text-${t.id}`} 
                className="absolute text-[#bae6fa] font-serif whitespace-nowrap drop-shadow-[0_0_8px_rgba(138,222,250,0.6)]" 
                style={{ 
                  writingMode: 'vertical-rl',
                  left: t.left, 
                  opacity: t.opacity, 
                  fontSize: t.fontSize,
                  letterSpacing: '0.3em'
                }} 
                animate={{ y: ["-120vh", "120vh"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: t.duration, delay: t.delay }}
              >
                {t.text}
              </motion.div>
           ))}
        </div>

        {/* Slow moving foggy waterfall dust */}
        <motion.div 
            className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.2] mix-blend-overlay z-30"
            animate={{ y: ["0%", "100%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 5 }}
        />
      </div>

      {/* B O T T O M : Water Surface & Boat */}
      <div className="absolute bottom-0 left-0 right-0 h-[25%] flex flex-col items-center z-20 pointer-events-none">
        {/* Glow hitting the water */}
        <div className="absolute -top-[50px] w-[75vw] h-[130px] bg-[#aee2ff] opacity-30 blur-[60px] rounded-[100%]" />
        <div className="absolute top-4 w-[45vw] h-[40px] bg-[#fff] opacity-30 blur-[40px] rounded-[100%]" />
        
        {/* Horizontal wave reflection lines */}
        <div className="absolute inset-0 flex flex-col items-center justify-start pt-16 gap-2.5 opacity-90 mix-blend-screen">
           <div className="w-[50vw] h-[2px] bg-[#bbecfc] blur-[1px] rounded-full" />
           <div className="w-[65vw] h-[1px] bg-[#84c4d8] blur-[1px] rounded-full" />
           <div className="w-[35vw] h-[2px] bg-[#ffffff] blur-[2px] rounded-full" />
           <div className="w-[80vw] h-[1px] bg-[#84c4d8] blur-[1px] rounded-full opacity-60" />
           <div className="w-[95vw] h-[1.5px] bg-[#84c4d8] blur-[2px] opacity-40 rounded-full" />
        </div>
      </div>

      {/* The Boat Silhouette positioned in the reflection */}
      <div className="absolute bottom-[8%] drop-shadow-2xl z-30 transition-transform duration-1000 ease-in-out">
         <motion.div
           animate={{ y: [0, -5, 0], rotate: [0, 2, -2, 0] }}
           transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
         >
           <BoatSilhouette />
         </motion.div>
      </div>
    </motion.div>
  )
}
