import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Typography, LinearProgress } from '@mui/material'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom';
import sentences from './../paragraphs.js'
import './GamePage.css'
import Buzzer from './buzzer.mp3'
import tickTick from './tick-tick.mp3'

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

const GamePage = () => {
    const navigate = useNavigate();
    const { gameMode, duration } = useParams();

    const username = localStorage.getItem('username')
    
    const textFieldRef = useRef(null);
    
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
        // if(timeLeft === 0) {
        //     const audio = new Audio(Buzzer);
        //     audio.play();
        // } 
        // if(timeLeft === 10) {
        //     const audio = new Audio(tickTick);
        //     audio.play();
        // }

        return () => clearInterval(timer);
    }, [timeLeft, showResult]);

    const loadParagraph = () => {
        const ranIndex = Math.floor(Math.random() * sentences[gameMode].length);
        const chars = sentences[gameMode][ranIndex].split("").map((char) => ({
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
        e.target.onpaste = (e) => e.preventDefault();
        setInput(e.target.value);
        const typedChar = e.target.value[e.target.value.length - 1];
        if (charIndex < characters.length && timeLeft > 0) {
            setTotalCharactersTyped((prevCount) => prevCount + 1);
            if (!isTyping) {
                setIsTyping(true);
            }
            if (e.nativeEvent.inputType === 'deleteContentBackward') {
                // Backspace or delete key was pressed, handle the logic
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
        const wpm = Math.round((totalWords / (duration - timeLeft)) * 60);
        return wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    };

    const getScore = () => {
        const wpm = getWPM();
        const accuracyPercentage = getAccuracyPercentage();
        const score = (wpm * accuracyPercentage) / 100;
        return Math.round(score);
    };

    const resetGame = () => {
        setCorrectCharacters(0);
        setTotalCharactersTyped(0);
        loadParagraph();
        setIsTyping(false);
        setInput("");
        setShowResult(false);
        setResultModalOpen(false);
        textFieldRef.current.focus();
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

    // const handleMouseDown = (event) => {
    //     event.preventDefault();
    // };

    return (
        <Box sx={styles.outerBox}>
            {showResult && <Result
                open={resultModalOpen}
                handleClose={resetGame}
                mistakes={mistakes}
                wpm={getWPM()}
                timeLeft={timeLeft}
                accuracy={getAccuracyPercentage()}
                score={getScore()}
                resetGame={resetGame}
            />}
            <Box sx={styles.wrapper} className='wrapper'>
                <Box sx={styles.progressBar}>
                    <Box sx={styles.heading}>
                        <Typography sx={{ fontWeight: 'bold' }} variant='h5'>{username}</Typography>
                        <Typography>Score: {getScore()}</Typography>
                    </Box>
                    <br />
                    <ProgressBar progress={progress} />
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
                        inputRef={textFieldRef}
                        onChange={handleInputChange}
                        autoFocus
                        autoComplete='off'
                        // inputProps={{ onMouseDown: handleMouseDown }}
                    />
                    <div className="content">
                        <ul className="result-details">
                            <li className='time'>
                                <p>Time Left:</p>
                                <span>
                                    <b className={timeLeft <= 10 ? 'red' : 'time'}>{timeLeft}</b>s
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
                        <button className='TryAgain' onClick={resetGame}>Try Again</button>
                        <button className="quit" onClick={()=>navigate("/")}>Quit</button>
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
        margin: '0 0 3%'
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

    heading: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 3%' 
    }
}

export default GamePage;