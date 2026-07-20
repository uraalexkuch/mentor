import { Injectable, NotFoundException } from '@nestjs/common';
import { MentorshipPairDto, MentorshipStatus } from '@mentor/shared-types';
import { MentorshipPair } from '../../models/mentorship-pair.model';

@Injectable()
export class MentorshipPairsService {
  async create(data: Partial<MentorshipPairDto>): Promise<MentorshipPairDto> {
    const pair = await MentorshipPair.create({
      mentorId: data.mentorId,
      menteeId: data.menteeId,
      status: data.status || MentorshipStatus.PLANNING,
    });
    return this.toDto(pair);
  }

  async findAll(): Promise<MentorshipPairDto[]> {
    const pairs = await MentorshipPair.findAll({
      order: [['createdAt', 'DESC']],
    });
    return pairs.map(p => this.toDto(p));
  }

  async findOne(id: string): Promise<MentorshipPairDto> {
    const pair = await MentorshipPair.findByPk(id);
    if (!pair) {
      throw new NotFoundException(`Pair with id ${id} not found`);
    }
    return this.toDto(pair);
  }

  async update(id: string, data: Partial<MentorshipPairDto>): Promise<MentorshipPairDto> {
    const pair = await MentorshipPair.findByPk(id);
    if (!pair) {
      throw new NotFoundException(`Pair with id ${id} not found`);
    }
    await pair.update(data);
    return this.toDto(pair);
  }

  async remove(id: string): Promise<void> {
    const pair = await MentorshipPair.findByPk(id);
    if (!pair) {
      throw new NotFoundException(`Pair with id ${id} not found`);
    }
    await pair.destroy();
  }

  private toDto(model: MentorshipPair): MentorshipPairDto {
    return {
      id: model.id,
      mentorId: model.mentorId,
      menteeId: model.menteeId,
      status: model.status as MentorshipStatus,
      createdAt: model.createdAt.toISOString(),
      updatedAt: model.updatedAt ? model.updatedAt.toISOString() : undefined,
    };
  }
}

