import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gardenApi } from '../services/api';
import { Loading } from '../components/common/Loading';
import { useThemeStore } from '../stores/themeStore';
import type { GardenPlant } from '../types';
import { HelpCircle, Star } from 'lucide-react';
import clsx from 'clsx';

// 所有可收集的文学同伴
const ALL_COMPANIONS = [
  { name: '李白', tag: '浪漫', image: '/authors/li_bai.png' },
  { name: '苏轼', tag: '豁达', image: '/authors/su_shi.png' },
  { name: '李清照', tag: '婉约', image: '/authors/li_qingzhao.png' },
  { name: '鲁迅', tag: '深刻', image: '/authors/lu_xun.png' },
  { name: '林徽因', tag: '灵动', image: '/authors/lin_huiyin.png' },
  { name: '莎士比亚', tag: '戏剧', image: '/authors/shakespeare.png' },
  { name: '泰戈尔', tag: '灵性', image: '/authors/tagore.png' },
  { name: '海明威', tag: '硬朗', image: '/authors/hemingway.png' },
  { name: '川端康成', tag: '细腻', image: '/authors/kawabata.png' },
  { name: '加缪', tag: '荒诞', image: '/authors/camus.png' },
  { name: '待解锁', tag: '', image: '' },
  { name: '待解锁', tag: '', image: '' },
];

// 等级阈值配置
const LEVEL_THRESHOLDS = [1, 3, 6, 10, 15]; // 达到对应共鸣次数升级

/**
 * 根据共鸣次数计算等级
 */
function calculateLevel(matchCount: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (matchCount >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
}

/**
 * 计算当前等级进度百分比
 */
function calculateProgress(matchCount: number): number {
  const level = calculateLevel(matchCount);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 5;

  if (level >= LEVEL_THRESHOLDS.length) {
    return 100; // 满级
  }

  const progress = ((matchCount - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export function GardenPage() {
  const [plants, setPlants] = useState<GardenPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    gardenApi.getPlants()
      .then((res) => {
        if (res.code === 200 && res.data) {
          setPlants(res.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  // 构建已解锁同伴的 Map，方便查找
  const plantsMap = new Map(plants.map(p => [p.authorName, p]));
  const unlockedCount = plants.length;

  return (
    <div className="max-w-lg mx-auto min-h-screen flex flex-col pb-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 px-2"
      >
        <h1 className="text-3xl font-serif text-[#d0eaf8] mb-2 tracking-tight">
          文学同伴
        </h1>
        <p className="text-[#7bb0c9] text-sm">
          已解锁 <span className="text-[#8adefa] font-bold">{unlockedCount}</span>/{ALL_COMPANIONS.length} 位同伴
        </p>
      </motion.div>

      {/* Companions Grid - 徽章收集系统 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 px-2 flex-1"
      >
        {ALL_COMPANIONS.map((companion, index) => {
          const plantData = plantsMap.get(companion.name);
          const isLocked = companion.name === '待解锁' || !plantData;

          if (isLocked) {
            return <LockedCard key={`slot-${index}`} delay={index * 0.03} isDark={isDark} />;
          }

          return (
            <CompanionBadge
              key={companion.name}
              name={companion.name}
              tag={companion.tag}
              image={companion.image}
              matchCount={plantData.matchCount}
              delay={index * 0.03}
              isDark={isDark}
            />
          );
        })}
      </motion.div>
    </div>
  );
}

// --- 子组件 ---

interface CompanionBadgeProps {
  name: string;
  tag: string;
  image: string;
  matchCount: number;
  delay: number;
  isDark: boolean;
}

/**
 * 人物徽章卡片 - 带等级和进度条
 */
function CompanionBadge({ name, tag, image, matchCount, delay, isDark }: CompanionBadgeProps) {
  const level = calculateLevel(matchCount);
  const progress = calculateProgress(matchCount);
  const isMaxLevel = level >= LEVEL_THRESHOLDS.length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={clsx(
        "backdrop-blur-sm border rounded-2xl p-5 flex flex-col items-center text-center transition-all cursor-pointer group relative overflow-hidden",
        isDark
          ? "bg-white/5 border-white/10 hover:bg-white/10 hover:border-sky-500/30"
          : "bg-black/5 border-black/10 hover:bg-black/10 hover:border-sky-300"
      )}
    >
      {/* 等级标签 */}
      <div className={clsx(
        "absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1",
        isMaxLevel
          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
          : isDark
            ? "bg-sky-500/20 text-sky-300"
            : "bg-sky-100 text-sky-600"
      )}>
        <Star className="w-3 h-3" />
        Lv.{level}
      </div>

      {/* 人物头像徽章 */}
      <div className={clsx(
        "w-20 h-20 rounded-full mb-3 overflow-hidden shadow-lg ring-2 transition-all relative",
        isDark
          ? "ring-white/10 group-hover:ring-sky-500/50"
          : "ring-black/10 group-hover:ring-sky-500/50"
      )}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // 图片加载失败时显示占位符
            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`;
          }}
        />
        {/* 徽章光效 */}
        {isMaxLevel && (
          <div className="absolute inset-0 bg-gradient-to-t from-amber-500/30 to-transparent animate-pulse" />
        )}
      </div>

      {/* 名字和标签 */}
      <h3 className="text-[#d0eaf8] font-bold text-lg mb-0.5">{name}</h3>
      <p className="text-[#7bb0c9] text-xs mb-3">{tag}</p>

      {/* 共鸣度进度条 */}
      <div className="w-full">
        <div className={clsx(
          "w-full h-1.5 rounded-full overflow-hidden",
          isDark ? "bg-white/10" : "bg-black/10"
        )}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: delay + 0.2 }}
            className={clsx(
              "h-full rounded-full",
              isMaxLevel
                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                : "bg-gradient-to-r from-sky-500 to-blue-500"
            )}
          />
        </div>
        <p className={clsx(
          "text-xs mt-1.5",
          isDark ? "text-slate-500" : "text-gray-400"
        )}>
          共鸣 {matchCount} 次
        </p>
      </div>
    </motion.div>
  );
}

/**
 * 未解锁的占位卡片
 */
function LockedCard({ delay, isDark }: { delay: number; isDark: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      className={clsx(
        "backdrop-blur-sm border border-dashed rounded-2xl p-5 flex flex-col items-center text-center opacity-50",
        isDark
          ? "bg-white/[0.02] border-white/5"
          : "bg-black/[0.02] border-black/10"
      )}
    >
      {/* 锁定头像 */}
      <div className={clsx(
        "w-20 h-20 rounded-full mb-3 flex items-center justify-center border border-dashed",
        isDark
          ? "bg-slate-800/50 border-slate-600"
          : "bg-gray-200/50 border-gray-400"
      )}>
        <HelpCircle className={clsx(
          "w-8 h-8",
          isDark ? "text-slate-600" : "text-gray-400"
        )} />
      </div>

      <p className="text-[#7bb0c9] text-sm">待解锁</p>
      <p className={clsx(
        "text-xs mt-1",
        isDark ? "text-slate-600" : "text-gray-400"
      )}>
        继续写日记解锁
      </p>
    </motion.div>
  );
}
