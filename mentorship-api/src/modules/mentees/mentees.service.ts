import { Injectable, NotFoundException } from '@nestjs/common';
import { MenteeDto, UserRole } from '@mentor/shared-types';
import { Mentee } from '../../models/mentee.model';

@Injectable()
export class MenteesService {
  async create(data: Partial<MenteeDto>): Promise<MenteeDto> {
    const mentee = await Mentee.create({
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      profession: data.profession || '',
      desiredSpecialization: data.desiredSpecialization || '',
      businessType: data.businessType || 'planned',
      isActive: data.isActive ?? true,
    });
    return this.toMenteeDto(mentee);
  }

  async findAll(): Promise<MenteeDto[]> {
    const mentees = await Mentee.findAll({
      order: [['createdAt', 'DESC']],
    });
    return mentees.map(m => this.toMenteeDto(m));
  }

  async findOne(id: string): Promise<MenteeDto> {
    const mentee = await Mentee.findByPk(id);
    if (!mentee) {
      throw new NotFoundException(`Mentee with id ${id} not found`);
    }
    return this.toMenteeDto(mentee);
  }

  async update(id: string, data: Partial<MenteeDto>): Promise<MenteeDto> {
    const mentee = await Mentee.findByPk(id);
    if (!mentee) {
      throw new NotFoundException(`Mentee with id ${id} not found`);
    }
    await mentee.update(data);
    return this.toMenteeDto(mentee);
  }

  async remove(id: string): Promise<void> {
    const mentee = await Mentee.findByPk(id);
    if (!mentee) {
      throw new NotFoundException(`Mentee with id ${id} not found`);
    }
    await mentee.destroy();
  }

  private toMenteeDto(model: Mentee): MenteeDto {
    return {
      id: model.id,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      role: UserRole.MENTEE,
      profession: model.profession,
      desiredSpecialization: model.desiredSpecialization,
      businessType: model.businessType as 'existing' | 'planned',
      isActive: model.isActive,
      createdAt: model.createdAt.toISOString(),
    };
  }
}
