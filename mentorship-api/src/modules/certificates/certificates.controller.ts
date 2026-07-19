import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CertificateService } from './certificate.service';
import { CertificateRegistryItemDto } from '@mentor/shared-types';

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  constructor(private readonly certificateService: CertificateService) {}

  @Post()
  @ApiOperation({ summary: 'Створити сертифікат' })
  @ApiResponse({ status: 201, description: 'Сертифікат створено' })
  async create(@Body() data: Partial<CertificateRegistryItemDto>) {
    const entityData = {
      ...data,
      issueDate: data.issueDate ? new Date(data.issueDate) : undefined
    };
    const certificate = this.certificateService.createCertificate(entityData);
    return { success: true, certificate };
  }

  @Get('generate')
  @ApiOperation({ summary: 'Згенерувати номер сертифіката' })
  async generateNumber(@Query('edrpoU') edrpoU: string, @Query('year') year: number) {
    return {
      certificateNumber: this.certificateService.generateCertificateNumber(edrpoU, year)
    };
  }

  @Get('validate/:number')
  @ApiOperation({ summary: 'Валідувати номер сертифіката' })
  async validate(@Param('number') number: string) {
    return {
      valid: this.certificateService.validateCertificateNumber(number),
      parsed: this.certificateService.parseCertificateNumber(number)
    };
  }
}
