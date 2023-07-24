import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material'
import { Link } from 'react-router-dom';
import axios from 'axios'


const LeaderBoard = () => {

    const [noData, setNoData] = useState(false);
    const [usersData, setUsersData] = useState([])
    const getData = async () => {
        try {
            const { data } = await axios.get('http://localhost:5000/game/getLeaderBoard');
            if (data && data.status && Array.isArray(data.users)) {
                setUsersData(data.users);
                setNoData(false);
            } else {
                setUsersData([]);
                setNoData(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setUsersData([]);
            setNoData(true);
        }
    }

    useEffect(() => {
        (async () => {
            await getData();
        })();
    }, [])


    const nameformating = (name) => {
        if (name.length <= 7) {
            return name;
        } else {
            return name.substring(0, 7) + '..';
        }
    };
    return (
        <Box style={styles.container}>
            <Box style={styles.leaderboardBox}>
                <Box style={styles.leaderboardTitle}>Leaderboard</Box>
                <Box style={styles.leaderboardTable}>
                    <Box style={styles.tableHeader}>
                        <Box style={styles.rankColumn}>RANK</Box>
                        <Box style={styles.userIdColumn}>USERID</Box>
                        <Box style={styles.netScoreColumn}>NET SCORE</Box>
                    </Box>

                    {!noData ? usersData && usersData.slice(0,5).map((item, index) => (
                        <Box key={index} style={styles.tableRow}>
                            <Box style={styles.rankColumn}>{index + 1}</Box>
                            <Box style={styles.userIdColumn}>{nameformating(item.username)}</Box>
                            <Box style={styles.netScoreColumn}>{item.score}</Box>
                        </Box>
                    )) :
                        <Box style={styles.tableRow}>
                            <Box style={styles.rankColumn}>-</Box>
                            <Box style={styles.userIdColumn}>-</Box>
                            <Box style={styles.netScoreColumn}>-</Box>
                        </Box>
                    }

                </Box>
            </Box>
            <Button sx={styles.playBtn} variant='contained'><Link to="https://www.youtube.com/playlist?list=PL6krtUNUVPsCXJ2dbR1xbDadzAZllKw7t">Learn Speed Typing</Link></Button>
        </Box>
    );
};

const styles = {
    container: {
        padding: '3% 1%',
        width: '20vw',
        height: '50vh',
        display: 'flex',
        flexDirection: 'column'
    },
    leaderboardBox: {
        padding: '5%',
        maxWidth: '30vw',
        border: '3px solid rgba(188, 196, 195)',
        borderRadius: '10px',
        backgroundColor: 'rgba(188, 196, 195, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    leaderboardTitle: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: '24px',
        marginBottom: '1rem',
        backgroundColor: '#feb236',
        padding: '0.5rem 1rem',
        borderRadius: '5px',
    },
    leaderboardTable: {
        border: '2px solid #feb236',
        borderRadius: '5px',
        width: '100%',
        backgroundColor: 'lightblue',
        marginTop: '1rem',
    },
    tableHeader: {
        background: '#feb236',
        color: 'white',
        padding: '0.5rem',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    tableRow: {
        padding: '0.5rem',
        borderBottom: '1px solid rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    rankColumn: {
        flex: '0 0 4ch',
        marginRight: '1ch',
        textAlign: 'center',
    },
    userIdColumn: {
        flex: '0 0 10ch',
        textAlign: 'center',
    },
    netScoreColumn: {
        flex: '1',
        textAlign: 'center',
    },
    playerName: {
        fontWeight: 'bold',
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
};

export default LeaderBoard;