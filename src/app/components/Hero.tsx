import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import './EmblaCarousel/embla.css'
import { ReactNode } from 'react';

interface HeroProps {

    children: ReactNode;

}

const Hero: React.FC<HeroProps> = ({ children }) => {
    return (
        <Box
            id='hero'
            sx={{
                width: '100vw',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 100% at 50% -10%, rgb(239, 237, 225),rgba(239, 237, 225, 0.21))',
                }}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 14, sm: 25 },
                    pb: { xs: 8, sm: 10 },
                }}
            >
                {children}
            </Container>
        </Box>
    );
};

export default Hero;
