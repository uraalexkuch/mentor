import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsService } from './consultations.service';
import { Consultation } from '../../models/consultation.model';

@Module({
  imports: [],
  controllers: [ConsultationsController],
  providers: [ConsultationsService],
  exports: [ConsultationsService],
})
export class ConsultationsModule {}
