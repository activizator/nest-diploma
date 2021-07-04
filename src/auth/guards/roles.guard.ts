import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const auth = headers.authorization;
    const jwt = auth.replace('Bearer ', '');
    const payload = this.jwtService.decode(jwt, { json: true }) as {
      email: string;
      name: string;
      role: string;
    };
    const role = payload.role;
    if (role !== 'admin') {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Доступ с данной ролью запрещен',
        },
        403,
      );
    }
    return role == 'admin';
  }
}

@Injectable()
export class ManagerRoleGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const auth = headers.authorization;
    const jwt = auth.replace('Bearer ', '');
    const payload = this.jwtService.decode(jwt, { json: true }) as {
      email: string;
      name: string;
      role: string;
    };
    const role = payload.role;
    if (role !== 'manager') {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Доступ с данной ролью запрещен',
        },
        403,
      );
    }
    return role == 'manager';
  }
}
