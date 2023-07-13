import { useEffect } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, Container, Divider, Link, Typography } from '@mui/material';
import { GuestGuard } from '../../components/authentication/guest-guard';
import { AuthBanner } from '../../components/authentication/auth-banner';
import { AmplifyLogin } from '../../components/authentication/amplify-login';
import { Auth0Login } from '../../components/authentication/auth0-login';
import { FirebaseLogin } from '../../components/authentication/firebase-login';
import { JWTLogin } from '../../components/authentication/jwt-login';
import { Logo } from '../../components/logo';
import { useAuth } from '../../hooks/use-auth';
import { gtm } from '../../lib/gtm';

const platformIcons = {
  Amplify: '/static/icons/amplify.svg',
  Auth0: '/static/icons/auth0.svg',
  Firebase: '/static/icons/firebase.svg',
  JWT: '/static/icons/jwt.svg'
};

const Login = () => {
  const { platform } = useAuth();

  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  return (
    <>
      <Head>
        <title>
          Login | Material Kit Pro
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        {/* <AuthBanner /> */}
        <Container
          maxWidth="sm"
          sx={{
            py: {
              xs: '60px',
              md: '120px'
            }
          }}
        >
          <Card
            elevation={16}
            sx={{ p: 4 }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <NextLink
                href="/input/laboratory"
                passHref
              >
                <a>
                  <img
                    src='/static/logo/Sachtleben_Technology_Logo.svg'
                    className='svg-black'
                    alt=''
                    height="120px"
                  />
                </a>
              </NextLink>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                mt: 3
              }}
            >
              {platform === 'Amplify' && <AmplifyLogin />}
              {platform === 'Auth0' && <Auth0Login />}
              {platform === 'Firebase' && <FirebaseLogin />}
              {platform === 'JWT' && <JWTLogin />}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Typography component='h2'>&copy; 2022 Sachtleben Technology GmbH</Typography>
            {/* <div>
              <NextLink
                href={'/authentication/register'}
                passHref
              >
                <Link
                  color="textSecondary"
                  variant="body2"
                >
                  2022 Sachtleben Technology GmbH
                </Link>
              </NextLink>
            </div> */}
            {platform === 'Amplify' && (
              <Box sx={{ mt: 1 }}>
                <NextLink
                  href={'/authentication/password-recovery'}
                  passHref
                >
                  <Link
                    color="textSecondary"
                    variant="body2"
                  >
                    Forgot password
                  </Link>
                </NextLink>
              </Box>
            )}
          </Card>
        </Container>
      </Box>
    </>
  );
};

Login.getLayout = (page) => (
  <GuestGuard>
    {page}
  </GuestGuard>
);

export default Login;
