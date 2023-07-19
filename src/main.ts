import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';



async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  //using dot env globally
  const configService = app.get<ConfigService>(ConfigService)

  //use dot env port
  const port = configService.get<string>('PORT')

  //applies the validation pipe to all routes and controllers, including third-party libraries and external endpoints.
  app.useGlobalPipes(new ValidationPipe());

  //access public folder
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');



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
      origin: true,
      methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
      //enables the inclusion of credentials (such as cookies or HTTP authentication) in cross-origin requests.
      credentials: true,
      preflightContinue: false
    }
  )

  //set up cookies
  app.use(cookieParser())

  await app.listen(port);
}
bootstrap();
