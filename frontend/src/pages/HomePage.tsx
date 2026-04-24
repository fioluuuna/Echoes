import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookLoadingAnimation } from '../components/common/BookLoadingAnimation';
import { entryApi } from '../services/api';
import { useEntryStore } from '../stores/entryStore';
import { Image as ImageIcon, X } from 'lucide-react';

// 压缩图片
function compressImage(file: File, maxWidth = 800, quality = 0.6): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

interface Sticker {
  id: string;
  url: string;
  x: number;
  y: number;
  rotation: number;
}

export function HomePage() {
  const navigate = useNavigate();
  const { setCurrentResult, isLoading, setLoading, draftEmotion, draftContent, setDraftContent } = useEntryStore();

  const [content, setContent] = useState('');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (draftContent) {
      setContent(draftContent);
      setDraftContent(null);
    }
  }, [draftContent, setDraftContent]);

  const handleSubmit = async () => {
    if (content.length < 1) return;
    console.log('[HomePage] 开始提交日记...');

    setLoading(true);
    try {
      const images = stickers.map(s => s.url);

      const response = await entryApi.create({
        content,
        images: images.length > 0 ? images : undefined,
        emotionPrimary: draftEmotion || undefined,
      });

      if (response.code === 200 && response.data) {
        const resultWithImages = {
          ...response.data,
          entry: {
            ...response.data.entry,
            images: response.data.entry.imageUrl ? [response.data.entry.imageUrl] : [],
          },
        };
        setCurrentResult(resultWithImages);
        navigate(`/result/${resultWithImages.entry.id}`);
      }
    } catch (error: any) {
      console.error('Failed to create entry:', error);
      const errorMessage = error?.message || error?.error || '创建日记失败，请重试';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressImage(file).then(url => {
        const newSticker: Sticker = {
          id: Math.random().toString(36).substr(2, 9),
          url,
          x: Math.random() * 200 + 50,
          y: Math.random() * 200 + 100,
          rotation: Math.random() * 20 - 10,
        };
        setStickers(prev => [...prev, newSticker]);
      });
    }
  };

  const removeSticker = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStickers(prev => prev.filter(s => s.id !== id));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        compressImage(file).then(url => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left - 75;
          const y = e.clientY - rect.top - 75;

          const newSticker: Sticker = {
            id: Math.random().toString(36).substr(2, 9),
            url,
            x: Math.max(0, x),
            y: Math.max(0, y),
            rotation: Math.random() * 20 - 10,
          };
          setStickers(prev => [...prev, newSticker]);
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {isLoading && <BookLoadingAnimation />}

      <div className="h-full flex flex-col relative" style={{ transformStyle: 'preserve-3d' }}>
        
        <div className="relative z-10 p-2 md:p-4 flex-1 flex flex-col justify-between"
             onDrop={handleDrop}
             onDragOver={handleDragOver}>

            <motion.div 
               className="flex-1 relative z-20 group"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
               style={{ transform: "translateZ(15px)" }}
            >
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="在此刻下你的星海回音..."
                className="w-full h-full bg-transparent border-none outline-none resize-none text-xl leading-[3rem] font-serif scrollbar-none text-[#d0eaf8] transition-colors placeholder-[#4c849e]/60 focus:placeholder-[#4c849e] opacity-90"
                style={{ 
                   lineHeight: '3rem',
                   letterSpacing: '0.05em',
                   background: 'linear-gradient(transparent, transparent 47px, rgba(138,222,250,0.1) 48px)',
                   backgroundSize: '100% 48px',
                }}
                spellCheck={false}
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ transform: "translateZ(30px)" }}
              className="flex items-center justify-between mt-8 pt-4 border-t border-[#8adefa]/20"
            >
              <div className="flex items-center gap-6">
                <div className="text-sm font-serif flex gap-4 items-center opacity-80 tracking-widest text-[#7bb0c9]">
                  <span>共聚 {content.length} 灵迹</span>
                  <div className="ml-4 flex items-center">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 hover:opacity-100 transition-colors hover:text-[#8adefa]"
                    >
                      <ImageIcon className="w-4 h-4" />
                      <span>幻化星图</span>
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={content.length < 1 || isLoading}
                className="px-8 py-3 bg-[#0b162c] disabled:bg-[#030613] hover:bg-[#152a4a] text-[#8adefa] disabled:text-[#4c849e]/50 transition-all font-serif tracking-widest shadow-[0_0_15px_rgba(138,222,250,0.1)] hover:shadow-[0_0_20px_rgba(138,222,250,0.4)] border border-[#8adefa]/30 flex items-center justify-center min-w-[140px] rounded"
              >
                {isLoading ? '化星中...' : '归于星海'}
              </button>
            </motion.div>
          </div>

          {stickers.map((sticker) => (
            <motion.div
              key={sticker.id}
              className="absolute max-w-[150px] shadow-[var(--shadow-lg)] border border-[var(--border-primary)] rounded-lg overflow-hidden group bg-[var(--bg-card)] backdrop-blur-sm z-40"
              style={{
                left: sticker.x,
                top: sticker.y,
                rotate: sticker.rotation,
                cursor: 'grab',
                translateZ: 20
              }}
              drag
              dragMomentum={false}
              whileDrag={{ scale: 1.1, cursor: 'grabbing', zIndex: 100 }}
            >
              <img src={sticker.url} alt="Sticker" className="w-full h-auto pointer-events-none mix-blend-multiply opacity-80" />
              <button
                onClick={(e) => removeSticker(sticker.id, e)}
                className="absolute top-1 right-1 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-primary)] text-[var(--text-primary)]"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
      </div>
    </>
  );
}