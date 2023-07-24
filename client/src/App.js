import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useDispatch } from "react-redux";
import axios from 'axios'

import { authInfo } from "./store";

import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
import Timer from './components/Timer.jsx';
import MultiGamePage from "./pages/MultiGamePage";
import PlayWithFrdsPage from "./pages/PlayWithFrdsPage";

const App = () => {

    const dispatch = useDispatch();

    const refreshToken = async () => {
        const { data } = await axios.get("http://localhost:5000/user/refreshToken");
        console.log(data);
        if (data.status === false)
            dispatch(authInfo.logout());
    }

    useEffect(() => {
        let interval = setInterval(() => {
            refreshToken();
        }, 1000 * 29);
        return () => clearInterval(interval);
    }, [])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/singleplay/:gameMode/:duration" element={<Timer Component={<GamePage />} />} />
                <Route path="/multiplay/:gameMode" element={<MultiGamePage />} />
                <Route path="/frdsplay/:roomId" element={<PlayWithFrdsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
