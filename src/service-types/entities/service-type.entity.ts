import { ServiceRequestItem } from './../../service-requests/entities/service-request-item.entity';
import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { Currency } from 'src/common/enums/currency.enum';
import { ServiceCategory } from 'src/service-categories/entities/service-category.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('service-types')
export class ServiceType extends BaseEntity {
  @Column({ type: 'text', nullable: false })
  name: string;

  @Column({ type: 'float', nullable: false })
  price: number;

  @Column({
    type: 'enum',
    enum: Currency,
    default: Currency.USD,
    nullable: false,
  })
  currency: Currency;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  showVehicleSelection: boolean;

  @Column({ default: false })
  showQuantityInput: boolean;

  @Column({ default: false })
  isMotoAllowed: boolean;

  @Column({ nullable: false })
  icon: string;

  @Column({ nullable: false })
  categoryId: string;

  
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @ManyToOne((type) => ServiceCategory, (category) => category.serviceTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: ServiceCategory;

  @OneToMany((type) => ServiceRequestItem, (req) => req.type)
  serviceRequestItems: ServiceRequestItem[];
}
