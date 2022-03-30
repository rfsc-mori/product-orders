import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class TimestampTrackedEntity {
  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
