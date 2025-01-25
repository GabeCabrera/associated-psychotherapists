"use client"

import { Box } from '@mui/material';
import AppAppBar from './components/AppAppBar'; // Ensure this file exists at the specified path
import Hero from './components/Hero';
import Footer from './components/Footer';

export default function Home() {

  return (
    <Box>
      <AppAppBar/>
      <Hero/>
      <Footer/>
    </Box>
  );
}
