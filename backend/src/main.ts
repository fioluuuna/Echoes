import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  // 设置全局路由前缀
  app.setGlobalPrefix('api');

  // 启用CORS
  // 启用CORS
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
    // 设置请求体大小限制（50MB），解决 "request entity too large" 问题
  app.use(require('express').json({ limit: '50mb' }));
  app.use(require('express').urlencoded({ limit: '50mb', extended: true }));
  await app.listen(port);
  console.log(`🚀 心灵奇记后端服务已启动: http://localhost:${port}`);
}
bootstrap();
