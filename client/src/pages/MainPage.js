import React, { useState, useEffect, useRef } from "react";
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { v4 as uuidv4 } from 'uuid';

import './../App.css'

import PopUp from './../components/PopUp'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Logo from "../components/Logo";

import { useNavigate } from "react-router-dom";

const MainPage = () => {

    useEffect(() => {
        const uuid = uuidv4().replace(/-/g, '');
        const id = uuid.toString().slice(0, 10);
        localStorage.setItem('username', `Guest_${id}`)
    }, [])

    const [index, setIndex] = useState(0);

    return (
        <Box sx={styles.outerBox}>
            <Navbar index={index} setIndex={setIndex} />
            <Box sx={styles.innerBox}>
                <LeftBox />
                <RightBox index={index} />
            </Box>
        </Box>
    );
}

const Navbar = ({ index, setIndex }) => {
    return (
        <Box sx={styles.nav}>
            <Logo />
            <ul style={{ ...styles.ul, width: '35%' }}>
                <Button sx={styles.listBtn} onClick={() => setIndex(0)}><li style={styles.li1}>Multi Player</li></Button>
                <Button sx={styles.listBtn} onClick={() => setIndex(1)}><li style={styles.li1}>Single Player</li></Button>
                <Button sx={styles.listBtn} onClick={() => setIndex(2)}><li style={styles.li1}>Play with friends</li></Button>
            </ul>
            <ul style={{ ...styles.ul, width: '10%' }}>
                <IconButton sx={styles.iconBtn}><li style={styles.li2}><VolumeUpIcon /></li></IconButton>
                <li style={styles.li2}>Ping: 175</li>
            </ul>
        </Box>
    )
}

const LeftBox = () => {
    // const dispatch = useDispatch();
    // const username = useSelector(state => state.authInfoReducer.username);
    const [username, setUsername] = useState(localStorage.getItem('username'));

    const changeUsername = (e) => {
        // dispatch(authInfo.setUsername({ username: e.target.value }));
        setUsername(e.target.value)
        localStorage.setItem('username', e.target.value)
    }

    return (
        <Box sx={styles.leftBox}>
            <Box sx={styles.intro}>
                <TextField value={username} onChange={changeUsername}></TextField>
                <Button sx={styles.howToPlayBtn} variant="contained">How to Play</Button>
            </Box>
        </Box>
    );
}

const RightBox = ({ index }) => {
    const navigate = useNavigate();
    const [playBtnDetails, setPlayBtnDetails] = useState({
        btnName: 'Play MP',
        route: '/multiplay'
    });
    const [roomNo, setRoomNo] = useState();

    useEffect(() => {
        if (index === 0)
            setPlayBtnDetails({ route: '/multiplay', btnName: 'Play MP' })
        else if (index === 1)
            setPlayBtnDetails({ route: '/singleplay', btnName: 'Play SP' })
        else
            setPlayBtnDetails({ route: '/frdsplay', btnName: 'Create' })
    }, [index])

    const handleJoin = () => {
        navigate(`/frdsplay/${roomNo}`)
    }

    return (
        <Box sx={styles.rightBox}>
            <Box sx={styles.centerBox}>
                <PopUp playBtnDetails={playBtnDetails} />
                {playBtnDetails.btnName === 'Create' &&
                    <>
                        <TextField placeholder="Enter room" onChange={(e) => setRoomNo(e.target.value)}></TextField>
                        <Button sx={styles.playBtn} variant='contained' onClick={handleJoin}>Join</Button>
                    </>
                }
            </Box>
        </Box>
    );
}

const styles = {
    outerBox: {

    },

    innerBox: {
        display: 'flex',
    },

    // NAV STYLES
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',

        // border: '1px solid blue',
        padding: '0% 1%',
    },

    ul: {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        listStyleType: 'none',
        padding: 0,
        margin: 0,
    },

    li1: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#333333',
        // color: '#fff', // Highlight color - You can use the complementary color suggested earlier
        cursor: 'pointer',
        width: '75%',
    },

    li2: {
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: '#333333',
    },

    listBtn: {
        margin: 0,
        padding: 0,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },

    // LEFT BOX STYLES
    leftBox: {
        // border: '1px solid blue',
        padding: '3% 1%',
        width: '20vw',
        height: '70vh',
    },
    intro: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',

        padding: '10% 5%',

        border: '3px solid blue',
        borderRadius: '10px',
        height: '30%'

    },

    howToPlayBtn: {
        width: '80%',
        margin: '10px auto',
        backgroundColor: '#feb236',
        color: 'black',
        fontWeight: 'bold'
    },

    // RIGHT BOX STYLES
    rightBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        // border: '1px solid blue',
        padding: '1%',
        width: '80vw',

    },
    centerBox: {
        // border: '1px solid black',
        padding: '1%',
    },
    playBtn: {
        padding: '10%',
        width: '100px',
        margin: '10px auto',
        backgroundColor: '#feb236',
        color: 'black',
        fontWeight: 'bold',
    }
}

export default MainPage;
