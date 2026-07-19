import { Injectable } from '@nestjs/common';
import { CertificateEntity } from './entities/certificate.entity';

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
  createCertificate(data: Partial<CertificateEntity>): CertificateEntity {
    const certificate = new CertificateEntity();
    
    if (!data.certificateNumber) {
      data.edrpoUCode = data.edrpoUCode || '00000000';
      data.year = data.year || new Date().getFullYear();
      certificate.certificateNumber = this.generateCertificateNumber(
        data.edrpoUCode, 
        data.year
      );
    } else {
      if (!this.validateCertificateNumber(data.certificateNumber)) {
        throw new Error('Невірний формат номера сертифіката. Очікується: ХХХХХХХХ/УУ-ZZ');
      }
      certificate.certificateNumber = data.certificateNumber;
    }

    certificate.year = data.year || new Date().getFullYear();
    certificate.institutionName = data.institutionName || '';
    certificate.edrpoUCode = data.edrpoUCode || '';
    certificate.participantFullName = data.participantFullName || '';
    certificate.programName = data.programName || '';
    certificate.issueDate = data.issueDate ? new Date(data.issueDate) : new Date();
    certificate.note = data.note ?? '';

    return certificate;
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
