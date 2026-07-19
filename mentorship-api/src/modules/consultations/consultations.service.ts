import { Injectable, NotFoundException } from '@nestjs/common';
import { ConsultationOrderDto, ApplicationStatus } from '@mentor/shared-types';

@Injectable()
export class ConsultationsService {
  private consultations: Map<string, ConsultationOrderDto> = new Map();
  private counter = 0;

  async create(data: Partial<ConsultationOrderDto>): Promise<{ id: string; status: ApplicationStatus }> {
    this.counter++;
    const id = String(this.counter);
    
    // Валідація: якщо бізнес не діючий — причина обов'язкова
    if (!data.isBusinessActive && !data.businessInactiveReason) {
      throw new Error('Якщо бізнес не діючий, необхідно вказати причину');
    }

    // Валідація: необхідно вказати тип заявки
    if (!data.applicationType) {
      throw new Error('Необхідно обрати тип заявки');
    }

    // Якщо обрано "Консультація офісу" для діючого підприємця, бажано вказати напрям (хоча тут ми просто зберігаємо)

    const consultation: ConsultationOrderDto = {
      id,
      fullName: data.fullName || '',
      birthDate: data.birthDate || new Date().toISOString(),
      phone: data.phone || '',
      email: data.email || '',
      regionCode: data.regionCode || '',
      isBusinessActive: data.isBusinessActive ?? false,
      businessInactiveReason: data.businessInactiveReason,
      applicationType: data.applicationType || 'TRAINING',
      officeConsultationTopics: data.officeConsultationTopics || {
        businessPlans: false,
        personnel: false,
        creditPrograms: false,
      },
      otherTopicDescription: data.otherTopicDescription,
      preferredDate: data.preferredDate || new Date().toISOString(),
      status: ApplicationStatus.SUBMITTED,
      createdAt: new Date().toISOString()
    };

    this.consultations.set(id, consultation);
    
    return { id, status: ApplicationStatus.SUBMITTED };
  }

  async findAll(page: number = 1, limit: number = 20): Promise<ConsultationOrderDto[]> {
    const all = Array.from(this.consultations.values());
    const start = (page - 1) * limit;
    return all.slice(start, start + limit);
  }

  async findOne(id: string): Promise<ConsultationOrderDto> {
    const consultation = this.consultations.get(id);
    if (!consultation) {
      throw new NotFoundException(`Consultation with id ${id} not found`);
    }
    return consultation;
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<ConsultationOrderDto> {
    const consultation = this.consultations.get(id);
    if (!consultation) {
      throw new NotFoundException(`Consultation with id ${id} not found`);
    }
    
    const updated = {
      ...consultation,
      status,
      updatedAt: new Date().toISOString()
    };
    
    this.consultations.set(id, updated);
    return updated;
  }

  async remove(id: string): Promise<void> {
    if (!this.consultations.has(id)) {
      throw new NotFoundException(`Consultation with id ${id} not found`);
    }
    this.consultations.delete(id);
  }
}
