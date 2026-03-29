import type { JsonValue } from './typeGenerator';

/**
 * Replaces string values with a random mock string.
 */
function randomString(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Recursively replaces primitive values with random mock equivalents.
 */
export function randomizeData(json: JsonValue): JsonValue {
  if (json === null) {
    return null;
  }
  if (Array.isArray(json)) {
    return json.map(item => randomizeData(item));
  }
  if (typeof json === 'object') {
    const newObj: Record<string, JsonValue> = {};
    for (const [key, value] of Object.entries(json)) {
      newObj[key] = randomizeData(value);
    }
    return newObj;
  }
  if (typeof json === 'string') {
    // Basic heuristic to generate somewhat realistic looking random strings
    if (json.includes('@')) return `user_${Math.floor(Math.random() * 1000)}@example.com`;
    if (json.length > 20) return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    return randomString();
  }
  if (typeof json === 'number') {
    return Math.floor(Math.random() * 1000);
  }
  if (typeof json === 'boolean') {
    return Math.random() > 0.5;
  }
  return json;
}
