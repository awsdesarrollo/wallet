import { Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Body, Query, Res, HttpStatus, Delete, Patch, UseInterceptors, Post, UploadedFiles, UnprocessableEntityException, Req, Param, SetMetadata, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddBalanceDto, AddPerformanceDto, CreateUserDto, FindUserDto, FindUserOrdersDto, UpdateUserDto } from './dto';
import { Constants } from 'src/utils';
import { AuthGuard } from 'src/controllers/auth/auth.guard';

@Controller('api/admin/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

	@Post()
	@UseInterceptors(AnyFilesInterceptor())
	async register(@Body() body: CreateUserDto, @Res() res: Response, @UploadedFiles() files: Array<Express.Multer.File>) {
		try {
      const response = await this.usersService.create(body, files);
			return res.status(HttpStatus.OK).json(response);

		} catch (e) {
			throw new UnprocessableEntityException(e.message);
		}
	}

  @Get()
  async findAll(@Query() query: FindUserDto, @Res() res: Response) {
    try {
      const response = await this.usersService.findAll(query);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async findOne(@Param('id') userId: number, @Res() res: Response) {
    try {
      const response = await this.usersService.findOne(userId);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Get(':id/orders')
  async findAllOrders(@Param('id') userId: number, @Query() query: FindUserOrdersDto, @Res() res: Response) {
    try {
      const response = await this.usersService.findAllOrders(userId, query);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Get(':id/movements')
  async findAllMovements(@Param('id') userId: number, @Query() query: FindUserOrdersDto, @Res() res: Response) {
    try {
      const response = await this.usersService.findAllMovements(userId, query);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Patch()
  async update(@Body() body: UpdateUserDto, @Res() res: Response) {
    try {
      const response = await this.usersService.update(body);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Post('/balance')
	@SetMetadata('role', Constants.LEVELS.ADMIN)
  @UseGuards(AuthGuard)
  async addBalance(@Body() body: AddBalanceDto, @Res() res: Response) {
    try {
      const response = await this.usersService.addBalance(body);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Post('/performance')
	@SetMetadata('role', Constants.LEVELS.ADMIN)
  @UseGuards(AuthGuard)
  async addPerformance(@Body() body: AddPerformanceDto, @Res() res: Response) {
    try {
      const response = await this.usersService.addPerformance(body);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }

  @Delete()
  async remove(@Body('id') id: number, @Res() res: Response) {
    try {
      const response = await this.usersService.remove(id);
      return res.status(HttpStatus.OK).json(response);

    } catch (error) {
      throw error;
    }
  }
}
