import { Module } from '@nestjs/common';
import { MentorshipPairsService } from './mentorship-pairs.service';
import { MentorshipPairsController } from './mentorship-pairs.controller';

@Module({
  imports: [],
  controllers: [MentorshipPairsController],
  providers: [MentorshipPairsService],
  exports: [MentorshipPairsService],
})
export class MentorshipPairsModule {}

