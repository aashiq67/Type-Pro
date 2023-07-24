import * as React from 'react';
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {
    Avatar, Button, Card, CardMedia, CardHeader, CardContent, Checkbox, CssBaseline, TextField, FormControlLabel, Link, Box, Grid,
    Stack, Typography, Container
} from "@mui/material";
import { setNewPasswordRoute } from '../../routes/APIRoutes';


const theme = createTheme();

export default function SetNewPassword() {

    const navigate = useNavigate();

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    useEffect(() => {
        if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/");
        }
    }, []);

    const handleValidation = (formData) => {
        const { newpassword, confirmNewpassword } = {
            newpassword: formData.get('newpassword'),
            confirmNewpassword: formData.get('confirmNewpassword'),
        };

        if (newpassword.length < 8) {
            toast.error(
                "Password should be equal or greater than 8 characters.",
                toastOptions
            );
            return false;
        } else if (newpassword !== confirmNewpassword) {
            toast.error("Password and Confirm Password should be same.", toastOptions);

            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newpassword = formData.get('newpassword');
        const confirmNewpassword = formData.get('confirmNewpassword');

        if (handleValidation(formData)) {
            const { data } = await axios.post(setNewPasswordRoute, { password: newpassword });
            if (data.status === false) {
                toast.error(data.message, toastOptions);
            }

            if (data.status === true) {
                alert("password updated successfully")
                navigate("/login");
            }
        };
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 20,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Set New Password
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="newpassword"
                            label="Enter New Password "
                            name="newpassword"
                            autoComplete="password"
                            type="password"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmNewpassword"
                            label="Confirm New Password"
                            type="password"
                            id="password"
                            autoComplete="confirmnewpassword"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
            </Container>
            <ToastContainer />
        </>
    );
}