import { Response } from 'express';
import { Controller, Get, Body, Query, Res, HttpStatus, Patch, SetMetadata, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { FindOrderDto, UpdateOrderDto } from './dto';
import { AuthGuard } from 'src/controllers/auth/auth.guard';
import { Constants } from 'src/utils';

@Controller('api/admin/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @SetMetadata('role', Constants.LEVELS.ADMIN)
  @UseGuards(AuthGuard)
  async findAll(@Query() query: FindOrderDto, @Res() res: Response) {
    try {
      const response = await this.ordersService.findAll(query);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Patch()
  @SetMetadata('role', Constants.LEVELS.ADMIN)
  @UseGuards(AuthGuard)
  async update(@Body() body: UpdateOrderDto, @Res() res: Response) {
    try {
      const response = await this.ordersService.update(body);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }
}
