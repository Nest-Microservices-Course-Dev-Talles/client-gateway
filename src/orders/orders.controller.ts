import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';
// import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { NATS_SERVICE, ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { PaginationDto } from 'src/common';
import { StatusDto } from './dto/status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get()
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      const orders = firstValueFrom(
        await this.client.send('findAllOrders', orderPaginationDto),
      );
      return orders;
    } catch (error) {
      throw new RpcException(error);
    }
    // return this.client.send('findAllOrders', orderPaginationDto).pipe(
    //   catchError((err) => {
    //     throw new RpcException(err);
    //   }),
    // );
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      const order = await firstValueFrom(this.client.send('findOneOrder', id));
      return order;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const order = await firstValueFrom(
        this.client.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status,
        }),
      );
      return order;
    } catch (error) {
      throw new RpcException(error);
      //   }),
    }
  }
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() statusDto: StatusDto) {
    try {
      return this.client.send('changeOrderStatus', {
        id,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersClient.remove(+id);
  // }
}
