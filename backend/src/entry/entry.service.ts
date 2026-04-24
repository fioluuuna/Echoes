import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from './entities/entry.entity';
import { Match } from './entities/match.entity';
import { CreateEntryDto } from './dto/create-entry.dto';
import { AiService, EmotionAnalysisResult } from '../ai/ai.service';
import { LiteratureService } from '../literature/literature.service';
import { GardenService } from '../garden/garden.service';
import { Passage } from '../literature/entities/passage.entity';

interface MatchResult {
  passage: Passage;
  score: number;
  reason: string;
}

@Injectable()
export class EntryService {
  private readonly logger = new Logger(EntryService.name);

  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private aiService: AiService,
    private literatureService: LiteratureService,
    private gardenService: GardenService,
  ) {}

  // 创建日记并获取匹配结果
  async createEntry(userId: number, createEntryDto: CreateEntryDto) {
    const { content, emotionPrimary, emotionSecondary, images } = createEntryDto;

    // 1. AI情感分析（包含图片分析）
    this.logger.log('开始情感分析...');
    const analysis = await this.aiService.analyzeEmotion(content, images);

    // 2. 创建日记记录
    const entry = this.entryRepository.create({
      userId,
      content,
      emotionPrimary: emotionPrimary || analysis.primaryEmotion,
      emotionSecondary: emotionSecondary || analysis.emotions.map((e) => e.name),
      emotionIntensity: analysis.emotionIntensity,
      keywords: analysis.keywords,
      imagery: analysis.imagery,
      scenes: analysis.scenes,
      themes: analysis.themes,
      weatherType: analysis.weatherType,
      psychologicalInsight: analysis.psychologicalInsight,
      imageUrl: images?.[0] || undefined,
    });
    const savedEntry = await this.entryRepository.save(entry);

    // 3. 匹配文学段落
    this.logger.log('开始匹配文学段落...');
    const matchResults = await this.matchPassages(analysis, content);

    // 4. 保存匹配结果
    const matches = await this.saveMatches(savedEntry, matchResults);

    // 5. 更新花园（植物成长）
    const gardenUpdates = await this.updateGarden(userId, matchResults);

    return {
      entry: savedEntry,
      analysis: {
        emotions: analysis.emotions,
        keywords: analysis.keywords,
        imagery: analysis.imagery,
        scenes: analysis.scenes,
        psychologicalInsight: analysis.psychologicalInsight,
      },
      matches,
      gardenUpdates,
    };
  }

  // 匹配文学段落（使用 AI 智能匹配）
  private async matchPassages(
    analysis: EmotionAnalysisResult,
    userContent?: string,
  ): Promise<MatchResult[]> {
    // 获取所有段落
    const passages = await this.literatureService.getAllPassages();
    if (!passages.length) {
      this.logger.warn('文学库为空，无法匹配');
      return [];
    }

    this.logger.log(`开始 AI 匹配 ${passages.length} 个文学段落...`);

    // 并行处理所有段落的 AI 匹配
    const matchPromises = passages.map(async (passage) => {
      const result = await this.aiService.aiMatchPassage(
        userContent || analysis.keywords.join('，'),
        passage.content,
        passage.author?.name || '佚名',
        passage.work?.title || '未知作品',
      );
      return {
        passage,
        score: result.score,
        reason: result.reason,
      };
    });

    // 等待所有匹配完成
    const scoredPassages = await Promise.all(matchPromises);

    // 排序并返回 Top 3
    const topMatches = scoredPassages
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    this.logger.log(`AI 匹配完成，Top 3 匹配度: ${topMatches.map(m => `${m.score.toFixed(2)} (${m.passage.author?.name})`).join(', ')}`);

    return topMatches;
  }

  // 保存匹配结果
  private async saveMatches(
    entry: Entry,
    matchResults: MatchResult[],
  ): Promise<any[]> {
    const matches: any[] = [];

    for (let i = 0; i < matchResults.length; i++) {
      const result = matchResults[i];
      const passage = result.passage;

      // 使用 AI 已生成的匹配原因
      const matchReason = result.reason;

      const match = this.matchRepository.create({
        entryId: entry.id,
        passageId: passage.id,
        matchScore: result.score,
        matchReason,
        emotionSimilarity: result.score, // AI 综合评分
        keywordOverlap: 0, // 不再使用
        imageryMatch: 0, // 不再使用
        rank: i + 1,
      });
      const savedMatch = await this.matchRepository.save(match);

      matches.push({
        rank: i + 1,
        passage: {
          id: passage.id,
          content: passage.content,
          author: passage.author
            ? {
                id: passage.author.id,
                name: passage.author.name,
                avatar: passage.author.avatar,
                plantType: passage.author.plantType,
              }
            : null,
          work: passage.work
            ? {
                id: passage.work.id,
                title: passage.work.title,
              }
            : null,
        },
        matchScore: result.score,
        matchReason,
      });
    }

    return matches;
  }

  // 更新花园
  private async updateGarden(userId: number, matchResults: MatchResult[]): Promise<any[]> {
    const updates: any[] = [];

    for (const result of matchResults) {
      if (result.passage.author) {
        const update = await this.gardenService.updatePlant(
          userId,
          result.passage.author.id,
        );
        if (update) {
          updates.push({
            authorId: result.passage.author.id,
            authorName: result.passage.author.name,
            plantType: result.passage.author.plantType,
            previousStage: update.previousStage,
            currentStage: update.currentStage,
            isNewPlant: update.isNewPlant,
          });
        }
      }
    }

    return updates;
  }

  // 获取用户日记列表
  async getUserEntries(userId: number, page = 1, limit = 20) {
    const [entries, total] = await this.entryRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['matches', 'matches.passage', 'matches.passage.author'],
    });

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 获取日记详情
  async getEntryById(id: number, userId: number) {
    return this.entryRepository.findOne({
      where: { id, userId },
      relations: [
        'matches',
        'matches.passage',
        'matches.passage.author',
        'matches.passage.work',
      ],
    });
  }

  // 删除日记
  async deleteEntry(id: number, userId: number): Promise<boolean> {
    const result = await this.entryRepository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
