// src/prisma/prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;

  constructor(configService: ConfigService) {
    const databaseUrl = configService.get<string>('DATABASE_URL');
    if (!databaseUrl) {
      // Prisma v7 client engine requires either `adapter` or `accelerateUrl`.
      // For Postgres we use `@prisma/adapter-pg` which needs a valid DATABASE_URL.
      throw new Error('DATABASE_URL is not set (required for Prisma Postgres adapter)');
    }

    const ssl = PrismaService.resolvePgSslOptions(databaseUrl, configService);
    const pool = new Pool({
      connectionString: databaseUrl,
      ssl,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
  }

  private static resolvePgSslOptions(
    databaseUrl: string,
    configService: ConfigService,
  ): false | { rejectUnauthorized: boolean } {
    // Priority:
    // 1) explicit env overrides
    // 2) DATABASE_URL query params (e.g. ?sslmode=require)
    // 3) default: no SSL

    const envSsl = configService.get<string>('DATABASE_SSL');
    const envRejectUnauthorized = configService.get<string>('DATABASE_SSL_REJECT_UNAUTHORIZED');

    const parseBool = (v?: string): boolean | undefined => {
      if (v === undefined) return undefined;
      const norm = v.trim().toLowerCase();
      if (['1', 'true', 'yes', 'y', 'on'].includes(norm)) return true;
      if (['0', 'false', 'no', 'n', 'off'].includes(norm)) return false;
      return undefined;
    };

    const sslFromEnv = parseBool(envSsl);
    const rejectUnauthorizedFromEnv = parseBool(envRejectUnauthorized);

    let sslRequiredFromUrl: boolean | undefined;
    try {
      const u = new URL(databaseUrl);
      const sslmode = u.searchParams.get('sslmode')?.toLowerCase();
      // Common Postgres conventions (even if not all drivers support them natively).
      if (sslmode === 'disable') sslRequiredFromUrl = false;
      if (sslmode === 'require' || sslmode === 'verify-ca' || sslmode === 'verify-full') {
        sslRequiredFromUrl = true;
      }

      // Some providers use ?ssl=true / ?ssl=1
      const sslParam = parseBool(u.searchParams.get('ssl') ?? undefined);
      if (sslParam !== undefined) sslRequiredFromUrl = sslParam;
    } catch {
      // If DATABASE_URL isn't URL-parseable (should be), fall back to env only.
    }

    const sslRequired = sslFromEnv ?? sslRequiredFromUrl ?? false;
    if (!sslRequired) return false;

    // Secure-by-default: verify certificates unless explicitly disabled.
    const rejectUnauthorized = rejectUnauthorizedFromEnv ?? true;
    return { rejectUnauthorized };
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
