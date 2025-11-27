import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sale } from './schemas/sale.schema';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { SaleItemsService } from '../sale-items/sale-items.service';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Sale.name) private saleModel: Model<Sale>,
    private saleItemsService: SaleItemsService,
  ) {}

  async create(createSaleDto: CreateSaleDto, userId: string): Promise<Sale> {
    const { items, ...saleData } = createSaleDto;

    // Crear la venta
    const newSale = new this.saleModel({
      ...saleData,
      vendedor_id: userId,
      fechaVenta: createSaleDto.fechaVenta || new Date(),
      estado: createSaleDto.estado || 'completada',
    });

    const savedSale = await newSale.save();

    // Crear los items de la venta
    if (items && items.length > 0) {
      await this.saleItemsService.createMany(String(savedSale._id), items);
    }

    return savedSale;
  }

  async findAll(): Promise<Sale[]> {
    return this.saleModel
      .find()
      .populate('vendedor_id', 'username email nombreCompleto')
      .sort({ fechaVenta: -1 })
      .exec();
  }

  async findOne(id: string): Promise<any> {
    const sale = await this.saleModel
      .findById(id)
      .populate('vendedor_id', 'username email nombreCompleto')
      .exec();

    if (!sale) {
      throw new NotFoundException('Venta no encontrada');
    }

    // Obtener los items de la venta
    const items = await this.saleItemsService.findBySaleId(id);

    return {
      ...sale.toObject(),
      items,
    };
  }

  async findByUser(userId: string): Promise<Sale[]> {
    return this.saleModel
      .find({ vendedor_id: userId })
      .sort({ fechaVenta: -1 })
      .exec();
  }

  async update(id: string, updateData: Partial<CreateSaleDto>): Promise<Sale> {
    const { items, ...saleData } = updateData;

    const updatedSale = await this.saleModel
      .findByIdAndUpdate(id, saleData, { new: true })
      .exec();

    if (!updatedSale) {
      throw new NotFoundException('Venta no encontrada');
    }

    // Si se actualizan los items, eliminar los viejos y crear los nuevos
    if (items && items.length > 0) {
      await this.saleItemsService.deleteBySaleId(id);
      await this.saleItemsService.createMany(String(updatedSale._id), items);
    }

    return updatedSale;
  }

  async delete(id: string): Promise<void> {
    // Primero eliminar los items
    await this.saleItemsService.deleteBySaleId(id);

    // Luego eliminar la venta
    const result = await this.saleModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Venta no encontrada');
    }
  }

  // Métodos adicionales útiles
  async getTotalSales(): Promise<number> {
    const result = await this.saleModel.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    return this.saleModel
      .find({
        fechaVenta: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate('vendedor_id', 'username email nombreCompleto')
      .sort({ fechaVenta: -1 })
      .exec();
  }
}