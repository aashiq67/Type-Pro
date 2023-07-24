import React, { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client';
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'
import MultiGame from './MultiGame'

const PlayWithFrdsPage = () => {
    const navigate = useNavigate();
    const sockRef = useRef(null);

    const username = localStorage.getItem('username')
    
    const { roomId } = useParams();
    const gameMode = localStorage.getItem('gameMode')
    const duration = localStorage.getItem('duration')
    console.log(duration);
    const isCreated = localStorage.getItem('isCreated')
    
    const [room, setRoom] = useState(null);
    const [start, setStart] = useState(false);

    const resetGame = () => {
        // console.log("playing again");
        // setRoom(null);
        // setWaitingTime(30);
        // socket.emit('startGame', username);
    }

    useEffect(() => {
        const socket = io('http://localhost:5000');
        if(!sockRef.current)
            sockRef.current = socket;
        if (isCreated)
            sockRef.current.emit('create-room', { username, roomId, gameMode, duration });
        else
            sockRef.current.emit('join-room', { username, roomId });
    }, [])

    useEffect(() => {
        sockRef.current.on('receiveStartStatus', ()=>{
            setStart(true)
        })
        
        sockRef.current.on('roomUpdate', (room) => {
            console.log(room);
            setRoom(room);
        });

        sockRef.current.on('no-room', (message) => {
            alert(message)
            localStorage.setItem('gameMode', '')
            localStorage.setItem('duration', '')
            localStorage.setItem('isCreated', '')
            navigate("/")
        })

        return () => {
            sockRef.current.disconnect();
        };
    }, []);

    const handleStart = () => {
        sockRef.current.emit('sendStartStatus', roomId);
        setStart(true);
    }

    const contentRef = useRef(null);

    const handleCopyClick = () => {
        const range = document.createRange();
        range.selectNode(contentRef.current);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    };


    return (
        <Box>
            <Box>
                {room && room.roomId !== null && !start &&
                    <Box sx={styles.container}>
                        <Typography style={styles.typography}>Room {isCreated ? "Created" : "Joined"}</Typography>
                        <Typography ref={contentRef} style={styles.typography}>{(room) ? room.roomId : 'Loading...'}</Typography>
                        <button onClick={handleCopyClick} > copy </button>
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
            {room && room.roomId !== null && start && <MultiGame sockRef={sockRef} room={room} resetGame={resetGame} />}
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
