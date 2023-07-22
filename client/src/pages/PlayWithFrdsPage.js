import React, { useEffect, useState } from 'react'
import io from 'socket.io-client';
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import MultiGame from './MultiGame'

const socket = io('http://localhost:5000');

const PlayWithFrdsPage = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const isCreated = useSelector(state => state.currInfoReducer.isCreated);
    const username = localStorage.getItem('username')
    const [room, setRoom] = useState(null);
    const [start, setStart] = useState(false);

    const resetGame = () => {
        // console.log("playing again");
        // setRoom(null);
        // setWaitingTime(30);
        // socket.emit('startGame', username);
    }

    useEffect(() => {
        console.log(isCreated);
        if (isCreated)
            socket.emit('create-room', { username, roomId });
        else
            socket.emit('join-room', { username, roomId });
    }, [])

    useEffect(() => {
        socket.on('receiveStartStatus', ()=>{
            setStart(true)
        })
        
        socket.on('roomUpdate', (room) => {
            console.log(room);
            setRoom(room);
        });

        socket.on('no-room', (roomId) => {
            alert(`no room exist with id : ${roomId}`)
            navigate("/")
        })

        // return () => {
        //     socket.disconnect();
        // };
    }, [socket]);

    const handleStart = () => {
        socket.emit('sendStartStatus', roomId);
        setStart(true);
    }

    return (
        <Box>
            <Box>
                {room && room.roomId !== null && !start &&
                    <>
                        <Typography>Room: {(room) ? room.roomId : 'Loading...'}</Typography>
                        {/* <ul>
                            {room && room.roomMembers.map((member) => (
                                <li key={member.sockId}>User: {member.username}</li>
                            ))}
                        </ul> */}
                        <Typography>Waiting for friends to join...</Typography>
                        <Typography>Current players: {room && room.roomMembers.length}</Typography>
                        {isCreated && <Button onClick={handleStart} variant='contained'>Start</Button>}
                    </>
                }
            </Box>
            {room && room.roomId !== null && start && <MultiGame socket={socket} room={room} resetGame={resetGame} />}
        </Box>
    )
}

export default PlayWithFrdsPage
