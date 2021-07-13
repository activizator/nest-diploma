import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Headers,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ClientRoleGuard, ManagerRoleGuard } from 'src/auth/guards/roles.guard';
import { UIdService } from 'src/auth/uid.service';
import { UsersService } from 'src/users/users.service';
import { ReservationsService } from './reservations.service';

@Controller('/api/')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly uIdService: UIdService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(ClientRoleGuard)
  @Post('/client/reservations')
  async createClientReservation(@Body() body, @Headers() headers) {
    // Доступ
    // 400 - если номер с указанным ID не существует или отключен
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    const userId = u.id;
    const { hotelRoom, startDate, endDate } = body;
    return await this.reservationsService.addReservation({
      hotelRoom,
      startDate,
      endDate,
      user: userId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(ClientRoleGuard)
  @Get('/client/reservations')
  async getClientReservation(
    @Headers() headers,
    @Query('dateStart') dateStart?,
    @Query('dateEnd') dateEnd?,
  ) {
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    const userId = u.id;
    const filter = { user: userId, dateStart, dateEnd };
    return await this.reservationsService.getReservations(filter);
  }

  //   Ошибки
  // 400 - если бронь с указанным ID для пользователя с указанным ID не существует
  @UseGuards(JwtAuthGuard)
  @UseGuards(ManagerRoleGuard)
  @Delete('/client/reservations/:id')
  async removeClientReservation(@Param() params) {
    return await this.reservationsService.removeReservation(params.id);
  }
}
