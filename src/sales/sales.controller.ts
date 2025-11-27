import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sales')
@UseGuards(JwtAuthGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  async create(@Body() createSaleDto: CreateSaleDto, @Request() req) {
    return this.salesService.create(createSaleDto, req.user.userId);
  }

  @Get()
  async findAll() {
    return this.salesService.findAll();
  }

  @Get('my-sales')
  async findMySales(@Request() req) {
  return this.salesService.findByUser(req.user.userId);
}

  @Get('total')
  async getTotalSales() {
    const total = await this.salesService.getTotalSales();
    return { total };
  }

  @Get('by-date-range')
  async getSalesByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.salesService.getSalesByDateRange(start, end);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSaleDto: Partial<CreateSaleDto>,
  ) {
    return this.salesService.update(id, updateSaleDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.salesService.delete(id);
    return { message: 'Venta eliminada correctamente' };
  }
}