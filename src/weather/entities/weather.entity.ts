import { ApiProperty } from '@nestjs/swagger';
import { Posts } from 'src/posts/entities/post.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Weather {
  @ApiProperty({ description: '날씨 정보 id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '날씨' })
  @Column({
    type: 'varchar',
    length: 20,
    comment: '해당 컬럼은 게시글 생성 시점의 날씨를 나타냅니다.',
  })
  text: string;

  @ApiProperty({ description: '날씨 아이콘 url' })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '해당 컬럼은 날씨 아이콘 url을 나타냅니다.',
  })
  icon: string;

  @ApiProperty({ description: '날씨 코드' })
  @Column({
    type: 'int',
    comment: '해당 컬럼은 날씨 코드를 나타냅니다.',
  })
  code: number;

  @OneToOne(() => Posts, (post) => post.weather)
  post: Posts;
}
