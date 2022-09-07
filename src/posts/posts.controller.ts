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
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SecretPostGuard } from '../guard/secret-post.guard';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Posts } from './entities/post.entity';
import { PostsListResponseDto } from './dto/posts-list.dto';

@Controller('posts')
@ApiTags('Users API')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({
    summary: '게시글 생성 API',
    description: '게시글을 생성합니다.',
  })
  @ApiCreatedResponse({ description: '게시글을 생성합니다.' })
  create(@Body() createPostDto: CreatePostDto): Promise<void> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({
    summary: '게시글 목록 조회 API',
    description: '게시글 목록을 조회합니다.',
  })
  @ApiOkResponse({
    description: '게시글 목록을 조회합니다.',
    type: PostsListResponseDto,
  })
  findAll(
    @Query('offset') offset: number,
    @Query('size') size: number,
  ): Promise<PostsListResponseDto> {
    if (!offset) offset = 0;
    if (!size) size = 20;
    return this.postsService.findAll(+offset, +size);
  }

  @Get(':id')
  @ApiOperation({
    summary: '게시글 조회 API',
    description: '게시글을 조회합니다.',
  })
  @ApiOkResponse({ description: '게시글을 조회합니다.', type: Posts })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

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
