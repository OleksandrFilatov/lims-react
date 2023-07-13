import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const Objective = () => {

    const ref = useRef();

    return (
        <section id="objective" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.Objectives.title}</Typography>
            <Box p={3}>
                <img src={HelpData.Objectives.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.Objectives.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.Objectives.create_description}</Box>
                        <img src={HelpData.Objectives.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.Objectives.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.Objectives.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default Objective;