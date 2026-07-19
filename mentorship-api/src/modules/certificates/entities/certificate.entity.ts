import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index
} from 'typeorm';

/**
 * Entity для реєстру сертифікатів молодих підприємців
 */
@Entity('certificate_registry')
@Index(['certificateNumber'], { unique: true })
export class CertificateEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'smallint' })
  year: number;

  @Column({ length: 255 })
  institutionName: string;

  @Column({ length: 15 })
  edrpoUCode: string;

  @Column({ length: 20, unique: true })
  certificateNumber: string; // ХХХХХХХХ/УУ-ZZ

  @Column({ length: 255 })
  participantFullName: string;

  @Column({ length: 255 })
  programName: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
