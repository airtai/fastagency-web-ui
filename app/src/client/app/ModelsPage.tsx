import { useState, useEffect } from 'react';
import CustomLayout from './layout/CustomLayout';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import Button from '../components/Button';
import DynamicFormBuilder from '../components/DynamicFormBuilder';
import Loader from '../admin/common/Loader';
import { getModels } from '../services/modelService';
import { ModelSchema, JsonSchema } from '../interfaces/models';
import ModelFormContainer from '../components/ModelFormContainer';
import NotificationBox from '../components/NotificationBox';

const ModelsPage = () => {
  const [modelsSchema, setModelsSchema] = useState<ModelSchema | null>(null);
  const [initialModelSchema, setInitialModelSchema] = useState<JsonSchema | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getModels();
      setModelsSchema(response);
      setInitialModelSchema(response.schemas[0].json_schema);
    } catch (error: any) {
      setError('Something went wrong. Please try again later.');
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
            <div className='flex-col flex items-start p-6 gap-3 w-full' style={{ width: '1000px', minHeight: '600px' }}>
              <div className='flex justify-end w-full px-6.5 py-3'>
                <Button onClick={() => fetchData()} label='Add Model' />
              </div>
              <div className='flex-col flex w-full'>
                {modelsSchema && (
                  <>
                    <ModelFormContainer modelsSchema={modelsSchema} onModelChange={handleModelChange} />
                    {initialModelSchema && <DynamicFormBuilder jsonSchema={initialModelSchema} />}
                  </>
                )}
                {error && <NotificationBox type={'error'} onClick={() => setError(null)} message={error} />}
              </div>
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
