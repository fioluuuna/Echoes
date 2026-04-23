import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// 情感分析结果接口
export interface EmotionAnalysisResult {
  emotions: { name: string; score: number }[];
  primaryEmotion: string;
  emotionIntensity: number;
  keywords: string[];
  imagery: string[];
  scenes: string[];
  themes: string[];
  weatherType: string;
  psychologicalInsight: string;
  imageAnalysis?: string; // 图片分析结果
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://dashscope.aliyuncs.com/api/v1';

  // 豆包API配置
  private readonly doubaoApiKey: string;
  private readonly doubaoModel: string;
  private readonly doubaoBaseUrl = 'https://ark.cn-beijing.volces.com/api/v3';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('DASHSCOPE_API_KEY', '');
    this.doubaoApiKey = this.configService.get('DOUBAO_API_KEY', '');
    this.doubaoModel = this.configService.get('DOUBAO_MODEL', 'doubao-seed-2-0-pro-260215');
  }

  // 情感分析（支持图片）
  async analyzeEmotion(content: string, images?: string[]): Promise<EmotionAnalysisResult> {
    // 如果有图片，先分析图片内容
    let imageDescription = '';
    if (images && images.length > 0) {
      this.logger.log(`开始分析 ${images.length} 张图片...`);
      imageDescription = await this.analyzeImages(images);
      this.logger.log(`图片分析结果: ${imageDescription}`);
    }

    const prompt = `你是一个专业的文本情感分析专家。请分析以下日记内容，返回JSON格式的分析结果。

日记内容：
"""
${content}
"""
${imageDescription ? `\n用户上传的图片内容描述：\n"""\n${imageDescription}\n"""` : ''}

请结合文字和图片内容（如有），返回以下JSON格式（不要包含任何其他文字，只返回JSON）：
{
  "emotions": [
    {"name": "情绪名称", "score": 0.0到1.0的强度}
  ],
  "primaryEmotion": "主要情绪",
  "emotionIntensity": 0.0到1.0,
  "keywords": ["关键词1", "关键词2"],
  "imagery": ["意象1", "意象2"],
  "scenes": ["场景1", "场景2"],
  "themes": ["主题1", "主题2"],
  "weatherType": "晴天/雨天/多云/雷暴/雾天/彩虹",
  "psychologicalInsight": "一段温暖的心理学洞察，100字以内"${imageDescription ? ',\n  "imageAnalysis": "对图片内容的简短分析，50字以内"' : ''}
}

情绪类型包括：快乐、悲伤、愤怒、恐惧、惊讶、平静、孤独、感动、困惑、期待、疲惫、充实、矛盾、释然
意象示例：月亮、雨、窗、路、海、山、花、树、风、云
场景示例：校园、咖啡馆、深夜、清晨、车站、家中、办公室`;

    try {
      const response = await this.callQwen(prompt);
      // 解析JSON响应
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析AI响应');
    } catch (error) {
      this.logger.error('情感分析失败', error);
      // 返回默认值
      return this.getDefaultAnalysis();
    }
  }

  // 分析图片内容（使用通义千问VL多模态模型）
  private async analyzeImages(images: string[]): Promise<string> {
    try {
      // 只分析前3张图片，避免请求过大
      const imagesToAnalyze = images.slice(0, 3);

      // 构建多模态消息内容
      const content: any[] = [
        {
          type: 'text',
          text: '请描述这些图片的内容、情感氛围和可能表达的心情。用简洁的中文描述，每张图片50字以内。',
        },
      ];

      // 添加图片
      for (const imageUrl of imagesToAnalyze) {
        // 检查是否是 base64 格式
        if (imageUrl.startsWith('data:image')) {
          content.push({
            type: 'image',
            image: imageUrl,
          });
        }
      }

      const response = await axios.post(
        `${this.baseUrl}/services/aigc/multimodal-generation/generation`,
        {
          model: 'qwen-vl-max',
          input: {
            messages: [
              {
                role: 'user',
                content,
              },
            ],
          },
          parameters: {
            result_format: 'message',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 图片分析可能需要更长时间
        },
      );

      if (response.data?.output?.choices?.[0]?.message?.content) {
        const result = response.data.output.choices[0].message.content;
        // 如果返回的是数组格式，提取文本
        if (Array.isArray(result)) {
          return result.find((item: any) => item.type === 'text')?.text || '';
        }
        return result;
      }
      return '';
    } catch (error) {
      this.logger.error('图片分析失败', error);
      return '';
    }
  }

  // 生成匹配原因
  async generateMatchReason(
    userContent: string,
    passageContent: string,
    authorName: string,
    workTitle: string,
  ): Promise<string> {
    const prompt = `你是一个文学评论专家。请解释为什么以下文学段落与用户的日记产生了共鸣。

用户日记：
"""
${userContent}
"""

匹配的文学段落：
"""
${passageContent}
"""
作者：${authorName}
作品：${workTitle}

请用温暖、富有诗意的语言，写一段50-100字的匹配原因说明，解释两者之间的情感共鸣点。
不要使用"你"开头，使用第三人称或直接描述共鸣点。只返回说明文字，不要有其他内容。`;

    try {
      return await this.callQwen(prompt);
    } catch (error) {
      this.logger.error('生成匹配原因失败', error);
      return '这段文字与你的心情产生了深深的共鸣。';
    }
  }

  /**
   * AI 智能匹配 - 评估用户日记与文学段落的匹配度
   * 返回匹配分数 (0-1) 和匹配原因
   */
  async aiMatchPassage(
    userContent: string,
    passageContent: string,
    authorName: string,
    workTitle: string,
  ): Promise<{ score: number; reason: string }> {
    const prompt = `你是一个专业的文学共鸣分析专家。请分析用户日记与文学段落之间的情感共鸣程度。

用户日记：
"""
${userContent}
"""

文学段落：
"""
${passageContent}
"""
作者：${authorName}
作品：${workTitle}

请从以下维度评估匹配度（0-100分）：
1. 情感共鸣：两者表达的情感是否相似或互补
2. 意境相通：场景、意象是否有相似之处
3. 主题契合：探讨的主题是否相关
4. 心理投射：文学段落是否能折射出用户的内心状态

返回 JSON 格式（只返回 JSON，不要有其他内容）：
{
  "score": 0-100之间的数值,
  "reason": "50-100字的匹配原因说明，用温暖诗意的语言解释共鸣点"
}

评分标准：
- 90-100分：情感高度共鸣，意境完美契合
- 70-89分：情感有明显共鸣，有较多相似之处
- 50-69分：情感有一定关联，存在共鸣点
- 30-49分：情感较弱关联，仅有细微共鸣
- 0-29分：几乎无共鸣，关联性很低`;

    try {
      const response = await this.callQwen(prompt);
      // 解析 JSON 响应
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          score: Math.min(100, Math.max(0, result.score || 50)) / 100,
          reason: result.reason || '这段文字与你的心情产生了深深的共鸣。',
        };
      }
      throw new Error('无法解析 AI 响应');
    } catch (error) {
      this.logger.error('AI 匹配失败', error);
      // 返回默认值
      return {
        score: 0.5,
        reason: '这段文字与你的心情产生了深深的共鸣。',
      };
    }
  }

  // 生成文本向量嵌入
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/services/embeddings/text-embedding/text-embedding`,
        {
          model: 'text-embedding-v3',
          input: { texts: [text] },
          parameters: { dimension: 1024 },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.output?.embeddings?.[0]?.embedding) {
        return response.data.output.embeddings[0].embedding;
      }
      throw new Error('无法获取向量嵌入');
    } catch (error) {
      this.logger.error('生成向量嵌入失败', error);
      // 返回空向量
      return new Array(1024).fill(0);
    }
  }

  // 调用通义千问（带重试机制）
  private async callQwen(prompt: string, maxRetries = 3): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(
          `${this.baseUrl}/services/aigc/text-generation/generation`,
          {
            model: 'qwen-max',
            input: {
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
            },
            parameters: {
              result_format: 'message',
              temperature: 0.7,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30秒超时
          },
        );

        if (response.data?.output?.choices?.[0]?.message?.content) {
          return response.data.output.choices[0].message.content;
        }
        throw new Error('AI响应格式错误');
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`AI 调用失败 (尝试 ${attempt}/${maxRetries}): ${lastError.message}`);

        if (attempt < maxRetries) {
          // 指数退避：1秒、2秒、4秒...
          const delay = Math.pow(2, attempt - 1) * 1000;
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('AI调用失败');
  }

  // 延迟函数
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 默认分析结果
  private getDefaultAnalysis(): EmotionAnalysisResult {
    return {
      emotions: [{ name: '平静', score: 0.5 }],
      primaryEmotion: '平静',
      emotionIntensity: 0.5,
      keywords: [],
      imagery: [],
      scenes: [],
      themes: [],
      weatherType: '多云',
      psychologicalInsight: '每一次记录都是与自己对话的机会。',
    };
  }

  /**
   * AI场景生图 - 使用豆包API
   * @param prompt 场景描述
   * @param style 风格（可选）
   * @returns 生成的图片URL
   */
  async generateSceneImage(
    prompt: string,
    style?: string,
  ): Promise<{ imageUrl: string; taskId: string }> {
    this.logger.log(`开始生成场景图片: ${prompt}`);

    // 构建增强的prompt，添加艺术风格
    const enhancedPrompt = this.buildImagePrompt(prompt, style);

    try {
      // 调用豆包API生成图片
      const response = await axios.post(
        `${this.doubaoBaseUrl}/images/generations`,
        {
          model: this.doubaoModel,
          prompt: enhancedPrompt,
          size: '1024x1024',
          n: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${this.doubaoApiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 60秒超时
        },
      );

      this.logger.log('豆包API响应:', JSON.stringify(response.data));

      // 解析响应获取图片URL
      const imageUrl = response.data?.data?.[0]?.url;
      if (!imageUrl) {
        throw new Error('无法获取生成的图片URL');
      }

      return { imageUrl, taskId: Date.now().toString() };
    } catch (error: any) {
      this.logger.error('图片生成失败', error?.response?.data || error);
      throw new Error('图片生成失败，请稍后重试');
    }
  }

  /**
   * 轮询图片生成结果
   */
  private async pollImageResult(
    taskId: string,
    maxAttempts = 60,
  ): Promise<string> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      await this.sleep(2000); // 每2秒轮询一次

      try {
        const response = await axios.get(
          `${this.baseUrl}/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
            },
            timeout: 10000,
          },
        );

        const status = response.data?.output?.task_status;
        this.logger.log(`任务 ${taskId} 状态: ${status}`);

        if (status === 'SUCCEEDED') {
          const results = response.data?.output?.results;
          if (results && results.length > 0 && results[0].url) {
            return results[0].url;
          }
          throw new Error('图片结果为空');
        }

        if (status === 'FAILED') {
          const errorMsg =
            response.data?.output?.message || '图片生成失败';
          throw new Error(errorMsg);
        }

        // PENDING 或 RUNNING 状态继续等待
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
      }
    }

    throw new Error('图片生成超时');
  }

  /**
   * 构建增强的图片生成prompt
   */
  private buildImagePrompt(prompt: string, style?: string): string {
    // 基础艺术风格描述
    const styleMap: Record<string, string> = {
      watercolor: '水彩画风格，柔和的色彩过渡，梦幻朦胧',
      oil: '油画风格，厚重的笔触，丰富的色彩层次',
      anime: '日系动漫风格，精致的线条，明亮的色彩',
      realistic: '写实风格，高清细节，自然光影',
      fantasy: '奇幻风格，魔幻元素，绚丽的光效',
      minimalist: '极简风格，简洁的构图，留白艺术',
    };

    const styleDesc = style && styleMap[style] ? styleMap[style] : '艺术插画风格，温暖治愈的氛围';

    return `${prompt}，${styleDesc}，高质量，精美细节，4K分辨率`;
  }

  /**
   * 根据日记内容生成场景描述
   */
  async generateScenePrompt(
    content: string,
    emotion: string,
    keywords: string[],
    imagery: string[],
  ): Promise<string> {
    const prompt = `你是一个专业的AI绘画提示词专家。请根据以下日记内容，生成一段适合AI绘画的场景描述。

日记内容：
"""
${content}
"""

关键词：${(keywords || []).join('、')}
意象：${(imagery || []).join('、')}

要求：
1. 生成一段50-100字的场景描述
2. 描述要具体、有画面感
3. 包含环境、光影、氛围等元素
4. 不要包含人物的具体面部特征
5. 只返回场景描述，不要有其他内容`;

    try {
      return await this.callQwen(prompt);
    } catch (error) {
      this.logger.error('生成场景描述失败', error);
      // 返回基于关键词的默认描述
      return `${imagery.join('，')}，${emotion}的氛围，温暖治愈的场景`;
    }
  }
}
