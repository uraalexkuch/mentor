import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Op } from 'sequelize';
import { Consultation } from '../../models/consultation.model';

export interface ConsultationRecord {
  id: string;
  fullName: string;
  regionCode: string;
  status: string;
  createdAt: Date;
}

@Injectable()
export class ConsultationsService {
  async create(data: any): Promise<ConsultationRecord> {
    // Валідація
    if (!data.isBusinessActive && !data.businessInactiveReason) {
      throw new BadRequestException('Якщо бізнес не діючий, необхідно вказати причину');
    }

    const consultation = await Consultation.create({
      fullName: data.fullName || '',
      birthDate: new Date(data.birthDate),
      phone: data.phone || '',
      email: data.email,
      regionCode: data.regionCode || '',
      isBusinessActive: data.isBusinessActive ?? false,
      businessInactiveReason: data.businessInactiveReason,
      topicGovernmentPrograms: data.officeConsultationTopics?.businessPlans ?? false,
      topicGrantSelection: false,
      topicMentorshipSupport: data.officeConsultationTopics?.personnel ?? false,
      topicOther: data.otherTopicDescription ? true : false,
      topicStateCompensations: data.officeConsultationTopics?.stateCompensations ?? false,
      otherTopicDescription: data.otherTopicDescription,
      consultationResult: data.consultationResult,
      consultantName: data.consultantName,
      preferredDate: new Date(data.preferredDate),
      status: 'подано',
    });

    return this.toConsultationRecord(consultation);
  }

  async findAll(page: number = 1, limit: number = 20): Promise<{ data: ConsultationRecord[]; total: number }> {
    const offset = (page - 1) * limit;
    
    const { rows, count } = await Consultation.findAndCountAll({
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return {
      data: rows.map(item => this.toConsultationRecord(item)),
      total: count,
    };
  }

  async findOne(id: string): Promise<ConsultationRecord> {
    const consultation = await Consultation.findByPk(id);
    
    if (!consultation) {
      throw new NotFoundException(`Consultation with id ${id} not found`);
    }
    
    return this.toConsultationRecord(consultation);
  }

  async updateStatus(id: string, status: string): Promise<ConsultationRecord> {
    const consultation = await Consultation.findByPk(id);
    
    if (!consultation) {
      throw new NotFoundException(`Consultation with id ${id} not found`);
    }
    
    await consultation.update({ status });
    
    return this.toConsultationRecord(consultation);
  }

  async remove(id: string): Promise<void> {
    const consultation = await Consultation.findByPk(id);
    
    if (!consultation) {
      throw new NotFoundException(`Consultation with id ${id} not found`);
    }
    
    await consultation.destroy();
  }

  private toConsultationRecord(model: Consultation): ConsultationRecord {
    return {
      id: model.id,
      fullName: model.fullName,
      regionCode: model.regionCode,
      status: model.status,
      createdAt: model.createdAt,
    };
  }
}
