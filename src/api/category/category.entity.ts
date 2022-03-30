import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { Product } from "../product/product.entity";

@Entity()
export class Category extends TimestampTrackedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 255, nullable: false })
  name: string;

  @OneToMany(type => Product, product => product.category)
  products: Product[];
}
