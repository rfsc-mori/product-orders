import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinColumn } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { Order } from "../order/order.entity";
import { Category } from "../category/category.entity";

@Entity()
export class Product extends TimestampTrackedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: false })
  title: string;

  @Column('decimal', { precision: 10, scale: 4, nullable: false })
  price: number;

  @Column({ nullable: false })
  available_quantity: number;

  @ManyToOne(type => Category, category => category.products, {
    nullable: false
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToMany(type => Order, order => order.products)
  orders: Order[];
}
