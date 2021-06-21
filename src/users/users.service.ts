import { Injectable } from '@nestjs/common';

// interface SearchUserParams {
//   limit: number;
//   offset: number;
//   email: string;
//   name: string;
//   contactPhone: string;
// }

// interface IUserService {
//   create(data: Partial<User>): Promise<User>;
//   findById(id: ID): Promise<User>;
//   findByEmail(email: string): Promise<User>;
//   findAll(params: SearchUserParams): Promoise<User[]>;
// }

// Поле role может принимать одно из следующих значений:

// client
// admin
// manager
// При поиске IUserService.findAll() поля email, name и contactPhone должны проверяться на частичное совпадение.

@Injectable()
export class UsersService {}
