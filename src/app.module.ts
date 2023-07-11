import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin, SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CompaniesModule } from './companies/companies.module';



@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
      dbName: configService.get<string>('DB_NAME'),
      connectionFactory: (connection) => {
        connection.plugin(softDeletePlugin);
        return connection;
      }
    }),


    inject: [ConfigService],
  }),
    UsersModule,
    AuthModule,
    CompaniesModule],
  controllers: [AppController],
  providers: [
    AppService,

  ],
})
export class AppModule { }
