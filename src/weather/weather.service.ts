import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Posts } from 'src/posts/entities/post.entity';
import { Repository } from 'typeorm';
import { Weather } from './entities/weather.entity';

interface Condition {
  text: string;
  icon: string;
  code: number;
}

@Injectable()
export class WeatherService {
  constructor(
    @InjectRepository(Weather) private weatherRepository: Repository<Weather>,
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {}

  private baseUrl = `http://api.weatherapi.com/v1/`;
  private key = this.configService.get<string>('WEATHER_API_KEY');

  /**
   * 요청된 latitude, longitude 위치의 현재 날씨를 조회합니다.
   * @param lat 위도
   * @param lng 경도
   * @returns 현재 날씨 정보
   */
  async fetchWeather(lat: string, lng: string) {
    const url = `${this.baseUrl}current.json?key=${this.key}&q=${lat},${lng}&aqi=no`;

    const response$ = this.httpService.get(url);
    const data = (await lastValueFrom(response$)).data.current
      .condition as Condition;

    return data;
  }

  /**
   * 현재 날씨 정보를 fetch하고, 게시글과 연관시켜 현재 날씨를 DB에 저장합니다.
   * @param postId 날씨 정보를 연관시킬 게시글의 id
   * @param lat 위도
   * @param lng 경도
   */
  async saveCurrentWeather(
    postId: number,
    lat: string,
    lng: string,
  ): Promise<void> {
    const { text, icon, code } = await this.fetchWeather(lat, lng);

    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found.');
    }

    const weather = await this.weatherRepository.create({
      post,
      text,
      icon,
      code,
    });

    await this.weatherRepository.save(weather);
  }
}
