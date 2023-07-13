import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const User = () => {

    const ref = useRef();

    return (
        <section id="user" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.User.title}</Typography>
            <Box p={3}>
                <img src={HelpData.User.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.User.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.User.create_description}</Box>
                        <img src={HelpData.User.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.User.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.User.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default User;