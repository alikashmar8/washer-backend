import { BaseEntity } from 'src/common/entities/base-entity.entity';
import { Currency } from 'src/common/enums/currency.enum';
import { ServiceCategory } from 'src/service-categories/entities/service-category.entity';
import { ServiceRequest } from 'src/service-requests/entities/service-request.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
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

  @Column({ nullable: false })
  icon: string;

  @Column({ nullable: false })
  categoryId: string;

  @ManyToOne((type) => ServiceCategory, (category) => category.serviceTypes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: ServiceCategory;

  @OneToMany((type) => ServiceRequest, (req) => req.type)
  serviceRequests: ServiceRequest[];
}
