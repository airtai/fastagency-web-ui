// hooks/useForm.ts
import { useState, useEffect } from 'react';
import { JsonSchema } from '../interfaces/models';

export const useForm = (jsonSchema: JsonSchema) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const initialValues: { [key: string]: any } = {};
    Object.keys(jsonSchema.properties).forEach((key) => {
      // Ensure every field starts with a defined value, use an empty string as a fallback
      initialValues[key] = jsonSchema.properties[key].default ?? '';
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
