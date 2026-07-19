import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm';

/**
 * Entity для заявки на участь у заходах менторства
 * Відповідає бізнес-правилам ДЦЗ (Постанова №472)
 */
@Entity('mentorship_applications')
@Index(['rnokpp'], { unique: true })
export class ApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === Особисті дані ===
  @Column({ length: 255 })
  fullName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ length: 10, nullable: true })
  passportSeries: string;

  @Column({ length: 15 })
  passportNumber: string;

  @Column({ length: 20, unique: true, nullable: true })
  rnokpp: string;

  @Column({ type: 'text', nullable: true })
  rnokppRefusalNote: string;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ length: 10 })
  regionCode: string;

  @Column({ length: 50, nullable: true })
  employmentCenterId: string;

  // === Інформація про бізнес ===
  @Column({ type: 'boolean', default: false })
  isBusinessActive: boolean;

  @Column({ type: 'boolean', default: false })
  receivedMicrogrant: boolean;

  @Column({ length: 10, nullable: true })
  micrograntYear: string; // "2022 рік", "2023 рік" тощо

  @Column({ length: 255, nullable: true })
  primaryBusinessActivity: string;

  // === Пільгові категорії ===
  @Column({ type: 'boolean', default: false })
  isIDP: boolean;

  @Column({ type: 'boolean', default: false })
  hasDisability: boolean;

  // === Ветеранські категорії ===
  @Column({ type: 'boolean', default: false })
  isCombatant: boolean;

  @Column({ type: 'boolean', default: false })
  isWarDisabled: boolean;

  @Column({ type: 'boolean', default: false })
  isFamilyMember: boolean;

  @Column({ type: 'boolean', default: false })
  isVeteranEnterprise: boolean;

  // === Дані ветерана (для членів сім'ї) ===
  @Column({ length: 255, nullable: true })
  veteranFullName: string;

  @Column({ length: 20, nullable: true })
  veteranRnokpp: string;

  @Column({ length: 255, nullable: true })
  veteranContactInfo: string;

  // === Потреби (ТІЛЬКИ ЧЕКБОКСИ — зберігаються як окремі boolean поля) ===
  @Column({ type: 'boolean', default: false })
  needsTraining: boolean;

  @Column({ type: 'boolean', default: false })
  needsMentorshipSupport: boolean;

  @Column({ type: 'boolean', default: false })
  needsPracticalHelp: boolean;

  @Column({ type: 'boolean', default: false })
  needsMicrograntMentorship: boolean;

  // === Статус та метадані ===
  @Column({
    type: 'enum',
    enum: ['подано', 'опрацьовується', 'підтверджено', 'резерв', 'відмовлено', 'завершено навчання', 'дата консультації'],
    default: 'подано'
  })
  status: string;

  @Column({ length: 20, nullable: true })
  certificateNumber: string; // ХХХХХХХХ/УУ-ZZ

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;

  // ==================== ЗАБОРОНЕНО (не існує в цій таблиці) ====================
  // ❌ КЕКВ поля — суворо заборонені
  // ❌ Ручний аналіз за Постановою 738 — суворо заборонений
}
