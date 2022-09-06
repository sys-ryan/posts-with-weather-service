import { Expose } from 'class-transformer';

/**
 * Post 조회시 Response Serialization을 위한 DTO 입니다.
 */
export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  content: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
}
