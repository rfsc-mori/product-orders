import { Entity, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { User } from "../user/user.entity";
import { Product } from "../product/product.entity";

@Entity()
export class Order extends TimestampTrackedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, user => user.orders, {
    nullable: false
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(type => Product, product => product.orders)
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
  products: Product[];
}
