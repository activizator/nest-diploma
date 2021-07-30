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

  @UseGuards(JwtAuthGuard)
  @UseGuards(ManagerRoleGuard)
  @Get('/manager/reservations/:userId')
  async managerGetClientReservation(@Param() params) {
    const userId = params.userId;
    const filter = { user: userId, dateStart: undefined, dateEnd: undefined };
    return await this.reservationsService.getReservations(filter);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(ClientRoleGuard)
  @Delete('/client/reservations/:id')
  async removeClientReservation(@Param() params, @Headers() headers) {
    const user = await this.uIdService.getUser(headers.authorization);
    const u = await this.userService.findByEmail(user.email);
    const userId = u.id;
    return await this.reservationsService.removeReservation(userId, params.id);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(ManagerRoleGuard)
  @Delete('/manager/reservations/:userId/:reservationId')
  async managerRemoveClientReservation(@Param() params) {
    return await this.reservationsService.removeReservation(
      params.userId,
      params.reservationId,
    );
  }
}
