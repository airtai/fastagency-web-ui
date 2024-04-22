import { useState, useEffect } from 'react';
import { JsonSchema } from '../interfaces/ModelInterfaces';

export const useForm = (jsonSchema: JsonSchema) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const initialValues: { [key: string]: any } = {};
    Object.keys(jsonSchema.properties).forEach((key) => {
      const property = jsonSchema.properties[key];
      if (property.enum && property.enum.length === 1) {
        initialValues[key] = property.enum[0];
      } else {
        initialValues[key] = property.default ?? '';
      }
    });
    setFormData(initialValues);
    setFormErrors({}); // Reset errors on schema change
  }, [jsonSchema]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: '' })); // Clear error on change
  };

  return {
    formData,
    handleChange,
    formErrors,
    setFormErrors, // Expose this to allow setting errors from the component
  };
};
