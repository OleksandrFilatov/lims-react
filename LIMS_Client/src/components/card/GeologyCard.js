import { useEffect, useState } from 'react';
import { Box, Button, Grid, IconButton, Typography } from "@mui/material"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ListOutlinedIcon from '@mui/icons-material/ListOutlined';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import DownloadIcon from '@mui/icons-material/Download';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const GeologyCard = ({
    geology,
    handleDelete,
    handleShift,
    handleViewComments,
    setID,
    setOpenGeneral,
    setOpenMarkscheiderei,
    setOpenLaboratory,
    setOpenGeology,
    date_format
}) => {

    const { t } = useTranslation();
    const [check_sum, setCheckSum] = useState(0);

    useEffect(() => {
        if (geology.laboratory) {
            let sum = 0;
            const selected_objective_values = geology.laboratory_data.objective_values;

            selected_objective_values.map(obj => {
                sum += Number(obj.obj.unit.unit === '%' ? obj.value : obj.obj.unit.unit === 'ppm' ? obj.value / 10000 : obj.value * 100);
            });
            setCheckSum(sum.toFixed(2));
        }
    }, [geology]);

    return (
        <Box m={1} p={1} border="1px solid #ddd" borderRadius="10px" backgroundColor="#eee">
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <span style={{ color: (geology.general && geology.general_data[0].hole_id.value !== '') ? 'green' : 'black' }}>
                    {t("HOLEID")}: {geology.general && geology.general_data[0].hole_id.value !== '' ? geology.general_data[0].hole_id.value : 'XXXXX'}
                </span>
                <Box display="flex" alignItems="center" justifyContent="end">
                    {
                        geology.check_status >= 2 && (
                            <IconButton
                                aria-label="settings"
                                id="basic-button"
                                onClick={() => handleShift(geology._id, geology.check_status + 1)}
                                disabled={geology.check_status === 3}
                            >
                                <DownloadIcon />
                            </IconButton>
                        )
                    }
                    <IconButton
                        aria-label="settings"
                        id="basic-button"
                        onClick={() => handleViewComments(geology._id)}
                    >
                        <ListOutlinedIcon />
                    </IconButton>
                    <IconButton
                        aria-label="settings"
                        id="basic-button"
                        onClick={() => handleDelete(geology._id)}
                    >
                        <DeleteForeverOutlinedIcon />
                    </IconButton>
                </Box>
            </Box>
            <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                    <Button
                        variant="contained"
                        sx={{ width: '100%', color: geology.general ? 'green' : 'white' }}
                        onClick={() => setID(geology._id) & setOpenGeneral(true)}
                        size="small"
                    >{t("General")}</Button>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Button
                        variant="contained"
                        sx={{ width: '100%', color: geology.markscheiderei ? 'green' : 'white' }}
                        onClick={() => setID(geology._id) & setOpenMarkscheiderei(true)}
                        size="small"
                    >{t("Markscheiderei")}</Button>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Button
                        variant="contained"
                        sx={{ width: '100%', color: geology.laboratory ? (check_sum >= 90 && check_sum <= 100) ? 'green' : '#dd1e1e' : 'white' }}
                        onClick={() => setID(geology._id) & setOpenLaboratory(true)}
                        size="small"
                    >{t("Laboratory")}</Button>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Button
                        variant="contained"
                        sx={{ width: '100%', color: geology.geology ? 'green' : 'white' }}
                        onClick={() => setID(geology._id) & setOpenGeology(true)}
                        size="small"
                    >{t("Geology")}</Button>
                </Grid>
            </Grid>
            <Typography variant="h6" component="h6" textAlign="center">
                <span style={{ color: geology.geology ? 'green' : 'black' }}>
                    {t("SAMPLE")}: {geology.geology ? geology.geology_data[0].sample.value : 'YYYYY'}
                </span>,
                <span style={{ color: geology.laboratory ? 'green' : 'black' }}>
                    {t("DATE")}: {geology.laboratory ? moment(geology.laboratory_data.date.value).format(date_format) : 'XXXXX'}
                </span>
            </Typography>
            <Typography variant="h6" component="h6" textAlign="center">
                <span style={{ color: geology.laboratory ? 'green' : 'black' }}>{t("Check Sum")}: {Number(check_sum)}</span>
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between">
                <IconButton
                    aria-label="settings"
                    id="basic-button"
                    onClick={() => handleShift(geology._id, geology.check_status - 1)}
                    disabled={geology.check_status === 0}
                >
                    <SkipPreviousIcon />
                </IconButton>
                <IconButton
                    aria-label="settings"
                    id="basic-button"
                    onClick={() => handleShift(geology._id, geology.check_status + 1)}
                    disabled={geology.check_status === 3}
                >
                    <SkipNextIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default GeologyCard;