'use client'

import { Box, Container, Button, Stack } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { therapistsData, testimonialsData } from '@/data';
import { EmblaOptionsType } from 'embla-carousel'
import AppAppBar from './components/AppAppBar/AppAppBar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import EmblaCarousel from './components/EmblaCarousel/EmblaCarousel';
import StyledCard from './components/StyledCard';
import Link from 'next/link';

const emblaOptions: EmblaOptionsType = { loop: true }


const therapists = therapistsData.map((therapist) => ({
  key: therapist.id,
  title: therapist.title,
  chips: therapist.chips,
  description: therapist.description,
  avatar: therapist.avatar,
}));

const testimonialsSlide = testimonialsData.map((testimonial) => ({
  key: testimonial.id,
  title: testimonial.title,
  description: testimonial.description,
  avatar: testimonial.avatar,
  rating: testimonial.rating,
}));

const scrolltoHash = (element_id: string, offset: number) => {
  const element = document.getElementById(element_id);
  const yOffset = offset;
  if (element) {
    const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

export default function Home() {
  return (
    <Box>
      <AppAppBar />
      <Hero>
        <Stack
          spacing={2}
          useFlexGap
          sx={{
            alignItems: 'center',
            width: { xs: '100%', sm: '70%' },
          }}
        >
          <Typography
            variant='h1'
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
              variant='contained'
              size='large'
              fullWidth
              href='/schedule'
            >
              Get Started
            </Button>
            <Button variant='outlined' size='large' fullWidth onClick={() => scrolltoHash('therapists', -160)}>
              Learn more
            </Button>
          </Stack>
        </Stack>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 14, sm: 10 },
            pb: { xs: 1, sm: 1 },
          }}>
          <EmblaCarousel slides={testimonialsSlide} options={emblaOptions} />
        </Container>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 1, sm: 5 },
            pb: { xs: 1, sm: 5 },
            borderRadius: 'calc(8px + 8px) calc(8px + 8px) 0 0',
            bgcolor: '#6da2d6',
          }}>
          <Container id='therapists' sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', pt: { xs: 3 } }}>
            <Typography variant='h3' component='div' gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 300, color: 'white' }}>
              Meet Our Therapists
            </Typography>
            <Container
              sx={{
                display: 'flex',
                gap: 3,
                justifyContent: 'center',
                flexWrap: 'wrap',
                width: '100%',
              }}
            >
              {therapists.map((therapist) => (
                <StyledCard {...therapist} key={therapist.key} />
              ))}
            </Container>
          </Container>
        </Container>
        <img src='/intersecting-waves-scattered-alt.svg' alt='logo' width={'100%'} draggable='false' />
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 12,
            pt: { xs: 14, sm: 1 },
            pb: { xs: 1, sm: 3, md: 5, lg: 8 },
          }}>
          <Grid container spacing={2}>
            <Grid size={8}>
              <Typography
                variant='h4'
                component='div'
                gutterBottom
                sx={{ fontFamily: 'Roboto', fontWeight: 400, color: '#1976d2' }}
              >
                REACH OUT TODAY
              </Typography>
              <Typography
                variant='h5'
                component='div'
                gutterBottom
                sx={{ fontFamily: 'Roboto', fontWeight: 300, width: '85%', }}
              >
                Join the community of people who decided to get help and get happy with <span style={{ color: '#1976d2' }}>Associated Psychotherapists</span>
              </Typography>
              <Button
                variant='contained'
                size='large'
                fullWidth
                href='/schedule'
                sx={{
                  mt: 16,
                  width: '85%',
                }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid size={4}>
              <img src='/people-cta.png' alt='logo' width={'100%'} draggable='false' style={{ borderRadius: '50% 5px 5px 5px' }} />
            </Grid>
          </Grid>
        </Container>
        <Typography variant='body2' sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
          If you are in a crisis or any other person may be in danger - don't use this site. <Link href='/resources' style={{ color: '#1976d2' }}>These resources</Link> can provide you with immediate help.
        </Typography>
      </Hero>
      <Footer />
    </Box>
  );
};
