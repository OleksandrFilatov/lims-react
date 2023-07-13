import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const UserType = () => {

    const ref = useRef();

    return (
        <section id="user_type" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.UserType.title}</Typography>
            <Box p={3}>
                <img src={HelpData.UserType.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.UserType.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.UserType.create_description}</Box>
                        <img src={HelpData.UserType.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.UserType.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.UserType.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default UserType;