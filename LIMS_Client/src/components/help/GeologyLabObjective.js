import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const GeologyLabObjective = () => {

    const ref = useRef();

    return (
        <section id="geology_lab_objective" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.GeologyLabObjective.title}</Typography>
            <Box p={3}>
                <img src={HelpData.GeologyLabObjective.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.GeologyLabObjective.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.GeologyLabObjective.create_description}</Box>
                        <img src={HelpData.GeologyLabObjective.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.GeologyLabObjective.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.GeologyLabObjective.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default GeologyLabObjective;