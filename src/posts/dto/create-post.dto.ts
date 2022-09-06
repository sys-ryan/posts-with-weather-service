import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  content: string;

  @IsString()
  @Matches(/^(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{6,20}$/)
  password: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}
