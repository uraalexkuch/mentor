import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MentorsService } from './mentors.service';
import { MentorDto } from '@mentor/shared-types';

@ApiTags('mentors')
@Controller('mentors')
export class MentorsController {
  constructor(private readonly mentorsService: MentorsService) {}

  @Post()
  @ApiOperation({ summary: 'Додати нового ментора' })
  @ApiResponse({ status: 201, description: 'Ментора додано' })
  async create(@Body() data: Partial<MentorDto>): Promise<MentorDto> {
    return this.mentorsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список всіх менторів' })
  @ApiResponse({ status: 200, description: 'Список менторів' })
  async findAll(): Promise<MentorDto[]> {
    return this.mentorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати ментора за ID' })
  @ApiResponse({ status: 200, description: 'Ментора знайдено' })
  async findOne(@Param('id') id: string): Promise<MentorDto> {
    return this.mentorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані ментора' })
  @ApiResponse({ status: 200, description: 'Дані ментора оновлено' })
  async update(@Param('id') id: string, @Body() data: Partial<MentorDto>): Promise<MentorDto> {
    return this.mentorsService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити ментора' })
  @ApiResponse({ status: 200, description: 'Ментора видалено' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.mentorsService.remove(id);
  }
}
