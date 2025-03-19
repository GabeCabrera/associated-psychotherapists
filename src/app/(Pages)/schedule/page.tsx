"use client";

import AppAppBar from "@/app/components/AppAppBar/AppAppBar";
import Footer from "@/app/components/Footer";
import Hero from "@/app/components/Hero";
import ScheduleForm from "@/app/components/ScheduleForm";
import { Box, Card, Container, Typography } from "@mui/material";

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
                            <Typography variant="h3" component="div" gutterBottom sx={{ fontWeight: 300, mt: 4, fontSize: { xs: 24, sm: 28, md: 32, lg: 48 } }}>
                                Register For a Consultation
                            </Typography>
                            <ScheduleForm />
                        </Container>
                    </Card>
                </Container>
            </Hero>
            <Footer />
        </Box>
    );
}