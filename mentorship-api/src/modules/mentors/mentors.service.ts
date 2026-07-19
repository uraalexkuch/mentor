import { Injectable, NotFoundException } from '@nestjs/common';
import { MentorDto, UserRole } from '@mentor/shared-types';

@Injectable()
export class MentorsService {
  private mentors: Map<string, MentorDto> = new Map();
  private counter = 0;

  async create(data: Partial<MentorDto>): Promise<MentorDto> {
    this.counter++;
    const id = String(this.counter);
    const mentor: MentorDto = {
      id,
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: UserRole.MENTOR,
      specialization: data.specialization || '',
      experienceYears: data.experienceYears || 0,
      rating: data.rating || 0,
      isAvailable: data.isAvailable ?? true,
      maxActiveMentees: data.maxActiveMentees ?? 5,
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString()
    };
    this.mentors.set(id, mentor);
    return mentor;
  }

  async findAll(): Promise<MentorDto[]> {
    return Array.from(this.mentors.values());
  }

  async findOne(id: string): Promise<MentorDto> {
    const mentor = this.mentors.get(id);
    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} not found`);
    }
    return mentor;
  }

  async update(id: string, data: Partial<MentorDto>): Promise<MentorDto> {
    const mentor = this.mentors.get(id);
    if (!mentor) {
      throw new NotFoundException(`Mentor with id ${id} not found`);
    }
    const updated = { ...mentor, ...data };
    this.mentors.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!this.mentors.has(id)) {
      throw new NotFoundException(`Mentor with id ${id} not found`);
    }
    this.mentors.delete(id);
  }
}
