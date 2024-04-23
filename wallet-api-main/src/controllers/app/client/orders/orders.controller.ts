import { Request, Response } from 'express';
import { Controller, Body, Res, HttpStatus, Post, UseGuards, SetMetadata, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto';
import { AuthGuard } from 'src/controllers/auth/auth.guard';
import { Constants } from 'src/utils';

@Controller('api/client/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @SetMetadata('role', Constants.LEVELS.CLIENT)
  @UseGuards(AuthGuard)
  async create(@Body() body: CreateOrderDto, @Req() req: Request, @Res() res: Response) {
    try {
      const response = await this.ordersService.create(body, req);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }
}
