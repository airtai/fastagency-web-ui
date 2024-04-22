// interfaces/models.ts
export interface JsonSchemaProperty {
  default?: string;
  description: string;
  enum?: string[];
  title: string;
  type: string;
  const?: string;
  format?: string;
  maxLength?: number;
  minLength?: number;
}

export interface JsonSchema {
  properties: Record<string, JsonSchemaProperty>;
  required: string[];
  title: string;
  type: string;
}

export interface Schema {
  name: string;
  json_schema: JsonSchema;
}

export interface ModelSchema {
  schemas: Schema[];
}

export type UpdateExistingModelType = {
  model: string;
  base_url: string;
  api_type: string;
  api_version?: string;
  uuid: string;
};
