import { useState } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';
import { GlassCard } from '../ui/GlassCard';
import type { MatchResult } from '../../types';
import clsx from 'clsx';

interface PassageCardProps {
  match: MatchResult;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * 诗句卡片组件
 * 始终使用深色主题样式，因为它只在书本布局（深色背景）中显示
 */
export function PassageCard({ match, isActive = false, onClick }: PassageCardProps) {
  const { passage, matchScore, matchReason, rank } = match;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.15 }}
      whileHover={{
        y: -8,
        rotateX: 2,
        rotateY: -1,
        scale: 1.02,
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative group perspective-[1000px]"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <GlassCard
        className={clsx(
          "p-8 cursor-pointer transition-all duration-500 border-l-[3px] overflow-hidden !bg-[#05080f]/70 backdrop-blur-sm",
          isActive
            ? "border-l-[#8adefa] shadow-[0_0_30px_rgba(138,222,250,0.15)]"
            : "border-l-transparent hover:!bg-[#0b162c]/60 hover:border-l-[#4c849e]"
        )}
      >
        {/* 悬停时的光晕效果 */}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[#8adefa]/10 via-transparent to-[#4c849e]/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* 悬停时的飞线边缘 */}
        <motion.div
          className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-[#8adefa] to-transparent shadow-[0_0_10px_#8adefa]"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'top' }}
        />

        {/* Match Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-serif tracking-widest shadow-[0_0_10px_rgba(0,0,0,0.5)] border backdrop-blur-md bg-[#02050f]/80 border-[#8adefa]/30 text-white">
          <Sparkles className="w-3 h-3" />
          契合度 {Math.round(matchScore * 100)}%
        </div>

        {/* Rank Watermark */}
        <div className="absolute -bottom-4 -right-2 text-[8rem] font-serif font-bold pointer-events-none select-none leading-none text-white/10">
          {rank}
        </div>

        <Quote className="w-8 h-8 mb-6 drop-shadow-md text-white/50" />

        <blockquote className="text-lg md:text-xl mb-8 leading-[2.5rem] font-serif italic relative z-10 tracking-wide text-white drop-shadow-sm">
          "{passage.content}"
        </blockquote>

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded bg-gradient-to-br from-[#0ea5e9] to-[#38bdf8] flex items-center justify-center font-serif text-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10 text-white">
            {passage.author?.name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-serif tracking-widest text-lg text-white">
              {passage.author?.name || '佚名'}
            </p>
            <p className="text-sm font-serif tracking-wider mt-1 text-white/70">
              《{passage.work?.title || '未知卷帙'}》
            </p>
          </div>
        </div>

        {/* Match Reason */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <p className="text-sm flex items-start gap-3 leading-relaxed font-serif tracking-wide text-white/80">
            <span className="mt-0.5 text-white/85">✦</span>
            <span className="opacity-90">{matchReason}</span>
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
