import React, {useState} from 'react';
import { Backdrop, Box, Modal, Fade, Button, Typography } from '@mui/material/'

import GameMode from './GameMode';

export default function HowToPlayPopUp() {
    const [open, setOpen] = React.useState(false);
    const [selectedMode, setSelectedMode] = useState('single');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setSelectedMode('single')
        setOpen(false);
    }

    const handleModeClick = (mode) => {
        setSelectedMode(mode);
    };

    const getInstructionsByMode = (mode) => {
        switch (mode) {
            case 'single':
                return (
                    <Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>Gameplay:</Typography>
                        <ul>
                            <li>Start the game by clicking the "Play" button on the main page.</li>
                            <li>Once the game starts, words or sentences will appear on the screen one by one.</li>
                            <li>Type the displayed word or sentence as fast as you can in the provided text input area.</li>
                            <li>Your speed and accuracy will be calculated based on how quickly and accurately you type the words.</li>
                            <li>Your Final Score will be calculated by using Speed (WPM) and Accuracy only.</li>
                        </ul>
                        <Typography sx={{ fontWeight: 'bold' }}>Results:</Typography>
                        <ul>
                            <li>Your score, along with accuracy, WPM, mistakes, and time left, will be displayed, showcasing the remaining time in the game.</li>
                        </ul>
                    </Typography>
                );
            case 'multiplayer':
                return (
                    <Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>Gameplay:</Typography>
                        <ul>
                            <li>This will be like a race with other participants with whom you are in a particular room.</li>
                            <li>You can also view other players progress bar along with yours which will get automatically updated.</li>
                        </ul>
                        <Typography sx={{ fontWeight: 'bold' }}>Scoring:</Typography>
                        <ul>
                            <li>Your score in multiplayer mode is determined by the number of correct words or sentences you type within a given time or word limit.</li>
                            <li>Your Final Score will be calculated as the product of your WPM and Accuracy.</li>
                        </ul>
                        <Typography sx={{ fontWeight: 'bold' }}>Leaderboard:</Typography>
                        <ul>
                            <li>Compete against other players to see who can achieve the highest score within the time or word limit.</li>
                            <li>The player with the highest score at the end of the game will be considered the winner.</li>
                        </ul>
                    </Typography>
                );
            case 'friends':
                return (
                    <Typography>
                        <Typography sx={{ fontWeight: 'bold' }}>Gameplay:</Typography>
                        <ul>
                            <li>Create a unique room by clicking on the "Play with Friends" button on the main page.</li>
                            <li>Share the room code with your friends to invite them to join your game.</li>
                            <li>Once all your friends have joined the room, start the game which will be similar to multiplayer mode from now.</li>
                            <li>Type the displayed word or sentence as fast as you can in the provided text input area.</li>
                            <li>Your speed and accuracy will be calculated based on how quickly and accurately you type the words.</li>
                            <li>Your Final Score will be calculated as the product of your WPM and Accuracy.</li>
                        </ul>
                        <Typography sx={{ fontWeight: 'bold' }}>Leaderboard:</Typography>
                        <ul>
                            <li>The leaderboard will show the scores of all the players in the room.</li>
                            <li>The player with the highest score at the end of the game will be considered the winner.</li>
                        </ul>
                    </Typography>
                );
            default:
                return null;
        }
    };
    return (
        <div>
            <Button sx={styles.playBtn} variant='contained' onClick={handleOpen}>How to Play</Button>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={styles.box}>
                        <Box sx={styles.navbar}>
                            <Button
                                onClick={() => handleModeClick('single')}
                                sx={selectedMode === 'single' ? styles.navbarButtonActive : styles.navbarButton}
                            >
                                Single Player
                            </Button>
                            <Button
                                onClick={() => handleModeClick('multiplayer')}
                                sx={selectedMode === 'multiplayer' ? styles.navbarButtonActive : styles.navbarButton}
                            >
                                Multiplayer
                            </Button>
                            <Button
                                onClick={() => handleModeClick('friends')}
                                sx={selectedMode === 'friends' ? styles.navbarButtonActive : styles.navbarButton}
                            >
                                Play with Friends
                            </Button>
                        </Box>

                        {/* Display Instructions for the selected mode */}
                        {getInstructionsByMode(selectedMode)}
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
        width: '40vw',
        height: '65vh',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },
    navbar: {
        display: 'flex',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '10px',
        paddingBottom: '10px',
        borderBottom: '1px solid black'
    },
    navbarButton: {
        background: '',
        color: 'black',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease', 
        textDecoration: 'none', 
        '&:hover': {
            textDecoration: 'underline', 
        },
    },
    navbarButtonActive: {
        background: '', 
        color: '#feb236',
        fontWeight: 'bold',
        '&:hover': {
            textDecoration: 'underline', 
        },
    },
    playBtn: {
        width: '100%',
        backgroundColor: '#feb236',
        color: 'black',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease', 

        '&:hover': {
            backgroundColor: '#f58220', 
        },
    }
}