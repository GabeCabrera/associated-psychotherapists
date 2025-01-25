"use client"

import { Box, Container } from '@mui/material';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppAppBar from './components/AppAppBar/AppAppBar'; // Ensure this file exists at the specified path
import Hero from './components/Hero';
import Footer from './components/Footer';
import EmblaCarousel from './components/EmblaCarousel/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel'


const OPTIONS: EmblaOptionsType = { loop: true }
const slideData = [
    {
        id: 1,
        title: 'I have been going to therapy with Jason Williams for several years now. Mr. Williams has been very open minded, honest, kind and patient in working with me, even when I was at my very worst.',
        description: 'Karlie Marsh',
        avatar: '#1976d2'
    },
    {
        id: 2,
        title: 'I have been to three different psychologists over the past five years, and Dr. Christensen is by far the best doctor I have ever had. He is an A+ doctor! I would reccomend him to anyone.',
        description: 'Elisabeth Campbell',
        avatar: '#1976d2'
    },
    {
        id: 3,
        title: 'Love Christie Powell, she helped me so much with my anxiety and depression throughout and after my pregnancy. She is very knowledgeable and understanding. She has great techniques for coping and resources.',
        description: 'Caitlyn Harper',
        avatar: '#1976d2'
    },
]
const SLIDES = slideData.map((slide) => ({
    key: slide.id,
    title: slide.title,
    description: slide.description,
    avatar: slide.avatar,
}));


export default function Home() {

  return (
    <Box>
      <AppAppBar />
      <Hero>
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              fontSize: 'clamp(3rem, 10vw, 3rem)',
            }}
          >
            <span style={{ color: '#1976d2' }}>Associated Psychotherapy</span> is committed to strengthening individuals, couples, and family relationships.
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '80%' },
            }}
          >
            Take your first steps today on the road to <span style={{ color: '#1976d2' }}>better</span>, with a free consultation.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
          >
            <Button
              variant="contained"
              size="large"
              fullWidth
              href="#contact"
            >
              Get Started
            </Button>
            <Button variant="outlined" size="large" fullWidth>
              Learn more
            </Button>
          </Stack>
        </Stack>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 20 },
            pb: { xs: 8, sm: 12 },
          }}>
          <EmblaCarousel slides={SLIDES} options={OPTIONS} />
        </Container>
      </Hero>
      <Footer />
    </Box>
  );
}
