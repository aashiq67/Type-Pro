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
                    <>
                        <Typography>Room: {(room) ? room.roomId : 'Loading...'}</Typography>
                        <ul>
                            {room && room.roomMembers.map((member) => (
                                <li key={member.sockId}>User: {member.username}</li>
                            ))}
                        </ul>
                        <Typography>Waiting for players to join...</Typography>
                        <Typography>Time remaining: {waitingTime} seconds</Typography>
                        <Typography>Current players: {room && room.roomMembers.length}</Typography>
                    </>
                }
            </Box>
            {room && room.roomId !== null && !waitingTime && <MultiGame socket={socket} room={room} resetGame={resetGame} />}
        </Box>
    )
}

export default MultiGamePage
