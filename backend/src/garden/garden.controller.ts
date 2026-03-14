import { Controller, Get } from '@nestjs/common';
import { GardenService } from './garden.service';
import { ApiResponse } from '../common/dto/api-response.dto';

// 默认用户ID（移除登录后使用）
const DEFAULT_USER_ID = 1;

@Controller('garden')
export class GardenController {
  constructor(private gardenService: GardenService) { }

  @Get()
  async getUserGarden() {
    const garden = await this.gardenService.getUserGarden(DEFAULT_USER_ID);
    return ApiResponse.success(garden);
  }

  @Get('plants')
  async getPlants() {
    const garden = await this.gardenService.getUserGarden(DEFAULT_USER_ID);
    // 转换为植物列表格式
    const plants = garden.map((g) => ({
      authorId: g.authorId,
      authorName: g.author?.name,
      plantType: g.author?.plantType,
      plantSymbol: g.author?.plantSymbol,
      stage: g.plantStage,
      matchCount: g.matchCount,
      lastMatchAt: g.lastMatchAt,
    }));
    return ApiResponse.success(plants);
  }
}
