import { ProductModel } from '../../product/product.model/product.model';

export const enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products
}

export class TopPageModel {
	_id: string;
	firstCategory: TopLevelCategory;
	secondCategory: string;
	title: string;
	category: string;
	hh?: {
		count: number;
		juniorSalary: number;
		middleSalary: number;
		seniorSalary: number;
	}
	advantages: {
		title: string
		description: string
	}[];
	seoText: string;
	tags: string[];
	tagsTitle: string;
	products: ProductModel[];
}
