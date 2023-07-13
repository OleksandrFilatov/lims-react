import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const InputLaboratory = () => {

    const ref = useRef();

    return (
        <section id="input_laboratory" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.InputLaboratory.title}</Typography>
            <Box p={3}>
                <img src={HelpData.InputLaboratory.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.InputLaboratory.description}</Typography>
                <ul>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Create New: {HelpData.InputLaboratory.create_description}</Box>
                        <img src={HelpData.InputLaboratory.create_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Import: {HelpData.InputLaboratory.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.InputLaboratory.export_description}</Box>
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>View client information: {HelpData.InputLaboratory.client_info_description}</Box>
                        <img src={HelpData.InputLaboratory.client_info_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Input AnalysisType Values: {HelpData.InputLaboratory.analysis_values_description}</Box>
                        <img src={HelpData.InputLaboratory.analysis_values_image} alt="" width="60%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Input Lot Number: {HelpData.InputLaboratory.lot_number_description}</Box>
                        <img src={HelpData.InputLaboratory.lot_number_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Input Weight: {HelpData.InputLaboratory.weight_description}</Box>
                        <img src={HelpData.InputLaboratory.weight_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Click M Button: {HelpData.InputLaboratory.mbutton_description}</Box>
                        <img src={HelpData.InputLaboratory.mbutton_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Sort: {HelpData.InputLaboratory.sort_description}</Box>
                        <img src={HelpData.InputLaboratory.sort_image} alt="" width="70%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Import CSV: {HelpData.InputLaboratory.import_csv_description}</Box>
                        <img src={HelpData.InputLaboratory.import_csv_image} alt="" width="60%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Download Certificate: {HelpData.InputLaboratory.download_certificate_description}</Box>
                        <img src={HelpData.InputLaboratory.download_certificate_image} alt="" width="60%" />
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default InputLaboratory;