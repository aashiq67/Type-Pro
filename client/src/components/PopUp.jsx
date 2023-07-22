import React from 'react';
import { Backdrop, Box, Modal, Fade, Button } from '@mui/material/'

import GameMode from './GameMode';

const styles = {
    box: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '40vw',
        height: '60vh',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    },

    playBtn: {
        // padding: '10%',
        width: '250px',
        margin: '25% auto',
        backgroundColor: '#feb236',
        color: 'black',
        fontWeight: 'bold',
    }
};

export default function PopUp({ playBtnDetails }) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button sx={styles.playBtn} variant='contained' onClick={handleOpen}>{playBtnDetails.btnName}</Button>
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
                        <GameMode route={playBtnDetails.route}/>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}
