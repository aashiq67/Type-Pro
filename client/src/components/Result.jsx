import React from 'react';
import { Backdrop, Box, Modal, Fade, Button, Typography } from '@mui/material/';
import { useNavigate } from 'react-router-dom'

const styles = {
    box: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        // maxHeight: 'calc(100vh - 20px)', // Set a maximum height to prevent overflow
        // overflowY: 'auto',
        height: '300px',
        bgcolor: '#f2faff', // Light bluish background color
        border: '2px solid #00bcd4', // Similar color to the button
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        p: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        fontFamily: 'Roboto, sans-serif', // Use Roboto font for labels
    },
    contents: {
        textAlign: 'center',
    },
    button: {
        marginTop: '15px',
        background: '#00bcd4', // Cyan button color
        color: '#fff', // White text color for the button
        fontWeight: 'bold',
        borderRadius: '4px',
        '&:hover': {
            background: '#0097a7', // Lighter shade on hover
        },
    },
    label: {
        color: '#0097a7', // Cyan color for labels
        fontWeight: 'bold',
        marginBottom: '5px',
        fontFamily: 'Roboto, sans-serif', // Use Roboto font for labels
    },
    value: {
        color: '#00bcd4', // Similar color to the button
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '8px',
        fontFamily: 'Montserrat, sans-serif', // Use Montserrat font for values
    },
};

export default function Result({ open, mistakes, wpm, timeLeft, accuracy, playersProgress }) {
    const navigate = useNavigate();
    const handleClose = () => {
        navigate("/")
    }
    return (
        <div>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>
                    <Box sx={styles.box}>
                        <Box sx={styles.contents}>
                            
                            <Typography variant="h6" sx={styles.label}>
                                Mistakes:
                            </Typography>
                            <Typography variant="h5" sx={styles.value}>
                                {mistakes}
                            </Typography>
                            <Typography variant="h6" sx={styles.label}>
                                WPM:
                            </Typography>
                            <Typography variant="h5" sx={styles.value}>
                                {wpm}
                            </Typography>
                            <Typography variant="h6" sx={styles.label}>
                                Time Left:
                            </Typography>
                            <Typography variant="h5" sx={styles.value}>
                                {timeLeft}
                            </Typography>
                            <Typography variant="h6" sx={styles.label}>
                                Accuracy:
                            </Typography>
                            <Typography variant="h5" sx={styles.value}>
                                {accuracy}
                            </Typography>
                            <Button onClick={handleClose} variant="contained" sx={styles.button}>
                                Close
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}