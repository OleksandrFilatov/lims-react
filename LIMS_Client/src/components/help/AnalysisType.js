import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const AnalysisType = () => {

    const ref = useRef();
    return (
        <section id="analysis_type" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.AnalysisTypes.title}</Typography>
            <Box p={3}>
                <img src={HelpData.AnalysisTypes.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.AnalysisTypes.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.AnalysisTypes.create_description}</Box>
                        <img src={HelpData.AnalysisTypes.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.AnalysisTypes.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.AnalysisTypes.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default AnalysisType;