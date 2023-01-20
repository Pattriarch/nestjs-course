import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { UserDto } from '../src/auth/dto/user.dto';

const loginDto: UserDto = {
	login: 'aaa@aa.aa',
	password: 'secret'
}

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		// создание тстового модуля
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/login (POST) - success', () => {
		return request(app.getHttpServer())
			.post('/login')
			.send(loginDto)
			.expect(200, {
				statusCode: 200
			})
	});

	it('/auth/login (POST) - fail', () => {
		return request(app.getHttpServer())
			.post('/login')
			.expect(401, {
				statusCode: 401
			});
	});

	afterAll(() => {
		disconnect();
	});
});
