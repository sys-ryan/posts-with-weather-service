import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { setupApp } from './setup-app';
import { Posts } from 'src/posts/entities/post.entity';

describe('Posts (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;

  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  const defaultPostObject = {
    title: 'hello ๐ฐ๐ท',
    content: '๐บ๐ธ USA',
    password: 'tester123',
    lat: 30,
    lng: 120,
  };

  describe('๊ฒ์๊ธ ์์ฑ', () => {
    it('title, content์ ์ด๋ชจ์ง ์ ์ฅ ๊ฒ์ฆ', async () => {
      let response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send(defaultPostObject);
      expect(response.statusCode).toEqual(201);

      response = await request(app.getHttpServer()).get('/api/v1/posts');
      expect(response.statusCode).toEqual(200);

      const post: Posts = response.body.data[0];
      expect(post.title.includes('๐ฐ๐ท')).toBe(true);
      expect(post.content.includes('๐บ๐ธ')).toBe(true);
    });

    it('title์ด 20์ ์ด์์ผ ๊ฒฝ์ฐ ์์ฑ ์คํจ ๊ฒ์ฆ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
          title:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Nunc ullamcorper eleifend pretium. Donec fringilla nisi id erat laoreet, eget facilisis nisl posuere. Vivamus ac diam sed arcu tincidunt vehicula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        });

      expect(response.statusCode).toBe(400);
    });

    it('content๊ฐ 200์ ์ด์์ผ ๊ฒฝ์ฐ ์์ฑ ์คํจ ๊ฒ์ฆ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum.',
        });

      expect(response.statusCode).toBe(400);
    });

    it('๋น๋ฐ๋ฒํธ ์ ์ฑ (6์๋ฆฌ ์ด์, ์ซ์ 1๊ฐ ์ด์ ๋ฐ๋์ ํฌํจ) ์๋ฐ์ ์์ฑ ์คํจ ๊ฒ์ฆ', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
          password: '1234',
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('๊ฒ์๊ธ ์กฐํ', () => {
    it('๊ฒ์๊ธ ๋ฆฌ์คํธ ์กฐํ์ Default pageneation option (offset=0, size=20) ์ ์ฉ ๊ฒ์ฆ', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/posts');
      expect(response.statusCode).toBe(200);
      expect(response.body.meta.offset).toBe(0);
      expect(response.body.meta.size).toBe(20);
    });
  });

  describe('๊ฒ์๊ธ ์์ ', () => {
    it('์๋ชป๋ ๋น๋ฐ๋ฒํธ๋ก ๊ฒ์๊ธ ์์  ์์ฒญ์ exception ๊ฒ์ฆ', async () => {
      let response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
        });

      response = await request(app.getHttpServer()).get('/api/v1/posts');
      const post = response.body.data[0];

      response = await request(app.getHttpServer())
        .patch(`/api/v1/posts/${post.id}`)
        .send({
          title: 'new title',
          password: 'wrong-password',
        });

      expect(response.statusCode).toBe(403);
    });
  });

  describe('๊ฒ์๊ธ ์ญ์ ', () => {
    it('์๋ชป๋ ๋น๋ฐ๋ฒํธ๋ก ๊ฒ์๊ธ ์ญ์  ์์ฒญ์ exception ๊ฒ์ฆ', async () => {
      let response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
        });

      response = await request(app.getHttpServer()).get('/api/v1/posts');
      const post = response.body.data[0];

      response = await request(app.getHttpServer())
        .delete(`/api/v1/posts/${post.id}`)
        .send({
          password: 'wrong-password',
        });

      expect(response.statusCode).toBe(403);
    });
  });
});
