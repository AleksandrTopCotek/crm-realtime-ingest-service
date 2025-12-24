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
      const schemaPath = path.join(__dirname, '..', 'schemas', `${schemaName}.avsc`);
      const file = await fs.readFile(schemaPath, 'utf8');
      const schemaJson: unknown = JSON.parse(file);

      this.schemaCache[schemaName] = parse(schemaJson);
    }
    return this.schemaCache[schemaName];
  }
}
