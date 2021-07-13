import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/config/jwt.config';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy],
  imports: [
    forwardRef(() => AuthModule),
    TypegooseModule.forFeature([
      {
        typegooseClass: UserModel,
        schemaOptions: {
          collection: 'User',
        },
      },
    ]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJWTConfig,
    }),
    PassportModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
