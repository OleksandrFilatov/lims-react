import * as React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AuthGuard } from '../../components/authentication/auth-guard';
import { AdminLayout } from '../../components/admin/admin-layout';
import { useTranslation } from 'react-i18next';
import UserTypes from './UserTypes';
import User from './User';
import PackingType from './PackingType';
import Unit from './Unit';
import Objective from './Objective';
import AnalysisType from './AnalysisType';
import Client from './Client';
import Reason from './Reason';
import SampleTypes from './SampleTypes';
import Material from './Material';
import CertificateTemplate from './CertificateTemplate';
import CertificateType from './CertificateType';
import AdminSettings from './AdminSettings';
import OreType from './OreType';
import GeologyLabObjectives from './GeologyLabObjectives';

const Administration = () => {

    const { t } = useTranslation();

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box p={2} sx={{ backgroundColor: 'white' }}>
            <Head>
                <title>
                    Administration | Sachtleben Technology
                </title>
            </Head>
            <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList variant='scrollable' onChange={handleChange} aria-label="lab API tabs example">
                            <Tab label={t('User Types')} value="1" />
                            <Tab label={t('User')} value="2" />
                            <Tab label={t('Packing Types')} value="3" />
                            <Tab label={t('Unit Types')} value="4" />
                            <Tab label={t('Objectives')} value="5" />
                            <Tab label={t('Analysis Types')} value="6" />
                            <Tab label={t('Clients')} value="7" />
                            <Tab label={t('Material')} value="8" />
                            <Tab label={t('Certificate Types')} value="9" />
                            <Tab label={t('Certificate Template')} value="10" />
                            <Tab label={t('Sample Types')} value="11" />
                            <Tab label={t('Reason')} value="12" />
                            <Tab label={t('Settings')} value="13" />
                            <Tab label={t('Ore Types')} value="14" />
                            <Tab label={t('Geology-Lab-Objectives')} value="15" />
                        </TabList>
                    </Box>
                    <TabPanel value="1">
                        <UserTypes />
                    </TabPanel>
                    <TabPanel value="2"><User /></TabPanel>
                    <TabPanel value="3"><PackingType /></TabPanel>
                    <TabPanel value="4"><Unit /></TabPanel>
                    <TabPanel value="5"><Objective /></TabPanel>
                    <TabPanel value="6"><AnalysisType /></TabPanel>
                    <TabPanel value="7"><Client /></TabPanel>
                    <TabPanel value="8"><Material /></TabPanel>
                    <TabPanel value="9"><CertificateType /></TabPanel>
                    <TabPanel value="10"><CertificateTemplate /></TabPanel>
                    <TabPanel value="11"><SampleTypes /></TabPanel>
                    <TabPanel value="12"><Reason /></TabPanel>
                    <TabPanel value="13"><AdminSettings /></TabPanel>
                    <TabPanel value="14"><OreType /></TabPanel>
                    <TabPanel value="15"><GeologyLabObjectives /></TabPanel>
                </TabContext>
            </Box>
        </Box>
    )
}

Administration.getLayout = (page) => (
    <AuthGuard>
        <AdminLayout>
            {page}
        </AdminLayout>
    </AuthGuard>
);

export default Administration;