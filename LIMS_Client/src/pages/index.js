import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {

  const router = useRouter();
  useEffect(() => {
    router.push('/input/laboratory');
    // gtm.push({ event: 'page_view' });
  }, []);

  return <></>
};

export default Home;
