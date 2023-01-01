import { BaseEntity } from "src/common/entities/base-entity.entity";
import { Column, Entity } from "typeorm";

@Entity('settings')
export class Setting extends BaseEntity {

    @Column({ nullable: false, unique: true })
    key: string;

    @Column({ nullable: true })
    value?: string;
}
