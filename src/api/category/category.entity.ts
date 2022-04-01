import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { TimestampTrackedEntity } from "../base/timestampTracked.entity";
import { ProductEntity } from "../product/product.entity";
import { IsNotEmpty, MaxLength } from "class-validator";

@Entity('category')
export class CategoryEntity extends TimestampTrackedEntity {
  @PrimaryColumn({ length: 32 })
  @IsNotEmpty()
  @MaxLength(32)
  id: string;

  @Column({ unique: true, length: 255, nullable: false })
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @OneToMany(type => ProductEntity, product => product.category)
  products: ProductEntity[];
}
