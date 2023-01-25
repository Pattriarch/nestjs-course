import { prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TopLevelCategory } from '../top-page.model';

export class HhDataDto {
	@IsNumber()
	count: number;

	@IsNumber()
	juniorSalary: number;

	@IsNumber()
	middleSalary: number;

	@IsNumber()
	seniorSalary: number;

	@IsDate()
	updatedAt: Date;
}

export class TopPageAdvantageDto {
	@IsString()
	title: string;

	@IsString()
	description: string;
}

export class TopPageModelDto {
	@IsEnum(TopLevelCategory)
	firstCategory: TopLevelCategory;

	@IsString()
	secondCategory: string;

	@IsString()
	alias: string;

	@IsString()
	title: string;

	@IsString()
	category: string;

	@IsOptional()
	@Type(() => HhDataDto)
	@ValidateNested()
	hh?: HhDataDto;

	@IsArray()
	@Type(() => TopPageAdvantageDto)
	@ValidateNested()
	advantages: TopPageAdvantageDto[];

	@IsString()
	seoText: string;

	@IsString()
	tagsTitle: string;

	@IsArray()
	@IsString({ each: true })
	tags: string[];
}
