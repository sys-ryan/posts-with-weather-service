import { ApiProperty } from '@nestjs/swagger';
import { Weather } from '../../weather/entities/weather.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Posts {
  @ApiProperty({ description: '게시글 id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '게시글 제목' })
  @Column({
    type: 'varchar',
    length: 20,
    comment: '해당 컬럼은 게시글의 제목을 나타냅니다.',
  })
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  @Column({
    type: 'varchar',
    length: 200,
    comment: '해당 컬럼은 게시글의 내용을 나타냅니다.',
  })
  content: string;

  @ApiProperty({ description: '게시글 비밀번호' })
  @Column({
    type: 'varchar',
    length: 255,
    comment: '해당 컬럼은 게시글의 비밀번호를 나타냅니다.',
  })
  password: string;

  @ApiProperty({ description: '게시글 생성 시간' })
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    comment: '해당 컬럼은 게시글의 생성 시간을 나타냅니다.',
  })
  createdAt: Date;

  @ApiProperty({ description: '게시글 수정 시간' })
  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    comment: '해당 컬럼은 게시글의 수정 시간을 나타냅니다.',
  })
  updatedAt: Date;

  @ApiProperty({ description: '게시글 생성 시점의 날씨 정보' })
  @OneToOne(() => Weather, (weather) => weather.post)
  @JoinColumn()
  weather: Weather;
}
