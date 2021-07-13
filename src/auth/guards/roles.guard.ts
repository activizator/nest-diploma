import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UIdService } from '../uid.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly uIdService: UIdService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const auth = headers.authorization;
    const payload = this.uIdService.getUser(auth);
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
  constructor(private readonly uIdService: UIdService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const auth = headers.authorization;
    const payload = this.uIdService.getUser(auth);
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

@Injectable()
export class ClientRoleGuard implements CanActivate {
  constructor(private readonly uIdService: UIdService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const auth = headers.authorization;
    const payload = this.uIdService.getUser(auth);
    const role = payload.role;
    if (role !== 'client') {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Доступ с данной ролью запрещен',
        },
        403,
      );
    }
    return role == 'client';
  }
}
