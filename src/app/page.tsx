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
import StyledCard from './components/StyledCard';

const emblaOptions: EmblaOptionsType = { loop: true }


const therapistsData = [
  {
    id: 1,
    title: 'Jason Williams',
    chips: ['Individual', 'Couples', 'Family'],
    description: 'Jason Williams is a licensed therapist with over 10 years of experience. He specializes in individual, couples, and family therapy.',
    avatar: 'JW'
  },
  {
    id: 2,
    title: 'John Arrington',
    chips: ['Individual', 'Couple', 'Family'],
    description: 'John Arrington is a licensed therapist with over 10 years of experience. He specializes in individual, couples, and family therapy.',
    avatar: 'JA'
  },
  {
    id: 3,
    title: 'Cyndi Tangren',
    chips: ['Marriage', 'Family', 'Couple'],
    description: 'Cyndi Tangren is a licensed therapist with over 10 years of experience. She specializes in marriage, family, and individual therapy.',
    avatar: 'CT'
  },
  {
    id: 4,
    title: 'Christi Powell',
    chips: ['Marriage', 'Family', 'Individual'],
    description: 'Christi Powell is a licensed therapist with over 10 years of experience. She specializes in marriage, family, and individual therapy.',
    avatar: 'CP'
  },
  {
    id: 5,
    title: 'Tyler Beckstrand',
    chips: ['Marriage', 'Family', 'Individual'],
    description: 'Tyler Beckstrand is a licensed therapist with over 10 years of experience. She specializes in marriage, family, and individual therapy.',
    avatar: 'CP'
  },
];


const testimonialsData = [
  {
    id: 1,
    title: 'I have been going to therapy with Jason Williams for several years now. Mr. Williams has been very open minded, honest, kind and patient in working with me, even when I was at my very worst.',
    description: 'Karlie Marsh',
    avatar: '#1976d2',
    rating: 5
  },
  {
    id: 2,
    title: 'I have been to three different psychologists over the past five years, and Dr. Christensen is by far the best doctor I have ever had. He is an A+ doctor! I would reccomend him to anyone.',
    description: 'Elisabeth Campbell',
    avatar: '#1976d2',
    rating: 5

  },
  {
    id: 3,
    title: 'Love Christie Powell, she helped me so much with my anxiety and depression throughout and after my pregnancy. She is very knowledgeable and understanding. She has great techniques for coping and resources.',
    description: 'Caitlyn Harper',
    avatar: '#1976d2',
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
            pb: { xs: 1, sm: 3 },
          }}>
          <EmblaCarousel slides={testimonialsSlide} options={emblaOptions} />
        </Container>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: { xs: 1, sm: 5 },
            pb: { xs: 8, sm: 10 },
            borderRadius: 'calc(8px + 8px)',
            boxShadow: 'rgba(25, 118, 210, 0.4) 0px 5px, rgba(25, 118, 210, 0.3) 0px 10px, rgba(25, 118, 210, 0.2) 0px 15px, rgba(25, 118, 210, 0.1) 0px 20px, rgba(25, 118, 210, 0.05) 0px 25px',
            backgroundImage:
                    'linear-gradient(0deg, rgba(25, 118, 210, 0.7) 0%, rgba(25, 118, 210, 0.9) 20%,rgba(25,118,210,1) 100%)',
          }}>
          <Container sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
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
      </Hero>
      <Footer />
    </Box>
  );
}
