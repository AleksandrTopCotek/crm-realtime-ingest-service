import { Injectable, Logger } from '@nestjs/common';
import { parse, type Type } from 'avro-js';

type SchemaByIdResponse = { schema: string };

@Injectable()
export class SchemaRegistryService {
  private readonly logger = new Logger(SchemaRegistryService.name);
  private readonly cache = new Map<number, Type>();

  async decodeConfluentAvro(buffer: Buffer): Promise<{ schemaId: number; decoded: unknown }> {
    if (buffer.length < 6) {
      throw new Error(`Message too small for Confluent Avro framing (len=${buffer.length})`);
    }
    const magic = buffer.readUInt8(0);
    if (magic !== 0) {
      throw new Error(`Unsupported magic byte ${magic}; expected 0 for Confluent Avro`);
    }
    const schemaId = buffer.readUInt32BE(1);
    const payload = buffer.subarray(5);

    const schemaType = await this.getTypeById(schemaId);
    const decoded = schemaType.fromBuffer(payload);
    return { schemaId, decoded };
  }

  async getTypeById(schemaId: number): Promise<Type> {
    const cached = this.cache.get(schemaId);
    if (cached) return cached;

    const schemaStr = await this.fetchSchemaById(schemaId);
    const schemaJson: unknown = JSON.parse(schemaStr);
    const type = parse(schemaJson);
    this.cache.set(schemaId, type);
    return type;
  }

  private getRegistryUrls(): string[] {
    const urlsRaw =
      process.env.SCHEMA_REGISTRY_URLS ??
      process.env.SCHEMA_REGISTRY_URL ??
      'https://kafka01-public.prod05.hrzn.io';

    return urlsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((u) => u.replace(/\/+$/, ''));
  }

  private async fetchSchemaById(schemaId: number): Promise<string> {
    const urls = this.getRegistryUrls();
    const authUser = process.env.SCHEMA_REGISTRY_USERNAME ?? '';
    const authPass = process.env.SCHEMA_REGISTRY_PASSWORD ?? '';
    const headers: Record<string, string> = { Accept: 'application/vnd.schemaregistry.v1+json' };
    if (authUser && authPass) {
      const token = Buffer.from(`${authUser}:${authPass}`, 'utf8').toString('base64');
      headers.Authorization = `Basic ${token}`;
    }

    let lastErr: unknown;
    for (const baseUrl of urls) {
      const url = `${baseUrl}/schemas/ids/${schemaId}`;
      try {
        const res = await fetch(url, { method: 'GET', headers });
        if (!res.ok) {
          const body = await res.text().catch(() => '');
          throw new Error(`SchemaRegistry ${url} HTTP ${res.status} ${res.statusText} ${body}`.trim());
        }
        const json = (await res.json()) as SchemaByIdResponse;
        if (!json?.schema) {
          throw new Error(`SchemaRegistry ${url} returned no 'schema' field`);
        }
        return json.schema;
      } catch (e) {
        lastErr = e;
        this.logger.warn(`SchemaRegistry fetch failed for ${url}: ${String(e)}`);
      }
    }
    throw new Error(`Failed to fetch schema id=${schemaId} from any Schema Registry URL: ${String(lastErr)}`);
  }
}


