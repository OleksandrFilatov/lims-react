import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const OreType = () => {

    const ref = useRef();

    return (
        <section id="ore_type" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.OreType.title}</Typography>
            <Box p={3}>
                <img src={HelpData.OreType.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.OreType.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.OreType.create_description}</Box>
                        <img src={HelpData.OreType.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.OreType.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.OreType.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default OreType;