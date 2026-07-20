import { Injectable, BadRequestException } from '@nestjs/common';
import { Certificate } from '../../models/certificate.model';

/**
 * Сервіс для генерації та управління сертифікатами
 * Формат номера: ХХХХХХХХ/УУ-ZZ (код ЄДРПОУ / номер / останні 2 цифри року)
 */
@Injectable()
export class CertificateService {
  /**
   * Генерація унікального номера сертифіката
   * Формат: 8 цифр / 2цифри_року - 2цифри
   * Приклад: 12345678/26-01
   */
  generateCertificateNumber(edrpoUCode: string, year: number): string {
    const randomPart = Math.floor(Math.random() * 90000000 + 10000000).toString();
    const yearDigits = String(year).slice(-2);
    const sequenceNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    return `${randomPart}/${yearDigits}-${sequenceNum}`;
  }

  /**
   * Валідація номера сертифіката
   * Формат: ХХХХХХХХ/УУ-ZZ (8 цифр / 2 цифри - 2 цифри)
   */
  validateCertificateNumber(number: string): boolean {
    const regex = /^\d{8}\/\d{2}-\d{2}$/;
    return regex.test(number);
  }

  /**
   * Створення запису сертифіката
   */
  async createCertificate(data: Partial<Certificate>): Promise<Certificate> {
    if (!data.certificateNumber) {
      data.edrpoUCode = data.edrpoUCode || '00000000';
      data.year = data.year || new Date().getFullYear();
      data.certificateNumber = this.generateCertificateNumber(
        data.edrpoUCode, 
        data.year
      );
    } else {
      if (!this.validateCertificateNumber(data.certificateNumber)) {
        throw new BadRequestException('Невірний формат номера сертифіката. Очікується: ХХХХХХХХ/УУ-ZZ');
      }
    }

    data.year = data.year || new Date().getFullYear();
    data.institutionName = data.institutionName || '';
    data.edrpoUCode = data.edrpoUCode || '';
    data.participantFullName = data.participantFullName || '';
    data.programName = data.programName || '';
    data.issueDate = data.issueDate ? new Date(data.issueDate as any) : new Date();
    data.note = data.note ?? '';

    return Certificate.create(data as Partial<Certificate>);
  }

  /**
   * Парсинг номера сертифіката на компоненти
   */
  parseCertificateNumber(certificateNumber: string): {
    eightDigits: string;
    yearDigits: string;
    sequenceNum: string;
    fullYear: number;
  } | null {
    if (!this.validateCertificateNumber(certificateNumber)) {
      return null;
    }

    const parts = certificateNumber.split('/');
    if (parts.length !== 2) return null;

    const [eightDigits, yearSeq] = parts;
    const seqParts = yearSeq.split('-');
    
    return {
      eightDigits,
      yearDigits: seqParts[0],
      sequenceNum: seqParts[1],
      fullYear: 2000 + parseInt(seqParts[0], 10)
    };
  }
}
