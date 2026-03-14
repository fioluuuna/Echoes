import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EMOTIONS } from '../../types';
import clsx from 'clsx';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EmotionPickerProps {
  selected: string | null;
  onSelect: (emotion: string) => void;
}

// Map emotion names to specific gradient classes or styles
const getEmotionStyle = (_emotionName: string, isSelected: boolean) => {
  if (!isSelected) return {};

  return { background: 'rgba(138,222,250,0.1)', color: '#d0eaf8', borderColor: 'rgba(138,222,250,0.5)', textShadow: '0 0 5px rgba(138,222,250,0.5)', boxShadow: '0 0 15px rgba(138,222,250,0.2)' }; // Cosmic glow active
};

export function EmotionPicker({ selected, onSelect }: EmotionPickerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium tracking-widest text-[10px] text-[#4c849e]">
          心灵共鸣
        </span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs flex items-center gap-1 transition-colors text-[#4c849e] hover:text-[#8adefa]"
        >
          {isExpanded ? '收起' : '更多情绪'}
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Main Emotions */}
        {EMOTIONS.slice(0, 6).map((emotion) => {
          const style = getEmotionStyle(emotion.name, selected === emotion.name);
          return (
            <motion.button
              key={emotion.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(emotion.name)}
              style={style}
              className={clsx(
                "flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm border transition-all duration-300 backdrop-blur-md",
                selected === emotion.name
                  ? "border-[#8adefa] shadow-[0_0_15px_rgba(138,222,250,0.2)] font-bold bg-[#8adefa]/10 text-[#d0eaf8]"
                  : "bg-[#030613]/80 border-[#8adefa]/20 text-[#4c849e] hover:bg-[#081222] hover:text-[#7bb0c9] hover:border-[#8adefa]/40"
              )}
            >
              <span className="text-base filter drop-shadow-md">{emotion.emoji}</span>
              {emotion.name}
            </motion.button>
          )
        })}

        {/* More Emotions */}
        <AnimatePresence>
          {isExpanded && (
            <>
              {EMOTIONS.slice(6).map((emotion, index) => {
                const style = getEmotionStyle(emotion.name, selected === emotion.name);
                return (
                  <motion.button
                    key={emotion.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelect(emotion.name)}
                    style={style}
                    className={clsx(
                      "flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm border transition-all duration-300 backdrop-blur-md",
                      selected === emotion.name
                        ? "border-[#8adefa] shadow-[0_0_15px_rgba(138,222,250,0.2)] font-bold bg-[#8adefa]/10 text-[#d0eaf8]"
                        : "bg-[#030613]/80 border-[#8adefa]/20 text-[#4c849e] hover:bg-[#081222] hover:text-[#7bb0c9] hover:border-[#8adefa]/40"
                    )}
                  >
                    <span className="text-base filter drop-shadow-md">{emotion.emoji}</span>
                    {emotion.name}
                  </motion.button>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
