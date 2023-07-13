import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  AppBar,
  Avatar,
  Box,
  ButtonBase,
  IconButton,
  Button,
  Toolbar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import toast from 'react-hot-toast';
import { Menu as MenuIcon } from '../../icons/menu';
import { UserCircle as UserCircleIcon } from '../../icons/user-circle';
import { AccountPopover } from './account-popover';
import { useAuth } from '../../hooks/use-auth';
import { LanguagePopover } from './language-popover';
import { useDispatch } from 'react-redux';
import { getUser, setAuthenticated } from '../../slices/auth';

const languages = {
  en: '/static/icons/uk_flag.svg',
  de: '/static/icons/de_flag.svg',
};

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  ...(theme.palette.mode === 'light'
    ? {
      boxShadow: theme.shadows[3]
    }
    : {
      backgroundColor: theme.palette.background.paper,
      borderBottomColor: theme.palette.divider,
      borderBottomStyle: 'solid',
      borderBottomWidth: 1,
      boxShadow: 'none'
    })
}));

const LanguageButton = () => {
  const anchorRef = useRef(null);
  const { i18n } = useTranslation();
  const [openPopover, setOpenPopover] = useState(false);

  const handleOpenPopover = () => {
    setOpenPopover(true);
  };

  const handleClosePopover = () => {
    setOpenPopover(false);
  };

  return (
    <>
      <IconButton
        onClick={handleOpenPopover}
        ref={anchorRef}
        sx={{ ml: 1 }}
      >
        <Box
          sx={{
            display: 'flex',
            height: 20,
            width: 20,
            '& img': {
              width: '100%'
            }
          }}
        >
          <img
            alt=""
            src={languages[i18n.language]}
          />
        </Box>
      </IconButton>
      <LanguagePopover
        anchorEl={anchorRef.current}
        onClose={handleClosePopover}
        open={openPopover}
      />
    </>
  );
};

const AccountButton = () => {

  const router = useRouter();
  const dispatch = useDispatch();

  const onClickLogout = async () => {
    try {
      if (localStorage.getItem('accessToken')) {
        localStorage.removeItem('accessToken');
        dispatch(setAuthenticated(false));
        dispatch(getUser({}));
      }
      router.push('/authentication/login').catch(console.error);
    } catch (err) {
      console.error(err);
      toast.error('Unable to logout.');
    }
  };

  return (
    <>
      <Button variant='text' onClick={onClickLogout}>
        <LogoutIcon fontSize='small' />&nbsp;Logout
      </Button>
    </>
  );
};

const NavMenu = ({ onOpenSidebar }) => {

  return (
    <Box display="flex">
      <Button variant='text' sx={{ mx: 1 }} onClick={onOpenSidebar}><MenuIcon /></Button>
      <NextLink href="/admin" passHref>
        <Button variant='text' sx={{ mx: 1 }}>Administration</Button>
      </NextLink>
      <NextLink href="/" passHref>
        <Button variant='text' sx={{ mx: 1 }}>Setting</Button>
      </NextLink>
      {/* <NextLink href="/authentication/login" passHref>
        <Button onClick={handleLogout} variant='text' sx={{ mx: 1 }}>Login</Button>
      </NextLink> */}
      <NextLink href="/help" passHref>
        <Button variant='text' sx={{ mx: 1 }}>Help</Button>
      </NextLink>
    </Box>
  )
}

export const DashboardNavbar = (props) => {
  const { onOpenSidebar, ...other } = props;

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          left: {
            lg: 280
          },
          width: {
            lg: 'calc(100% - 280px)'
          },
          borderBottom: '2px solid #ffb93a'
        }}
        {...other}>
        <NavMenu onOpenSidebar={onOpenSidebar} />
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            left: 0,
            px: 2
          }}
        >
          <IconButton
            onClick={onOpenSidebar}
            sx={{
              display: {
                xs: 'inline-flex',
                lg: 'none'
              }
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <LanguageButton />
          <AccountButton />
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};

DashboardNavbar.propTypes = {
  onOpenSidebar: PropTypes.func
};
