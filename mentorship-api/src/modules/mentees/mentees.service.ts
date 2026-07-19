import { Injectable, NotFoundException } from '@nestjs/common';
import { MenteeDto, UserRole } from '@mentor/shared-types';

@Injectable()
export class MenteesService {
  private mentees: Map<string, MenteeDto> = new Map();
  private counter = 0;

  async create(data: Partial<MenteeDto>): Promise<MenteeDto> {
    this.counter++;
    const id = String(this.counter);
    const mentee: MenteeDto = {
      id,
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      role: UserRole.MENTEE,
      profession: data.profession || '',
      desiredSpecialization: data.desiredSpecialization || '',
      businessType: data.businessType || 'planned',
      isActive: data.isActive ?? true,
      createdAt: new Date().toISOString()
    };
    this.mentees.set(id, mentee);
    return mentee;
  }

  async findAll(): Promise<MenteeDto[]> {
    return Array.from(this.mentees.values());
  }

  async findOne(id: string): Promise<MenteeDto> {
    const mentee = this.mentees.get(id);
    if (!mentee) {
      throw new NotFoundException(`Mentee with id ${id} not found`);
    }
    return mentee;
  }

  async update(id: string, data: Partial<MenteeDto>): Promise<MenteeDto> {
    const mentee = this.mentees.get(id);
    if (!mentee) {
      throw new NotFoundException(`Mentee with id ${id} not found`);
    }
    const updated = { ...mentee, ...data };
    this.mentees.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!this.mentees.has(id)) {
      throw new NotFoundException(`Mentee with id ${id} not found`);
    }
    this.mentees.delete(id);
  }
}
