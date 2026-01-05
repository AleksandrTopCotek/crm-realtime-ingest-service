import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { parse, type Type } from 'avro-js';
import * as path from 'path';
type TSchemaName = 'payment' | 'profile' | 'bonuse';
@Injectable()
export class SchemaService {
  private schemaCache: Partial<Record<TSchemaName, Type>> = {};

  async getSchema(schemaName: TSchemaName): Promise<Type> {
    if (!this.schemaCache[schemaName]) {
      const schemaPath = await this.resolveSchemaPath(schemaName);
      const file = await fs.readFile(schemaPath, 'utf8');
      const schemaJson: unknown = JSON.parse(file);

      this.schemaCache[schemaName] = parse(schemaJson);
    }
    return this.schemaCache[schemaName];
  }

  private async resolveSchemaPath(schemaName: TSchemaName): Promise<string> {
    const filename = `${schemaName}.avsc`;

    // In compiled code (__dirname ≈ dist/shared/services/schema) the schemas live in dist/schemas.
    const candidates = [
      path.resolve(__dirname, '..', '..', '..', 'schemas', filename), // dist/schemas/<name>.avsc
      path.resolve(process.cwd(), 'dist', 'schemas', filename), // /app/dist/schemas/<name>.avsc
      path.resolve(process.cwd(), 'src', 'schemas', filename), // dev fallback
      path.resolve(process.cwd(), 'schemas', filename), // fallback if assets copied differently
    ];

    for (const p of candidates) {
      try {
        await fs.access(p);
        return p;
      } catch {
        // try next
      }
    }

    throw new Error(`Avro schema '${schemaName}' not found. Tried: ${candidates.join(', ')}`);
  }
}
