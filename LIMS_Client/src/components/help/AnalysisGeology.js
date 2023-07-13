import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const AnalysisGeology = () => {

    return (
        <section id="analysis_geology">
            <Typography variant='h4' component='h4'>{HelpData.AnalysisGeology.title}</Typography>
            <Box p={3}>
                <img src={HelpData.AnalysisGeology.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.AnalysisGeology.description}</Typography>
            </Box>
        </section>
    )
}

export default AnalysisGeology;