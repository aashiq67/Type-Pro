import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, LinearProgress } from '@mui/material'
import { useSelector } from 'react-redux'

import './GamePage.css'

import Result from './../components/Result'

const ProgressBar = ({ progress }) => {
    return (
        <div className="progress-bar" style={{ height: `15px`, width: '100%' }}>
            <div className="moving-object" style={{ left: `${progress - 3}%`, top: -15 }}>
                🚘
            </div>
            <LinearProgress sx={{ height: `10px`, width: '100%' }} variant="determinate" value={progress} />
        </div>
    );
};

const MultiGame = ({socket, room, resetGame}) => {
    // const navigate = useNavigate();
    // const gameMode = useSelector(state => state.currInfoReducer.gameMode)
    // const duration = useSelector(state => state.currInfoReducer.duration)
    const username = localStorage.getItem('username')
    const gameMode = 'Easy';
    const duration = 30;
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [input, setInput] = useState();
    const [characters, setCharacters] = useState(["a a"]);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [showResult, setShowResult] = useState(false);
    
    useEffect(() => {
        loadParagraph();
    }, []);

    useEffect(() => {
        let timer;
        if (timeLeft > 0 && !showResult) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0 && !showResult) {
            setShowResult(true);
            setResultModalOpen(true);
        }

        return () => clearInterval(timer);
    }, [timeLeft, showResult]);

    const loadParagraph = () => {
        const chars = room.paragraph.split("").map((char) => ({
            char,
            status: 'inactive',
        }));
        setCharacters(chars);
        setIsTyping(true);
        setCharIndex(0);
        setMistakes(0);
        setTimeLeft(duration);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        const typedChar = e.target.value[e.target.value.length - 1];
        if (charIndex < characters.length && timeLeft > 0) {
            if (!isTyping) {
                setIsTyping(true);
            }
            if (e.nativeEvent.inputType === 'deleteContentBackward') {
                if (charIndex > 0) {
                    characters[charIndex - 1].status = 'inactive';
                    setCharIndex((prevIndex) => prevIndex - 1);
                    if (characters[charIndex - 1].status === 'incorrect') {
                        setMistakes((prevMistakes) => prevMistakes - 1);
                    }
                }
            } else {
                if (characters[charIndex].char === typedChar) {
                    characters[charIndex].status = 'correct';
                } else {
                    setMistakes((prevMistakes) => prevMistakes + 1);
                    characters[charIndex].status = 'incorrect';
                }
                setCharIndex((prevIndex) => prevIndex + 1);
            }
            setCharacters([...characters]);
        } else {
            setIsTyping(false);
            e.target.value = '';
        }
    };

    const getWPM = () => {
        const totalWords = (charIndex - mistakes) / 5;
        const wpm = Math.round((totalWords / (60 - timeLeft)) * 60);
        return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    };

    const getCPM = () => {
        const cpm = charIndex - mistakes;
        return cpm < 0 ? 0 : cpm;
    };

    // const resetGame = () => {
    //     loadParagraph();
    //     setIsTyping(false);
    //     setInput("");
    //     setShowResult(false);
    //     setResultModalOpen(false);
    // };

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (charIndex > 0 && characters.length > 0) {
            setProgress((charIndex / characters.length) * 100);
        } else {
            setProgress(0);
        }
    }, [charIndex, characters]);

    useEffect(() => {
        if (timeLeft === 0) {
            setShowResult(true);
            setResultModalOpen(true);
        }
    }, [timeLeft])

    useEffect(() => {
        if (charIndex === characters.length) {
            setShowResult(true);
            setResultModalOpen(true);
        }
    }, [charIndex])
    useEffect(() => {
        if (charIndex === characters.length && !showResult) {
            setShowResult(true);
            setResultModalOpen(true);
        }
    }, [charIndex, showResult]);
    
    // SOCKETS
    // const [playersProgress, setPlayersProgress] = useState([
    //     { name: room.roomMembers[0].username, progress: 0, wpm: 0 },
    //     { name: room.roomMembers[1].username, progress: 0, wpm: 0 },
    //     { name: room.roomMembers[2].username, progress: 0, wpm: 0 },
    // ]);

    const [playersProgress, setPlayersProgress] = useState([]);

    useEffect(()=>{
        const data = room.roomMembers.map((member) => {
            return { name: member.username, progress: 0, wpm: 0 }
        })
        setPlayersProgress(data);
    }, [])

    useEffect(() => {
        if (playersProgress.length === room.roomMembers.length)
            socket.emit('sendProgress', { username, roomId: room.roomId, progress, wpm: getWPM() });
    }, [progress, getWPM()])

    useEffect(() => {
        socket.on('receiveProgress', ({ sender, progress, wpm }) => {
            
            const existingPlayerIndex = playersProgress.findIndex((player) => player.name === sender);
            
            if (existingPlayerIndex !== -1) {
                const updatedPlayersProgress = [...playersProgress];
                updatedPlayersProgress[existingPlayerIndex].progress = progress;
                updatedPlayersProgress[existingPlayerIndex].wpm = wpm;
                setPlayersProgress(updatedPlayersProgress);
            } else {
                const newPlayerProgress = { name: sender, progress, wpm };
                setPlayersProgress([...playersProgress, newPlayerProgress]);
            }
            
        })
    }, [socket, playersProgress])

    return (
        <Box sx={styles.outerBox}>
            {showResult && <Result
                open={resultModalOpen}
                handleClose={resetGame}
                mistakes={mistakes}
                wpm={getWPM()}
                timeLeft={timeLeft}
            />}
            <Box sx={styles.wrapper} className='wrapper'>
                <Box sx={styles.progressBar}>
                    {playersProgress.length !== 0 && 
                        playersProgress.map(player => (
                            <Box>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', margin: '5% 1%'}}>
                                    <Typography>{player.name}</Typography>
                                    <Typography>WPM : {player.wpm}</Typography>
                                </Box>
                                <ProgressBar progress={player.progress} />
                            </Box>
                        ))
                    }
                </Box>
                <div className='content-box'>
                    <div className='typing-text'>
                        <p>
                            {characters.map((charObj, index) => (
                                <span
                                    key={index}
                                    className={index === charIndex ? 'active ' + charObj.status : charObj.status}
                                >
                                    {charObj.char}
                                </span>
                            ))}
                        </p>
                    </div>
                    <TextField
                        type="text"
                        sx={styles.inputField}
                        value={input}
                        onChange={handleInputChange}
                        autoFocus
                    />
                    <div className="content">
                        <ul className="result-details">
                            <li className="time">
                                <p>Time Left:</p>
                                <span>
                                    <b>{timeLeft}</b>s
                                </span>
                            </li>
                            <li className="mistake">
                                <p>Mistakes:</p>
                                <span>{mistakes}</span>
                            </li>
                            <li className="wpm">
                                <p>WPM:</p>
                                <span>{getWPM()}</span>
                            </li>
                            <li className="cpm">
                                <p>CPM:</p>
                                <span>{getCPM()}</span>
                            </li>
                        </ul>
                        <button onClick={resetGame}>Try Again</button>
                    </div>
                </div>
            </Box>
        </Box>
    );
};

const styles = {
    outerBox: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '97.9vh'
    },

    progressBar: {
        width: '250px',
        height: '250px',
        border: '3px solid red',
        position: 'absolute',
        top: 20,
        left: 20
    },

    wrapper: {
        width: '700px',
        padding: '35px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.05)',
    },

    inputField: {
        width: '100%'
    },
    contentBox: {
        padding: '13px 20px 0',
        borderRadius: '10px',
        border: '4px solid #007acc',
    },
}

export default MultiGame;