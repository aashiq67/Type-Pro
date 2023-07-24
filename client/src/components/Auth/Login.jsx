import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Checkbox, CssBaseline, TextField, FormControlLabel, Link, Box, Grid, Typography, Container } from "@mui/material";

import { useSelector, useDispatch } from 'react-redux'
import { authInfo } from '../../store'

import { loginRoute, getUsernameRoute } from '../../routes/APIRoutes';

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

export default function Login({ setBtnName }) {
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleValidation = (formData) => {
        const { username, password } = {
            username: formData.get('username'),
            password: formData.get('password'),
        };
        if (username === "") {
            toast.error("Username / Email is required.", toastOptions);
            return false;
        }
        if (password.length < 8) {
            toast.error(
                "Password should be equal or greater than 8 characters.",
                toastOptions
            );
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const email = formData.get('email');
        // const password = formData.get('password');

        if (handleValidation(formData)) {
            const password = '12345678'
            const { data } = await axios.post(loginRoute, { email, password });
            // console.log(data);
            if (data.status === false) {
                toast.error(data.message, toastOptions);
            }

            if (data.status === true) {
                dispatch(authInfo.login({ username: data.username, email }))
                navigate("/");
            }
        };
    };
    const username = useSelector(state => state.authInfoReducer.username)
    useEffect(()=>{
        console.log("login page", username);
    }, [username])

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={styles.box}>
                    <Typography component="h1" variant="h5" fontWeight="bold">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        // InputLabelProps={{
                        //     style: {
                        //         color: '#f5a623',
                        //     },
                        // }}
                        // sx={{
                        //     '& .MuiOutlinedInput-root': {
                        //         '&.Mui-focused fieldset': {
                        //             borderColor: '#f5a623',
                        //         },
                        //         '& .MuiInputLabel-root': {
                        //             color: '#f5a623',
                        //         },
                        //     },
                        // }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={styles.btn}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Button onClick={() => setBtnName('fp')}>
                                    Forgot password?
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => setBtnName('register')}>
                                    Create Account
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
        // border: '3px solid red',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px', // Added padding to create space between content and border
        borderRadius: '10px', // Added border radius to round the corners
        backgroundColor: '#f9f9f9', // Light gray background color
        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.1)', // Added a subtle box shadow
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