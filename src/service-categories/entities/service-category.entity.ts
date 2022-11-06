import { ServiceType } from 'src/service-types/entities/service-type.entity';
import {
    BaseEntity, Column,
    Entity,
    OneToMany, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('service-categories')
export class ServiceCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon?: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany((type) => ServiceType, (type) => type.category)
  serviceTypes: ServiceType[];
}
