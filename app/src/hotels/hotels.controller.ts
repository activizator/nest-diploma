import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  Body,
  Put,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import type { Types } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { HotelRoomService } from './hotel.room.service';
import { editFileName, imageFileFilter } from 'src/config/img.upload.config';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { AdminRoleGuard } from 'src/auth/guards/roles.guard';

// Если пользователь не аутентифицирован или его роль client, то при поиске всегда должен использоваться флаг isEnabled: true.
@Controller('/api/')
export class HotelsController {
  constructor(
    private readonly hotelsService: HotelsService,
    private readonly hotelRoomService: HotelRoomService,
  ) {}

  @Get('/common/hotel-rooms')
  async getAllRooms(
    @Query('hotel') hotel?: Types.ObjectId,
    @Query('limit') limit?,
    @Query('offset') offset?,
  ) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    const isEnabled = true;
    return await this.hotelRoomService.search({
      hotel,
      limit,
      offset,
      isEnabled,
    });
  }

  @Get('/common/hotel-rooms/:id')
  async getTheRoom(@Param() params) {
    return await this.hotelRoomService.findById(params.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/admin/hotels/')
  async addTheHotel(@Body() body: { title: string; description: string }) {
    const { title, description } = body;
    return await this.hotelsService.create({ title, description });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Get('/admin/hotels/')
  async findAllHotels(@Query('limit') limit?, @Query('offset') offset?) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    return await this.hotelsService.search({ limit, offset });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Put('/admin/hotels/:id')
  async changeTheHotelDesc(
    @Param() params,
    @Body() hotel: { title: string; description: string },
  ) {
    const id = params.id;
    return await this.hotelsService.update({ id, hotel });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Post('/admin/hotel-rooms/')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './rooms-imgs',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async addNewRoom(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    const { title, description, hotelId } = body;
    const images = files.map((file) => file.path);
    const isEnabled = true;
    const hotel = hotelId;
    return await this.hotelRoomService.create({
      title,
      description,
      hotel,
      images,
      isEnabled,
    });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminRoleGuard)
  @Put('/admin/hotel-rooms/:id')
  @UseInterceptors(
    FilesInterceptor('images', 20, {
      storage: diskStorage({
        destination: './rooms-imgs',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async editRoom(
    @Param() params,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    const isEnabled = true;
    const images = [];
    const im = body.images;
    Array.isArray(im) ? im.map((file) => images.push(file)) : images.push(im);
    files.map((file) => images.push(file.path));
    const id = params.id;
    const { title, description, hotelId } = body;
    const hotel = hotelId;
    return await this.hotelRoomService.update({
      id,
      title,
      description,
      hotel,
      images,
      isEnabled,
    });
  }
}
