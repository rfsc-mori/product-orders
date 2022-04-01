import { Entity, Column, ManyToMany, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { OrderEntity } from "../order/order.entity";
import { CategoryEntity } from "../category/category.entity";
import { IsNotEmpty, MaxLength } from "class-validator";

@Entity('product')
export class ProductEntity extends TimestampTrackedEntity {
  @PrimaryColumn({ length: 32 })
  @IsNotEmpty()
  @MaxLength(32)
  id: string;

  @Column({ length: 255, nullable: false })
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @Column('decimal', { precision: 15, scale: 4, nullable: true })
  price: number; // The price is stored as a number for simplicity as no operations takes place.

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
