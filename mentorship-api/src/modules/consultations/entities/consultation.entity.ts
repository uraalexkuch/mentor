import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

/**
 * Entity для форми замовлення онлайн-консультації
 * Відповідає бізнес-правилам ДЦЗ (Постанова №472)
 */
@Entity('consultation_orders')
export class ConsultationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // === Особисті дані ===
  @Column({ length: 255 })
  fullName: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ length: 20 })
  phone: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ length: 10 })
  regionCode: string;

  // === Інформація про бізнес ===
  @Column({ type: 'boolean', default: false })
  isBusinessActive: boolean;

  @Column({ type: 'text', nullable: true })
  businessInactiveReason: string; // Текстова причина (тільки якщо isBusinessActive = false)

  // === Теми консультації (ТІЛЬКИ ЧЕКБОКСИ — зберігаються як окремі boolean поля) ===
  @Column({ type: 'boolean', default: false })
  topicGovernmentPrograms: boolean;

  @Column({ type: 'boolean', default: false })
  topicGrantSelection: boolean;

  @Column({ type: 'boolean', default: false })
  topicMentorshipSupport: boolean;

  @Column({ type: 'boolean', default: false })
  topicOther: boolean;

  @Column({ type: 'boolean', default: false })
  topicStateCompensations: boolean; // Державні компенсації

  @Column({ type: 'text', nullable: true })
  otherTopicDescription: string; // Тільки для теми "Інше"

  @Column({ type: 'text', nullable: true })
  consultationResult: string; // Результат консультації

  @Column({ type: 'varchar', length: 255, nullable: true })
  consultantName: string; // Ім'я фахівця

  // === Бажана дата консультації ===
  @Column({ type: 'date' })
  preferredDate: Date;

  // === Статус та метадані ===
  @Column({
    type: 'enum',
    enum: ['подано', 'опрацьовується', 'підтверджено', 'резерв', 'відмовлено', 'завершено навчання', 'дата консультації'],
    default: 'подано'
  })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;

  // ==================== ЗАБОРОНЕНО (не існує в цій таблиці) ====================
  // ❌ КЕКВ поля — суворо заборонені
  // ❌ Ручний аналіз за Постановою 738 — суворо заборонений
}
