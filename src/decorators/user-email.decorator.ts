import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserEmail = createParamDecorator(
	(data: unknown, ctx: ExecutionContext) => {
		const req = ctx.switchToHttp().getRequest();
		// тк user состоит из email
		return req.user;
	}
)