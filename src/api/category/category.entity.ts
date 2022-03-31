import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { ProductEntity } from "../product/product.entity";

@Entity('category')
export class CategoryEntity extends TimestampTrackedEntity {
  @PrimaryColumn({ length: 32 })
  id: string;

  @Column({ unique: true, length: 255, nullable: false })
  name: string;

  @OneToMany(type => ProductEntity, product => product.category)
  products: ProductEntity[];
}
