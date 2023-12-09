import { ServiceType } from 'src/service-types/entities/service-type.entity';
import { Vehicle } from 'src/vehicles/entities/vehicle.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServiceRequest } from './service-request.entity';

@Entity('service_request_items')
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

  @ManyToOne((type) => ServiceType, (type) => type.serviceRequestItems, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'typeId' })
  type: ServiceType;

  @ManyToOne((type) => Vehicle, (v) => v.requestItems, {
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
