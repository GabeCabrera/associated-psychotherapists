import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Chip, Container } from '@mui/material';

const therapistsData = [
    {
        id: 1,
        title: 'Jason Williams',
        specialities: ['Individual', 'Couples', 'Family'],
        description: 'Jason Williams is a licensed therapist with over 10 years of experience. He specializes in individual, couples, and family therapy.',
        avatar: 'JW'
    },
    {
        id: 2,
        title: 'John Arrington',
        specialities: ['Individual', 'Couple', 'Family'],
        description: 'John Arrington is a licensed therapist with over 10 years of experience. He specializes in individual, couples, and family therapy.',
        avatar: 'JA'
    },
    {
        id: 3,
        title: 'Cyndi Tangren',
        specialities: ['Marriage', 'Family', 'Couple'],
        description: 'Cyndi Tangren is a licensed therapist with over 10 years of experience. She specializes in marriage, family, and individual therapy.',
        avatar: 'CT'
    },
    {
        id: 4,
        title: 'Christi Powell',
        specialities: ['Marriage', 'Family', 'Individual'],
        description: 'Christi Powell is a licensed therapist with over 10 years of experience. She specializes in marriage, family, and individual therapy.',
        avatar: 'CP'
    },
    {
        id: 5,
        title: 'Tyler Beckstrand',
        specialities: ['Marriage', 'Family', 'Individual'],
        description: 'Tyler Beckstrand is a licensed therapist with over 10 years of experience. She specializes in marriage, family, and individual therapy.',
        avatar: 'CP'
    },
];

const therapists = therapistsData.map((therapist) => ({
    key: therapist.id,
    title: therapist.title,
    specialities: therapist.specialities,
    description: therapist.description,
    avatar: therapist.avatar,
}));

export default function MediaCard() {
    return (
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
                    <Card sx={{
                        width: 270,
                        margin: 2,
                        pb: 3,
                        px: 3,
                        borderRadius: 2,
                        boxShadow: 'rgba(17, 17, 26, 0.5) 0px 4px 16px, rgba(17, 17, 26, 0.07) 0px 8px 32px',
                    }}
                        key={therapist.key}
                    >
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ height: '4rem', width: '4rem' }}>{therapist.avatar}</Avatar>{therapist.title}
                            </Typography>
                            {therapist.specialities.map((speciality, index) => (
                                <Chip key={index} label={speciality} size='small' sx={{ m: 0.5 }} />
                            ))}
                            <br />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                                {therapist.description}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" sx={{ p: 1 }}>Learn More</Button>
                        </CardActions>
                    </Card>
                ))}
            </Container>
        </Container>
    )
};