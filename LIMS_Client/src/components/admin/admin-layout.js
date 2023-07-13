import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DashboardNavbar } from '../dashboard/dashboard-navbar';
import { DashboardSidebar } from '../dashboard/dashboard-sidebar';
import SubMenu from './sub-menu';
import setAuthToken from '../../utils/setAuthToken';
import { authApi } from '../../api/auth-api';
import { setUser } from '../../slices/auth';
import { useDispatch } from 'react-redux';

const AdminLayoutRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    maxWidth: '100%',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
        paddingLeft: 280
    }
}));

export const AdminLayout = (props) => {
    const { children } = props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                setAuthToken(token);
                const user = await authApi.me(token);
                dispatch(setUser(user));
            }
        }
        checkAuth();
    }, []);

    return (
        <>
            <AdminLayoutRoot>
                <Box
                    sx={{
                        display: 'flex',
                        flex: '1 1 auto',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%'
                    }}
                >
                    <SubMenu parentItem="Home" menuItem="Administration" />
                    <Box></Box>
                    <Box p={4} sx={{ height: '100%' }}>
                        {children}
                    </Box>
                </Box>
            </AdminLayoutRoot>
            <DashboardNavbar onOpenSidebar={() => setIsSidebarOpen(true)} />
            <DashboardSidebar
                onClose={() => setIsSidebarOpen(false)}
                open={isSidebarOpen}
            />
        </>
    );
};

AdminLayout.propTypes = {
    children: PropTypes.node
};
