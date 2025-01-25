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
            id="hero"
            sx={{
                width: '100vw',
                backgroundRepeat: 'no-repeat',
                backgroundImage:
                    'radial-gradient(ellipse 80% 100% at 50% -10%, hsl(210, 100%, 90%), transparent)',
                }}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 14, sm: 30 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                {children}
            </Container>
        </Box>
    );
};

export default Hero;
