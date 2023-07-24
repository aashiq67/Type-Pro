import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import MultiGame from './MultiGame'
import { useNavigate } from 'react-router-dom';

import Timer from './../components/Timer'

const MultiGamePage = () => {
    const navigate = useNavigate();
    const sockRef = useRef(null);
    // const gameMode = useSelector(state => state.currInfoReducer.gameMode);
    const { gameMode } = useParams();
    const username = localStorage.getItem('username')
    const [room, setRoom] = useState(null);
    const [waitingTime, setWaitingTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWaitingTime((prevTime) => prevTime - 1);
        }, 1000);
        if (waitingTime === 0) {
            clearInterval(interval);
        }
        if (waitingTime === 0 && room && room.roomMembers.length === 1) {
            alert("no one joined the room try again");
            navigate("/");
        }
        return () => clearInterval(interval);

    }, [waitingTime])

    const resetGame = () => {
        // console.log("playing again");
        // setRoom(null);
        // setWaitingTime(30);
        // socket.emit('startGame', username);
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');
        if(!sockRef.current)
            sockRef.current = socket
        sockRef.current.emit('startGame', username, gameMode);
    }, [])

    useEffect(() => {

        sockRef.current.on('connect', () => {
            console.log('Connected to the server');
        });

        sockRef.current.on('start', (room) => {
            setWaitingTime(0);
        });

        sockRef.current.on('roomUpdate', (updatedRoom) => {
            setRoom(updatedRoom);
            if (!updatedRoom.isGameStarted)
                setWaitingTime(updatedRoom.endTime - Math.floor(Date.now() / 1000));
        });

        return () => {
            sockRef.current.disconnect();
        };
    }, []);

    return (
        <Box>
            <Box>
                {room && room.roomId !== null && waitingTime ?
                    <Box sx={styles.container}>
                        <Typography sx={styles.typography}>Room: {(room) ? room.roomId : 'Loading...'}</Typography>
                        <ul style={styles.list}>
                            {room && room.roomMembers.map((member) => (
                                <li key={member.sockId} style={styles.listItem}>User: {member.username}</li>
                            ))}
                        </ul>
                        <Typography sx={styles.typography}>Waiting for players to join...</Typography>
                        <Typography sx={styles.typography}>Time remaining: {waitingTime} seconds</Typography>
                        <Typography sx={styles.typography}>Current players: {room && room.roomMembers.length}</Typography>
                    </Box> : <></>
                }
            </Box>
            {room && room.roomId !== null && !waitingTime && <Timer Component={<MultiGame sockRef={sockRef} room={room} resetGame={resetGame} duration={60} />} />}
        </Box>
    )
}

const styles = {
    body: {
        height: '100%',
        margin: 0,
        fontFamily: 'Arial, sans-serif', // Replace with your desired font family
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        paddingTop: '200px',
        paddingLeft: '300px'
    },
    typography: {
        fontSize: '16px', // Adjust the font size as needed
        fontWeight: 'bold', // Adjust the font weight as needed
        color: '#333', // Adjust the text color as needed
        marginBottom: '8px', // Add any other margin or padding styles you need
    },
    list: {
        listStyle: 'none', // Remove list bullet points
        padding: 0,
        margin: 0,
    },
    listItem: {
        marginBottom: '4px', // Add any other margin or padding styles you need
    },
    // Add any other styles you need for the Typography and ul elements
};



export default MultiGamePage
