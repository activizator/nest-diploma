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
} from '@nestjs/common';
import { HotelsService } from './hotels.service';
import type { Types } from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

// Ограничения
// Если пользователь не аутентифицирован или его роль client, то при поиске всегда должен использоваться флаг isEnabled: true.

const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

const editFileName = (req, file, callback) => {
  const name = file.originalname.split('.')[0];
  const fileExtName = extname(file.originalname);
  const randomName = Array(4)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  callback(null, `${name}-${randomName}${fileExtName}`);
};

@Controller('/api/')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('/common/hotel-rooms')
  async getAllRooms(
    @Query('hotel') hotel?: Types.ObjectId,
    @Query('limit') limit?,
    @Query('offset') offset?,
  ) {
    const lim = limit ? parseInt(limit) : 100;
    const off = offset ? parseInt(offset) : 0;
    return await this.hotelsService.findAllRooms(hotel, lim, off);
  }

  @Get('/common/hotel-rooms/:id')
  async getTheRoom(@Param() params) {
    return await this.hotelsService.findTheRoom(params.id);
  }

  @Post('/admin/hotels/')
  //   Доступ
  // Доступно только аутентифицированным пользователям с ролью admin.

  // Ошибки
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не admin
  async addTheHotel(@Body() body: { title: string; description: string }) {
    return await this.hotelsService.addNewHotel(body.title, body.description);
  }

  @Get('/admin/hotels/')
  //   Доступ
  // Доступно только аутентифицированным пользователям с ролью admin.

  // Ошибки
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не admin
  async findAllHotels(@Query('limit') limit?, @Query('offset') offset?) {
    const lim = limit ? parseInt(limit) : 100;
    const off = offset ? parseInt(offset) : 0;
    return await this.hotelsService.findAllHotels(lim, off);
  }

  @Put('/admin/hotels/:id')
  //   Доступ
  // Доступно только аутентифицированным пользователям с ролью admin.

  // Ошибки
  // 401 - если пользователь не аутентифицирован
  // 403 - если роль пользователя не admin
  async changeTheHotelDesc(
    @Param() params,
    @Body() hotel: { title: string; description: string },
  ) {
    return await this.hotelsService.changeTheHotelDesc(params.id, hotel);
  }

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
    const isEnabled = true;

    console.log(files);
    return await this.hotelsService.addNewRoom(
      body.title,
      body.description,
      body.hotelId,
      files.map((file) => file.path),
      isEnabled,
    );
  }
}
