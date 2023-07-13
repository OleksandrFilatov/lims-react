import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const Material = () => {

    const ref = useRef();

    return (
        <section id="material" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.Material.title}</Typography>
            <Box p={3}>
                <img src={HelpData.Material.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.Material.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.Material.create_description}</Box>
                        <img src={HelpData.Material.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.Material.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.Material.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default Material;