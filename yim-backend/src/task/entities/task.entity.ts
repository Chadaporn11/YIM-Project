/* eslint-disable prettier/prettier */
import { IsNotEmpty } from 'class-validator';
import { Group } from 'src/group/entities/group.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ default: '' })
  name: string;
  @Column({ default: false })
  state: boolean;


  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Group, (group) => group.tasks, { onDelete: 'CASCADE' })
  group: Group;
}
