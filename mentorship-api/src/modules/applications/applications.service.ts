import { Injectable, NotFoundException } from '@nestjs/common';
import { ApplicationStatus } from '@mentor/shared-types';
import { CreateApplicationDto, UpdateApplicationDto } from './dto/application.dto';

export interface AppRecord {
  id: string;
  applicantName: string;
  regionCode: string;
  applicationType: string;
  status: ApplicationStatus;
  comments?: string;
  createdAt: string;
  updatedAt?: string;
}

@Injectable()
export class ApplicationsService {
  private applications: Map<string, AppRecord> = new Map();
  private counter = 0;

  async create(createApplicationDto: CreateApplicationDto): Promise<AppRecord> {
    this.counter++;
    const id = String(this.counter);
    const application: AppRecord = {
      id,
      applicantName: createApplicationDto.applicantName,
      regionCode: createApplicationDto.regionCode,
      applicationType: createApplicationDto.applicationType,
      status: ApplicationStatus.SUBMITTED,
      createdAt: new Date().toISOString()
    };
    this.applications.set(id, application);
    return application;
  }

  async findAll(page: number = 1, limit: number = 20): Promise<AppRecord[]> {
    const all = Array.from(this.applications.values());
    const start = (page - 1) * limit;
    return all.slice(start, start + limit);
  }

  async findOne(id: string): Promise<AppRecord> {
    const application = this.applications.get(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<AppRecord> {
    const application = this.applications.get(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    
    const updated = {
      ...application,
      ...(updateApplicationDto.status && { status: updateApplicationDto.status }),
      updatedAt: new Date().toISOString()
    };
    
    this.applications.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const application = this.applications.get(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }
    this.applications.delete(id);
  }

}
