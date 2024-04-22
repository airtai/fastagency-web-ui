// src/components/ModelForm.tsx
import React from 'react';
import { JsonSchema, Model, ModelSchemas } from '../interfaces/ModelInterfaces';

import ModelFormContainer from './ModelFormContainer';
import DynamicFormBuilder from './DynamicFormBuilder';

interface ModelFormProps {
  modelSchemas: ModelSchemas;
  initialModelSchema: JsonSchema | null;
  selectedModel: string;
  updateExistingModel: Model | null;
  onModelChange: (model: string) => void;
  onSuccessCallback: (data: any) => void;
  onCancelCallback: () => void;
}

const ModelForm: React.FC<ModelFormProps> = ({
  modelSchemas,
  initialModelSchema,
  selectedModel,
  updateExistingModel,
  onModelChange,
  onSuccessCallback,
  onCancelCallback,
}) => {
  return (
    <div>
      {modelSchemas && (
        <>
          {updateExistingModel && <h2 className='text-lg font-semibold text-airt-primary'>Update model</h2>}
          {!updateExistingModel && (
            <ModelFormContainer selectedModel={null} modelSchemas={modelSchemas} onModelChange={onModelChange} />
          )}
          {initialModelSchema && (
            <DynamicFormBuilder
              jsonSchema={initialModelSchema}
              validationURL={`models/llms/${selectedModel}/validate`}
              updateExistingModel={updateExistingModel ?? null}
              onSuccessCallback={onSuccessCallback}
              onCancelCallback={onCancelCallback}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ModelForm;
