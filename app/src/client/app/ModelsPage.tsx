import { useState } from 'react';
import { getModels, useQuery, updateUserModels } from 'wasp/client/operations';

import CustomLayout from './layout/CustomLayout';
import CustomBreadcrumb from '../components/CustomBreadcrumb';
import Button from '../components/Button';
import DynamicFormBuilder from '../components/DynamicFormBuilder';
import Loader from '../admin/common/Loader';
import { getAvailableModels } from '../services/modelService';
import { ModelSchema, JsonSchema } from '../interfaces/models';
import ModelFormContainer from '../components/ModelFormContainer';
import NotificationBox from '../components/NotificationBox';

const ModelsPage = () => {
  const [modelsSchema, setModelsSchema] = useState<ModelSchema | null>(null);
  const [initialModelSchema, setInitialModelSchema] = useState<JsonSchema | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModel, setShowAddModel] = useState(false);
  const { data: modelsList, refetch: refetchModels } = useQuery(getModels);

  const fetchData = async () => {
    setShowAddModel(true);
    setIsLoading(true);
    try {
      const response = await getAvailableModels();
      setModelsSchema(response);
      setInitialModelSchema(response.schemas[0].json_schema);
      setSelectedModel(response.schemas[0].name);
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
      setSelectedModel(foundSchema.name);
    }
  };

  const onSuccessCallback = async (data: any) => {
    await updateUserModels({ data });
    refetchModels();
    setShowAddModel(false);
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
                {!showAddModel ? (
                  modelsList ? (
                    <div className='flex flex-col gap-3'>
                      <h2 className='text-lg font-semibold'>Available Models</h2>
                      <div className='flex flex-col gap-2'>{JSON.stringify(modelsList)}</div>
                    </div>
                  ) : null
                ) : (
                  modelsSchema && (
                    <>
                      <ModelFormContainer modelsSchema={modelsSchema} onModelChange={handleModelChange} />
                      {initialModelSchema && (
                        <DynamicFormBuilder
                          jsonSchema={initialModelSchema}
                          validationURL={`models/llms/${selectedModel}/validate`}
                          onSuccessCallback={onSuccessCallback}
                        />
                      )}
                    </>
                  )
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
