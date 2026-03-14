import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { useThemeStore } from '../../stores/themeStore';
import { EMOTIONS } from '../../types';
import clsx from 'clsx';

interface EmotionCardProps {
  emotion: string;
  intensity: number;
}

/**
 * 情绪展示卡片 - 替代原有的天气卡片
 * 展示用户的主要情绪和强度
 */
export function EmotionCard({ emotion, intensity }: EmotionCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  // 获取情绪对应的 emoji
  const getEmotionEmoji = (emotionName: string) => {
    const found = EMOTIONS.find(e => e.name === emotionName);
    return found?.emoji || '💭';
  };

  // 根据情绪类型返回渐变色
  const getEmotionGradient = (emotionName: string) => {
    const gradients: Record<string, string> = {
      '快乐': 'from-amber-500 to-orange-500',
      '悲伤': 'from-blue-500 to-blue-500',
      '愤怒': 'from-red-500 to-rose-500',
      '恐惧': 'from-sky-500 to-cyan-500',
      '惊讶': 'from-cyan-500 to-teal-500',
      '平静': 'from-emerald-500 to-green-500',
      '孤独': 'from-slate-500 to-gray-500',
      '感动': 'from-pink-500 to-rose-500',
      '困惑': 'from-yellow-500 to-amber-500',
      '期待': 'from-cyan-500 to-sky-500',
      '疲惫': 'from-gray-500 to-slate-500',
      '充实': 'from-green-500 to-emerald-500',
    };
    return gradients[emotionName] || 'from-sky-500 to-blue-500';
  };

  return (
    <GlassCard className={clsx(
      "flex flex-col items-center gap-6 py-8 relative overflow-hidden backdrop-blur-md border",
      isDark ? "!bg-[#05080f]/80 border-[#8adefa]/20 shadow-[0_0_20px_rgba(138,222,250,0.1)]" : "!bg-white"
    )}>
      {/* 背景光晕 - 在宇宙深邃背景下的色彩投射 */}
      <div className={clsx(
        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 blur-[60px] rounded-full opacity-40 mix-blend-screen",
        `bg-gradient-to-br ${getEmotionGradient(emotion)}`
      )} />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', bounce: 0.4 }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* 情绪 Emoji */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className={clsx(
            "w-24 h-24 rounded-full border shadow-lg flex items-center justify-center text-5xl backdrop-blur-sm",
            isDark
              ? "bg-[#0b162c]/60 border-[#8adefa]/30 shadow-[0_0_15px_rgba(138,222,250,0.2)]"
              : "bg-gray-100 border-gray-200"
          )}
        >
          {getEmotionEmoji(emotion)}
        </motion.div>

        {/* 情绪文字 */}
        <div className="text-center">
          <p className={clsx(
            "text-2xl font-serif font-bold mb-3 tracking-[0.2em] relative",
            isDark ? "text-[#d0eaf8] drop-shadow-[0_0_8px_rgba(138,222,250,0.5)]" : "text-gray-900"
          )}>
            {emotion}
            {/* 左右装饰星点 */}
            {isDark && (
              <>
                <span className="absolute -left-6 top-1/2 -translate-y-1/2 text-[#8adefa]/50 text-xs">✦</span>
                <span className="absolute -right-6 top-1/2 -translate-y-1/2 text-[#8adefa]/50 text-xs">✦</span>
              </>
            )}
          </p>
          <p className={clsx(
            "text-xs font-serif tracking-[0.3em] font-medium uppercase",
            isDark ? "text-[#4c849e]" : "text-gray-500"
          )}>
            灵光刻度 {Math.round(intensity * 100)}%
          </p>
        </div>

        {/* 进度条 */}
        <div className={clsx(
          "w-64 h-1.5 rounded-full overflow-hidden border",
          isDark
            ? "bg-[#02050f] border-[#8adefa]/20 shadow-[inset_0_0_5px_rgba(0,0,0,0.8)]"
            : "bg-gray-200 border-gray-300"
        )}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${intensity * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={clsx(
              "h-full relative overflow-hidden",
              `bg-gradient-to-r ${getEmotionGradient(emotion)}`
            )}
          >
             {/* 进度条上的高光扫过效果 */}
             {isDark && (
                <motion.div 
                  animate={{ x: ['-100%', '200%'] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent mix-blend-overlay"
                />
             )}
          </motion.div>
        </div>
      </motion.div>
    </GlassCard>
  );
}
