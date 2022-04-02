import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { UserEntity } from "../user/user.entity";
import { ProductEntity } from "../product/product.entity";

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Column,
  RelationId
} from "typeorm";

@Entity('order')
export class OrderEntity extends TimestampTrackedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => UserEntity, user => user.orders, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // id for user field (see above)
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToMany(type => ProductEntity, product => product.orders)
  @JoinTable({
    name: 'product_orders',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'product_id',
      referencedColumnName: 'id'
    }
  })
  products: ProductEntity[];

  // id for products field (see above)
  @RelationId((order: OrderEntity) => order.products)
  productIds: string[];
}
