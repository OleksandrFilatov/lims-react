import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const CertificateTemplate = () => {

    const ref = useRef()

    return (
        <section id="certificate_template" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.CertificateTemplate.title}</Typography>
            <Box p={3}>
                <img src={HelpData.CertificateTemplate.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.CertificateTemplate.description}</Typography>
                <ul>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Create New: {HelpData.CertificateTemplate.create_description}</Box>
                        <img src={HelpData.CertificateTemplate.create_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Import: {HelpData.CertificateTemplate.import_description}</Box>
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Export: {HelpData.CertificateTemplate.export_description}</Box>
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Product Data: {HelpData.CertificateTemplate.product_data_description}</Box>
                        <img src={HelpData.CertificateTemplate.product_data_image} alt="" width="50%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Table Columns: {HelpData.CertificateTemplate.table_columns_description}</Box>
                        <img src={HelpData.CertificateTemplate.table_columns_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Free Text: {HelpData.CertificateTemplate.freetext_description}</Box>
                        <img src={HelpData.CertificateTemplate.freetext_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Copy template: {HelpData.CertificateTemplate.copy_row_description}</Box>
                        <img src={HelpData.CertificateTemplate.copy_row_image} alt="" width="40%" />
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default CertificateTemplate;