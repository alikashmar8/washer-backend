import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceRequest } from './service-request.entity';
import { ServiceType } from 'src/service-types/entities/service-type.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';

@Entity('order_items')
export class ServiceRequestItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false, type: 'decimal', default: 0 })
  price: number;

  @Column({ nullable: false })
  serviceRequestId: number;

  @Column({ nullable: true })
  vehicleId?: string;

  @Column({ nullable: false })
  typeId: string;

  // TODO: check deleting product logic // protect or cascade ?
  @ManyToOne((type) => ServiceType, (type) => type.serviceRequests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'typeId' })
  type: ServiceType;

  @ManyToOne((type) => Vehicle, (v) => v.requests, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'vehicleId' })
  vehicle?: Vehicle;

  @ManyToOne(
    (type) => ServiceRequest,
    (serviceRequest) => serviceRequest.serviceRequestItems,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'serviceRequestId' })
  serviceRequest: ServiceRequest;
}
