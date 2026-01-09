declare module 'avro-js' {
  export interface Type {
    fromBuffer(buffer: Buffer): unknown;
    toBuffer?(value: unknown): Buffer;
  }

  export function parse(schema: unknown): Type;
}



