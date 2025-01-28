"use client";

import AppAppBar from "@/app/components/AppAppBar/AppAppBar";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import { Box, Card, Container, Typography } from "@mui/material";

const resourceData = [
    {
        id: 2,
        title: 'Suicide & Crisis Lifeline',
        phoneNumber: '988',
        website: null,
    },
    {
        id: 3,
        title: 'Crisis Text Line',
        phoneNumber: 'Text "DESERVE" TO 741-741',
        website: null
    },
    {
        id: 4,
        title: 'Essential Local And Community Services',
        phoneNumber: '211',
        website: '211.org'
    },
    {
        id: 5,
        title: 'Lifeline Crisis Chat (Online Live Messaging)',
        phoneNumber: '988',
        website: '988lifeline.org/chat',
    },
    {
        id: 6,
        title: 'LGBT Hotline',
        phoneNumber: '1-888-843-4564',
        website: null,
    },
    {
        id: 7,
        title: 'National Council On Alcoholism & Drug Dependency Hope Line',
        phoneNumber: '1-800-622-2255',
        website: null,
    },
    {
        id: 8,
        title: 'National Crisis Line - Anorexia And Bulimia',
        phoneNumber: '1-800-233-4357',
        website: null,
    },
    {
        id: 9,
        title: 'National Domestic Violence Hotline',
        phoneNumber: '1-800-799-7233',
        website: null,
    },
    {
        id: 10,
        title: 'National Eating Disorders Association (NEDA)',
        phoneNumber: '866-662-1235',
        website: 'nationaleatingdisorders.org',
    },
    {
        id: 11,
        title: 'Planned Parenthood Hotline',
        phoneNumber: '1-800-230-PLAN (7526)',
        website: null,
    },
    {
        id: 12,
        title: 'Self-Harm Hotline',
        phoneNumber: '1-800-366-8288',
        website: null,
    },
    {
        id: 13,
        title: 'TransLifeline',
        phoneNumber: '877-565-8860',
        website: 'translifeline.org',
    },
    {
        id: 14,
        title: 'TREVOR Crisis Hotline',
        phoneNumber: '1-866-221-7044',
        website: null,
    },
    {
        id: 15,
        title: 'Veterans Crisis Line',
        phoneNumber: '',
        website: 'veteranscrisisline.net',
    },
]

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