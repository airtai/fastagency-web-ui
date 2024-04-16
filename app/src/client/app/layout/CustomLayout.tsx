import { useAuth } from 'wasp/client/auth';
import { useState, ReactNode, FC, useRef, useEffect } from 'react';
import CustomHeader from '../../components/CustomHeader';
import { useHistory } from 'react-router-dom';
import CustomSidebar from '../../components/CustomSidebar';

interface Props {
  children?: ReactNode;
}

const CustomLayout: FC<Props> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    if (!user) {
      history.push('/login');
    } else {
      if (!user.hasPaid && user.isSignUpComplete) {
        history.push('/pricing');
      }
    }
  }, [user, history]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    });

    if (scrollRef.current) {
      observer.observe(scrollRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, []);
  // make call to api -> from action file access conversation entity and pass it to openai
  // get response from openai and save it against the conversation

  const wrapperClass = document.body.classList.contains('server-error') ? 'h-[calc(100vh-85px)]' : 'h-screen';

  return (
    <div className='dark:bg-boxdark-2 dark:text-bodydark bg-captn-light-blue'>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className={`flex ${wrapperClass} overflow-hidden`}>
        {/* <!-- ===== Sidebar Start ===== --> */}
        <CustomSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className='relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden'>
          {/* <!-- ===== Header Start ===== --> */}
          <CustomHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} user={user} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main className='mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10' ref={scrollRef}>
            <div>{children}</div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
          <></>
        </div>

        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </div>
  );
};

export default CustomLayout;
