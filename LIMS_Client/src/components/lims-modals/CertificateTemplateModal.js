import React, { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Switch } from '@mui/material';
import { Upload, Modal as AntdModal } from "antd";
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ServerUri } from '../../config';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -32%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '1px solid #d8dbe0',
    boxShadow: 24,
    borderRadius: '10px'
};

const CertificateTemplateModal = (props) => {

    const { t } = useTranslation();

    const [rowId, setRowId] = useState('');
    const [samenameerror, setNameDuplicated] = useState(false);
    const [name, setName] = useState('');
    const [certificateTitle, setCertificateTitle] = useState('');
    const [company, setCompany] = useState('');
    const [header_left, setHeaderLeft] = useState(0);
    const [header_top, setHeaderTop] = useState(0);
    const [header_width, setHeaderWidth] = useState(0);
    const [header_height, setHeaderHeight] = useState(0);
    const [header_keep_relation, setHeaderKeepRelation] = useState(false);
    const [footer_left, setFooterLeft] = useState(0);
    const [footer_bottom, setFooterBottom] = useState(0);
    const [footer_width, setFooterWidth] = useState(0);
    const [footer_height, setFooterHeight] = useState(0);
    const [footer_keep_relation, setFooterKeepRelation] = useState(false);
    const [place, setPlace] = useState('');
    const [date_format, setDateFormat] = useState('DD.MM.YYYY');
    const [fileList, setFileList] = useState([]);
    const [fileList_Footer, setFileListFooter] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage_Footer, setPreviewImageFooter] = useState(null);
    const [previewVisible_Footer, setPreviewVisibleFooter] = useState(false);
    const [header_old_width, setHeaderOldWidth] = useState(0);
    const [header_old_height, setHeaderOldHeight] = useState(0);
    const [footer_old_width, setFooterOldWidth] = useState(0);
    const [footer_old_height, setFooterOldHeight] = useState(0);


    const { certificateTemplates } = useSelector(state => state.certificateTemplate);

    useEffect(() => {
        if (props.id !== '') {
            const selectedTemplate = certificateTemplates.filter(item => item._id === props.id)[0];
            var logodata = {
                originFileObj: { uid: selectedTemplate.logoUid },
                url: `${ServerUri}/uploads/certificates/${selectedTemplate.logo_filename}`,
            };
            var footerdata = {
                originFileObj: { uid: selectedTemplate.footerUid },
                url: `${ServerUri}/uploads/certificates/${selectedTemplate.footer_filename}`,
            };
            setRowId(props.id);
            setName(selectedTemplate.name);
            setCertificateTitle(selectedTemplate.certificatetitle);
            setCompany(selectedTemplate.company);
            setPlace(selectedTemplate.place);
            setFileListFooter([footerdata]);
            setFileList([logodata]);
            setDateFormat(selectedTemplate.date_format);
            setHeaderLeft(selectedTemplate.header_styles.left);
            setHeaderTop(selectedTemplate.header_styles.top);
            setHeaderWidth(selectedTemplate.header_styles.width);
            setHeaderHeight(selectedTemplate.header_styles.height);
            setHeaderOldWidth(selectedTemplate.header_styles.width);
            setHeaderOldHeight(selectedTemplate.header_styles.height);
            setHeaderKeepRelation(selectedTemplate.header_styles.keep_distance);
            setFooterLeft(selectedTemplate.footer_styles.left);
            setFooterBottom(selectedTemplate.footer_styles.bottom);
            setFooterWidth(selectedTemplate.footer_styles.width);
            setFooterHeight(selectedTemplate.footer_styles.height);
            setFooterOldWidth(selectedTemplate.footer_styles.width);
            setFooterOldHeight(selectedTemplate.footer_styles.height);
            setFooterKeepRelation(selectedTemplate.footer_styles.keep_distance);
        }
    }, [props.id])

    const handleCreate = () => {
        if (name === '' || name === 0) {
            toast.error('Name is required');
            return;
        }
        if (certificateTitle === '') {
            toast.error('Certificate title is required');
            return;
        }
        if (fileList.length === 0 || fileList_Footer.length === 0 || samenameerror === true) {
            return;
        }
        const data = {
            name: name,
            certificatetitle: certificateTitle,
            fileList_Footer: fileList_Footer,
            fileList: fileList,
            company: company,
            place: place,
            rowid: rowId,
            samenameerror: samenameerror,
            date_format: date_format,
            header_left: header_left,
            header_top: header_top,
            header_width: header_width,
            header_height: header_height,
            header_keep_distance: header_keep_relation,
            footer_left: footer_left,
            footer_bottom: footer_bottom,
            footer_width: footer_width,
            footer_height: footer_height,
            footer_keep_distance: footer_keep_relation
        };
        props.handleCreate(data);
    }

    const handleChangeName = (e) => {
        setName(e.target.value);
        setNameDuplicated(certificateTemplates.filter(item => item.name === e.target.value).length > 0);
    }

    const handleFileSelect = (file) => {
        setFileList(file.fileList);
    };

    const handleUpload_footer = (file) => {
        setFileListFooter(file.fileList);
    };

    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={props.open}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2" color="#65748B" borderBottom="1px solid #d8dbe0" px={4} py={2}>
                        {props.id === '' ? t('Create New') : t('Update')}&nbsp;{t('Certificate Template')}
                    </Typography>
                    <Box m={2} p={2} border="1px solid #d8dbe0" borderRadius='5px'>
                        <TextField
                            required
                            label={t("Name")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={handleChangeName}
                            value={name}
                        />
                        {/* {
                            samenameerror && <Box className="invalid-feedback" display="block">Name already existed</Box>
                        } */}
                        <TextField
                            required
                            label={t("Certificate Title")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setCertificateTitle(e.target.value)}
                            value={certificateTitle}
                        />
                        <TextField
                            label={t("Company")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setCompany(e.target.value)}
                            value={company}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Box display="block" margin="auto">
                                    <Typography>Logo</Typography>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onPreview={(f) => setPreviewImage(f.thumbUrl) & setPreviewVisible(true)}
                                        onChange={handleFileSelect}
                                        beforeUpload={() => false}
                                    >
                                        {fileList.length > 0 ? "" : <Box className="ant-upload-text">Upload</Box>}
                                    </Upload>
                                    <AntdModal
                                        visible={previewVisible}
                                        footer={null}
                                        onCancel={() => setPreviewVisible(false)}
                                    >
                                        <img
                                            alt="example"
                                            style={{ width: "100%" }}
                                            src={previewImage}
                                        />
                                    </AntdModal>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="block" m="auto">
                                    <Typography>Footer</Typography>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList_Footer}
                                        onPreview={(f) => setPreviewImageFooter(f.thumbUrl) & setPreviewVisibleFooter(true)}
                                        onChange={handleUpload_footer}
                                        beforeUpload={() => false}
                                    >
                                        {fileList_Footer.length > 0 ? "" : <Box className="ant-upload-text">Upload</Box>}
                                    </Upload>
                                    <AntdModal
                                        visible={previewVisible_Footer}
                                        footer={null}
                                        onCancel={() => setPreviewVisibleFooter(false)}
                                    >
                                        <img
                                            alt="example"
                                            style={{ width: "100%" }}
                                            src={previewImage_Footer}
                                        />
                                    </AntdModal>
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Distance vom left side[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => setHeaderLeft(e.target.value)}
                                    value={header_left}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Distance vom left side[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => setFooterLeft(e.target.value)}
                                    value={footer_left}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Distance from top[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => setHeaderTop(e.target.value)}
                                    value={header_top}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Distance from bottom[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => setFooterBottom(e.target.value)}
                                    value={footer_bottom}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Width[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => {
                                        if (header_old_width !== 0 && header_old_height !== 0 && header_keep_relation === true) {
                                            setHeaderHeight(Number((e.target.value * header_old_height) / header_old_width).toFixed(2));
                                        }
                                        setHeaderWidth(e.target.value);
                                    }}
                                    value={header_width}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Width[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => {
                                        if (footer_old_width !== 0 && footer_old_height !== 0 && footer_keep_relation === true) {
                                            setFooterHeight(Number((e.target.value * footer_old_height) / footer_old_width).toFixed(2));
                                        }
                                        setFooterWidth(e.target.value)
                                    }}
                                    value={footer_width}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Height[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => {
                                        if (header_old_width !== 0 && header_old_height !== 0 && header_keep_relation === true) {
                                            setHeaderWidth(Number((e.target.value * header_old_width) / header_old_height).toFixed(2));
                                        }
                                        setHeaderHeight(e.target.value);
                                    }}
                                    value={header_height}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    required
                                    label={t("Height[cm]")}
                                    fullWidth
                                    sx={{ my: 1 }}
                                    onChange={(e) => {
                                        if (footer_old_width !== 0 && footer_old_height !== 0 && footer_keep_relation === true) {
                                            setFooterWidth(Number((e.target.value * footer_old_width) / footer_old_height).toFixed(2));
                                        }
                                        setFooterHeight(e.target.value);
                                    }}
                                    value={footer_height}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <span>Keep Relation</span>
                                    <Switch onChange={(e) => setHeaderKeepRelation(e.target.checked)} checked={header_keep_relation} />
                                </Box>
                            </Grid>
                            <Grid item xs={6}>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <span>Keep Relation</span>
                                    <Switch onChange={(e) => setFooterKeepRelation(e.target.checked)} checked={footer_keep_relation} />
                                </Box>
                            </Grid>
                        </Grid>
                        <TextField
                            label={t("Place")}
                            fullWidth
                            sx={{ my: 1 }}
                            onChange={(e) => setPlace(e.target.value)}
                            value={place}
                        />
                        <FormControl fullWidth sx={{ mt: 1 }}>
                            <InputLabel id="demo-simple-select-label">{t('Date Format')}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={date_format}
                                label={`${t('Date Format')}`}
                                onChange={(e) => setDateFormat(e.target.value)}
                            >
                                <MenuItem value="DD.MM.YYYY">DD.MM.YYYY</MenuItem>
                                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                                <MenuItem value="MM-DD-YYYY">MM-DD-YYYY</MenuItem>
                                <MenuItem value="YYYY/MM/DD">YYYY/MM/dd</MenuItem>
                            </Select>
                        </FormControl>
                        <Box mt={1} display="flex" justifyContent="end">
                            <Button variant="outlined" sx={{ mx: 1 }} onClick={props.handleClose}>Cancel</Button>
                            <Button variant="contained" onClick={handleCreate}>{props.id === '' ? 'Create' : 'Update'}</Button>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default CertificateTemplateModal;