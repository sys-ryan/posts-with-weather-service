import { Post } from 'src/posts/entities/post.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Weather {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  text: string;

  @Column()
  icon: string;

  @Column()
  code: number;

  @OneToOne(() => Post, (post) => post.weather)
  post: Post;
}
