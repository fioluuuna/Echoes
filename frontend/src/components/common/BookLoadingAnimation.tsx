import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import clsx from 'clsx';
import { Compass } from 'lucide-react';

interface PageLine {
  width: string;
  opacity?: number;
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createPageLines(
  count: number,
  widthMin: number,
  widthMax: number,
  opacityMin?: number,
  opacityMax?: number,
): PageLine[] {
  return Array.from({ length: count }, () => ({
    width: `${randomBetween(widthMin, widthMax)}%`,
    opacity:
      opacityMin !== undefined && opacityMax !== undefined
        ? randomBetween(opacityMin, opacityMax)
        : undefined,
  }));
}

/**
 * 答案之书加载动画
 * 模拟书本持续翻页效果，用于AI分析等待时
 */
export function BookLoadingAnimation() {
  const isDark = true;
  const [basePageLines] = useState(() => createPageLines(5, 60, 90));
  const [frontPageLines] = useState(() => createPageLines(6, 50, 90, 0.4, 1));
  const [backPageLines] = useState(() => createPageLines(6, 40, 80, 0.2, 0.6));

  // 翻页动画变体
  const pageVariants: Variants = {
    initial: { rotateY: 0 },
    flip: {
      rotateY: -180,
      transition: {
        duration: 1.2,
        ease: [0.3, 0.05, 0.2, 1] as const,
      },
    },
  };

  // 错开时间的页面数组
  const pages = [0, 1, 2, 3, 4];

  return (
    <div
      className={clsx(
        'fixed inset-0 backdrop-blur-md flex items-center justify-center z-[100]',
        isDark ? 'bg-[#02050f]/80' : 'bg-white/90'
      )}
    >
      <div className="flex flex-col items-center gap-12 select-none pointer-events-none">
        {/* 背景穹顶光效 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8adefa]/10 blur-[150px] rounded-full pointer-events-none" />

        {/* 罗盘星轨背景 */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute text-[#8adefa]/10"
        >
          <Compass className="w-96 h-96" />
        </motion.div>

        {/* 书本容器 */}
        <div
          className="relative w-56 h-72 perspective-[1500px] mt-10"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 书脊核心 */}
          <div
            className={clsx(
              'absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 z-10 rounded-sm',
              isDark
                ? 'bg-gradient-to-b from-[#02050f] via-[#0b162c] to-[#02050f] border-x border-[#8adefa]/30 shadow-[0_0_20px_rgba(138,222,250,0.4)]'
                : 'bg-gradient-to-b from-sky-300 via-sky-400 to-sky-300'
            )}
            style={{ transform: "translateZ(2px)" }}
          >
            {/* 发光神经索(书脊线) */}
            <div className="absolute inset-y-0 left-1/2 w-[2px] bg-[#8adefa]/60 -translate-x-1/2 shadow-[0_0_10px_#8adefa]" />
          </div>

          {/* 左侧封面（静态放置） */}
          <div
            className={clsx(
              'absolute left-0 top-0 w-1/2 h-full rounded-l-2xl',
              isDark
                ? 'bg-[#02050f] border-y border-l border-[#8adefa]/30 shadow-[inset_0_0_30px_rgba(138,222,250,0.1),-15px_15px_40px_rgba(0,0,0,0.8)]'
                : 'bg-sky-50 border-sky-200'
            )}
            style={{ transformOrigin: 'right center', transform: "rotateY(0deg) translateZ(-1px)" }}
          >
             {/* 封面内页 */}
             <div className="absolute inset-2 md:inset-4 border border-[#8adefa]/20 rounded-l-xl bg-[#0a0d14]/60 backdrop-blur-sm overflow-hidden flex flex-col items-center justify-center">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                 <Compass className="w-16 h-16 text-[#8adefa]/30 mb-4" />
                 <div className="text-[10px] text-[#4c849e] font-serif tracking-[0.5em] uppercase" style={{ writingMode: 'vertical-rl' }}>星海志</div>
                 {/* 页面装订阴影 */}
                 <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#02050f] to-transparent" />
             </div>
          </div>

          {/* 右侧底页（等待动画翻阅完成露出的层） */}
          <div
            className={clsx(
              'absolute right-0 top-0 w-1/2 h-full rounded-r-2xl',
              isDark
                ? 'bg-[#0a0d14] border-y border-r border-[#8adefa]/20 shadow-[inset_0_0_30px_rgba(138,222,250,0.05),15px_15px_40px_rgba(0,0,0,0.8)]'
                : 'bg-sky-50 border-sky-200'
            )}
            style={{ transform: "translateZ(-2px)" }}
          >
             {/* 右侧基础空页 */}
             <div className="absolute inset-2 md:inset-4 border border-[#8adefa]/10 rounded-r-xl bg-transparent flex flex-col pt-8 px-5">
                 <div className="w-1/2 h-[1px] bg-[#8adefa]/20 rounded mb-6" />
                 {basePageLines.map((line, index) => (
                    <div key={index} className="h-1 bg-[#8adefa]/5 rounded mb-4" style={{ width: line.width }} />
                 ))}
                 <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#02050f] to-transparent" />
             </div>
          </div>

          {/* 翻动的书页 */}
          {pages.map((index) => (
            <motion.div
              key={index}
              className="absolute right-0 top-0 w-1/2 h-full"
              style={{
                transformOrigin: 'left center',
                transformStyle: 'preserve-3d',
                zIndex: pages.length - index,
              }}
              initial="initial"
              animate="flip"
              variants={pageVariants}
              transition={{
                delay: index * 0.4,
                repeat: Infinity,
                repeatDelay: pages.length * 0.4, // 每轮翻页中间停顿
              }}
            >
              {/* === 书页正面 === */}
              <div
                className={clsx(
                  'absolute inset-0 rounded-r-2xl border backface-hidden',
                  isDark
                    ? 'bg-[#05080f] border-r border-y border-[#8adefa]/30 shadow-[-10px_0_20px_rgba(0,0,0,0.8)]'
                    : 'bg-white border-sky-100'
                )}
                style={{ backfaceVisibility: 'hidden' }}
              >
                {/* 边缘发光层 */}
                <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#8adefa]/10 to-transparent" />
                
                {/* 内部页芯 */}
                <div className="absolute inset-2 md:inset-4 rounded-r-xl overflow-hidden flex flex-col pt-8 px-5 bg-[#0a0d14]/40">
                  <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#02050f]/80 to-transparent" />
                  
                  {/* 模拟宇宙语言文字 */}
                  <div className="flex gap-2 mb-6">
                    <div className="w-8 h-8 rounded-full border border-[#8adefa]/30 flex items-center justify-center text-[10px] text-[#8adefa]/70">❖</div>
                    <div className="flex-1 space-y-2 pt-2">
                       <div className="h-[2px] bg-[#8adefa]/40 w-1/3 rounded shadow-[0_0_5px_#8adefa]" />
                       <div className="h-[1px] bg-[#8adefa]/20 w-1/4 rounded" />
                    </div>
                  </div>

                  {frontPageLines.map((line, index) => (
                    <div
                      key={index}
                      className="h-[2px] rounded my-2.5 bg-[#8adefa]/30"
                      style={{
                        width: line.width,
                        opacity: line.opacity,
                        boxShadow: '0 0 8px rgba(138,222,250,0.3)'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* === 书页背面 (翻开到了左侧) === */}
              <div
                className={clsx(
                  'absolute inset-0 rounded-l-2xl border',
                  isDark
                    ? 'bg-[#02050f] border-l border-y border-[#8adefa]/20 shadow-[10px_0_20px_rgba(0,0,0,0.8)]'
                    : 'bg-sky-50/80 border-sky-100'
                )}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <div className="absolute inset-2 md:inset-4 rounded-l-xl overflow-hidden flex flex-col items-end pt-8 px-5 bg-[#0a0d14]/40">
                  <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#02050f]/80 to-transparent" />
                  
                  {/* 飞散的粒子残留 */}
                  <div className="w-full mb-6 text-right text-[#8adefa]/20 text-xs font-serif px-2">✧</div>

                  {backPageLines.map((line, index) => (
                    <div
                      key={index}
                      className="h-[2px] rounded my-2.5 bg-[#8adefa]/20"
                      style={{
                        width: line.width,
                        opacity: line.opacity,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 底部文案 - 契合深空审美 */}
        <div className="text-center relative z-10 mt-8">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={clsx(
              'text-2xl font-serif tracking-[0.3em] mb-4',
              isDark ? 'text-[#d0eaf8] drop-shadow-[0_0_15px_rgba(138,222,250,0.5)] text-shadow-lg' : 'text-sky-600'
            )}
            style={{ textShadow: "0 0 20px rgba(138,222,250,0.3)" }}
          >
            世界正在写给你
          </motion.h2>
          
          <motion.div className="flex items-center justify-center gap-4 mb-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0.3, y: 0 }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
                className={clsx(
                  'w-2 h-2 rotate-45',
                  isDark ? 'bg-[#8adefa] shadow-[0_0_10px_#8adefa]' : 'bg-sky-500'
                )}
              />
            ))}
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={clsx(
              'text-sm font-serif tracking-widest',
              isDark ? 'text-[#4c849e]' : 'text-gray-500'
            )}
          >
            寻找与你心灵共鸣的回音
          </motion.p>
        </div>
      </div>
    </div>
  );
}
