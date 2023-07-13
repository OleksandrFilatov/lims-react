import { Box, Typography } from '@mui/material';
import { useRef } from 'react';
import HelpData from '../../utils/help.json';

const InputGeology = () => {

    const ref = useRef();

    return (
        <section id="input_geology" ref={ref}>
            <Typography variant='h4' component='h4'>{HelpData.InputGeology.title}</Typography>
            <Box p={3}>
                <img src={HelpData.InputGeology.image} alt="" width="80%" />
                <Typography variant="h6" component="div" marginY={2}>Description: {HelpData.InputGeology.description}</Typography>
                <ul>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Create New: {HelpData.InputGeology.create_geology}</Box>
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Input General: {HelpData.InputGeology.general_description}</Box>
                        <img src={HelpData.InputGeology.general_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Input Markscheiderei: {HelpData.InputGeology.markscheiderei_description}</Box>
                        <img src={HelpData.InputGeology.markscheiderei_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Input Laboratory: {HelpData.InputGeology.laboratory_description}</Box>
                        <img src={HelpData.InputGeology.laboratory_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Input Geology: {HelpData.InputGeology.geology_description}</Box>
                        <img src={HelpData.InputGeology.geology_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Export Geology: {HelpData.InputGeology.export_description}</Box>
                        <img src={HelpData.InputGeology.export_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Shift Geology: {HelpData.InputGeology.shift_description}</Box>
                        <img src={HelpData.InputGeology.shift_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Shift Buttons: {HelpData.InputGeology.shift_button_description}</Box>
                        <img src={HelpData.InputGeology.shift_button_image} alt="" width="40%" />
                    </li>
                    <li style={{ paddingTop: '10px' }}>
                        <Box>Shift History: {HelpData.InputGeology.shift_history_description}</Box>
                        <img src={HelpData.InputGeology.shift_history_image} alt="" width="40%" />
                    </li>
                </ul>
            </Box>
        </section>
    )
}

export default InputGeology;