"use client";

import AppAppBar from "@/app/components/AppAppBar/AppAppBar";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import { Box, Card, Container, Typography } from "@mui/material";
import { resourceData } from "@/data";

export default function Resources() {
    return (
        <Box>
            <AppAppBar />
            <Hero>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        pt: { xs: 5, sm: 5, md: 5, lg: 0 },
                        pb: { xs: 5, sm: 5, md: 0, lg: 0 },
                    }}
                >
                    <Card
                        sx={{
                            width: '80%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'left',
                            pb: 5,
                            px: 3,
                            borderRadius: 2,
                            boxShadow: 'rgba(17, 17, 26, 0.27) 0px 4px 12px, rgba(17, 17, 26, 0.07) 0px 8px 10px',
                        }}
                    >
                        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography variant="h3" component="div" gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 300, mt: 3 }}>
                                United States
                            </Typography>
                        </Container>
                        <Container
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'left'
                            }}>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'baseline',
                                mb: 1
                            }}>
                                <h4>EMERGENCY:</h4>
                                <h4 style={{ color: 'red' }} >
                                    &nbsp; 911
                                </h4>
                            </Box>
                            {resourceData.map((data) => (
                                <Box key={data.id} sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'baseline',
                                    mb: 1,
                                    textWrap: 'noWrap'
                                }}>
                                    <h4>{data.title}:</h4>
                                    <h4 style={{ color: '#6DA2D6' }} >
                                        &nbsp;{data.phoneNumber ? data.phoneNumber : ''},&nbsp;
                                        {data.website ?
                                            <a
                                                style={{
                                                    color: '#424242',
                                                    fontWeight: 'normal',
                                                    textDecoration: 'underline'
                                                }}
                                                href={'https://www.' + data.website}
                                            >
                                                {data.website}
                                            </a> : ''}
                                    </h4>
                                </Box>
                            ))}
                        </Container>
                    </Card>
                    <Typography 
                        variant="subtitle1" 
                        component="div" 
                        gutterBottom 
                        sx={{ 
                            fontFamily: 'Roboto', 
                            fontWeight: 300, 
                            fontSize: '0.8rem', 
                            mt: 3, 
                            maxWidth: '75%'
                        }}>
                        Updated on Jan 27th, 2025.
                        Associated Psychotherapy assumes no responsibility or liability for the professional ability, reputation, or quality of services provided by the entities or individuals listed above. Inclusion on this list does not constitute an endorsement by Associated Psychotherapy. The order does not imply any ranking or evaluation. Associated Psychotherapy cannot vouch for the contact information's accuracy; If you discover any inaccuracies in the contact information, please email us at contact@associatedpsych.com so we can update it.
                    </Typography>
                </Container>
            </Hero>
            <Footer />
        </Box>
    );
}