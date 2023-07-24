import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { registerRoute } from '../../routes/APIRoutes';

export default function Register({ setBtnName }) {
    const navigate = useNavigate();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleValidation = (formData) => {
        const { email, username, password, confirmpassword } = {
            email: formData.get('email'),
            username: formData.get('username'),
            password: formData.get('password'),
            confirmpassword: formData.get('confirmpassword')
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (username.length <= 3) {
            toast.error(
                "Username should be greater than 3 characters.",
                toastOptions
            );
            return false;
        }
        else if (email === "") {
            toast.error("Email is required.", toastOptions);
            return false;
        }
        else if (!emailRegex.test(email)) {
            toast.error('Invalid email.', toastOptions);
            return false;
        }
        if (password.length < 8) {
            toast.error(
                "Password should be equal or greater than 8 characters.",
                toastOptions
            );
            return false;
        }
        else if (password !== confirmpassword) {
            toast.error("Password and Confirm Password should be same.", toastOptions);
            return false;
        }

        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const username = formData.get('username');
        const password = formData.get('password');

        if (handleValidation(formData)) {
            const { data } = await axios.post(registerRoute, { username, email, password });

            if (data.status === false) {
                toast.error(data.message, toastOptions);
            }

            if (data.status === true) {
                alert("Verification link sent to your email.");
                setBtnName('login')
            }
        };
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={styles.box}>
                    <Typography variant="h5"> Register  </Typography>
                    <Box component="form" noValidate onSubmit={(event) => handleSubmit(event)} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="username"
                                    type="text"
                                    label="Username"
                                    name="username"
                                    autoComplete="username"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    type="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="password"
                                    type="password"
                                    label="Password"
                                    name="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirmpassword"
                                    label="Confirm Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={styles.btn}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                Already have an account? &nbsp;
                                <Button onClick={()=>setBtnName('login')} >
                                    Login
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <ToastContainer />
        </>
    );
}

const styles = {
    box: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)',
    },

    btn: {
        mt: 3,
        mb: 2,
        color: 'black',
        fontWeight: 'bold',
        backgroundColor: '#feb236',
        '&:hover': {
            backgroundColor: '#f58220'
        }
    }
}