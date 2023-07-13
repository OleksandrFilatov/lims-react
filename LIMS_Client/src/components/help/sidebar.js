import NextLink from 'next/link';
import { Box } from "@mui/material"

const administration_items = ['user_type', 'user', 'packing_type', 'unit_type', 'objective', 'analysis_type', 'client', 'material', 'certificate_type', 'certificate_template', 'sample_type', 'reason', 'settings', 'ore_type', 'geology_lab_objective'];
const input_items = ['input_laboratory', 'input_geology'];
const analysis_items = ['analysis_laboratory', 'analysis_geology'];

const Sidebar = (props) => {

    return (
        <Box className={props.show && props.width < 768 ? "help-navigation active" : "help-navigation"} overflow="auto" px={4} py={3} sx={{ height: 'calc(100vh - 87px)' }}>
            <ul className="nav-menu">
                <li className={administration_items.includes(props.current) ? 'root-menu active' : 'root-menu'}>
                    <NextLink href="/help/#user_type" passHref>Administration</NextLink>
                    {
                        administration_items.includes(props.current) && (
                            <ul className="nav-menu" style={{ borderLeft: '1px solid #c9c8c8', margin: '5px 0' }}>
                                <li className={props.current === 'user_type' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#user_type" passHref>User Types</NextLink>
                                </li>
                                <li className={props.current === 'user' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#user" passHref>User</NextLink>
                                </li>
                                <li className={props.current === 'packing_type' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#packing_type" passHref>Packing Types</NextLink>
                                </li>
                                <li className={props.current === 'unit_type' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#unit_type" passHref>Unit Types</NextLink>
                                </li>
                                <li className={props.current === 'objective' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#objective" passHref>Objectives</NextLink>
                                </li>
                                <li className={props.current === 'analysis_type' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#analysis_type" passHref>Analysis Types</NextLink>
                                </li>
                                <li className={props.current === 'client' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#client" passHref>Clients</NextLink>
                                </li>
                                <li className={props.current === 'material' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#material" passHref>Material</NextLink>
                                </li>
                                <li className={props.current === 'certificate_type' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#certificate_type" passHref>Certificate Types</NextLink>
                                </li>
                                <li className={props.current === 'certificate_template' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#certificate_template" passHref>Certificate Template</NextLink>
                                </li>
                                <li className={props.current === 'sample_type' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#sample_type" passHref>Sample Types</NextLink>
                                </li>
                                <li className={props.current === 'reason' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#reason" passHref>Reason</NextLink>
                                </li>
                                <li className={props.current === 'settings' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#settings" passHref>Settings</NextLink>
                                </li>
                                <li className={props.current === 'ore_type' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#ore_type" passHref>Ore Types</NextLink>
                                </li>
                                <li className={props.current === 'geology_lab_objective' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#geology_lab_objective" passHref>Geology-Lab-Objectives</NextLink>
                                </li>
                            </ul>
                        )
                    }
                </li>
                <li className={input_items.includes(props.current) ? 'root-menu active' : 'root-menu'}>
                    <NextLink href="/help/#input_laboratory" passHref>Input</NextLink>
                    {
                        input_items.includes(props.current) && (
                            <ul className="nav-menu" style={{ borderLeft: '1px solid #c9c8c8', margin: '5px 0' }}>
                                <li className={props.current === 'input_laboratory' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#input_laboratory" passHref>Laboratory</NextLink>
                                </li>
                                <li className={props.current === 'input_geology' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#input_geology" passHref>Geology</NextLink>
                                </li>
                            </ul>
                        )
                    }
                </li>
                <li className={analysis_items.includes(props.current) ? 'root-menu active' : 'root-menu'}>
                    <NextLink href="/help/#analysis_laboratory" passHref>Analysis</NextLink>
                    {
                        analysis_items.includes(props.current) && (
                            <ul className="nav-menu" style={{ borderLeft: '1px solid #c9c8c8', margin: '5px 0' }}>
                                <li className={props.current === 'analysis_laboratory' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#analysis_laboratory" passHref>Laboratory</NextLink>
                                </li>
                                <li className={props.current === 'analysis_geology' ? 'nav-link active' : 'nav-link'}>
                                    <NextLink href="/help/#analysis_geology" passHref>Geology</NextLink>
                                </li>
                            </ul>
                        )
                    }
                </li>
            </ul>
        </Box>
    )
}

export default Sidebar;