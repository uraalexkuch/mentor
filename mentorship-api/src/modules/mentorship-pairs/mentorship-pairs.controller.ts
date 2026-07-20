import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MentorshipPairsService } from './mentorship-pairs.service';
import { MentorshipPairDto } from '@mentor/shared-types';

@ApiTags('mentorship-pairs')
@Controller('mentorship-pairs')
export class MentorshipPairsController {
  constructor(private readonly pairsService: MentorshipPairsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити менторську пару' })
  @ApiResponse({ status: 201, description: 'Пару створено' })
  async create(@Body() data: Partial<MentorshipPairDto>): Promise<MentorshipPairDto> {
    return this.pairsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список всіх пар' })
  @ApiResponse({ status: 200, description: 'Список пар' })
  async findAll(): Promise<MentorshipPairDto[]> {
    return this.pairsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати пару за ID' })
  @ApiResponse({ status: 200, description: 'Пару знайдено' })
  async findOne(@Param('id') id: string): Promise<MentorshipPairDto> {
    return this.pairsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити статус або дані пари' })
  @ApiResponse({ status: 200, description: 'Пару оновлено' })
  async update(@Param('id') id: string, @Body() data: Partial<MentorshipPairDto>): Promise<MentorshipPairDto> {
    return this.pairsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити пару' })
  @ApiResponse({ status: 200, description: 'Пару видалено' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.pairsService.remove(id);
  }
}
