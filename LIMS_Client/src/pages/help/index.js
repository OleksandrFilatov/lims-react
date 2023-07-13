import { Box, Divider } from "@mui/material"
import { useEffect, useState } from "react";
import { AuthGuard } from "../../components/authentication/auth-guard";
import AnalysisType from "../../components/help/AnalysisType";
import CertificateTemplate from "../../components/help/CertificateTemplate";
import CertificateType from "../../components/help/CertificateType";
import Client from "../../components/help/Client";
import GeologyLabObjective from "../../components/help/GeologyLabObjective";
import Header from "../../components/help/header";
import InputGeology from "../../components/help/InputGeology";
import InputLaboratory from "../../components/help/InputLaboratory";
import Material from "../../components/help/Material";
import Objective from "../../components/help/Objective";
import OreType from "../../components/help/OreType";
import PackingType from "../../components/help/PackingType";
import Reason from "../../components/help/Reason";
import SampleType from "../../components/help/SampleType";
import Settings from "../../components/help/Settings";
import Sidebar from "../../components/help/sidebar";
import UnitType from "../../components/help/UnitType";
import User from "../../components/help/User";
import UserType from "../../components/help/UserType";
import AnalysisLaboratory from "../../components/help/AnalysisLaboratory";
import AnalysisGeology from "../../components/help/AnalysisGeology";

const Help = () => {

    const [show, setShow] = useState(window.innerWidth >= 768);
    const [width, setWidth] = useState(window.innerWidth);
    const [currentSection, setCurrentSection] = useState('user_type');

    useEffect(() => {
        window.addEventListener('resize', () => {
            setShow(window.innerWidth < 768);
            setWidth(window.innerWidth);
        });
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', console.log('Removed event listener'));
            window.removeEventListener('scroll', console.log('Removed event listener'));
        }
    }, []);

    const handleScroll = (e) => {
        const pagesections = document.getElementsByTagName('section');

        let current = '';
        for (let section of pagesections) {
            const topSection = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY + 90 < topSection + sectionHeight) {
                current = section.getAttribute('id');
                break;
            }
        }
        setCurrentSection(current);
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="space-between" minHeight="100vh">
            <Header show={show} setShow={(val) => setShow(val)} width={width} />
            <Box display="flex" marginTop="87px">
                <Sidebar show={show} width={width} current={currentSection} />
                <Box className="help_content" p={4} sx={{ flex: '1', backgroundColor: 'white' }}>
                    <UserType />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <User />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <PackingType />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <UnitType />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <Objective />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <AnalysisType />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <Client />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <Material />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <CertificateType />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <CertificateTemplate />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <SampleType />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <Reason />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <Settings />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <OreType />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <GeologyLabObjective />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <InputLaboratory />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <InputGeology />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <AnalysisLaboratory />
                    <Divider light sx={{ borderColor: '#eee', my: 4 }} />
                    <AnalysisGeology />
                </Box>
            </Box>
        </Box>
    )
}

Help.getLayout = (page) => (
    <AuthGuard>
        {page}
    </AuthGuard>
);

export default Help;