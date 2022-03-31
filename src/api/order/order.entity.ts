import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { UserEntity } from "../user/user.entity";
import { ProductEntity } from "../product/product.entity";

@Entity('order')
export class OrderEntity extends TimestampTrackedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => UserEntity, user => user.orders, {
    nullable: false
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

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
}
