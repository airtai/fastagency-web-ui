import { useState, useEffect } from 'react';
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
import { UpdateExistingModelType } from '../interfaces/models';

const ModelsPage = () => {
  const [modelsSchema, setModelsSchema] = useState<ModelSchema | null>(null);
  const [initialModelSchema, setInitialModelSchema] = useState<JsonSchema | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [updateExistingModel, setUpdateExistingModel] = useState<UpdateExistingModelType | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModel, setShowAddModel] = useState(false);
  const { data: modelsList, refetch: refetchModels, isLoading: getModelsIsLoading } = useQuery(getModels);

  const fetchData = async () => {
    // setShowAddModel(true);
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

  useEffect(() => {
    fetchData();
  }, []);

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

  const updateSelectedModel = (index: number) => {
    if (modelsList) {
      const selectedModel = modelsList[index];
      const selectedModelSchemaName = selectedModel.api_type === 'openai' ? 'openai' : 'azureoai';
      const foundSchema = modelsSchema?.schemas.find((schema) => schema.name.toLowerCase() === selectedModelSchemaName);
      if (foundSchema) {
        setInitialModelSchema(foundSchema.json_schema);
        setSelectedModel(foundSchema.name);
        setUpdateExistingModel(selectedModel);
        setShowAddModel(true);
      }
    }
  };

  return (
    <CustomLayout>
      <CustomBreadcrumb pageName='Models' />
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-4'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark min-h-[300px] sm:min-h-[600px]'>
            <div className='flex-col flex items-start p-6 gap-3 w-full'>
              <div className={`${showAddModel ? 'hidden' : ''} flex justify-end w-full px-6.5 py-3`}>
                <Button
                  onClick={async () => {
                    setIsLoading(true);
                    await fetchData();
                    setShowAddModel(true);
                    setIsLoading(false);
                  }}
                  label='Add Model'
                />
              </div>
              <div className='flex-col flex w-full'>
                {!showAddModel ? (
                  modelsList && modelsList.length > 0 ? (
                    <div className='flex flex-col gap-3'>
                      <h2 className='text-lg font-semibold text-airt-primary'>Available Models</h2>
                      <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                        {modelsList.map((model, i) => {
                          return (
                            <div
                              key={i}
                              className='group relative cursor-pointer overflow-hidden bg-airt-primary text-airt-font-base px-6 pt-10 pb-8  transition-all duration-300 hover:-translate-y-1 sm:max-w-sm sm:rounded-lg sm:pl-8 sm:pr-24'
                              // add a click event to the div
                              onClick={() => updateSelectedModel(i)}
                            >
                              <span className='absolute top-10 z-0 h-9 w-9 rounded-full bg-airt-hero-gradient-start transition-all duration-300 group-hover:scale-[30]'></span>
                              <div className='relative z-10 mx-auto max-w-md'>
                                <div className='flex items-center mb-3'>
                                  <div className='w-8 h-8 mr-3 inline-flex items-center justify-center rounded-full dark:bg-indigo-500 bg-airt-hero-gradient-start text-white flex-shrink-0'>
                                    <svg
                                      fill='#FFFFFF'
                                      stroke='#FFFFFF'
                                      strokeWidth='0.5'
                                      version='1.1'
                                      id='Layer_1'
                                      xmlns='http://www.w3.org/2000/svg'
                                      xmlnsXlink='http://www.w3.org/1999/xlink'
                                      viewBox='0 0 32 32'
                                      width='24'
                                      height='24'
                                      xmlSpace='preserve'
                                      style={{ marginLeft: '4px', marginTop: '2.5px' }}
                                    >
                                      <path d='M12,30.36c-1.47,0-2.852-0.766-3.653-2.011C5.703,28.24,3.64,26.106,3.64,23.5 c0-0.899,0.252-1.771,0.733-2.544C2.678,19.887,1.64,18.021,1.64,16s1.038-3.886,2.733-4.957C3.893,10.271,3.64,9.4,3.64,8.5 c0-2.63,2.101-4.779,4.712-4.858C9.155,2.402,10.534,1.64,12,1.64c2.404,0,4.36,1.956,4.36,4.36v4.64H25 c0.904,0,1.64-0.736,1.64-1.64V7.312c-0.575-0.158-1-0.686-1-1.312c0-0.75,0.61-1.36,1.36-1.36S28.36,5.25,28.36,6 c0,0.625-0.425,1.153-1,1.312V9c0,1.301-1.059,2.36-2.36,2.36h-8.64v2.28h11.329c0.158-0.576,0.687-1,1.312-1 c0.75,0,1.36,0.61,1.36,1.36s-0.61,1.36-1.36,1.36c-0.625,0-1.153-0.424-1.312-1H16.36v3.28h11.329c0.158-0.575,0.687-1,1.312-1 c0.75,0,1.36,0.61,1.36,1.36s-0.61,1.36-1.36,1.36c-0.625,0-1.153-0.425-1.312-1H16.36v2.279H25c1.302,0,2.36,1.059,2.36,2.36v1.688 c0.575,0.158,1,0.687,1,1.312c0,0.75-0.61,1.36-1.36,1.36s-1.36-0.61-1.36-1.36c0-0.625,0.425-1.153,1-1.312V23 c0-0.904-0.735-1.64-1.64-1.64h-8.64V26C16.36,28.404,14.404,30.36,12,30.36z M8.721,27.628l0.143,0.186 C9.526,28.957,10.699,29.64,12,29.64c2.007,0,3.64-1.633,3.64-3.64V6c0-2.007-1.633-3.64-3.64-3.64 c-1.301,0-2.474,0.683-3.137,1.826L8.747,4.365C8.493,4.869,8.36,5.431,8.36,6c0,0.64,0.168,1.269,0.487,1.82L8.224,8.18 C7.842,7.521,7.64,6.766,7.64,6c0-0.547,0.103-1.088,0.3-1.593C5.901,4.694,4.36,6.42,4.36,8.5c0,0.876,0.283,1.722,0.817,2.446 l0.246,0.333l-0.364,0.197C3.394,12.377,2.36,14.11,2.36,16c0,1.785,0.922,3.43,2.427,4.365C5.713,19.268,7.061,18.64,8.5,18.64 v0.721c-1.206,0-2.336,0.517-3.125,1.424l-0.198,0.27C4.643,21.778,4.36,22.624,4.36,23.5c0,2.283,1.857,4.14,4.14,4.14 L8.721,27.628z M27,25.36c-0.353,0-0.64,0.287-0.64,0.64s0.287,0.64,0.64,0.64s0.64-0.287,0.64-0.64S27.353,25.36,27,25.36z M29,17.36c-0.353,0-0.64,0.287-0.64,0.64s0.287,0.64,0.64,0.64s0.64-0.287,0.64-0.64S29.353,17.36,29,17.36z M29,13.36 c-0.353,0-0.64,0.287-0.64,0.64s0.287,0.64,0.64,0.64s0.64-0.287,0.64-0.64S29.353,13.36,29,13.36z M27,5.36 c-0.353,0-0.64,0.287-0.64,0.64S26.647,6.64,27,6.64S27.64,6.353,27.64,6S27.353,5.36,27,5.36z M12,28.36v-0.72 c0.904,0,1.64-0.735,1.64-1.64h0.72C14.36,27.302,13.301,28.36,12,28.36z M9,26.36c-1.577,0-2.86-1.283-2.86-2.86h0.72 c0,1.18,0.96,2.14,2.14,2.14C9,25.64,9,26.36,9,26.36z M12,24.36c-1.301,0-2.36-1.059-2.36-2.36s1.059-2.36,2.36-2.36v0.721 c-0.904,0-1.64,0.735-1.64,1.64s0.736,1.64,1.64,1.64V24.36z M6.332,16.667C5.886,16.221,5.64,15.629,5.64,15 c0-1.39,0.97-2.36,2.36-2.36c0.641,0,1.218,0.238,1.669,0.689l-0.51,0.509C8.847,13.525,8.446,13.36,8,13.36 c-0.996,0-1.64,0.644-1.64,1.64c0,0.437,0.171,0.848,0.48,1.158L6.332,16.667z M12,12.86v-0.72c0.904,0,1.64-0.736,1.64-1.64 S12.904,8.86,12,8.86V8.14c1.301,0,2.36,1.059,2.36,2.36S13.301,12.86,12,12.86z M14.36,6h-0.72c0-0.904-0.736-1.64-1.64-1.64 S10.36,5.096,10.36,6H9.64c0-1.301,1.059-2.36,2.36-2.36S14.36,4.699,14.36,6z' />
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
                      <p className='text-airt-primary/50 pt-2'>No models available. Please add one.</p>
                    </div>
                  )
                ) : (
                  modelsSchema && (
                    <>
                      <ModelFormContainer
                        selectedModel={
                          updateExistingModel
                            ? updateExistingModel.api_type === 'openai'
                              ? 'openai'
                              : 'azureoai'
                            : null
                        }
                        modelsSchema={modelsSchema}
                        onModelChange={handleModelChange}
                      />
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
                  )
                )}
                {error && <NotificationBox type={'error'} onClick={() => setError(null)} message={error} />}
              </div>
            </div>
          </div>
        </div>
        {isLoading ||
          (getModelsIsLoading && (
            <div className='absolute inset-0 flex items-center justify-center bg-white bg-opacity-50'>
              <Loader />
            </div>
          ))}
      </div>
    </CustomLayout>
  );
};

export default ModelsPage;
