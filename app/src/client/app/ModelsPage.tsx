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

  const onCancelCallback = () => {
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
                  modelsList && modelsList.length > 0 ? (
                    <div className='flex flex-col gap-3'>
                      <h2 className='text-lg font-semibold text-airt-primary'>Available Models</h2>
                      <div className='grid grid-cols-3 gap-3'>
                        {modelsList.map((model) => {
                          return (
                            <div className='group relative cursor-pointer overflow-hidden bg-airt-primary text-airt-font-base px-6 pt-10 pb-8  transition-all duration-300 hover:-translate-y-1 sm:max-w-sm sm:rounded-lg sm:pl-8 sm:pr-24'>
                              <span className='absolute top-10 z-0 h-8 w-8 rounded-full bg-airt-hero-gradient-start transition-all duration-300 group-hover:scale-[30]'></span>
                              <div className='relative z-10 mx-auto max-w-md'>
                                <div className='flex items-center mb-3'>
                                  <div className='w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-airt-hero-gradient-start text-white flex-shrink-0'>
                                    <svg
                                      fill='none'
                                      stroke='currentColor'
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth='2'
                                      className='w-5 h-5'
                                      viewBox='0 0 24 24'
                                    >
                                      <path d='M22 12h-4l-3 9L9 3l-3 9H2'></path>
                                    </svg>
                                  </div>
                                  <h2 className='text-white dark:text-white text-lg font-medium'>
                                    {model.api_type.toUpperCase()}
                                  </h2>
                                </div>
                                <div className='flex flex-col gap-2 text-white py-4 sm:max-w-sm sm:rounded-lg'>
                                  <p>Model: {model.model}</p>
                                </div>
                                {/* <div className='pt-5 text-base font-semibold leading-7'>
                                  <p>
                                    <a
                                      href='#'
                                      className='text-sky-500 transition-all duration-300 group-hover:text-white'
                                    >
                                      Update &rarr;
                                    </a>
                                  </p>
                                </div> */}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className='flex flex-col gap-3'>
                      <h2 className='text-lg font-semibold text-airt-primary'>Available Models</h2>
                      <p className='text-airt-primary/50 pt-2'>Please add a new model...</p>
                    </div>
                  )
                ) : (
                  modelsSchema && (
                    <>
                      <ModelFormContainer modelsSchema={modelsSchema} onModelChange={handleModelChange} />
                      {initialModelSchema && (
                        <DynamicFormBuilder
                          jsonSchema={initialModelSchema}
                          validationURL={`models/llms/${selectedModel}/validate`}
                          onSuccessCallback={onSuccessCallback}
                          onCancelCallback={onCancelCallback}
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
