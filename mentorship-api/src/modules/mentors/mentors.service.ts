import { Injectable, NotFoundException } from '@nestjs/common';
import { MentorDto, UserRole } from '@mentor/shared-types';
import { Mentor } from '../../models/mentor.model';

@Injectable()
export class MentorsService {
  async create(data: Partial<MentorDto>): Promise<MentorDto> {
    const mentor = await Mentor.create({
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      specialization: data.specialization || '',
      experienceYears: data.experienceYears || 0,
      rating: data.rating || 0,
      maxActiveMentees: data.maxActiveMentees ?? 5,
      isAvailable: data.isAvailable ?? true,
      organizationType: data.organizationType || 'NGO',
      isVolunteer: data.isVolunteer ?? true,
      isActive: data.isActive ?? true,
    });
    return this.toMentorDto(mentor);
  }

  async findAll(): Promise<MentorDto[]> {
    const mentors = await Mentor.findAll({
      order: [['createdAt', 'DESC']],
    });
    return mentors.map(m => this.toMentorDto(m));
  }

  async findOne(id: string): Promise<MentorDto> {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} not found`);
    }
    return this.toMentorDto(mentor);
  }

  async update(id: string, data: Partial<MentorDto>): Promise<MentorDto> {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} not found`);
    }
    await mentor.update(data);
    return this.toMentorDto(mentor);
  }

  async remove(id: string): Promise<void> {
    const mentor = await Mentor.findByPk(id);
    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} not found`);
    }
    await mentor.destroy();
  }

  private toMentorDto(model: Mentor): MentorDto {
    return {
      id: model.id,
      email: model.email,
      firstName: model.firstName,
      lastName: model.lastName,
      role: UserRole.MENTOR,
      specialization: model.specialization,
      experienceYears: model.experienceYears,
      rating: model.rating,
      isAvailable: model.isAvailable,
      maxActiveMentees: model.maxActiveMentees,
      isActive: model.isActive,
      organizationType: model.organizationType,
      isVolunteer: model.isVolunteer,
      createdAt: model.createdAt.toISOString(),
    };
  }
}

