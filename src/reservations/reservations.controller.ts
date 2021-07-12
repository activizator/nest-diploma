import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Headers,
  Param,
  Query,
} from '@nestjs/common';
import { UIdService } from 'src/auth/uid.service';
import { UsersService } from 'src/users/users.service';
import { ID } from './reservations.interfaces';
import { ReservationsService } from './reservations.service';

@Controller('/api/')
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly uIdService: UIdService,
    private readonly userService: UsersService,
  ) {}

  @Post('/client/reservations')
  async createClientReservation(@Body() body, @Headers() headers) {
    // Доступ
    // Доступно только аутентифицированным пользователям с ролью client.
    // Ошибки
    // 401 - если пользователь не аутентифицирован
    // 403 - если роль пользователя не client
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

  @Get('/client/reservations')
  async getClientReservation(
    @Headers() headers,
    @Query('dateStart') dateStart?,
    @Query('dateEnd') dateEnd?,
  ) {
    // Доступ
    // Доступно только аутентифицированным пользователям с ролью client.
    // Ошибки
    // 401 - если пользователь не аутентифицирован
    // 403 - если роль пользователя не client
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    const userId = u.id;
    const filter = { user: userId, dateStart, dateEnd };
    return await this.reservationsService.getReservations(filter);
  }

  // @Delete('/client/reservations/:id')
  // async removeClientReservation(@Param() params) {
  //   return await this.reservationsService.removeReservation(params.id);
  // }
}
