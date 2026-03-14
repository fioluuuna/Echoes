import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { ApiResponse } from '../common/dto/api-response.dto';

// 默认用户ID（移除登录后使用）
const DEFAULT_USER_ID = 1;

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) { }

  @Get('overview')
  async getOverview() {
    const overview = await this.statsService.getOverview(DEFAULT_USER_ID);
    return ApiResponse.success(overview);
  }

  @Get('emotion-curve')
  async getEmotionCurve(
    @Query('days') days = 30,
  ) {
    const curve = await this.statsService.getEmotionCurve(
      DEFAULT_USER_ID,
      +days,
    );
    return ApiResponse.success(curve);
  }

  @Get('timeline')
  async getTimeline(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const timeline = await this.statsService.getTimeline(
      DEFAULT_USER_ID,
      +page,
      +limit,
    );
    return ApiResponse.success(timeline);
  }
}
