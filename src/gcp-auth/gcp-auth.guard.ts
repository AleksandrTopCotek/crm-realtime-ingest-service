import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { Request } from 'express';
import { HandleConfigService } from 'src/shared/services/handle-config-service/handle-config-service.service';

interface AuthRequest extends Request {
  serviceAccount?: string;
}
@Injectable()
export class GcpAuthGuard implements CanActivate {
  private client = new OAuth2Client();
  logger = new Logger();
  constructor(private readonly handleConfigService: HandleConfigService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();

    const authHeader = req.headers.authorization;
    if (!authHeader || Array.isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    const ticket = await this.client.verifyIdToken({
      idToken: token,
      audience: this.handleConfigService.getConfig('envGCPrunAud'),
    });
    this.logger.debug(`token ${token}`);
    const payload = ticket.getPayload();
    this.logger.debug(`payload ${payload?.at_hash}`);
    if (!payload?.email?.endsWith('@veli-report.iam.gserviceaccount.com')) {
      throw new UnauthorizedException('Invalid service account');
    }

    req.serviceAccount = payload.email;

    return true;
  }
}
