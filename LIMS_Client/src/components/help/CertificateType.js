import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const CertificateType = () => {

    const ref = useRef();

    return (
        <section id="certificate_type" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.CertificateType.title}</Typography>
            <Box p={3}>
                <img src={HelpData.CertificateType.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.CertificateType.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.CertificateType.create_description}</Box>
                        <img src={HelpData.CertificateType.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.CertificateType.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.CertificateType.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default CertificateType;