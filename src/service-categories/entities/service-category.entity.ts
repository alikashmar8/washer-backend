import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { ServiceType } from 'src/service-types/entities/service-type.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('service-categories')
export class ServiceCategory extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'text', nullable: true })
  icon?: string;

  @Column({ default: false })
  isActive: boolean;

  @OneToMany((type) => ServiceType, (type) => type.category)
  serviceTypes: ServiceType[];
}
