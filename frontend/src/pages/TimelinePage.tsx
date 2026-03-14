import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { statsApi } from '../services/api';
import { Loading } from '../components/common/Loading';
import { GlassCard } from '../components/ui/GlassCard';
import { useThemeStore } from '../stores/themeStore';
import { EMOTIONS } from '../types';
import type { EmotionCurveData, TimelineItem } from '../types';
import { Calendar, Activity, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

// 获取情绪对应的 emoji
const getEmotionEmoji = (emotionName: string) => {
  const found = EMOTIONS.find(e => e.name === emotionName);
  return found?.emoji || '💭';
};

export function TimelinePage() {
  const [curveData, setCurveData] = useState<EmotionCurveData[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useThemeStore();

  const isDark = theme === 'dark';

  useEffect(() => {
    Promise.all([
      statsApi.getEmotionCurve(30),
      statsApi.getTimeline(1, 50),
    ])
      .then(([curveRes, timelineRes]) => {
        if (curveRes.code === 200 && curveRes.data) {
          setCurveData(curveRes.data);
        }
        if (timelineRes.code === 200 && timelineRes.data) {
          setTimeline(timelineRes.data.timeline);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ECharts Theme-aware Configuration
  const chartOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark ? 'rgba(30, 27, 46, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      textStyle: { color: isDark ? '#f8fafc' : '#171717' },
      className: 'backdrop-blur-md',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
      borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
    },
    xAxis: {
      type: 'category',
      data: curveData.map((d) => d.date.slice(5)),
      axisLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' } },
      axisLabel: { color: isDark ? '#94a3b8' : '#737373', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      axisLine: { show: false },
      axisLabel: { color: isDark ? '#94a3b8' : '#737373', fontSize: 11 },
      splitLine: { lineStyle: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' } },
    },
    series: [
      {
        name: '强度',
        type: 'line',
        smooth: true,
        data: curveData.map((d) => d.intensity),
        lineStyle: { color: '#38bdf8', width: 3, shadowColor: 'rgba(56, 189, 248, 0.3)', shadowBlur: 10 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(56, 189, 248, 0.2)' },
              { offset: 1, color: 'rgba(56, 189, 248, 0)' },
            ],
          },
        },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: isDark ? '#0f1b2d' : '#ffffff', borderColor: '#38bdf8', borderWidth: 2 },
      },
    ],
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-[#d0eaf8] mb-2">情绪曲线</h1>
          <p className="text-[#7bb0c9]">根据你的情绪高低变化。</p>
        </div>
        <div className="hidden md:block">
          <div className={clsx(
            "p-3 rounded-full border",
            isDark
              ? "bg-sky-900/20 border-sky-500/20"
              : "bg-sky-100 border-sky-200"
          )}>
            <Calendar className="w-6 h-6 text-[#8adefa]" />
          </div>
        </div>
      </motion.div>

      {/* Chart Section */}
      {curveData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-[#8adefa]" />
              <h2 className="text-lg font-medium text-[#d0eaf8]">30天情绪曲线</h2>
            </div>
            <ReactECharts option={chartOption} style={{ height: 300 }} />
          </GlassCard>
        </motion.div>
      )}

      {/* Timeline List */}
      <div className="space-y-6 relative">
        {/* Vertical Line */}
        <div className={clsx(
          "absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-transparent to-transparent",
          isDark ? "via-white/20" : "via-black/10"
        )} />

        {timeline.length > 0 ? (
          timeline.map((item, index) => {
            const emotionEmoji = getEmotionEmoji(item.emotion);
            const date = new Date(item.date);
            const dateStr = date.toLocaleDateString('zh-CN', {
              month: 'short',
              day: 'numeric',
            });

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-20 group"
              >
                {/* Dot */}
                <div className={clsx(
                  "absolute left-[29px] top-6 w-3 h-3 rounded-full border-2 z-10 group-hover:scale-125 transition-transform",
                  isDark
                    ? "bg-[#0f1b2d] border-sky-500"
                    : "bg-white border-sky-500"
                )} />

                {/* Time Label */}
                <div className="absolute left-0 top-5 text-xs text-[#7bb0c9] font-medium w-6 text-center">
                  {dateStr.split(' ')[0]} <br /> {dateStr.split(' ')[1]}
                </div>

                <Link to={`/result/${item.id}`} className="block">
                  <GlassCard
                    variant="interactive"
                    className={clsx(
                      "p-4 transition-all duration-300",
                      isDark
                        ? "group-hover:border-sky-500/30"
                        : "group-hover:border-sky-300"
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={clsx(
                          "text-2xl p-2 rounded-lg",
                          isDark ? "bg-white/5" : "bg-black/5"
                        )}>
                          {emotionEmoji}
                        </div>
                        <div>
                          <p className="font-medium text-[#d0eaf8]">{item.emotion}</p>
                          <p className="text-xs text-[#7bb0c9]">
                            {date.toLocaleDateString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={clsx(
                        "w-5 h-5 group-hover:translate-x-1 transition-all",
                        isDark
                          ? "text-slate-600 group-hover:text-sky-400"
                          : "text-gray-300 group-hover:text-sky-500"
                      )} />
                    </div>

                    <p className="text-[#a0c4d4] text-sm line-clamp-2 leading-relaxed">
                      {item.preview}
                    </p>

                    {item.keywords.length > 0 && (
                      <div className={clsx(
                        "flex flex-wrap gap-2 mt-4 pt-3 border-t",
                        isDark ? "border-white/5" : "border-black/5"
                      )}>
                        {item.keywords.slice(0, 3).map((keyword) => (
                          <span key={keyword} className="text-xs text-[#7bb0c9]">
                            #{keyword}
                          </span>
                        ))}
                      </div>
                    )}
                  </GlassCard>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-20 pl-20">
            <p className="text-[#7bb0c9]">时间似乎在这里静止了。</p>
          </div>
        )}
      </div>
    </div>
  );
}
