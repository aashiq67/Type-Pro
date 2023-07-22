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
    const gameMode = useSelector(state => state.currInfoReducer.gameMode);

    const resetGame = () => {
        // console.log("playing again");
        // setRoom(null);
        // setWaitingTime(30);
        // socket.emit('startGame', username);
    }

    useEffect(() => {
        console.log(isCreated);
        if (isCreated)
            socket.emit('create-room', { username, roomId, gameMode });
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
                    <Box sx={styles.container}>
                        <Typography style={styles.typography}>Room: {(room) ? room.roomId : 'Loading...'}</Typography>
                        {/* <ul>
                            {room && room.roomMembers.map((member) => (
                                <li key={member.sockId}>User: {member.username}</li>
                            ))}
                        </ul> */}
                        <Typography style={styles.typography}>Waiting for players to join...</Typography>
                        <Typography style={styles.typography}>Current players: {room && room.roomMembers.length}</Typography>
                        {isCreated && <Button onClick={handleStart} variant='contained'>Start</Button>}
                    </Box>
                    
                }
            </Box>
            {room && room.roomId !== null && start && <MultiGame socket={socket} room={room} resetGame={resetGame} />}
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
export default PlayWithFrdsPage
