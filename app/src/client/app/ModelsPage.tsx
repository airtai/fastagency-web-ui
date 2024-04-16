import CustomLayout from './layout/CustomLayout';
import CustomBreadcrumb from '../components/CustomBreadcrumb';

const ModelsPage = () => {
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
              <span className='text-sm font-medium text-airt-primary'>Some content goes here...</span>
            </div>
          </div>
        </div>
      </div>
    </CustomLayout>
  );
};

export default ModelsPage;