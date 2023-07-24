// Timer.js
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Timer.css'; // Import the Timer.css styles

const Timer = ({ Component }) => {
    const [start, setStart] = useState(false);
    const [timeLeft, setTimeLeft] = useState(3);

    useEffect(() => {
        let timer;

        if (timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setTimeout(() => {
                setStart(true);
            }, 1000);
        }

        return () => clearInterval(timer);
    }, [timeLeft]);

    return (
        <div className="timer-container">
            {!start && (
                <div className="countdown">
                    <div className="countdown-overlay" />
                    <Typography sx={{
                        fontSize: '72px',
                        color: '#00bcd4',
                        textShadow: '4px 4px 4px rgba(0, 0, 0, 0.2)', // Adding a shadow
                        opacity: 0.8,
                    }} variant="h1">{timeLeft === 0 ? "Go" : timeLeft}</Typography>
                </div>
            )}

            {start && Component}
        </div>
    );
};

export default Timer;
