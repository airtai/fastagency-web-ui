import React, { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { JsonSchema } from '../interfaces/models';
import { TextInput } from './form/TextInput';
import { SelectInput } from './form/SelectInput';
import { validateForm } from '../services/commonService';
import NotificationBox from '../components/NotificationBox';
import { object } from 'zod';

interface DynamicFormBuilderProps {
  jsonSchema: JsonSchema;
  validationURL: string;
  onSuccessCallback: (data: any) => void;
}

const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({ jsonSchema, validationURL, onSuccessCallback }) => {
  const { formData, handleChange } = useForm(jsonSchema);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const response = await validateForm(formData, validationURL);
      setError(null);
      onSuccessCallback(response);
    } catch (error: any) {
      setError(error.message);
      console.log(JSON.parse(error.message));
      console.log(typeof JSON.parse(error.message));
    }
    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-9 p-6.5'>
        {Object.entries(jsonSchema.properties).map(([key, property]) =>
          property?.enum?.length === 1 ? null : (
            <div key={key} className='w-full'>
              <label htmlFor={key}>{property.title}</label>
              {property.enum ? (
                <SelectInput
                  id={key}
                  value={formData[key]}
                  options={property.enum}
                  onChange={(value) => handleChange(key, value)}
                />
              ) : (
                <TextInput
                  id={key}
                  value={formData[key]}
                  placeholder={property.description || ''}
                  onChange={(value) => handleChange(key, value)}
                />
              )}
            </div>
          )
        )}
        <div className='col-span-full'>
          <button
            type='submit'
            className='rounded-md px-3.5 py-2.5 text-sm bg-airt-primary text-airt-font-base hover:bg-opacity-85 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            disabled={isLoading}
            data-testid='form-submit-button'
          >
            Submit
          </button>
        </div>
      </form>
      {error && <NotificationBox type={'error'} onClick={() => setError(null)} message={error} />}
    </>
  );
};

export default DynamicFormBuilder;
