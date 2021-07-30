import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ChatService } from 'src/chat/chat.service';
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

@Injectable()
export class WSWrongClientRoleGuard implements CanActivate {
  constructor(
    private readonly uIdService: UIdService,
    private readonly chatService: ChatService,
  ) {}
  async canActivate(context): Promise<boolean> {
    const data = context.args[1].data;
    const pos = data.lastIndexOf(':');
    const id = data.slice(pos + 1).trim();
    const headers = context.args[0].handshake.headers;
    const auth = headers.authorization;
    const payload = this.uIdService.getUser(auth);
    const role = payload.role;
    const userId = payload.id;
    let userRequests = await this.chatService.findSupportRequests({
      userId,
      isActive: true,
      limit: 100,
      offset: 0,
    });
    userRequests = userRequests.map((el) => el.id + '');
    if (role == 'manager') {
      return true;
    }
    if (role == 'client' && userRequests.includes(id + '')) {
      return true;
    }
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'Доступ пользователю к данному сообщению запрещен',
      },
      403,
    );
  }
}
