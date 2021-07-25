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
    try {
      const request = context.switchToHttp().getRequest();
      const headers = request.headers;
      const auth = headers.authorization;
      const payload = this.uIdService.getUser(auth);
      const role = payload.role;
      return role == 'admin';
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Доступ с данной ролью запрещен',
        },
        403,
      );
    }
  }
}

@Injectable()
export class ManagerRoleGuard implements CanActivate {
  constructor(private readonly uIdService: UIdService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const headers = request.headers;
      const auth = headers.authorization;
      const payload = this.uIdService.getUser(auth);
      const role = payload.role;
      return role == 'manager';
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Доступ с данной ролью запрещен',
        },
        403,
      );
    }
  }
}

@Injectable()
export class ClientRoleGuard implements CanActivate {
  constructor(private readonly uIdService: UIdService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const headers = request.headers;
      const auth = headers.authorization;
      const payload = this.uIdService.getUser(auth);
      const role = payload.role;
      return role == 'client';
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Доступ с данной ролью запрещен',
        },
        403,
      );
    }
  }
}

@Injectable()
export class ManagerOrClientRoleGuard implements CanActivate {
  constructor(private readonly uIdService: UIdService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const headers = request.headers;
      const auth = headers.authorization;
      const payload = this.uIdService.getUser(auth);
      const role = payload.role;
      if (role == 'client' || role == 'manager') {
        return true;
      } else {
        return false;
      }
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Доступ с данной ролью запрещен',
        },
        403,
      );
    }
  }
}
