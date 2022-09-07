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
    title: 'hello 🇰🇷',
    content: '🇺🇸 USA',
    password: 'tester123',
    lat: 30,
    lng: 120,
  };

  describe('게시글 생성', () => {
    it('title, content에 이모지 저장 검증', async () => {
      let response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send(defaultPostObject);
      expect(response.statusCode).toEqual(201);

      response = await request(app.getHttpServer()).get('/api/v1/posts');
      expect(response.statusCode).toEqual(200);

      const post: Posts = response.body.data[0];
      expect(post.title.includes('🇰🇷')).toBe(true);
      expect(post.content.includes('🇺🇸')).toBe(true);
    });

    it('title이 20자 이상일 경우 생성 실패 검증', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
          title:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Nunc ullamcorper eleifend pretium. Donec fringilla nisi id erat laoreet, eget facilisis nisl posuere. Vivamus ac diam sed arcu tincidunt vehicula. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
        });

      expect(response.statusCode).toBe(400);
    });

    it('content가 200자 이상일 경우 생성 실패 검증', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
          content:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at facilisis urna. Curabitur laoreet condimentum sem nec blandit. In enim enim, laoreet eget viverra et, bibendum ac nisi. Donec pharetra nec tortor porta fermentum. Nulla non orci pellentesque ante sollicitudin pharetra dictum in turpis. Sed dignissim risus luctus mollis dictum.',
        });

      expect(response.statusCode).toBe(400);
    });

    it('비밀번호 정책 (6자리 이상, 숫자 1개 이상 반드시 포함) 위반시 생성 실패 검증', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/posts')
        .send({
          ...defaultPostObject,
          password: '1234',
        });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('게시글 조회', () => {
    it('게시글 리스트 조회시 Default pageneation option (offset=0, size=20) 적용 검증', async () => {
      const response = await request(app.getHttpServer()).get('/api/v1/posts');
      expect(response.statusCode).toBe(200);
      expect(response.body.meta.offset).toBe(0);
      expect(response.body.meta.size).toBe(20);
    });
  });

  describe('게시글 수정', () => {
    it('잘못된 비밀번호로 게시글 수정 요청시 exception 검증', async () => {
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

  describe('게시글 삭제', () => {
    it('잘못된 비밀번호로 게시글 삭제 요청시 exception 검증', async () => {
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
