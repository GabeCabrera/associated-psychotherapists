import * as React from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { StyledToolbar } from './StyledToolBar';
import Link from 'next/link';

export default function AppAppBar() {
    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                mt: 'calc(var(--template-frame-height, 0px) + 28px)',
                zIndex: 1000,
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        px: 0,
                    }}>
                        <Link href='/' style={{ marginBottom: 0, paddingBottom: 0}}><img src="/ap-logo-primary.svg" alt="logo" width={400} height={60} draggable='false' /></Link>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            gap: 1,
                            alignItems: 'center',
                        }}
                    >
                        <Button color='primary' variant="text" size="small" href={'/schedule'} sx={{ fontWeight: 600 }}>
                            Schedule an Appointment
                        </Button>
                        <Button color='primary' variant="text" size="small" href={'/'} sx={{ mr: 3, fontWeight: 600 }}>
                            Home
                        </Button>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
                        <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                            PaperProps={{
                                sx: {
                                    top: 'var(--template-frame-height, 0px)',
                                },
                            }}
                        >
                            <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>

                                <MenuItem>Home</MenuItem>
                                <MenuItem>Request An Appointment</MenuItem>
                                <MenuItem>About Us</MenuItem>


                                <Divider sx={{ my: 3 }} />
                                <MenuItem>
                                    <Button color="primary" variant="outlined" fullWidth>
                                        Sign in
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
