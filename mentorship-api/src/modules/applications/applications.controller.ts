import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApplicationsService, AppRecord } from './applications.service';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити нову заявку' })
  @ApiResponse({ status: 201, description: 'Заявку успішно створено' })
  async create(@Body() createApplicationDto: CreateApplicationDto): Promise<AppRecord> {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список всіх заявок' })
  @ApiResponse({ status: 200, description: 'Список заявок' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20): Promise<AppRecord[]> {
    return this.applicationsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати заявку за ID' })
  @ApiResponse({ status: 200, description: 'Заявку знайдено' })
  async findOne(@Param('id') id: string): Promise<AppRecord> {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити заявку' })
  @ApiResponse({ status: 200, description: 'Заявку оновлено' })
  async update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto): Promise<AppRecord> {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити заявку' })
  @ApiResponse({ status: 200, description: 'Заявку видалено' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.applicationsService.remove(id);
  }
}
