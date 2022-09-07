import { Posts } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @OneToOne(() => Posts, (post) => post.weather)
  post: Posts;
}
