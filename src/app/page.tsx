"use client"

import { Box, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AppAppBar from './components/AppAppBar/AppAppBar'; // Ensure this file exists at the specified path
import Hero from './components/Hero';
import Footer from './components/Footer';
import EmblaCarousel from './components/EmblaCarousel/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel'
import StyledCard from './components/StyledCard';

const emblaOptions: EmblaOptionsType = { loop: true }


const therapistsData = [
  {
    id: 1,
    title: 'Jason Williams',
    chips: ['Individual', 'Couples', 'Family'],
    description: 'Jason Williams dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    avatar: 'JW'
  },
  {
    id: 2,
    title: 'John Arrington',
    chips: ['Individual', 'Couple', 'Family'],
    description: 'John Arrington dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    avatar: 'JA'
  },
  {
    id: 3,
    title: 'Cyndi Tangren',
    chips: ['Marriage', 'Family', 'Couple'],
    description: 'Cyndi Tangren dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    avatar: 'CT'
  },
  {
    id: 4,
    title: 'Christi Powell',
    chips: ['Marriage', 'Family', 'Individual'],
    description: 'Christi Powell dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    avatar: 'CP'
  },
  {
    id: 5,
    title: 'Tyler Beckstrand',
    chips: ['Marriage', 'Family', 'Individual'],
    description: 'Tyler Beckstrand dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    avatar: 'CP'
  },
];


const testimonialsData = [
  {
    id: 1,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    description: 'Karlie Marsh',
    avatar: '#6DA2D6',
    rating: 5
  },
  {
    id: 2,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    description: 'Elisabeth Campbell',
    avatar: '#6DA2D6',
    rating: 5

  },
  {
    id: 3,
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    description: 'Caitlyn Harper',
    avatar: '#6DA2D6',
    rating: 4.5

  },
];

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
            boxShadow: 'rgba(25, 118, 210, 0.4) 0px 5px, rgba(25, 118, 210, 0.3) 0px 10px, rgba(25, 118, 210, 0.2) 0px 15px, rgba(25, 118, 210, 0.1) 0px 20px, rgba(25, 118, 210, 0.05) 0px 25px',
            bgcolor: '#6da2d6',
            }}>
          <Container sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', pt: { xs: 3 } }}>
            <Typography variant="h3" component="div" gutterBottom sx={{ fontFamily: 'Roboto', fontWeight: 300, color: 'white' }}>
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
                <StyledCard {...therapist} key={therapist.key}/>
              ))}
            </Container>
          </Container>
        </Container>
        <img src='/intersecting-waves-scattered-alt.svg' alt="logo" width={'100%'} draggable='false' />
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
                variant="h4" 
                component="div" 
                gutterBottom 
                sx={{ fontFamily: 'Roboto', fontWeight: 400, color: '#1976d2' }}
              >
                REACH OUT TODAY
              </Typography>
              <Typography 
                variant="h5" 
                component="div" 
                gutterBottom 
                sx={{ fontFamily: 'Roboto', fontWeight: 300, width: '85%', }}
                >
                  Join the community of people who decided to get help and get happy with <span style={{ color: '#1976d2'}}>Associated Psychotherapists</span>
                </Typography>
                <Button
                variant="contained"
                size="large"
                fullWidth
                href="#contact"
                sx={{ 
                  mt: 16,
                  width: '85%',

                 }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid size={4}>
              <img src='/people-cta.png' alt="logo" width={'100%'} draggable='false' style={{ borderRadius: '50% 5px 5px 5px'}}/>
            </Grid>        
          </Grid>
        </Container>
        <Typography variant='body2' sx={{ textAlign: 'center', mt: 5, color: 'text.secondary' }}>
          If you are in a crisis or any other person may be in danger - don't use this site. <a href='#' style={{ color: '#1976d2'}}>These resources</a> can provide you with immediate help.
        </Typography>
      </Hero>
      <Footer />
    </Box>
  );
}
