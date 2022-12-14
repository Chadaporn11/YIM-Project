/* eslint-disable prettier/prettier */
import { Group } from 'src/group/entities/group.entity';
import { Role } from 'src/rolse/role.enum';
import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  img: string;

  @Column({ type: 'enum', enum: Role, default: Role.User})
  roles: Role;
  
  @ManyToOne(() => User, (user) => user.directReports, { onDelete: 'SET NULL' })
  userCreate: User;

  @OneToMany(() => User, (user) => user.userCreate)
  directReports: User[];

  @OneToMany(() => Task, (tasks) => tasks.user, { onDelete: 'SET NULL' })
  tasks: Task[];

  @OneToMany(() => Group, (groups) => groups.user, { onDelete: 'CASCADE' })
  groups: Group[];
}
