import { useEffect, useMemo, useRef, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Box, Drawer, useMediaQuery } from '@mui/material';
import { ChartBar as ChartBarIcon } from '../../icons/chart-bar';
import { Users as UsersIcon } from '../../icons/users';
import { ShoppingBag as ShoppingBagIcon } from '../../icons/shopping-bag';
import { Newspaper as NewspaperIcon } from '../../icons/newspaper';
import { OfficeBuilding as OfficeBuildingIcon } from '../../icons/office-building';
import { Scrollbar } from '../scrollbar';
import { DashboardSidebarSection } from './dashboard-sidebar-section';
import { OrganizationPopover } from './organization-popover';

const getSections = (t) => [
  {
    title: t('Home'),
    items: [
      {
        title: t('Input'),
        icon: <NewspaperIcon fontSize="small" />,
        children: [
          {
            title: t('Laboratory'),
            path: '/input/laboratory'
          },
          {
            title: t('Geology'),
            path: '/input/geology'
          },
        ]
      },
      {
        title: t('Analysis'),
        icon: <ChartBarIcon fontSize="small" />,
        children: [
          {
            title: t('Laboratory'),
            path: '/analysis/laboratory'
          },
          {
            title: t('Geology'),
            path: '/analysis/geology'
          },
        ]
      },
      {
        title: t('Stock Management'),
        icon: <OfficeBuildingIcon fontSize="small" />,
        children: [
          {
            title: t('Spare Parts'),
            path: '/laboratory/analysis'
          },
        ]
      }
    ]
  },
  {
    title: t('Import/Export'),
    items: [
      {
        title: t('Import'),
        icon: <UsersIcon fontSize="small" />,
        children: [
          {
            title: t('HS'),
            path: '/dashboard/customers'
          },
          {
            title: t('Geo-Information System'),
            path: '/dashboard/customers/1'
          }
        ]
      },
      {
        title: t('Export'),
        icon: <ShoppingBagIcon fontSize="small" />,
        children: [
          {
            title: t('HS'),
            path: '/dashboard/products'
          },
          {
            title: t('Geo-Information System'),
            path: '/dashboard/products/new'
          },
          {
            title: t('Reports'),
            path: '/dashboard/products'
          },
          {
            title: t('Excel'),
            path: '/dashboard/products/new'
          }
        ]
      }
    ]
  }
];

export const DashboardSidebar = (props) => {
  const { onClose, open } = props;
  const router = useRouter();
  const { t } = useTranslation();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    noSsr: true
  });
  const sections = useMemo(() => getSections(t), [t]);
  const organizationsRef = useRef(null);
  const [openOrganizationsPopover, setOpenOrganizationsPopover] = useState(false);

  const handlePathChange = () => {
    if (!router.isReady) {
      return;
    }

    if (open) {
      onClose?.();
    }
  };

  useEffect(handlePathChange,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.isReady, router.asPath]);

  const handleOpenOrganizationsPopover = () => {
    setOpenOrganizationsPopover(true);
  };

  const handleCloseOrganizationsPopover = () => {
    setOpenOrganizationsPopover(false);
  };

  const content = (
    <>
      <Scrollbar
        sx={{
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
          }}
        >
          <div>
            <Box sx={{ p: 3 }}>
              <NextLink
                href="/"
                passHref
              >
                <a>
                  <img src="/static/logo/Sachtleben_Technology_Logo.svg" className='d-block m-auto' width="100%" alt='' />
                </a>
              </NextLink>
            </Box>
          </div>
          <Box sx={{ flexGrow: 1 }}>
            {sections.map((section) => (
              <DashboardSidebarSection
                key={section.title}
                path={router.asPath}
                sx={{
                  mt: 2,
                  '& + &': {
                    mt: 2
                  }
                }}
                {...section} />
            ))}
          </Box>
          <Box className='px-2 position-absolute d-flex align-items-center justify-content-between' style={{ bottom: 0 }}>
            <img src="/static/logo/footer_left_logo.svg" className='svg-gray' width="45%" height={68} alt="LOGO" />
            <img src="/static/logo/divider.svg" className='svg-gray' alt="LOGO" height={68} />
            <img src="/static/logo/footer_right_logo.svg" className='svg-gray' width="45%" height={68} alt="LOGO" />
          </Box>
        </Box>
      </Scrollbar>
      <OrganizationPopover
        anchorEl={organizationsRef.current}
        onClose={handleCloseOrganizationsPopover}
        open={openOrganizationsPopover}
      />
    </>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            borderRightColor: 'divider',
            borderRightStyle: 'solid',
            borderRightWidth: (theme) => theme.palette.mode === 'dark' ? 1 : 1,
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.900',
          color: '#FFFFFF',
          width: 280
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
