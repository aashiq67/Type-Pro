import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, CssBaseline, TextField, Box, Typography } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { forgotPasswordRoute, verifyOTPRoute } from '../../routes/APIRoutes';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [enb, setenb] = useState(false);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const { data } = await axios.post(forgotPasswordRoute, { email });
        if (data.status === false) {
            toast.error(data.message, toastOptions);
        }

        if (data.status === true) {
            setenb(true);
        }
    };
    const handlesub = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const code = formData.get('code');
        const { data } = await axios.post(verifyOTPRoute, { code });
        if (data.status === false) {
            toast.error(data.message, toastOptions);
        }

        if (data.status === true) {
            navigate("/SetNewPassword");
        }
    };
    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={styles.box}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Typography component="h1" variant="h5">
                            Enter Your mail-id
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        {!enb ? <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={styles.btn}
                        >
                            Send Code
                        </Button> : <Button
                            fullWidth
                            variant="contained"
                            color="success"
                            sx={styles.btn}
                        >
                            Sent ☑️
                        </Button>}
                    </Box>
                    <Box component="form" onSubmit={handlesub} noValidate sx={{ mt: 1 }}>
                        <Typography component="h1" variant="h5">
                            Enter The Code
                        </Typography>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="code"
                            label="code"
                            name="code"
                            autoComplete="code"
                            autoFocus
                            disabled={!enb}
                        />
                        <Button
                            disabled={!enb}
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ m: 0, mt: 3, mb: 2 }}
                        >
                            Submit
                        </Button>
                    </Box>
                </Box>
                <ToastContainer />
            </Container>
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