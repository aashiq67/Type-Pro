import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainPage from "./pages/MainPage";
import GamePage from "./pages/GamePage";
// import GamePage from "./components/MultiGame";
import MultiGamePage from "./pages/MultiGamePage";
import PlayWithFrdsPage from "./pages/PlayWithFrdsPage";

const App = () => {
    const [username, setUsername] = useState();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage username={username} setUsername={setUsername}/>} />
                <Route path="/singleplay" element={<GamePage username={username} />} />
                <Route path="/multiplay" element={<MultiGamePage username={username} />} />
                <Route path="/frdsplay/:roomId" element={<PlayWithFrdsPage username={username} />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
