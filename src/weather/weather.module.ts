import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from 'src/posts/entities/post.entity';
import { Weather } from './entities/weather.entity';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Weather, Posts]),
    ConfigModule,
    HttpModule,
  ],
  controllers: [WeatherController],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
