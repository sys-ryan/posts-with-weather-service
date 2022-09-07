import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupApp = (app: any) => {
  const PORT = process.env.PORT || 3000;
  const prefix = '/api/v1';

  app.setGlobalPrefix(prefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  const docsConfig = new DocumentBuilder()
    .setTitle('Posts with Weather Service')
    .setDescription('비밀 포스트와 포스트 작성당시 날씨 정보를 제공하는 서비스')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, docsConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, document);
};
