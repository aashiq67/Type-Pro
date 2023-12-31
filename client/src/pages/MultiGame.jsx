import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography, LinearProgress } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'

import './GamePage.css'

import MultiResult from './../components/MultiResult'

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

const MultiGame = ({sockRef, room}) => {
    const navigate = useNavigate();
    // const gameMode = useSelector(state => state.currInfoReducer.gameMode)
    // const duration = useSelector(state => state.currInfoReducer.duration)
    const username = localStorage.getItem('username')
    const { gameMode } = useParams()
    const [resultModalOpen, setResultModalOpen] = useState(false);
    const [input, setInput] = useState();
    const [characters, setCharacters] = useState(["a a"]);
    const [charIndex, setCharIndex] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [showResult, setShowResult] = useState(false);
    const [totalCharactersTyped, setTotalCharactersTyped] = useState(0);
    const [correctCharacters, setCorrectCharacters] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    useEffect(() => {
        setAccuracy(0);
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
        if (gameMode === '' || gameMode === undefined)
            setTimeLeft(room.duration);
        else
            setTimeLeft(60);
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
        console.log(input, getWPM());
        const typedChar = e.target.value[e.target.value.length - 1];
        if (charIndex < characters.length && timeLeft > 0) {
            setTotalCharactersTyped((prevCount) => prevCount + 1);
            if (!isTyping) {
                setIsTyping(true);
            }
            if (e.nativeEvent.inputType === 'deleteContentBackward') {
                setTotalCharactersTyped((prevCount) => Math.max(0, prevCount - 1));
                if (charIndex > 0) {
                    setCharIndex((prevIndex) => prevIndex - 1);
                    characters[charIndex - 1].status = 'inactive';
                    setCharacters([...characters]);
                    if (characters[charIndex - 1].status === 'correct') {
                        setCorrectCharacters((prevCount) => Math.max(0, prevCount - 1));
                    }
                }
            } else {
                if (characters[charIndex].char === typedChar) {
                    setCorrectCharacters((prevCount) => prevCount + 1);
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

        const newAccuracy = getAccuracyPercentage();
        setAccuracy(newAccuracy);
    };

    const getAccuracyPercentage = () => {
        const accuracyValue = (correctCharacters / totalCharactersTyped) * 100;
        const roundedAccuracy = isNaN(accuracyValue) ? 0 : Math.min(100, accuracyValue.toFixed(2));
        return roundedAccuracy;
    };

    const getWPM = () => {
        const totalWords = (charIndex - mistakes) / 5;
        const wpm = Math.round((totalWords / (60 - timeLeft)) * 60);
        return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    };
    
    const getScore = () => {
        const wpm = getWPM();
        const accuracyPercentage = getAccuracyPercentage();
        const score = (wpm * accuracyPercentage) / 100;
        return Math.round(score);
    };

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
    const [winner, setWinner] = useState('Still Loading...');

    useEffect(()=>{
        const data = room.roomMembers.map((member) => {
            return { username: member.username, progress: 0, wpm: 0, accuracy: 0, score: 0 }
        })
        setPlayersProgress(data);
    }, [])

    useEffect(() => {
        if(playersProgress.length > 0) {
            const filteredPlayersProgress = playersProgress.filter(player =>
                room.roomMembers.some(member => member.username === player.username)
            );
            setPlayersProgress(filteredPlayersProgress);
        }
    }, [room])

    useEffect(() => {
        console.log(playersProgress.length, room.roomMembers.length);
        if (playersProgress.length === room.roomMembers.length)
            sockRef.current.emit('sendProgress', { username, roomId: room.roomId, progress, wpm: getWPM(), accuracy: getAccuracyPercentage(), score: getScore() });
    }, [progress, getWPM()])

    useEffect(() => {
        sockRef.current.on('receiveProgress', ({ sender, progress, wpm, accuracy, score }) => {
            console.log(playersProgress);
            const existingPlayerIndex = playersProgress.findIndex((player) => player.username === sender);
            
            if (existingPlayerIndex !== -1) {
                const updatedPlayersProgress = [...playersProgress];
                updatedPlayersProgress[existingPlayerIndex].progress = progress;
                updatedPlayersProgress[existingPlayerIndex].wpm = wpm;
                updatedPlayersProgress[existingPlayerIndex].accuracy = accuracy;
                updatedPlayersProgress[existingPlayerIndex].score = score;
                setPlayersProgress(updatedPlayersProgress);
            } else {
                const newPlayerProgress = { name: sender, progress, wpm, accuracy, score };
                setPlayersProgress([...playersProgress, newPlayerProgress]);
            }
        })
    }, [playersProgress])

    useEffect(()=>{
        playersProgress.sort((a, b) => b.score - a.score);
    }, [playersProgress])

    return (
        <Box sx={styles.outerBox}>
            {showResult && <MultiResult
                open={resultModalOpen}
                mistakes={mistakes}
                wpm={getWPM()}
                timeLeft={timeLeft}
                accuracy={getAccuracyPercentage()}
                playersProgress={playersProgress}
            />}
            <Box sx={styles.wrapper} className='wrapper'>
                <Box sx={{ margin: '0 0 3%' }}>
                    <center><Typography sx={{ fontWeight: 'bold' }} variant='h5'>{username}</Typography></center>
                    <br />
                    <ProgressBar progress={progress} />
                </Box>
                <Box className='progressBar'>
                    {playersProgress.length !== 0 && 
                        playersProgress.slice(0, 3).map((player, index) => (
                            <Box key={index}>
                                <Box sx={{display: 'flex', justifyContent: 'space-between', margin: '5% 1%'}}>
                                    <Typography>{player.username}</Typography>
                                    <Typography>Acc : {player.accuracy}</Typography>
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
                        autoComplete='off'
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
                            <li className="accuracy">
                                <p>Accuracy:</p>
                                <span>{getAccuracyPercentage()}%</span>
                            </li>
                        </ul>
                        <button className="quit" onClick={() => navigate("/")}>Quit</button>
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
        height: '93vh'
    },

    progressBar: {
        width: '250px',
        height: '250px',
        position: 'absolute',
        top: 20,
        right: 25
    },

    wrapper: {
        width: '700px',
        padding: '35px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.05)',
        marginLeft: '100px'
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