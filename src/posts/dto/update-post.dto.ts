import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

/**
 * 게시글 수정을 위한 DTO
 */
export class UpdatePostDto {
  @ApiProperty({ description: '게시글 제목' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsOptional()
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  content: string;

  @ApiProperty({ description: '게시글 비밀번호' })
  @IsString()
  @Matches(/^(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{6,20}$/)
  password: string;
}
