import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReviewModel } from '../review/review.model/review.model';
import { TopPageModel } from './top-page.model/top-page.model';

@Module({
	controllers: [TopPageController],
	providers: [ConfigService],
	imports: [
		TypegooseModule.forFeature([
			{
				typegooseClass: TopPageModel,
				schemaOptions: {
					collection: 'TopPage'
				}
			}
		])
	]
})
export class TopPageModule {
}
