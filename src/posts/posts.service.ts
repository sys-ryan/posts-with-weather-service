import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import * as bcrypt from 'bcrypt';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private weatherService: WeatherService,
  ) {}

  /**
   * 새로운 게시글을 생성합니다.
   * @param createPostDto //
   * @returns void
   */
  async create(createPostDto: CreatePostDto): Promise<void> {
    const { title, content, lat, lng } = createPostDto;

    const saltOrRounds = 10;
    const password = await bcrypt.hash(createPostDto.password, saltOrRounds);

    const post = await this.postRepository.create({
      title,
      content,
      password,
    });

    const savedPost = await this.postRepository.save(post);

    await this.weatherService.saveCurrentWeather(
      savedPost.id,
      lat.toString(),
      lng.toString(),
    );

    return;
  }

  /**
   * 게시글 리스트를 조회합니다.
   * @returns Post 배열
   */
  async findAll(offset: number, size: number): Promise<any> {
    const posts = await this.postRepository.find({
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
      relations: ['weather'],
      order: {
        createdAt: 'DESC', // 게시글을 최신 글 순서대로 확인
      },
      skip: offset,
      take: size,
    });

    return {
      data: posts,
      meta: {
        offset,
        size,
        returnedPostCount: posts.length,
      },
    };
  }

  /**
   * 게시글 id로 게시글을 조회합니다.
   * @param id 게시글 id
   * @returns Post
   */
  async findOne(id: number): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException('Post not foudn.');
    }

    return post;
  }

  /**
   * 제출된 id를 가진 게시글을 수정합니다.
   * @param id 게시글 id
   * @param updatePostDto { title, content, password }
   * @returns 수정된 게시글
   */
  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOne({ where: { id } });

    // 제출된 id를 가지는 게시글이 없을시 예외 처리
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }
    if (updatePostDto.content) {
      post.content = updatePostDto.content;
    }
    if (updatePostDto.password) {
      const saltOrRounds = 10;
      const password = await bcrypt.hash(updatePostDto.password, saltOrRounds);
      post.password = password;
    }

    await this.postRepository.save(post);

    // 수정된 게시글을 반환
    const updatedPost = await this.postRepository.findOne({ where: { id } });
    return updatedPost;
  }

  /**
   * 제출된 id를 가지는 게시글을 삭제합니다.
   * @param id 개시글 id
   * @returns void
   */
  async remove(id: number): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });

    // 제출된 id를 가지는 게시글이 없는 경우 예외 처리
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    await this.postRepository.remove(post);
    return;
  }
}
