import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { ApiResponse } from '../common/dto/api-response.dto';

// 默认用户ID（移除登录后使用）
const DEFAULT_USER_ID = 1;

@Controller('entries')
export class EntryController {
  constructor(private entryService: EntryService) { }

  @Post()
  async createEntry(@Body() createEntryDto: CreateEntryDto) {
    const result = await this.entryService.createEntry(
      DEFAULT_USER_ID,
      createEntryDto,
    );
    return ApiResponse.success(result, '记录成功');
  }

  @Get()
  async getUserEntries(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const result = await this.entryService.getUserEntries(
      DEFAULT_USER_ID,
      +page,
      +limit,
    );
    return ApiResponse.success(result);
  }

  @Get(':id')
  async getEntryById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const entry = await this.entryService.getEntryById(id, DEFAULT_USER_ID);
    if (!entry) {
      return ApiResponse.notFound('日记不存在');
    }
    return ApiResponse.success(entry);
  }

  @Delete(':id')
  async deleteEntry(
    @Param('id', ParseIntPipe) id: number,
  ) {
    const success = await this.entryService.deleteEntry(id, DEFAULT_USER_ID);
    if (!success) {
      return ApiResponse.notFound('日记不存在');
    }
    return ApiResponse.success(null, '删除成功');
  }
}
