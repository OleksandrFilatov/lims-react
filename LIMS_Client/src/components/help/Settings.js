import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const Settings = () => {

    const ref = useRef();

    return (
        <section id="settings" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.Settings.title}</Typography>
            <Box p={3}>
                <img src={HelpData.Settings.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.Settings.description}</Typography>
            </Box>
        </section>
    )
}

export default Settings;