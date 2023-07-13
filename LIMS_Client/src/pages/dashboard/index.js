import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';

const Overview = () => {

  const router = useRouter();

  useEffect(() => {
    router.push('/input/laboratory');
    // gtm.push({ event: 'page_view' });
  }, []);

  return (
    <></>
  );
};

Overview.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>
      {page}
    </DashboardLayout>
  </AuthGuard>
);

export default Overview;
