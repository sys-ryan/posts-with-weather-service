import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { of, lastValueFrom } from 'rxjs';
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

  it('날씨 정보를 Weather API로부터 성공적으로 fecth 한다.', async () => {
    const data = await service.fetchWeather('30', '127');
    console.log(data);
  });
});
