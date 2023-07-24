const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const PriorityQueue = require('./PriorityQueue');
const sentences = require('./paragraphs');

const userRoutes = require("./routes/userRoutes");
const gameRoutes = require("./routes/gameRoutes");

const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(cookieParser());

app.use("/user", userRoutes);
app.use("/game", gameRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/typingDB")
    .then(() => console.log("DB Connected"))
    .catch(err => console.log(err));

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your React app's origin
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});

const PORT = process.env.PORT || 5000;

const rooms = {
    'Easy' : new PriorityQueue(),
    'Medium': new PriorityQueue(),
    'Hard': new PriorityQueue(),
}

const privateRooms = {};

const createRoom = (roomId, username, sockId, gameMode, duration) => {
    const ranIndex = Math.floor(Math.random() * sentences[gameMode].length);
    return {
        roomId,
        gameMode,
        duration,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + 30,
        roomMembers: [{ sockId, username }],
        paragraph: sentences[gameMode][ranIndex],
        winner: '',
        isGameStarted: false
    }
}

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('create-room', ({ username, roomId, gameMode, duration }) => {
        const room = createRoom(roomId, username, id = socket.id, gameMode, duration);
        privateRooms[roomId] = room;
        socket.join(roomId);
        io.in(roomId).emit('roomUpdate', privateRooms[roomId]);
    })

    socket.on('join-room', ({ username, roomId }) => {
        const availableRoom = privateRooms[roomId];
        if (availableRoom && availableRoom.roomMembers.length < 3) {
            socket.join(roomId);
            availableRoom.roomMembers.push({ sockId: socket.id, username })
            privateRooms[roomId] = availableRoom;
            io.in(roomId).emit('roomUpdate', privateRooms[roomId]);
        }
        else
            io.to(socket.id).emit('no-room', `no room exist with id : ${roomId}`);
    })

    socket.on('sendStartStatus', (roomId) => {
        const availableRoom = privateRooms[roomId];
        if (availableRoom)
            io.in(roomId).emit('receiveStartStatus');
        else
            io.in(roomId).emit('no-room', roomId);
    })

    socket.on('startGame', (username, gameMode) => {
        let roomId;
        console.log("starting game");
        const availableRoom = rooms[gameMode].peek();
        // console.log(Math.floor(Date.now() / 1000), availableRoom);
        if (availableRoom && availableRoom.roomMembers.length < 3 && availableRoom.gameMode === gameMode && !availableRoom.isGameStarted) {
            // console.log("allocating");
            rooms[gameMode].addUser(username, sockId = socket.id);
            roomId = availableRoom.roomId
        } else {
            // console.log("creating");
            roomId = uuidv4();
            const room = createRoom(roomId, username, id = socket.id, gameMode);
            rooms[gameMode].enqueue(room);
        }

        socket.join(roomId);

        io.in(roomId).emit('roomUpdate', rooms[gameMode].peek());

        if (rooms[gameMode].peek().roomMembers.length === 3) {
            rooms[gameMode].startGame();
            io.in(roomId).emit('start');
        }
    });

    socket.on('sendProgress', ({ username, roomId, progress, wpm, accuracy, score }) => {
        io.in(roomId).emit('receiveProgress', { sender: username, progress, wpm, accuracy, score });
    });

    // socket.on('lastMessageBeforeDisconnect', (roomId) => {
    //     console.log('Received last message before disconnection:', roomId)
    // });

    // socket.on('user-audio-stream', (roomId, stream) => {
    //     const userId = socket.id;
    //     console.log(`Received audio stream from user ${userId} in room ${roomId}`);

    //     // Send the audio stream to other clients in the same room
    //     io.in(roomId).emit('user-audio-stream', userId, stream);
    // });


    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);

        let updatedRoom = rooms.Easy.removeUser(sockId = socket.id)
        if(updatedRoom === undefined)
            updatedRoom = rooms.Medium.removeUser(sockId = socket.id)
        if (updatedRoom === undefined)
            updatedRoom = rooms.Hard.removeUser(sockId = socket.id)
        
        

        if (updatedRoom) {
            // console.log("updating room", updatedRoom);
            io.in(updatedRoom.roomId).emit('roomUpdate', updatedRoom);
        }
    });
});

setInterval(() => {
    if (rooms.Easy.peek() && rooms.Easy.peek().roomMembers.length <= 1 && rooms.Easy.peek().endTime <= Math.floor(Date.now() / 1000)) {
        rooms.Easy.removeBack();
    }
    if (rooms.Medium.peek() && rooms.Medium.peek().roomMembers.length <= 1 && rooms.Medium.peek().endTime <= Math.floor(Date.now() / 1000)) {
        rooms.Medium.removeBack();
    }
    if (rooms.Hard.peek() && rooms.Hard.peek().roomMembers.length <= 1 && rooms.Hard.peek().endTime <= Math.floor(Date.now() / 1000)) {
        rooms.Hard.removeBack();
    }
}, 1000);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});