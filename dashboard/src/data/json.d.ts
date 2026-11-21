// JSON files are validated with zod (schema.ts) instead of letting TypeScript infer huge literal types.
declare module "*.json" {
  const value: unknown;
  export default value;
}
