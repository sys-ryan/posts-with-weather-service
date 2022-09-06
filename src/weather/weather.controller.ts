import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  test(@Query('lat') lat: string, @Query('lng') lng: string) {
    return this.weatherService.saveCurrentWeather(1, lat, lng);
  }
}
