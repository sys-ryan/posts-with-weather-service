import { ApiProperty } from '@nestjs/swagger';
import { Posts } from '../entities/post.entity';

/**
 * 날씨 정보 데이터 타입
 */
export class Condition {
  @ApiProperty({ description: 'pagenation offset' })
  offset: number;

  @ApiProperty({ description: 'pagenation size' })
  size: number;

  @ApiProperty({ description: '응답으로 반환된 게시글 개수' })
  returnedPostCount: number;
}

/**
 * 게시글 목록 조회시 데이터 타입 정의를 위한 DTO
 */
export class PostsListResponseDto {
  @ApiProperty({ description: '게시글 리스트 데이터' })
  data: Posts[];

  @ApiProperty({ description: '게시글 리스트 페이지네이션 메타데이터' })
  meta: Condition;
}
