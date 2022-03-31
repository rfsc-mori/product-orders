import { Entity, Column, ManyToMany, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { OrderEntity } from "../order/order.entity";
import { CategoryEntity } from "../category/category.entity";

@Entity('product')
export class ProductEntity extends TimestampTrackedEntity {
  @PrimaryColumn({ length: 32 })
  id: string;

  @Column({ length: 255, nullable: false })
  title: string;

  @Column('decimal', { precision: 15, scale: 4, nullable: true })
  price: number;

  @Column({ nullable: false })
  available_quantity: number;

  @ManyToOne(type => CategoryEntity, category => category.products, {
    nullable: false
  })
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToMany(type => OrderEntity, order => order.products)
  orders: OrderEntity[];
}
