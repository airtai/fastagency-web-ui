import { useState } from 'react';
import CustomLayout from './layout/CustomLayout';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import Button from '../components/Button';
import { getModels } from 'wasp/client/operations';

interface JsonSchemaProperty {
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

interface JsonSchema {
  properties: Record<string, JsonSchemaProperty>;
  required: string[];
  title: string;
  type: string;
}

interface Schema {
  name: string;
  json_schema: JsonSchema;
}

interface ModelSchema {
  schemas: Schema[];
}

const ModelsPage = () => {
  const [modelsSchema, setModelsSchema] = useState<ModelSchema | null>(null);
  const logout = async () => {
    const response = await getModels();
    setModelsSchema(response);
  };
  return (
    <CustomLayout>
      <CustomBreadcrumb pageName='Models' />
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div
              className='flex-col flex items-start justify-between p-6 gap-3 w-full'
              style={{ width: '1000px', height: '600px' }}
            >
              <Button onClick={logout} label='Add Model' />
              <p>{modelsSchema?.schemas.map((schema: any) => schema.name)}</p>
            </div>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default ModelsPage;
