import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConsultationsService, ConsultationRecord } from './consultations.service';

@ApiTags('consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: 'Створити заявку на онлайн-консультацію' })
  @ApiResponse({ status: 201, description: 'Заявку прийнято' })
  async create(@Body() data: any): Promise<ConsultationRecord> {
    return this.consultationsService.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Отримати список всіх заявок на консультації' })
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.consultationsService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати заявку на консультацію за ID' })
  async findOne(@Param('id') id: string): Promise<ConsultationRecord> {
    return this.consultationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити статус заявки на консультацію' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string
  ): Promise<ConsultationRecord> {
    return this.consultationsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити заявку на консультацію' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.consultationsService.remove(id);
  }
}
