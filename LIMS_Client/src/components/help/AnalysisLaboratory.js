import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const AnalysisLaboratory = () => {

    const ref = useRef();

    return (
        <section id="analysis_laboratory" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.AnalysisLaboratory.title}</Typography>
            <Box p={3}>
                <img src={HelpData.AnalysisLaboratory.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.AnalysisLaboratory.description}</Typography>
            </Box>
        </section>
    )
}

export default AnalysisLaboratory;