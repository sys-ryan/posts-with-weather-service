import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WeatherService } from '../weather/weather.service';
import { Repository } from 'typeorm';
import { Posts } from './entities/post.entity';
import { PostsService } from './posts.service';
import { Weather } from 'src/weather/entities/weather.entity';
import { NotFoundException } from '@nestjs/common';

const weathers: Partial<Weather>[] = [];
const posts: Posts[] = [];

const mockPostRepository = () => {
  return {
    create: jest.fn().mockImplementation((post) => post),
    save: jest.fn().mockImplementation((post) => {
      const savedPost = {
        ...post,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      posts.push(savedPost);

      return savedPost;
    }),
    find: jest.fn().mockImplementation(() => posts),
    findOne: jest.fn().mockImplementation((query) => {
      const where = query.where;

      let existingPost: Posts;

      if (where.id) {
        posts.forEach((post) => {
          if (post.id === where.id) {
            existingPost = post;
          }
        });
      }

      return existingPost;
    }),
    remove: jest.fn().mockImplementation((toBeDeletedPost: Posts) => {
      let itemIndex = -1;

      posts.forEach((post, index) => {
        console.log(post.id, toBeDeletedPost.id);
        if (post.id === toBeDeletedPost.id) {
          itemIndex = index;
        }
      });

      console.log(posts);
      console.log(itemIndex);

      if (itemIndex < 0) {
        return;
      }

      posts.splice(itemIndex, 1);
    }),
  };
};

const mockWeatherService = () => ({
  saveCurrentWeather: jest.fn().mockImplementation(() => {
    const weather = {
      id: 1,
      text: 'Sunny',
      icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
      code: 1000,
    } as Weather;
    weathers.push(weather);
    posts[0].weather = weather;
  }),
});

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: Repository<Posts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: getRepositoryToken(Posts),
          useValue: mockPostRepository(),
        },
        {
          provide: WeatherService,
          useValue: mockWeatherService(),
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get(getRepositoryToken(Posts));
  });

  afterEach(async () => {
    posts.splice(0, posts.length);
    weathers.splice(0, weathers.length);
  });

  const defalutPostObject = {
    title: 'this is the title',
    content: 'hello world',
    password: 'tester123',
    lat: 30,
    lng: 127,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('게시글 생성 성공 검증', async () => {
    await service.create(defalutPostObject);

    const posts = await postRepository.find();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toEqual('this is the title');
    expect(posts[0].weather).toBeDefined();
    expect(posts[0].weather.code).toEqual(1000);

    expect(weathers).toHaveLength(1);
    expect(weathers[0].code).toEqual(1000);
  });

  it('게시글 생성시 비밀번호 암호화 검증', async () => {
    const password = 'tester123';
    await service.create({
      ...defalutPostObject,
      password,
    });

    const post = await postRepository.findOne({ where: { id: 1 } });

    expect(post).toBeDefined();
    expect(post.password).not.toEqual(password);
  });

  it('게시글 리스트 조회 성공 검증', async () => {
    const postLength = 3;
    for (let i = 0; i < postLength; i++) {
      await service.create({
        ...defalutPostObject,
        title: `this is the title ${i + 1}`,
      });
    }

    const result = await service.findAll(0, 20);
    expect(result.data).toHaveLength(postLength);
  });

  it('게시글 조회 성공 검증', async () => {
    const postTitlte = `this is the title`;
    await service.create({
      title: postTitlte,
      content: 'hello world',
      password: 'tester123',
      lat: 30,
      lng: 127,
    });

    const post = await service.findOne(1);
    expect(post).toBeDefined();
    expect(post.title).toEqual(postTitlte);
  });

  it('존재하지 않는 게시글 id로 조회시 Exception 검증', async () => {
    await service.create(defalutPostObject);

    await expect(service.findOne(999)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('게시글 수정 성공 검증', async () => {
    const originalTitle = 'old title';
    await service.create({
      ...defalutPostObject,
      title: originalTitle,
    });

    const newTitle = 'new title';
    await service.update(1, {
      ...defalutPostObject,
      title: newTitle,
    });

    const updatedPost = await postRepository.findOne({ where: { id: 1 } });

    expect(updatedPost.title).not.toEqual(originalTitle);
  });

  it('존재하지 않는 게시글 id로 수정 요청시 Exception 검증', async () => {
    await service.create(defalutPostObject);

    await expect(service.update(999, defalutPostObject)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('게시글 삭제 성공 검증', async () => {
    await service.create(defalutPostObject);

    await service.remove(1);

    const result = await service.findAll(0, 20);
    const posts = result.data;

    expect(posts).toHaveLength(0);
  });

  it('존재하지 않는 게시글 id로 삭제 요청시 Exception 검증', async () => {
    await service.create(defalutPostObject);

    await expect(service.remove(999)).rejects.toBeInstanceOf(NotFoundException);
  });
});
