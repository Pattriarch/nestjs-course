import { AuthGuard } from '@nestjs/passport';

// мы используем более простой алиас
export class JwtAuthGuard extends AuthGuard('jwt') { }