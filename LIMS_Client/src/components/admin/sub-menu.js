import { useState } from "react";
import { Box, Button } from "@mui/material";
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import axiosFetch from "../../utils/axiosFetch";
import toast from "react-hot-toast";

const SubMenu = (props) => {

    const [pending, setPending] = useState(false);

    const handleBackup = async () => {
        if (window.confirm('Database will be backuped in db folder of server. Do you want to continue?')) {
            try {
                setPending(true);
                const res = await axiosFetch.post('/api/settings/backup_db');
                if (res.data?.success) {
                    toast.success('Export success');
                }
                setPending(false);
            } catch (err) {
                setPending(false);
                toast.error(err.response.data);
            }
        }
    }

    const handleRestore = async () => {
        if (window.confirm('Do you want to restore latest dump db?')) {
            try {
                setPending(true);
                const res = await axiosFetch.post('/api/settings/restore_db');
                if (res.data?.success) {
                    toast.success('Import success');
                }
                setPending(false);
            } catch (err) {
                setPending(false);
                toast.error(err.response.data);
            }
        }
    }
    return (
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ backgroundColor: 'white', px: 4, py: 2 }}>
            <Box>
                <Button variant="text" sx={{ color: 'black' }}>{props.parentItem}</Button>
                &nbsp;/&nbsp;
                <Button variant="text" sx={{ color: 'black' }}>{props.menuItem}</Button>
            </Box>
            <Box>
                <Button size='small' variant='contained' sx={{ mx: 2 }} disabled={pending} onClick={handleRestore}>
                    <UploadIcon />&nbsp;Import Database
                </Button>
                <Button size='small' variant='contained' disabled={pending} onClick={handleBackup}>
                    <DownloadIcon />&nbsp;Export Database
                </Button>
            </Box>

        </Box>
    )
}

export default SubMenu;