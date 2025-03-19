'use client';
import { Button, FormHelperText, FormLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid2';
import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const timeOptions = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour > 12 ? hour - 12 : hour;
    const time = `${formattedHour}:${minute} ${period}`;
    return (
        <MenuItem key={time} value={time}>
            {time}
        </MenuItem>
    );
});

export default function ScheduleForm() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        prefDate: dayjs().startOf('day').format('MM-DD-YYYY'),
        prefTime: timeOptions[0].props.value,
        message: ''
    });
    const [emailError, setEmailError] = useState('');

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, firstName: e.target.value });
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, lastName: e.target.value });
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
        if (value.length > 10) {
            value = value.slice(0, 10); // Limit to 10 digits
        }
        const formattedValue = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        setUserData({ ...userData, phone: formattedValue });
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUserData({ ...userData, email: value });
        const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
        if (!emailRegex.test(value) && value !== '') {
            setEmailError('Invalid email address');
        } else {
            setEmailError('');
        }
    };

    const handleDateChange = (date: any | null) => {
        if (date) {
            setUserData({ ...userData, prefDate: date.startOf('day').format('MM-DD-YYYY') });
        }
    };

    const handleTimeChange = (e: SelectChangeEvent<string>) => {
        setUserData({ ...userData, prefTime: e.target.value });
    };

    const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserData({ ...userData, message: e.target.value });
    };

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log(userData);
    };

    return (
        <Grid container spacing={2}>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }} size={6}>
                <FormLabel htmlFor="first-name" required>
                    First name
                </FormLabel>
                <OutlinedInput
                    id="first-name"
                    name="first-name"
                    type="name"
                    placeholder="First Name"
                    autoComplete="first name"
                    required
                    onChange={handleFirstNameChange}
                />
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }} size={6}>
                <FormLabel htmlFor="last-name" required>
                    Last name
                </FormLabel>
                <OutlinedInput
                    id="last-name"
                    name="last-name"
                    type="name"
                    placeholder="Last Name"
                    autoComplete="last name"
                    required
                    onChange={handleLastNameChange}
                />
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }} size={6}>
                <FormLabel htmlFor="phone" required>
                    Phone
                </FormLabel>
                <OutlinedInput
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="(___) ___-____"
                    autoComplete="tel"
                    required
                    value={userData.phone}
                    onChange={handlePhoneChange}
                />
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }} size={6}>
                <FormLabel htmlFor="country">
                    Email
                </FormLabel>
                <OutlinedInput
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email"
                    onChange={handleEmailChange}
                />
                {emailError && <FormHelperText error>{emailError}</FormHelperText>}
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }} size={6}>
                <FormLabel htmlFor="last-name" required>
                    Preferred Date
                </FormLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        minDate={dayjs()}
                        value={dayjs(userData.prefDate)}
                        onChange={handleDateChange}
                    />
                </LocalizationProvider>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }} size={6}>
                <FormLabel id="demo-simple-select-label">Preferred Time</FormLabel>
                <Select
                    value={userData.prefTime}
                    label="Preferred Time"
                    onChange={handleTimeChange}
                >
                    {timeOptions}
                </Select>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column' }} size={12}>
                <TextField
                    id="outlined-multiline-static"
                    label="Any additional information you would like to provide."
                    multiline
                    rows={4}
                    onChange={handleMessageChange}
                />
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column', mb: 0 }} size={12}>
                <Typography variant="subtitle1" component="div" gutterBottom sx={{ fontWeight: 300, fontSize: '0.8rem', mt: 0, mb: 0 }}>
                    Please do not submit any <a href='https://cphs.berkeley.edu/hipaa/hipaa18.html' style={{ color: '#1976d2' }}>Protected Health Information </a>.
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 300, fontSize: '0.8rem', mt: 0 }} gutterBottom>
                    By clicking submit you agree that the phone number you provided may be used to contact you (including autodialed or pre-recorded calls).
                </Typography>
            </Grid>
            <Grid sx={{ display: 'flex', flexDirection: 'column'}} size={12} >
                <Button variant='contained' type="submit" onClick={handleSubmit}>Submit</Button>
            </Grid>
        </Grid>
    );
};
