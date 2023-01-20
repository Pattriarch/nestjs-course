import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserModel } from './model/user-model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { compare, genSalt, hash } from 'bcryptjs';
import { USER_NOT_FOUND_ERROR, WRONG_PASSWORD_ERROR } from './auth.constants';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(UserModel) private readonly userModel: ModelType<UserModel>,
		private readonly jwtService: JwtService
	) { }

	async createUser(dto: UserDto) {
		const salt = await genSalt(10);
		const newUser = new this.userModel({
			email: dto.login,
			passwordHash: await hash(dto.password, salt)
		});
		// save - сохраняет в БД
		return newUser.save();
	}

	async findUser(email: string) {
		return this.userModel.findOne({ email }).exec();
	}

	// Pick - возвращаем одно свойство из модели - email
	async validateUser(email: string, password: string): Promise<Pick<UserModel, 'email'>> {
		const user = await this.findUser(email);

		// пользователя нет
		if (!user) {
			throw new UnauthorizedException(USER_NOT_FOUND_ERROR);
		}

		// пользовать есть, но не совпадает пароль
		const isCorrectPassword = await compare(password, user.passwordHash);
		if (!isCorrectPassword) {
			throw new UnauthorizedException(WRONG_PASSWORD_ERROR);
		}

		// пользователь есть
		return { email: user.email }
	}

	// шифровать jwt будем при помощи email
	async login(email: string) {
		const payload = { email };
		return {
			access_token: await this.jwtService.signAsync(payload)
		}
	}
}
