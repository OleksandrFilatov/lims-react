import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const UnitType = () => {

    const ref = useRef();

    return (
        <section id="unit_type" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.UnitType.title}</Typography>
            <Box p={3}>
                <img src={HelpData.UnitType.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.UnitType.description}</Typography>
                <ul>
                    <li>
                        <Box>Create New: {HelpData.UnitType.create_description}</Box>
                        <img src={HelpData.UnitType.create_image} alt="" width="40%" />
                    </li>
                    <li>
                        <Box>Import: {HelpData.UnitType.import_description}</Box>
                    </li>
                    <li>
                        <Box>Export: {HelpData.UnitType.export_description}</Box>
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default UnitType;