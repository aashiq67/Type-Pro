import React, { useEffect } from 'react';
import { Backdrop, Box, Modal, Fade, Button, Typography } from '@mui/material/';
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { authInfo } from '../store';

export default function Result({ open, mistakes, wpm, timeLeft, accuracy, score, resetGame }) {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const email = useSelector(state => state.authInfoReducer.email)

    const handleClose = () => {
        navigate("/")
    }
    const handlePlayAgain = () => {
        resetGame();
    }

    const updateScore = async () => {
        dispatch(authInfo.setStats({ score, accuracy }))
        const { data } = await axios.post('http://localhost:5000/game/updateScore', { email, accuracy, score, wpm })
        console.log(data);
    }

    useEffect(() => {
        (async () => {
            await updateScore()
        })()
    }, [])

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

                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={styles.scorelabel}>
                                    Score:<span style={styles.scoreValue}>{score} wpm </span>
                                </Typography>
                            </Box>
                            
                            <Box sx={styles.statsContainer}>
                                <Typography variant="h6" sx={styles.accuracyValue}>
                                    Accuracy: {accuracy}%
                                </Typography>

                                <Typography variant="h6" sx={styles.mistakesValue}>
                                    Mistakes: {mistakes}
                                </Typography>
            
                            </Box>

                            <Box sx={styles.statsContainer}>
                                <Typography variant="h6" sx={styles.wpmValue}>
                                    WPM: {wpm}
                                </Typography>
                            
                                <Typography variant="h6" sx={styles.timeLeftValue}>
                                    Time Left: {timeLeft}s
                                </Typography>
               
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                                <Button onClick={handlePlayAgain} variant="contained" sx={styles.button}>
                                    Play Again
                                </Button>
                                <Button onClick={handleClose} variant="contained" sx={styles.button}>
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

const styles = {
    box: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        // maxHeight: 'calc(100vh - 20px)', // Set a maximum height to prevent overflow
        // overflowY: 'auto',
        height: '240px',
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
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
        // alignItems: 'space-between',
        // gap: '8px',
    },
    statsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        gap: '10px',
    },
    '@keyframes colorChange': {
        from: {
            color: '#0097a7', // Cyan color (existing color)
        },
        to: {
            color: '#feb236', // New color for animation (light orange)
        },
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
    scorelabel: {
        color: '#0097a7', // Cyan color for labels
        fontWeight: 'bold',
        marginBottom: '5px',
        fontFamily: 'Roboto, sans-serif', // Use Roboto font for labels
        textAlign: "center",
        animation: '$colorChange 3s infinite alternate',
    },
    scoreValue: {
        color: '#00bcd4',
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '8px',
        marginLeft: '10px',
        fontFamily: 'Montserrat, sans-serif', // Use Montserrat font for values
        // Apply animation to the score value
        animation: '$colorChange 3s infinite alternate',
        // The animation name is "colorChange", duration is 3 seconds, and it will alternate infinitely
    },
    label: {
        color: '#0097a7', // Cyan color for labels
        fontWeight: 'bold',
        marginBottom: '5px',
        fontFamily: 'Roboto, sans-serif', // Use Roboto font for labels
        width: '120px'
    },
    value: {
        color: '#00bcd4', // Similar color to the button
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '8px',
        fontFamily: 'Montserrat, sans-serif', // Use Montserrat font for values
    },
    timeLeftValue: {
        color: 'black', // Red color for time left
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '8px',
        fontFamily: 'Montserrat, sans-serif', // Use Montserrat font for values
        width: '50%'
    },
    wpmValue: {
        color: 'rgb(246, 149, 3)', // Orange color for WPM
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '8px',
        fontFamily: 'Montserrat, sans-serif', // Use Montserrat font for values
        width: '50%'
    },
    accuracyValue: {
        color: 'rgba(3, 181, 0, 0.997)', // Green color for Accuracy
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '8px',
        fontFamily: 'Montserrat, sans-serif', // Use Montserrat font for values
        width: '50%'
    },
    mistakesValue: {
        color: 'red', // Red color for Mistakes
        fontWeight: 'bold',
        fontSize: '20px',
        marginBottom: '8px',
        fontFamily: 'Montserrat, sans-serif', // Use Montserrat font for values
        width: '50%'
    },
};