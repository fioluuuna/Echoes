import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Lightbulb, Hash, Palette } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

interface InsightCardProps {
  insight: string;
  keywords: string[];
  imagery: string[];
}

export function InsightCard({ insight, keywords, imagery }: InsightCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <GlassCard className={clsx(
      "!bg-gradient-to-br backdrop-blur-md border",
      isDark
        ? "!from-[#05080f]/80 !to-[#0b162c]/80 border-[#8adefa]/20 shadow-[0_0_20px_rgba(138,222,250,0.1)]"
        : "!from-blue-50 !to-sky-50 border-blue-200"
    )}>
      <div className={clsx(
        "flex items-center gap-3 mb-6 border-b pb-4",
        isDark ? "text-[#8adefa] border-[#8adefa]/10" : "text-blue-600 border-blue-100"
      )}>
        <Lightbulb className="w-6 h-6 drop-shadow-[0_0_5px_#8adefa]" />
        <h3 className={clsx(
          "text-lg font-serif tracking-[0.2em] font-bold",
          isDark ? "text-[#d0eaf8] drop-shadow-[0_0_5px_rgba(138,222,250,0.5)]" : "text-blue-700"
        )}>
          灵迹洞察
        </h3>
      </div>

      <p className={clsx(
        "leading-[2rem] mb-8 text-lg font-serif tracking-wide",
        isDark ? "text-[#e6f4fa]" : "text-gray-700"
      )}>
        {insight}
      </p>

      <div className="space-y-6">
        {keywords.length > 0 && (
          <div>
            <div className={clsx(
              "flex items-center gap-2 text-xs font-serif tracking-[0.2em] mb-3",
              isDark ? "text-[#4c849e]" : "text-gray-500"
            )}>
              <Hash className="w-3 h-3" /> 星点
            </div>
            <div className="flex flex-wrap gap-3">
              {keywords.map((keyword, index) => (
                <motion.span
                  key={keyword}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className={clsx(
                    "px-4 py-1.5 text-sm font-serif tracking-widest rounded border backdrop-blur-sm",
                    isDark
                      ? "bg-[#0b162c]/60 border-[#8adefa]/30 text-[#8adefa] shadow-[0_0_10px_rgba(138,222,250,0.1)] hover:bg-[#152a4a]/80 transition-colors"
                      : "bg-blue-100 border-blue-300 text-blue-700"
                  )}
                >
                  {keyword}
                </motion.span>
              ))}
            </div>
          </div>
        )}

        {imagery.length > 0 && (
          <div>
            <div className={clsx(
              "flex items-center gap-2 text-xs font-serif tracking-[0.2em] mb-3",
              isDark ? "text-[#4c849e]" : "text-gray-500"
            )}>
              <Palette className="w-3 h-3" /> 幻象
            </div>
            <div className="flex flex-wrap gap-3">
              {imagery.map((img, index) => (
                <motion.span
                  key={img}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className={clsx(
                    "px-3 py-1 text-sm font-serif tracking-widest rounded border transition-colors",
                    isDark
                      ? "bg-[#02050f]/60 border-[#7bb0c9]/30 text-[#7bb0c9] hover:text-[#8adefa] hover:border-[#8adefa]/50"
                      : "bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100"
                  )}
                >
                  {img}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
