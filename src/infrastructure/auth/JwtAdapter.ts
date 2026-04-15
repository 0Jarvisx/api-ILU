import jwt from 'jsonwebtoken';
import { ITokenPort, TokenPayload } from '@/domain/auth/ports/ITokenPort';
import env from '@/config/env';

export class JwtAdapter implements ITokenPort {
  sign(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    return decoded as unknown as TokenPayload;
  }
}
