import { motion } from 'framer-motion';
import { GlassCard } from '../ui/GlassCard';
import { Heart, Sparkles } from 'lucide-react';
import type { GardenUpdate } from '../../types';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

interface GardenUpdateCardProps {
  updates: GardenUpdate[];
}

/**
 * 花园更新卡片 - 显示共鸣度提升信息
 * 文案更新为"你和 [XX人物] 的共鸣度 +1"
 */
export function GardenUpdateCard({ updates }: GardenUpdateCardProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!updates.length) return null;

  return (
    <GlassCard className={clsx(
      "backdrop-blur-md border",
      isDark
        ? "!bg-[#05080f]/80 border-[#8adefa]/20 shadow-[0_0_20px_rgba(138,222,250,0.1)]"
        : "!bg-white border-gray-200"
    )}>
      <div className={clsx(
        "flex items-center gap-3 mb-6 border-b pb-4",
        isDark ? "text-[#8adefa] border-[#8adefa]/10" : "text-sky-600 border-sky-100"
      )}>
        <Heart className="w-6 h-6 drop-shadow-[0_0_5px_#8adefa]" />
        <h3 className={clsx(
          "text-lg font-serif tracking-[0.2em] font-bold",
          isDark ? "text-[#d0eaf8] drop-shadow-[0_0_5px_rgba(138,222,250,0.5)]" : "text-sky-700"
        )}>
          星轨交汇
        </h3>
      </div>

      <div className="space-y-4">
        {updates.map((update, index) => (
          <motion.div
            key={update.authorId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={clsx(
              "flex items-center gap-4 p-4 rounded-xl border transition-colors backdrop-blur-sm",
              isDark
                ? "bg-[#0b162c]/40 border-[#8adefa]/20 hover:border-[#8adefa]/50 hover:bg-[#152a4a]/60 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                : "bg-white border-gray-200 hover:border-sky-300"
            )}
          >
            {/* 人物头像 */}
            <div className={clsx(
              "w-12 h-12 rounded-full flex items-center justify-center overflow-hidden border-2 shadow-[0_0_10px_rgba(138,222,250,0.3)]",
              isDark
                ? "border-[#8adefa]/40"
                : "border-sky-200"
            )}>
              <img
                src={`/authors/${update.authorName.toLowerCase().replace(/\s+/g, '_')}.png`}
                alt={update.authorName}
                className="w-full h-full object-cover mix-blend-lighten"
                onError={(e) => {
                  // 图片加载失败时显示占位符
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(update.authorName)}&background=0b162c&color=8adefa`;
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              {/* 共鸣度提升文案 */}
              <div className={clsx(
                "font-serif tracking-widest",
                isDark ? "text-[#e6f4fa]" : "text-gray-900"
              )}>
                {update.isNewPlant ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#8adefa]" />
                    <span>
                      结识新灵体：<span className="text-[#8adefa] font-bold drop-shadow-[0_0_3px_rgba(138,222,250,0.5)]">{update.authorName}</span>
                    </span>
                  </span>
                ) : (
                  <span>
                    与 <span className="text-[#8adefa] font-bold drop-shadow-[0_0_3px_rgba(138,222,250,0.5)]">{update.authorName}</span> 的频率共振
                    <span className={clsx(
                      "ml-3 px-2 py-0.5 rounded border text-sm font-bold shadow-[0_0_5px_rgba(138,222,250,0.2)]",
                      isDark
                        ? "bg-[#02050f]/60 border-[#8adefa]/40 text-[#8adefa]"
                        : "bg-sky-100 border-sky-200 text-sky-600"
                    )}>
                      +1
                    </span>
                  </span>
                )}
              </div>

              {/* 等级信息 */}
              <p className={clsx(
                "text-sm font-serif tracking-widest mt-2",
                isDark ? "text-[#4c849e]" : "text-gray-500"
              )}>
                {update.isNewPlant
                  ? "开启星海巡游"
                  : `灵魂刻度 Lv.${update.currentStage}`
                }
              </p>
            </div>

            {/* 共鸣动画效果 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center border",
                isDark
                  ? "bg-[#0b162c] border-[#8adefa]/30 shadow-[0_0_10px_rgba(138,222,250,0.2)]"
                  : "bg-sky-100 border-sky-200"
              )}
            >
              <Heart className={clsx(
                "w-5 h-5 drop-shadow-[0_0_3px_#8adefa]",
                isDark ? "text-[#8adefa]" : "text-sky-500"
              )} />
            </motion.div>
          </motion.div>
        ))}
      </div>
    </GlassCard>
  );
}
