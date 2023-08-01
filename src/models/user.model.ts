import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: () => "CURRENT_TIMESTAMP" })
  date: Date;

  @Column({ nullable: true })
  stripeCustomerId: string;

  @BeforeInsert()
  async beforeInsert() {
    this.id = uuidv4();
  }
}
