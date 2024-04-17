// hooks/useForm.ts
import { useState, useEffect } from 'react';
import { JsonSchema } from '../interfaces/models';

export const useForm = (jsonSchema: JsonSchema) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const initialValues: { [key: string]: any } = {};
    Object.keys(jsonSchema.properties).forEach((key) => {
      const property = jsonSchema.properties[key];
      // Check for enum with exactly one value and set it, otherwise use default or fallback to an empty string
      if (property.enum && property.enum.length === 1) {
        initialValues[key] = property.enum[0]; // Auto-set single enum value
      } else {
        initialValues[key] = property.default ?? ''; // Use default or empty string if no default
      }
    });
    setFormData(initialValues);
  }, [jsonSchema]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    formData,
    handleChange,
  };
};
