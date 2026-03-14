import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Feather, Star } from 'lucide-react';
import { useThemeStore } from '../../stores/themeStore';
import clsx from 'clsx';

interface Author {
  id: number;
  name: string;
  avatar?: string | null;
  plantType?: string;
  era?: string;
  nationality?: string;
  styleTags?: string[];
  bio?: string;
}

interface Work {
  id: number;
  title: string;
}

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  author: Author | null;
  work: Work | null;
  passageContent: string;
}

/**
 * 诗人详情弹窗组件
 * 展示诗人信息、作品和名句
 */
export function AuthorModal({ isOpen, onClose, author, work, passageContent }: AuthorModalProps) {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!author) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              'w-full max-w-md rounded-2xl p-6 shadow-2xl border overflow-hidden relative',
              isDark
                ? 'bg-[#0a0d14]/95 border-[#8adefa]/30'
                : 'bg-white/95 border-gray-200'
            )}
          >
            {/* 背景装饰 */}
            <div className="absolute inset-0 pointer-events-none">
              <div className={clsx(
                "absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl",
                isDark ? "bg-sky-500/10" : "bg-sky-200/30"
              )} />
              <div className={clsx(
                "absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl",
                isDark ? "bg-blue-500/10" : "bg-blue-200/30"
              )} />
            </div>

            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className={clsx(
                'absolute top-4 right-4 p-2 rounded-lg transition-colors z-10',
                isDark
                  ? 'hover:bg-white/10 text-slate-400'
                  : 'hover:bg-gray-100 text-gray-500'
              )}
            >
              <X className="w-5 h-5" />
            </button>

            {/* 诗人头像和基本信息 */}
            <div className="flex items-start gap-4 mb-6 relative z-10">
              <div className={clsx(
                "w-20 h-20 rounded-full flex items-center justify-center text-3xl font-serif shadow-lg border-2",
                isDark
                  ? "bg-gradient-to-br from-sky-600 to-blue-700 border-sky-400/50 text-white"
                  : "bg-gradient-to-br from-sky-500 to-blue-600 border-sky-300 text-white"
              )}>
                {author.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className={clsx(
                  "text-2xl font-bold mb-1",
                  isDark ? "text-white" : "text-gray-900"
                )}>
                  {author.name}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  {author.era && (
                    <span className={clsx(
                      "text-xs px-2 py-0.5 rounded-full",
                      isDark ? "bg-white/10 text-slate-300" : "bg-gray-100 text-gray-600"
                    )}>
                      {author.era}
                    </span>
                  )}
                  {author.nationality && (
                    <span className={clsx(
                      "text-xs px-2 py-0.5 rounded-full",
                      isDark ? "bg-white/10 text-slate-300" : "bg-gray-100 text-gray-600"
                    )}>
                      {author.nationality}
                    </span>
                  )}
                  {author.plantType && (
                    <span className={clsx(
                      "text-xs px-2 py-0.5 rounded-full flex items-center gap-1",
                      isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-700"
                    )}>
                      <Feather className="w-3 h-3" />
                      {author.plantType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 风格标签 */}
            {author.styleTags && author.styleTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                {author.styleTags.map((tag) => (
                  <span
                    key={tag}
                    className={clsx(
                      "text-xs px-3 py-1 rounded-full border",
                      isDark
                        ? "bg-sky-500/10 border-sky-500/30 text-sky-300"
                        : "bg-sky-50 border-sky-200 text-sky-600"
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* 简介 */}
            {author.bio && (
              <p className={clsx(
                "text-sm leading-relaxed mb-6 relative z-10",
                isDark ? "text-slate-300" : "text-gray-600"
              )}>
                {author.bio}
              </p>
            )}

            {/* 作品和名句 */}
            <div className={clsx(
              "rounded-xl p-4 relative z-10",
              isDark ? "bg-white/5 border border-white/10" : "bg-gray-50 border border-gray-200"
            )}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className={clsx(
                  "w-4 h-4",
                  isDark ? "text-[#8adefa]" : "text-sky-500"
                )} />
                <span className={clsx(
                  "text-sm font-medium",
                  isDark ? "text-[#8adefa]" : "text-sky-600"
                )}>
                  {work?.title ? `《${work.title}》` : '名句'}
                </span>
              </div>
              <blockquote className={clsx(
                "text-base font-serif italic leading-relaxed pl-4 border-l-2",
                isDark
                  ? "text-slate-200 border-[#8adefa]/50"
                  : "text-gray-700 border-sky-300"
              )}>
                "{passageContent}"
              </blockquote>
            </div>

            {/* 底部装饰 */}
            <div className="flex items-center justify-center gap-2 mt-6 relative z-10">
              <Star className={clsx(
                "w-4 h-4",
                isDark ? "text-[#8adefa]/50" : "text-sky-300"
              )} />
              <span className={clsx(
                "text-xs tracking-widest",
                isDark ? "text-slate-500" : "text-gray-400"
              )}>
                文学共鸣
              </span>
              <Star className={clsx(
                "w-4 h-4",
                isDark ? "text-[#8adefa]/50" : "text-sky-300"
              )} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
