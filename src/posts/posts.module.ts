import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posts } from './entities/post.entity';
import { WeatherModule } from 'src/weather/weather.module';

@Module({
  imports: [TypeOrmModule.forFeature([Posts]), WeatherModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
