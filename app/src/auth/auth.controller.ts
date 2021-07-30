import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() user: { email: string; password: string }) {
    const isValidUser = await this.authService.validateUser(
      user.email,
      user.password,
    );
    if (isValidUser) return await this.authService.loginUser(user.email);
  }
}
