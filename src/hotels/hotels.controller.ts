import { Controller, Get } from '@nestjs/common';
import { HotelsService } from './hotels.service';

@Controller('/api/')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get('/common/hotel-rooms')
  getAll() {
    return this.hotelsService.findAll();
  }
}
