import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar, Chip, Container } from '@mui/material';

export default function MediaCard(data: any) {
    return (
        <Card sx={{
            width: 270,
            margin: 2,
            pb: 3,
            px: 3,
            borderRadius: 2,
            boxShadow: 'rgba(17, 17, 26, 0.5) 0px 4px 16px, rgba(17, 17, 26, 0.07) 0px 8px 32px',
            userSelect: 'none',
            transition: 'transform .2s',
            '&:hover': {
                transform: 'scale(1.01)'
            }
        }}
        >
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ height: '4rem', width: '4rem' }}>{data.avatar}</Avatar>{data.title}
                </Typography>
                {data.chips.map((chip: any) => (
                    <Chip key={chip} label={chip} size='small' sx={{ m: 0.5 }} />
                ))}
                <br />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                    {data.description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" sx={{ p: 1 }}>Learn More</Button>
            </CardActions>
        </Card>
    )
};