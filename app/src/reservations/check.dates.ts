import { HttpException, HttpStatus } from '@nestjs/common';

export class CheckDates {
  check(date: string, reservedDates: { dateStart; dateEnd }) {
    const d1 = new Date(date).getTime();
    const dS = new Date(reservedDates.dateStart).getTime();
    const dE = new Date(reservedDates.dateEnd).getTime();
    if (d1 >= dS && d1 <= dE) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
        },
        400,
      );
    }
    return true;
  }
}
