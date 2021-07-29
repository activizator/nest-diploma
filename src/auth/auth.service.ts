import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { compareSync } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(login: string, password: string): Promise<boolean> {
    const user = await this.userService.findByEmail(login);
    if (!user) {
      throw new UnauthorizedException('Неверное имя пользователя');
    }
    const isCorrectPass = compareSync(password, user.passwordHash);
    if (!isCorrectPass) {
      throw new UnauthorizedException('Неверный пароль');
    }
    return true;
  }

  async loginUser(email: string) {
    const user = await this.userService.findByEmail(email);
    const payload = {
      email: user.email,
      name: user.name,
      role: user.role,
      id: user.id,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
