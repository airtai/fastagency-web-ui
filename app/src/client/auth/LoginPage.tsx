import { useAuth, LoginForm } from 'wasp/client/auth';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthWrapper } from './authWrapper';

export default function Login() {
  const history = useHistory();

  const { data: user } = useAuth();

  useEffect(() => {
    if (user) {
      history.push('/');
    }
  }, [user, history]);

  return (
    <AuthWrapper>
      <LoginForm />
      <br />
      <span className='text-sm font-medium text-airt-font-base dark:text-airt-font-base'>
        Don't have an account yet?{' '}
        <Link to='/signup' className='underline'>
          go to signup
        </Link>
      </span>
    </AuthWrapper>
  );
}
