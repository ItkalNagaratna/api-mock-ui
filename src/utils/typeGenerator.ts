export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface GeneratorOptions {
  interfaceName?: string;
  schemaName?: string;
  endpoint?: string;
}

/**
 * Capitalizes the first letter of a string.
 */
function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Infers the TypeScript type of a given JSON value.
 */
function inferType(value: JsonValue): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'any[]';
    const elementType = inferType(value[0]);
    return `${elementType}[]`;
  }
  if (typeof value === 'object') {
    return 'Record<string, any>';
  }
  return typeof value;
}

/**
 * Generates a TypeScript interface from a JSON object.
 */
export function generateTypeScript(json: Record<string, JsonValue>, interfaceName: string = 'ApiResponse'): string {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    return `export type ${interfaceName} = ${inferType(json)};`;
  }

  const interfaces: string[] = [];
  const seenNames = new Set<string>();

  function traverse(obj: Record<string, JsonValue>, name: string): string {
    const props = [];
    for (const [key, value] of Object.entries(obj)) {
      const normalizedKey = key.includes('-') || key.includes(' ') ? `"${key}"` : key;
      
      if (value === null) {
        props.push(`  ${normalizedKey}: null;`);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          props.push(`  ${normalizedKey}: any[];`);
        } else if (typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
          const childName = capitalize(key);
          if (!seenNames.has(childName)) {
            seenNames.add(childName);
            traverse(value[0] as Record<string, JsonValue>, childName);
          }
          props.push(`  ${normalizedKey}: ${childName}[];`);
        } else {
          props.push(`  ${normalizedKey}: ${inferType(value[0])}[];`);
        }
      } else if (typeof value === 'object') {
        const childName = capitalize(key);
        if (!seenNames.has(childName)) {
          seenNames.add(childName);
          traverse(value as Record<string, JsonValue>, childName);
        }
        props.push(`  ${normalizedKey}: ${childName};`);
      } else {
        props.push(`  ${normalizedKey}: ${typeof value};`);
      }
    }
    const interfaceStr = `export interface ${name} {\n${props.join('\n')}\n}`;
    interfaces.unshift(interfaceStr);
    return name;
  }

  traverse(json, interfaceName);
  return interfaces.join('\n\n');
}

/**
 * Generates a Zod schema from a JSON object.
 */
export function generateZodSchema(json: Record<string, JsonValue>, schemaName: string = 'apiResponseSchema'): string {
  if (typeof json !== 'object' || json === null || Array.isArray(json)) {
    return `import { z } from 'zod';\n\nexport const ${schemaName} = z.any();`;
  }

  const schemas: string[] = [];
  const seenNames = new Set<string>();
  
  function inferZodType(value: JsonValue): string {
    if (value === null) return 'z.null()';
    if (typeof value === 'string') return 'z.string()';
    if (typeof value === 'number') return 'z.number()';
    if (typeof value === 'boolean') return 'z.boolean()';
    return 'z.any()';
  }

  function traverse(obj: Record<string, JsonValue>, name: string): string {
    const props = [];
    for (const [key, value] of Object.entries(obj)) {
      const normalizedKey = key.includes('-') || key.includes(' ') ? `"${key}"` : key;

      if (value === null) {
        props.push(`  ${normalizedKey}: z.null(),`);
      } else if (Array.isArray(value)) {
        if (value.length === 0) {
          props.push(`  ${normalizedKey}: z.array(z.any()),`);
        } else if (typeof value[0] === 'object' && value[0] !== null && !Array.isArray(value[0])) {
          const childName = capitalize(key) + 'Schema';
          if (!seenNames.has(childName)) {
            seenNames.add(childName);
            traverse(value[0] as Record<string, JsonValue>, childName);
          }
          props.push(`  ${normalizedKey}: z.array(${childName}),`);
        } else {
          props.push(`  ${normalizedKey}: z.array(${inferZodType(value[0])}),`);
        }
      } else if (typeof value === 'object') {
        const childName = capitalize(key) + 'Schema';
        if (!seenNames.has(childName)) {
          seenNames.add(childName);
          traverse(value as Record<string, JsonValue>, childName);
        }
        props.push(`  ${normalizedKey}: ${childName},`);
      } else {
        props.push(`  ${normalizedKey}: z.${typeof value}(),`);
      }
    }
    const schemaStr = `export const ${name} = z.object({\n${props.join('\n')}\n});`;
    schemas.unshift(schemaStr);
    return name;
  }

  traverse(json, schemaName);
  return `import { z } from 'zod';\n\n` + schemas.join('\n\n');
}

/**
 * Generates an MSW handler from a JSON object.
 */
export function generateMswHandler(json: Record<string, JsonValue>, endpoint: string = '/api/endpoint'): string {
  const jsonString = JSON.stringify(json, null, 2);
  return `import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('${endpoint}', () => {
    return HttpResponse.json(${jsonString.split('\n').join('\n    ')});
  })
];`;
}
