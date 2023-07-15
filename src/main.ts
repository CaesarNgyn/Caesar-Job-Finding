import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //using dot env globally
  const configService = app.get<ConfigService>(ConfigService)

  //use dot env port
  const port = configService.get<string>('PORT')

  //applies the validation pipe to all routes and controllers, including third-party libraries and external endpoints.
  app.useGlobalPipes(new ValidationPipe());



  //use jwt validation globally
  const reflector = app.get(Reflector)
  app.useGlobalGuards(new JwtAuthGuard(reflector))

  //use transform interceptor globally
  app.useGlobalInterceptors(new TransformInterceptor(reflector));


  //use versioning to have different versions of controllers or individual routes running within the same application
  app.setGlobalPrefix('api')
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', '2'],

  });
  //config cors
  app.enableCors(
    {
      origin: [
        'http://localhost:3000',
        'http://127.0.0.1:3000'
      ],
      methods: ["GET", "POST"],
    }
  )

  //set up cookies
  app.use(cookieParser())

  await app.listen(port);
}
bootstrap();
