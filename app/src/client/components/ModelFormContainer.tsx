// components/ModelFormContainer.tsx
import React from 'react';
import { ModelSchema } from '../interfaces/models';

interface ModelFormContainerProps {
  modelsSchema: ModelSchema;
  onModelChange: (selectedModel: string) => void;
}

const ModelFormContainer: React.FC<ModelFormContainerProps> = ({ modelsSchema, onModelChange }) => {
  return (
    <div className='flex flex-col gap-9'>
      <div className='flex flex-col gap-5.5 px-6.5'>
        <label className='mb-3 block text-black dark:text-white'>Select Model</label>
        <div className='relative z-20 bg-white dark:bg-form-input'>
          <select
            className='w-full rounded border bg-transparent py-3 px-12 outline-none focus:border-primary'
            onChange={(e) => onModelChange(e.target.value)}
          >
            {modelsSchema.schemas.map((schema) => (
              <option key={schema.name} value={schema.name}>
                {schema.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ModelFormContainer;
