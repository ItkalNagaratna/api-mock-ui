import { describe, it, expect } from 'vitest';
import { generateTypeScript, generateZodSchema, generateMswHandler } from '../typeGenerator';

describe('typeGenerator', () => {
  const mockJson = {
    id: 1,
    name: 'Test',
    isActive: true,
    tags: ['a', 'b'],
    metadata: {
      key: 'value'
    }
  };

  it('generates TypeScript interfaces correctly', () => {
    const ts = generateTypeScript(mockJson, 'TestResponse');
    expect(ts).toContain('export interface TestResponse');
    expect(ts).toContain('id: number;');
    expect(ts).toContain('name: string;');
    expect(ts).toContain('isActive: boolean;');
    expect(ts).toContain('tags: string[];');
    expect(ts).toContain('metadata: Metadata;');
    expect(ts).toContain('export interface Metadata');
  });

  it('handles keys with special characters in TypeScript', () => {
    const json = { 'api-version': '1.0', 'user count': 100 };
    const ts = generateTypeScript(json, 'Special');
    expect(ts).toContain('"api-version": string;');
    expect(ts).toContain('"user count": number;');
  });

  it('generates Zod schemas correctly', () => {
    const zod = generateZodSchema(mockJson, 'testSchema');
    expect(zod).toContain("import { z } from 'zod';");
    expect(zod).toContain('export const testSchema = z.object({');
    expect(zod).toContain('id: z.number(),');
    expect(zod).toContain('metadata: MetadataSchema,');
  });

  it('generates MSW handlers correctly', () => {
    const msw = generateMswHandler(mockJson, '/api/test');
    expect(msw).toContain("import { http, HttpResponse } from 'msw';");
    expect(msw).toContain("http.get('/api/test'");
    expect(msw).toContain('return HttpResponse.json(');
  });
});
