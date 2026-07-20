import { Module } from '@nestjs/common';
import { MenteesController } from './mentees.controller';
import { MenteesService } from './mentees.service';

@Module({
  imports: [],
  controllers: [MenteesController],
  providers: [MenteesService],
  exports: [MenteesService],
})
export class MenteesModule {}
