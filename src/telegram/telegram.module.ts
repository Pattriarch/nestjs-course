import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { ITelegramModuleAsyncOptions } from './telegram.interface';
import { TELEGRAM_MODULE_OPTIONS } from './telegram.constants';

@Global()
@Module({})
export class TelegramModule {
	// распространяется на все приложение => можно сделать глобальным
	// Global()
	static forRootAsync(options: ITelegramModuleAsyncOptions): DynamicModule {
		const asyncOptions = this.createAsyncOptionsProvider(options);
		return {
			module: TelegramModule,
			imports: options.imports,
			// чтобы попало в дерево зависимостей
			providers: [TelegramService, asyncOptions],
			exports: [TelegramService]
		}
	}

	// создание в качестве провайдера, чтобы в любом месте получить его
	// по названию провайдера
	private static createAsyncOptionsProvider(options: ITelegramModuleAsyncOptions): Provider {
		return {
			provide: TELEGRAM_MODULE_OPTIONS,
			useFactory: async (...args: any[]) => {
				return options.useFactory(...args);
			},
			// чтобы использовать в данном factory зависимости типа
			// configService, мы все это инжектим
			inject: options.inject || []
		}
	}
}
