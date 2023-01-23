import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from '../review/review.model/review.model';

@Injectable()
export class ProductService {
	constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {
	}

	async create(dto: CreateProductDto) {
		return this.productModel.create(dto);
	}

	async findById(id: string) {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto) {
		// 3 параметр у update позволяет задать параметры
		// по умолчанию возвращается предыдущая модель (до выполнения update)
		// поэтому здесь мы задаем параметр возврата новой модели
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
	}

	async findWithReviews(dto: FindProductDto) {
		return await this.productModel.aggregate([
			{
				$match: {
					categories: dto.category
				}
			},
			{
				$sort: {
					_id: 1
				}
			},
			{
				$limit: dto.limit
			},
			{
				$lookup: {
					from: 'Review',
					localField: '_id',
					foreignField: 'productId',
					as: 'reviews' // алиас для выведенного поля
				}
			},
			{
				$addFields: {
					// $review - ссылаемся на поле из $lookup выше
					reviewCount: { $size: '$reviews' },
					// ссылаемся на поле рейтинг из модели ревьюшки
					reviewAvg: { $avg: '$reviews.rating' },
					reviews: {
						$function: {
							body: `function (reviews) {
								reviews.sort((a, b) => new Date(b.createdAt)  - new Date(a.createdAt));
								return reviews;
							}`,
							args: ['$reviews'],
							lang: 'js'
						}
					}
				}
			}
		]).exec() as (ProductModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[];
	}
}
