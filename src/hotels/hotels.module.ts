import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './hotels.controller';
import { HotelModel, HotelRoomModel } from './hotels.models';
import { TypegooseModule } from 'nestjs-typegoose';
import { HotelRoomService } from './hotel.room.service';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { getJWTConfig } from 'src/config/jwt.config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [HotelsService, HotelRoomService, JwtStrategy],
  controllers: [HotelsController],
  imports: [
    AuthModule,
    TypegooseModule.forFeature([
      {
        typegooseClass: HotelModel,
        schemaOptions: {
          collection: 'Hotel',
        },
      },
      {
        typegooseClass: HotelRoomModel,
        schemaOptions: {
          collection: 'HotelRoom',
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
  exports: [HotelsService, HotelRoomService],
})
export class HotelsModule {}
