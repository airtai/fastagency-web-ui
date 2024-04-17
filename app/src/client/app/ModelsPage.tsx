import { useState, useEffect } from 'react';
import CustomLayout from './layout/CustomLayout';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import Button from '../components/Button';
import DynamicFormBuilder from '../components/DynamicFormBuilder';
import Loader from '../admin/common/Loader';
import { getModels } from '../services/modelService';
import { ModelSchema, JsonSchema } from '../interfaces/models';
import ModelFormContainer from '../components/ModelFormContainer';

const ModelsPage = () => {
  const [modelsSchema, setModelsSchema] = useState<ModelSchema | null>(null);
  const [initialModelSchema, setInitialModelSchema] = useState<JsonSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getModels();
      setModelsSchema(response);
      setInitialModelSchema(response.schemas[0].json_schema);
    } catch (error) {
      // handle error scenario
      console.log(error);
    }
    setIsLoading(false);
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const handleModelChange = (newModel: string) => {
    const foundSchema = modelsSchema?.schemas.find((schema) => schema.name === newModel);
    if (foundSchema) {
      setInitialModelSchema(foundSchema.json_schema);
    }
  };

  return (
    <CustomLayout>
      <CustomBreadcrumb pageName='Models' />
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='flex-col flex items-start p-6 gap-3 w-full' style={{ width: '1000px', height: '600px' }}>
              <div className='flex justify-end w-full'>
                <Button onClick={() => fetchData()} label='Add Model' />
              </div>
              {modelsSchema && (
                <>
                  <ModelFormContainer modelsSchema={modelsSchema} onModelChange={handleModelChange} />
                  {initialModelSchema && <DynamicFormBuilder jsonSchema={initialModelSchema} />}
                </>
              )}
            </div>
          </div>
        </div>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-50'>
            <Loader />
          </div>
        )}
      </div>
    </CustomLayout>
  );
};

export default ModelsPage;
