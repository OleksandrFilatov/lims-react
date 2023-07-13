import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const PackingType = () => {

    const ref = useRef();

    return (
        <section id="packing_type" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.PackingType.title}</Typography>
            <Box p={3}>
                <img src={HelpData.PackingType.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.PackingType.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.PackingType.create_description}</Box>
                        <img src={HelpData.PackingType.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.PackingType.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.PackingType.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default PackingType;