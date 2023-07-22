import React from 'react';
import { Backdrop, Box, Modal, Fade, Button, Typography } from '@mui/material/'

import GameMode from './GameMode';

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

    playBtn: {
        // padding: '10%',
        width: '100%',
        // margin: '10px auto',
        backgroundColor: '#feb236',
        color: 'black',
        fontWeight: 'bold',
    }
};

export default function HowToPlayPopUp() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                        <Typography variant='h5'>Speed Typing Test Game - Instructions</Typography>
                        <Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>Gameplay:</Typography>
                            <ul>
                                <li>Start the game by clicking the "Play" button on the main page.</li>
                                <li>Once the game starts, words or sentences will appear on the screen one by one.</li>
                                <li>Type the displayed word or sentence as fast as you can in the provided text input area.</li>
                                <li>Your speed and accuracy will be calculated based on how quickly and accurately you type the words.</li>
                            </ul>
                        </Typography>
                        <Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>Scoring: </Typography>
                            <ul>
                                <li>Your score in multiplayer mode is determined by the number of correct words or sentences you type within a given time or word limit.</li>
                            </ul>
                        </Typography>
                        <Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>Winning the Game: </Typography>
                            <ul>
                                <li>Compete against other players to see who can achieve the highest score within the time or word limit.</li>
                                <li>The player with the highest score at the end of the game wins.</li>
                            </ul>
                        </Typography>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
