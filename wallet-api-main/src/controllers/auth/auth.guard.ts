import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthGuardService } from './guard/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly authService: AuthGuardService,
    private reflector: Reflector,
    ) {}

  private onError() {
    return new UnauthorizedException('Debe iniciar sesión');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<number>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const fromUrl = this.extractTokenFromUrl(request);
    const fromHeader = this.extractTokenFromHeader(request);
    const token = fromHeader || fromUrl;
    if (!token) throw this.onError();

    try {
      const payload = await this.jwtService.verifyAsync(token, { secret: process.env.JWT_PRIVATE_KEY });
      const user = await this.authService.getProfile(payload.uid);

      if (!!role && payload.lid !== role) throw this.onError();

      payload.user = user;
      payload.accessToken = token;
      request['currentUser'] = payload;

    } catch (error) {
      console.log(error)
      throw this.onError();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromUrl(request: Request): string | undefined {
    return String(request.query?.token);
  }
}