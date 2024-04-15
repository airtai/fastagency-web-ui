import { type User } from 'wasp/entities';
import CustomAuthRequiredLayout from './layout/CustomAuthRequiredLayout';

const BuildPage = ({ user }: { user: User }) => {
  return (
    <p
      className='absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl md:text-6xl text-airt-font-base'
      style={{ lineHeight: 'normal' }}
    >
      Build Page...
    </p>
  );
};

const BuildPageWithCustomAuth = CustomAuthRequiredLayout(BuildPage);
export default BuildPageWithCustomAuth;
