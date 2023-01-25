import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { TopPageModelDto } from './dto/create-top-page.dto';
import { addDays } from 'date-fns';

@Injectable()
export class TopPageService {
	constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>) {
	}

	async create(dto: TopPageModelDto) {
		return this.topPageModel.create(dto);
	}

	async findById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async findByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	// тк вся модель не нужна, мы можем выбрать поля для передачи дальше
	// нам нужен alias и title
	async findByCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel.find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 }).exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: TopPageModelDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto);
	}

	async findForHhUpdate(date: Date) {
		// 0 - по Enum выбираем Courses
		// $lt - lesser than (меньше чем)
		return this.topPageModel.find({  firstCategory: 0, 'hh.updatedAt': { $lt: addDays(date, -1) } }).exec();
	}
}
