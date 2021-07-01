import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';

@Controller('/api/')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  //   Доступ
  // Доступно только пользователям с ролью admin.

  // Ошибки
  // 401 - если пользоватьель не аутентифицирован
  // 403 - если роль пользоватьель не admin
  @Post('/admin/users/')
  async addUser(@Body() body) {
    const data = body;
    return await this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/admin/users/')
  async findAUsers(
    @Query('email') email?,
    @Query('limit') limit?,
    @Query('offset') offset?,
    @Query('name') name?,
    @Query('contactPhone') contactPhone?,
  ) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    const params = { email, limit, offset, name, contactPhone };
    return await this.userService.findAll(params);
  }

  @Get('/manager/users/')
  async findMUsers(
    @Query('email') email?,
    @Query('limit') limit?,
    @Query('offset') offset?,
    @Query('name') name?,
    @Query('contactPhone') contactPhone?,
  ) {
    limit = limit ? parseInt(limit) : 100;
    offset = offset ? parseInt(offset) : 0;
    const params = { email, limit, offset, name, contactPhone };
    return await this.userService.findAll(params);
  }
}
