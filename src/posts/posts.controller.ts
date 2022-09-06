import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { SecretPostGuard } from 'src/guard/secret-post.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Serialize(PostResponseDto)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Serialize(PostResponseDto)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  @Serialize(PostResponseDto)
  @Patch(':id')
  @UseGuards(SecretPostGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(SecretPostGuard)
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
