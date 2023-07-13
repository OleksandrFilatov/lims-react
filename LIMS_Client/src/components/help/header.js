import { Box, IconButton } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from "next/router";

const Header = (props) => {

    const router = useRouter();

    return (
        <Box px={4} py={1} display="flex" position="fixed" width="100%" top={0} zIndex={1020} alignItems="center" justifyContent="space-between" sx={{ backgroundColor: 'white', borderBottom: '1px solid #eee' }}>
            <img src="/static/logo/Sachtleben_Technology_Logo.svg" alt="" height="70px" />
            <Box>
                {
                    props.width < 768 && (
                        <IconButton aria-label="delete" onClick={() => props.setShow(!props.show)}>
                            <MenuIcon />
                        </IconButton>
                    )
                }
                <IconButton aria-label="delete" onClick={() => router.push('/input/laboratory')}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </Box>
    )
}

export default Header;