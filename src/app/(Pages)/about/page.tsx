'use client';

import AppAppBar from '@/app/components/AppAppBar/AppAppBar';
import Footer from '@/app/components/Footer';
import Hero from '@/app/components/Hero';
import { Avatar, Box, Button, Card, Chip, Container, Divider, Tab, Tabs, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useTherapistStore } from '@/store/therapistStore';
import { useState } from 'react';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pt: { xs: 5, sm: 5, md: 5, lg: 0 },
        pb: { xs: 5, sm: 5, md: 0, lg: 0 },
    },
    card: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'left',
        py: 4,
        px: 3,
        borderRadius: 2,
        boxShadow: 'rgba(17, 17, 26, 0.27) 0px 4px 12px, rgba(17, 17, 26, 0.07) 0px 8px 10px',
    },
    button: {
        mr: 4,
        p: 1,
    },
    typography: {
        fontFamily: 'Roboto',
        fontWeight: 400,
        mt: 1.5,
        mb: 0,
        fontSize: { xs: 24, sm: 28, md: 32, lg: 48 },
        color: 'rgba(0, 0, 0, 0.60)',
    },
    chip: {
        my: 1,
        mx: 0.5,
        backgroundColor: 'rgba(171, 204, 237, 0.75)',
        color: 'rgba(0, 0, 0, 0.60)',
    },
};

const Method = ({ children }: { children: React.ReactNode }) => <Typography variant='subtitle2' sx={{ px: 1 }}>{children}</Typography>

const CustomTabPanel = (props: TabPanelProps) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role='tabpanel'
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
};

function tabProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

export default function About() {
    const [value, setValue] = useState(0);
    const { therapist } = useTherapistStore();

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box>
            <AppAppBar />
            <Hero>
                <Container sx={styles.container}>
                    <Card sx={{
                        width: '80%',
                        borderRadius: 'calc(8px + 8px) calc(8px + 8px) calc(8px + 8px) calc(8px + 8px)',
                        boxShadow: 'rgba(17, 17, 26, 0.27) 0px 4px 12px, rgba(17, 17, 26, 0.07) 0px 8px 10px',
                    }}>
                        <div>
                            <Grid sx={{ bgcolor: '#6da2d6', p: 2 }}>
                                <Grid sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Avatar sx={{ height: '8rem', width: '8rem', mr: 2, bgcolor: 'rgba(171, 204, 237, 0.75)', color: 'rgba(0, 0, 0, 0.60)' }}>{therapist.avatar}</Avatar>
                                    <Typography variant='h4' component='div' gutterBottom sx={ styles.typography }>
                                        {therapist.title}<br />
                                        {therapist.chips.map((chip: any) => (
                                            <Chip key={chip} label={chip} size='small' sx={styles.chip} />
                                        ))}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <img src='/intersecting-waves-scattered-alt.svg' alt='logo' width={'100%'} draggable='false' />
                            <Grid sx={{ pt: 3 }}>
                                <Box sx={{ width: '100%' }}>
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                                            <Tab label='About Me' {...tabProps(0)} />
                                            <Tab label='Professional Experience' {...tabProps(1)} />
                                            <Tab label='Reviews' {...tabProps(2)} />
                                        </Tabs>
                                        <Button variant='contained' size='small' sx={styles.button} href='/schedule'>
                                            Schedule an appointment
                                        </Button>
                                    </Box>
                                    <CustomTabPanel value={value} index={0}>
                                        <Typography variant='h6' sx={{ mb: 2 }}>About Me</Typography>
                                        {therapist.description}
                                    </CustomTabPanel>
                                    <CustomTabPanel value={value} index={1}>
                                        Professional Experience
                                    </CustomTabPanel>
                                    <CustomTabPanel value={value} index={2}>
                                        Reviews
                                    </CustomTabPanel>
                                </Box>
                            </Grid>
                        </div>
                    </Card>
                </Container>
            </Hero>
            <Footer />
        </Box>
    );
}