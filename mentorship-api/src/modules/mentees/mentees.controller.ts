import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MenteesService } from './mentees.service';
import { MenteeDto } from '@mentor/shared-types';

@ApiTags('mentees')
@Controller('mentees')
export class MenteesController {
  constructor(private readonly menteesService: MenteesService) {}

  @Post()
  @ApiOperation({ summary: 'Додати нового підопічного' })
  @ApiResponse({ status: 201, description: 'Підопічного додано' })
  async create(@Body() data: Partial<MenteeDto>): Promise<MenteeDto> {
    return this.menteesService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список всіх підопічних' })
  @ApiResponse({ status: 200, description: 'Список підопічних' })
  async findAll(): Promise<MenteeDto[]> {
    return this.menteesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати підопічного за ID' })
  @ApiResponse({ status: 200, description: 'Підопічного знайдено' })
  async findOne(@Param('id') id: string): Promise<MenteeDto> {
    return this.menteesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити дані підопічного' })
  @ApiResponse({ status: 200, description: 'Дані підопічного оновлено' })
  async update(@Param('id') id: string, @Body() data: Partial<MenteeDto>): Promise<MenteeDto> {
    return this.menteesService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити підопічного' })
  @ApiResponse({ status: 200, description: 'Підопічного видалено' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.menteesService.remove(id);
  }
}
