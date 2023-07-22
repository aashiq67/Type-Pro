import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import MultiGame from './MultiGame'
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

const MultiGamePage = () => {
    const navigate = useNavigate();
    const gameMode = useSelector(state => state.currInfoReducer.gameMode);
    const username = localStorage.getItem('username')
    const [room, setRoom] = useState(null);
    const [waitingTime, setWaitingTime] = useState(30);

    useEffect(() => {
        const interval = setInterval(() => {
            setWaitingTime((prevTime) => prevTime - 1);
        }, 1000);
        if (waitingTime === 0) {
            clearInterval(interval);
        }
        if(waitingTime === 0 && room.roomMembers.length===1) {
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

    useEffect(()=>{
        socket.emit('startGame', username, gameMode);
    }, [])

    useEffect(() => {

        socket.on('start', (room) => {
            setWaitingTime(0);
        });

        socket.on('roomUpdate', (room) => {
            setRoom(room);
            setWaitingTime(room.endTime - Math.floor(Date.now() / 1000));
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    return (
        <Box>
            <Box>
                {room && room.roomId !== null && waitingTime &&
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
                    </Box>
                }
            </Box>
            {room && room.roomId !== null && !waitingTime && <MultiGame socket={socket} room={room} resetGame={resetGame} />}
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
