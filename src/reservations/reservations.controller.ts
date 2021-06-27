import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';

@Controller('/api/')
export class ReservationsController {
  //   constructor(private readonly reservationsService: ReservationsService) {}
  //   @Post('/client/reservations')
  //   async createClientReservation(@Body() body) {
  //     // Доступ
  //     // Доступно только аутентифицированным пользователям с ролью client.
  //     // Ошибки
  //     // 401 - если пользователь не аутентифицирован
  //     // 403 - если роль пользователя не client
  //     // 400 - если номер с указанным ID не существует или отключен
  //     const { hotelRoom, startDate, endDate } = body;
  //     // data = interface ReservationDto {
  //     //     user: ID;
  //     //     hotel: ID;
  //     //     room: ID;
  //     //     dateStart: Date;
  //     //     dateEnd: Date;
  //     //   } передать в сервис боди, а там сделать подсервис для обогащения данных до dto
  //     return await this.reservationsService.addReservation(data);
  //   }
  //   @Get('/client/reservations')
  //   async getClientReservation() {
  //     // Доступ
  //     // Доступно только аутентифицированным пользователям с ролью client.
  //     // Ошибки
  //     // 401 - если пользователь не аутентифицирован
  //     // 403 - если роль пользователя не client
  //     const filter = { user, dateStart: Date, dateEnd: Date }
  //     return await this.reservationsService.getReservations(filter);
  //   }
  //   @Delete('/client/reservations/:id')
  //   async removeClientReservation(@Param() params) {
  //     return await this.reservationsService.removeReservation(params.id);
  //   }
}
