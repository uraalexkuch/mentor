import { Module } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { Application } from '../../models/application.model';

@Module({
  imports: [
    // Model буде додано глобально через SequelizeModule
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
})
export class ApplicationsModule {}
