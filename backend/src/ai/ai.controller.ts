import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AiService } from './ai.service';
import { ApiResponse } from '../common/dto/api-response.dto';

// 生成场景图片请求DTO
interface GenerateImageDto {
  prompt: string;
  style?: string;
}

// 根据日记生成场景描述请求DTO
interface GenerateScenePromptDto {
  content: string;
  emotion: string;
  keywords: string[];
  imagery: string[];
}

// 响应类型
interface GenerateImageResult {
  imageUrl: string;
  taskId: string;
}

interface GeneratePromptResult {
  prompt: string;
}

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  /**
   * 生成场景图片
   * POST /api/ai/generate-image
   */
  @Post('generate-image')
  async generateImage(
    @Body() dto: GenerateImageDto,
  ): Promise<ApiResponse<GenerateImageResult | null>> {
    this.logger.log(`收到生图请求: ${dto.prompt}`);

    try {
      const result = await this.aiService.generateSceneImage(
        dto.prompt,
        dto.style,
      );
      return ApiResponse.success(result, '图片生成成功');
    } catch (error) {
      this.logger.error('生图失败', error);
      return ApiResponse.error(
        error instanceof Error ? error.message : '图片生成失败',
      );
    }
  }

  /**
   * 根据日记内容生成场景描述
   * POST /api/ai/generate-scene-prompt
   */
  @Post('generate-scene-prompt')
  async generateScenePrompt(
    @Body() dto: GenerateScenePromptDto,
  ): Promise<ApiResponse<GeneratePromptResult | null>> {
    this.logger.log('收到生成场景描述请求');

    try {
      const prompt = await this.aiService.generateScenePrompt(
        dto.content,
        dto.emotion,
        dto.keywords,
        dto.imagery,
      );
      return ApiResponse.success({ prompt }, '场景描述生成成功');
    } catch (error) {
      this.logger.error('生成场景描述失败', error);
      return ApiResponse.error(
        error instanceof Error ? error.message : '场景描述生成失败',
      );
    }
  }
}
