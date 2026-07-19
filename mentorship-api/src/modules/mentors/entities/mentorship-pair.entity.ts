import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('mentorship_pairs')
export class MentorshipPairEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  mentorId: string;

  @Column({ length: 36 })
  menteeId: string;

  @Column({
    type: 'enum',
    enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PLANNING'
  })
  status: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updatedAt: Date;
}
