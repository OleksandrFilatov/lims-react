import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const SampleType = () => {

    const ref = useRef();

    return (
        <section id="sample_type" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.SampleType.title}</Typography>
            <Box p={3}>
                <img src={HelpData.SampleType.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.SampleType.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.SampleType.create_description}</Box>
                        <img src={HelpData.SampleType.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.SampleType.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.SampleType.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default SampleType;