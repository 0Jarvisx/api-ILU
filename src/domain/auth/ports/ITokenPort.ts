import { RoleName } from '@/domain/auth/User';

export interface TokenPayload {
  sub: number;
  email: string;
  role: RoleName;
}

export interface ITokenPort {
  sign(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}
