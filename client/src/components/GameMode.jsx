import React, { useState } from 'react'
import { Box, Button, Slider, Typography } from '@mui/material'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid';
import { currInfo } from './../store'

const GameMode = ({ route }) => {
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [gameMode, setGameMode] = useState('');
    const [duration, setDuration] = useState(30);

    const handleModeChange = (value) => {
        setGameMode(value);
    };
    const handleSliderChange = (event, newValue) => {
        setDuration(newValue);
    };
    const startGame = () => {
        if(gameMode==='') {
            alert("Choose Game Mode")
            return;
        }
        // dispatch(currInfo.setGameMode({ gameMode }))
        // dispatch(currInfo.setDuration({ duration }))

        if (route === '/singleplay') {
            navigate(`${route}/${gameMode}/${duration}`)
        }
        else if (route === '/multiplay') {
            navigate(`${route}/${gameMode}`)
        }
        else if (route === '/frdsplay') {
            
            localStorage.setItem('gameMode', gameMode);
            localStorage.setItem('duration', duration);
            localStorage.setItem('isCreated', true);

            const uuid = uuidv4()
            const id = uuid.toString().slice(0, 6);
            navigate(`${route}/${id}`)
            
        }
        else navigate(`${route}`)
    }
    
    return (
        <Box sx={styles.box}>
            <Box sx={styles.b1}>
                <Button sx={styles.btn} onClick={() => handleModeChange('Easy')} color={gameMode === 'Easy' ? "primary" : "success"} variant='contained'>Easy</Button>
                <Button sx={styles.btn} onClick={() => handleModeChange('Medium')} color={gameMode === 'Medium' ? "primary" : "warning"} variant='contained'>Medium</Button>
                <Button sx={styles.btn} onClick={() => handleModeChange('Hard')} color={gameMode === 'Hard' ? "primary" : "error"} variant='contained'>Hard</Button>
            </Box>
            {route !== '/multiplay' &&
                <Box sx={styles.b2}>
                    <Typography>
                        Duration (in secs)
                    </Typography>
                    <Slider
                        aria-label="Temperature"
                        defaultValue={30}
                        valueLabelDisplay="auto"
                        step={10}
                        marks
                        onChange={handleSliderChange}
                        min={30}
                        max={120}
                    />
                </Box>
            }
            {/* <Link to={route} style={{ textDecoration: 'none' }}> */}
            <Button variant="contained" onClick={startGame}>Start</Button>
            {/* </Link> */}
        </Box>
    )
}

const styles = {
    box: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '100%',
    },
    b1: {
        width: '90%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '40%',
        border: '1px solid black',
        padding: '8% 5%'
    },
    btn: {
        width: '50%',
    },
    b2: {
        width: '90%',
    }
}

export default GameMode;
