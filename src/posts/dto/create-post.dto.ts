import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '게시글 제목' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;

  @ApiProperty({ description: '게시글 내용' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  @ApiProperty({ description: '게시글 비밀번호' })
  @IsString()
  @Matches(/^(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{6,20}$/)
  password: string;

  @ApiProperty({ description: '게시글 작성자가 위치한 장소의 위도' })
  @IsNumber()
  lat: number;

  @ApiProperty({ description: '게시글 작성자가 위치한 장소의 경도' })
  @IsNumber()
  lng: number;
}
