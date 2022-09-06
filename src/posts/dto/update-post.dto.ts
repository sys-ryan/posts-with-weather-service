import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsOptional()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  @IsOptional()
  content: string;

  @IsString()
  @Matches(/^(?=.*\d)[A-Za-z\d~!@#$%^&*()+|=]{6,20}$/)
  @IsOptional()
  password: string;
}
