import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Application } from '../../models/application.model';
import { Op } from 'sequelize';

export interface AppRecord {
  id: string;
  fullName: string;
  regionCode: string;
  status: string;
  comments?: string;
  createdAt: Date;
  updatedAt?: Date;
}

@Injectable()
export class ApplicationsService {
  /**
   * Створити нову заявку
   */
  async create(data: Partial<Application>): Promise<AppRecord> {
    const application = await Application.create({
      fullName: data.fullName,
      birthDate: data.birthDate ? new Date(data.birthDate as any) : new Date(),
      passportSeries: data.passportSeries,
      passportNumber: data.passportNumber,
      phone: data.phone,
      email: data.email,
      regionCode: data.regionCode,
      employmentCenterId: data.employmentCenterId,
      isBusinessActive: data.isBusinessActive ?? false,
      receivedMicrogrant: data.receivedMicrogrant ?? false,
      micrograntYear: data.micrograntYear,
      primaryBusinessActivity: data.primaryBusinessActivity,
      applicantCategories: data.applicantCategories ?? [],
      needsTraining: data.needsTraining ?? false,
      needsMentorshipSupport: data.needsMentorshipSupport ?? false,
      needsPracticalHelp: data.needsPracticalHelp ?? false,
      needsMicrograntMentorship: data.needsMicrograntMentorship ?? false,
      status: 'подано',
    });

    return this.toAppRecord(application);
  }

  /**
   * Отримати всі заявки з пагінацією та пошуком
   */
  async findAll(page: number = 1, limit: number = 20, search?: string): Promise<{ data: AppRecord[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const where: any = {};
    if (search) {
      where[Op.or] = [
        { fullName: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Application.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows.map(item => this.toAppRecord(item)),
      total: count,
    };
  }

  /**
   * Отримати заявку за ID
   */
  async findOne(id: string): Promise<AppRecord> {
    const application = await Application.findByPk(id);
    
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    return this.toAppRecord(application);
  }

  /**
   * Отримати заявку за rnokpp
   */
  async findByRnokpp(rnokpp: string): Promise<AppRecord | null> {
    const application = await Application.findOne({ where: { rnokpp } });
    return application ? this.toAppRecord(application) : null;
  }

  /**
   * Оновити заявку
   */
  async update(id: string, data: Partial<Application>): Promise<AppRecord> {
    const application = await Application.findByPk(id);
    
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    await application.update(data);
    
    return this.toAppRecord(application);
  }

  /**
   * Видалити заявку
   */
  async remove(id: string): Promise<void> {
    const application = await Application.findByPk(id);
    
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    await application.destroy();
  }

  /**
   * Змінити статус заявки
   */
  async updateStatus(id: string, status: string): Promise<AppRecord> {
    const application = await Application.findByPk(id);
    
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    await application.update({ status });
    
    return this.toAppRecord(application);
  }

  /**
   * Конвертувати модель в AppRecord
   */
  private toAppRecord(model: Application): AppRecord {
    return {
      id: model.id,
      fullName: model.fullName,
      regionCode: model.regionCode,
      status: model.status,
      comments: model.rnokppRefusalNote || undefined,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt || undefined,
    };
  }
}
