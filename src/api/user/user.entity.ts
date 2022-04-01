import { Entity, Column, PrimaryGeneratedColumn, OneToMany, BeforeInsert } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { OrderEntity } from "../order/order.entity";

import * as argon2 from 'argon2';

@Entity('user')
export class UserEntity extends TimestampTrackedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 260, nullable: false })
  name: string;

  @Column({ unique: true, length: 254, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @OneToMany(type => OrderEntity, order => order.user)
  orders: OrderEntity[];
}
