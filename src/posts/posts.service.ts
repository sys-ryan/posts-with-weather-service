import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  /**
   * 새로운 게시글을 생성합니다.
   * @param createPostDto //
   * @returns void
   */
  async create(createPostDto: CreatePostDto): Promise<void> {
    const { title, content } = createPostDto;

    const saltOrRounds = 10;
    const password = await bcrypt.hash(createPostDto.password, saltOrRounds);

    const post = await this.postRepository.create({
      title,
      content,
      password,
    });

    await this.postRepository.save(post);

    return;
  }

  /**
   * 게시글 리스트를 조회합니다.
   * @returns Post 배열
   */
  async findAll(): Promise<Post[]> {
    const users = await this.postRepository.find();

    return users;
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

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
