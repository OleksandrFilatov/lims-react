import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const Client = () => {

    const ref = useRef();

    return (
        <section id="client" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.Client.title}</Typography>
            <Box p={3}>
                <img src={HelpData.Client.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.Client.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.Client.create_description}</Box>
                        <img src={HelpData.Client.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.Client.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.Client.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default Client;