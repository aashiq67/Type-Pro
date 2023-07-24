import React, { useState, useEffect, useRef } from "react";
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

import './../App.css'

import PopUp from './../components/PopUp'
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import Logo from "../components/Logo";
import HowToPlayPopUp from "../components/HowToPlayPopUp";

import LeaderBoard from "../components/LeaderBoard";

import AuthPopUp from "../components/Auth/AuthPopUp";
import Login from '../components/Auth/Login'
import Register from '../components/Auth/Register'
import ForgotPassword from '../components/Auth/Forgotpassword'

import { useNavigate } from "react-router-dom";
import { authInfo } from "../store";

const MainPage = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.authInfoReducer.isAuthenticated)

    const verifyLogin = async () => {
        const { data } = await axios.get("http://localhost:5000/user/dashboard");
        console.log(data);
        if (data.status === true) {
            dispatch(authInfo.login({ username: data.username, email: data.email }));
        }
        else dispatch(authInfo.logout());
    }
    const [username, setUsername] = useState(null);

    useEffect(() => {
        (async ()=>{
            await verifyLogin();
        })();
        
        if (!isAuthenticated) {
            const username = localStorage.getItem('username');
            if (username === '' || username === null) {
                const uuid = uuidv4().replace(/-/g, '');
                const id = uuid.toString().slice(0, 10);
                setUsername(`Guest_${id}`)
                localStorage.setItem('username', `Guest_${id}`)
            } else setUsername(localStorage.getItem('username'));
        }
        
    }, [])

    const [index, setIndex] = useState(0);

    return (
        <Box sx={styles.outerBox}>
            <Navbar index={index} setIndex={setIndex} />
            <Box sx={styles.innerBox}>
                <LeftBox />
                <RightBox index={index} />
                <LeaderBoard />
            </Box>
        </Box>
    );
}

const Navbar = ({ index, setIndex }) => {
    const isAuthenticated = useSelector(state => state.authInfoReducer.isAuthenticated)
    // const score = useSelector(state => state.authInfoReducer.score)
    // const accuracy = useSelector(state => state.authInfoReducer.accuracy)
    const [score, setScore] = useState();
    const [accuracy, setAccuracy] = useState();
    const newStyle = { ...styles.listBtn, backgroundColor: 'orange', fontWeight: 'bold' }
    
    useEffect(()=>{
        (async () => {
            const { data } = await axios.get("http://localhost:5000/game/getStats");
            
            if(data.status) {
                setScore(data.score)
                setAccuracy(data.accuracy)
            }
        })()
    }, [])

    return (
        <Box sx={styles.nav}>
            <Logo />
            <ul style={{ ...styles.ul, width: '35%'}}>
                <Button sx={index === 0 ? newStyle : styles.listBtn} onClick={() => setIndex(0)}><li style={styles.li1}>Multi Player</li></Button>
                <Button sx={index === 1 ? newStyle : styles.listBtn} onClick={() => setIndex(1)}><li style={styles.li1}>Single Player</li></Button>
                <Button sx={index === 2 ? newStyle : styles.listBtn} onClick={() => setIndex(2)}><li style={styles.li1}>Play with friends</li></Button>
            </ul>
            {isAuthenticated ? <ul style={{ ...styles.ul, width: '15%' }}>
                <Typography>score: {score}</Typography>
                <Typography>accuracy: {accuracy}</Typography>
            </ul> : <Box sx={{width: '15%'}}>Login to check Stats</Box>}
        </Box>
    )
}

const LeftBox = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector(state => state.authInfoReducer.isAuthenticated)
    const existingUsername = useSelector(state => state.authInfoReducer.username)

    const [btnName, setBtnName] = useState('login');
    const [component, setComponent] = useState(<Login setBtnName={setBtnName} />)
    const [username, setUsername] = useState('');
    
    // useEffect(()=>{
    //     console.log("eus", existingUsername);
    // }, [existingUsername])

    useEffect(()=>{
        if(btnName === 'login')
            setComponent(<Login setBtnName={setBtnName} />)
        else if (btnName === 'register')
            setComponent(<Register setBtnName={setBtnName} />)
        else if (btnName === 'fp')
            setComponent(<ForgotPassword setBtnName={setBtnName} />)
    }, [btnName])
    
    useEffect(()=>{
        console.log(isAuthenticated, existingUsername);
        if(!isAuthenticated) {
            const name = localStorage.getItem('username')
            if (name !== null)
                setUsername(name)
        }
        else setUsername(existingUsername)
    }, [localStorage.getItem('username'), isAuthenticated])

    const changeUsername = (e) => {
        setUsername(e.target.value)
        localStorage.setItem('username', e.target.value)
    }

    const sendLogoutReq = async () => {
        const { data } = await axios.get("http://localhost:5000/user/logout", null, {
            withCredentials: true
        });
        console.log(data);
        if (data.status === true) {
            const uuid = uuidv4().replace(/-/g, '');
            const id = uuid.toString().slice(0, 10);
            localStorage.setItem('username', `Guest_${id}`)
            dispatch(authInfo.logout())
            navigate("/")
        }
        return new Error("Unable to logout. Please try again")
    }

    return (
        <Box sx={styles.leftBox}>
            <Box sx={styles.intro}>
                <TextField value={username} sx={{ backgroundColor: "lightblue" }} onChange={changeUsername}></TextField>
                <HowToPlayPopUp />
                {!isAuthenticated ? 
                    <AuthPopUp setBtnName={setBtnName} Component={component}/> : 
                    <Button sx={styles.playBtn} onClick={sendLogoutReq}>Logout</Button>
                }
            </Box>
        </Box>
    );
}

const RightBox = ({ index }) => {
    const navigate = useNavigate();
    const [playBtnDetails, setPlayBtnDetails] = useState({
        btnName: 'Play MultiPlayer',
        route: '/multiplay'
    });
    const [roomNo, setRoomNo] = useState();

    useEffect(() => {
        if (index === 0)
            setPlayBtnDetails({ route: '/multiplay', btnName: 'Play in Multiplayer Mode' })
        else if (index === 1)
            setPlayBtnDetails({ route: '/singleplay', btnName: 'Play in SinglePlayer Mode' })
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
                    <TextField placeholder="Enter room" sx={{ backgroundColor: "lightblue" }} onChange={(e) => setRoomNo(e.target.value)}></TextField>
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
        justifyContent: 'space-between'
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
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease', // Add transition for smooth effect

        '&:hover': {
            backgroundColor: '#f58220', // New background color when hovering
        },
    },

    // LEFT BOX STYLES
    leftBox: {
        // border: '1px solid blue',
        padding: '3% 1%',
        width: '20vw',
        height: '50vh',
    },
    intro: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',

        padding: '10% 5%',

        border: '3px solid rgba(188, 196, 195)',
        borderRadius: '10px',
        // width: '80%',
        height: '50%',

        backgroundColor: 'rgba(188, 196, 195, 0.5)',
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
        // width: '65vw',

    },
    centerBox: {
        // border: '1px solid black',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'right',
        width: '250px',
        padding: '1%',
    },
    playBtn: {
        // padding: '10%',
        width: '100%',
        margin: '10px auto',
        backgroundColor: '#feb236',
        color: 'black',
        fontWeight: 'bold',
        transition: 'background-color 0.3s ease', // Add transition for smooth effect

        '&:hover': {
            backgroundColor: '#f58220', // New background color when hovering
        },
    }
}

export default MainPage;
