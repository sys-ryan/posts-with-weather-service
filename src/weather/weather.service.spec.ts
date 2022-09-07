import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of } from 'rxjs';
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
    find: jest.fn().mockImplementation(() => weathers),
  };
};

const mockPostRepository = () => {
  const posts: Partial<Posts>[] = [
    {
      id: 1,
      title: 'test post',
      content: 'hello post',
      password: 'tester123',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  return {
    findOne: jest.fn().mockImplementation((query) => {
      const where = query.where;

      let existingPost: Partial<Posts>;

      if (where.id) {
        posts.forEach((post) => {
          if (post.id === where.id) {
            existingPost = post;
          }
        });
      }

      return existingPost;
    }),
  };
};

const mockConfigService = () => ({
  get: jest.fn(() =>
    of({
      text: 'Sunny',
      icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
      code: 100,
    }),
  ),
});

const mockHttpService = () => ({
  get: jest.fn(),
});

jest.mock('rxjs', () => {
  const original = jest.requireActual('rxjs');
  return {
    ...original,
    lastValueFrom: () => {
      return {
        data: {
          current: {
            condition: {
              text: 'Sunny',
              icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
              code: 1000,
            },
          },
        },
      };
    },
  };
});

describe('WeatherService Unit Test', () => {
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
    weatherRepository = module.get(getRepositoryToken(Weather));
    postRepository = module.get(getRepositoryToken(Posts));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('날씨 정보를 Weather API로부터 fetch 하는지 검증', async () => {
    const data = await service.fetchWeather('30', '127');

    expect(data).toBeDefined();
    expect(data.text).toEqual('Sunny');
  });

  it('날씨 정보를 저장 성공 검증', async () => {
    await service.saveCurrentWeather(1, '30', '127');
    const weathers = await weatherRepository.find();

    expect(weathers).toHaveLength(1);
    expect(weathers[0].text).toEqual('Sunny');
  });
});
