import React from 'react';
import { useForm } from '../hooks/useForm';
import { JsonSchema } from '../interfaces/models';
import { TextInput } from './form/TextInput';
import { SelectInput } from './form/SelectInput';

interface DynamicFormBuilderProps {
  jsonSchema: JsonSchema;
}

const DynamicFormBuilder: React.FC<DynamicFormBuilderProps> = ({ jsonSchema }) => {
  const { formData, handleChange } = useForm(jsonSchema);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Submitted Data:', formData);
    // Add submission logic here
  };

  return (
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
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default DynamicFormBuilder;
