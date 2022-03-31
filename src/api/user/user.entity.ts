import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { OrderEntity } from "../order/order.entity";

@Entity('user')
export class UserEntity extends TimestampTrackedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 260, nullable: false })
  name: string;

  @Column({ unique: true, length: 254, nullable: false })
  email: string;

  @Column('binary', { length: 60, nullable: false })
  password: Buffer;

  @OneToMany(type => OrderEntity, order => order.user)
  orders: OrderEntity[];
}
