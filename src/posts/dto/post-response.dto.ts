import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { Weather } from '../../weather/entities/weather.entity';

/**
 * Post 조회시 Response Serialization을 위한 DTO
 */
export class PostResponseDto {
  @ApiProperty({ description: '게시글 id' })
  @Expose()
  id: number;

  @ApiProperty({ description: '게시글 제목' })
  @Expose()
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  @Expose()
  content: string;

  @ApiProperty({ description: '날씨 정보' })
  @Expose()
  weather: Weather;

  @ApiProperty({ description: '게시글 생성일' })
  @Expose()
  createdAt: string;

  @ApiProperty({ description: '게시글 수정일' })
  @Expose()
  updatedAt: string;
}
