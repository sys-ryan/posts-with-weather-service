import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Posts } from '../posts/entities/post.entity';
import { Weather } from './entities/weather.entity';
import { WeatherService } from './weather.service';

const mockWeatherRepository = () => {
  const weathers: Weather[] = [];

  return {
    create: jest.fn().mockImplementation((weather) => weather),
    save: jest.fn().mockImplementation((weather) => {
      weather.id = Math.random();
      weathers.push(weather);
      return weather;
    }),
  };
};

const mockPostRepository = () => {
  const posts: Posts[] = [
    {
      id: 1,
      title: 'test post',
      content: 'hello post',
      password: 'tester123',
      createdAt: new Date(),
      updatedAt: new Date(),
      weather: {} as Weather,
    },
  ];

  return {
    findOne: jest.fn(),
  };
};

const mockConfigService = () => ({
  get: jest.fn(),
});

const mockHttpService = () => ({
  get: jest.fn(),
});

describe('WeatherService', () => {
  let service: WeatherService;
  let weatherRepository: Repository<Weather>;
  let postRepository: Repository<Posts>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
          provide: getRepositoryToken(Weather),
          useValue: mockWeatherRepository(),
        },
        {
          provide: getRepositoryToken(Posts),
          useValue: mockPostRepository(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
        {
          provide: HttpService,
          useValue: mockHttpService(),
        },
      ],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
