const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const PriorityQueue = require('./PriorityQueue');
const sentences = require('./paragraphs');

const app = express();
app.use(express.json());

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

// const rooms = [];

// io.on('connection', (socket) => {
//     console.log(`New connection: ${socket.id}`);

//     // Handle user clicking start button
//     socket.on('startGame', (username) => {
//         const user = { id: socket.id, username };
//         const availableRoom = rooms.find((room) => room.length < 3);
//         if (availableRoom) {
//             availableRoom.push(user);
//         } else {
//             rooms.push([user]);
//         }
//         socket.join(rooms.length - 1);
//         io.to(socket.id).emit('roomAssigned', rooms.length - 1);
//         io.in(rooms.length - 1).emit('roomUpdate', rooms[rooms.length - 1]);
//     });

//     // socket.on('sendMessage', (message) => {
//     //     const index = rooms.findIndex((room) => room.some((user) => user.id === socket.id));
//     //     if (index !== -1) {
//     //         const room = rooms[index];
//     //         const user = room.find((user) => user.id === socket.id);
//     //         io.in(index).emit('receiveMessage', { sender: user.username, message });
//     //     }
//     // });

//     socket.on('sendProgress', (progress) => {
//         console.log(socket.id, progress);
//         const index = rooms.findIndex((room) => room.some((user) => user.id === socket.id));
//         if (index !== -1) {
//             const room = rooms[index];
//             console.log(room);
//             const user = room.find((user) => user.id === socket.id);
//             io.in(index).emit('receiveProgress', { sender: user.username, progress });
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log(`Disconnected: ${socket.id}`);
//         const index = rooms.findIndex((room) => room.some((user) => user.id === socket.id));
//         if (index !== -1) {
//             rooms[index] = rooms[index].filter((user) => user.id !== socket.id);
//             io.in(index).emit('roomUpdate', rooms[index]);
//         }
//     });
// });

const rooms = new PriorityQueue();
const privateRooms = {};

const createRoom = (roomId, username, sockId, gameMode) => {
    const ranIndex = Math.floor(Math.random() * sentences[gameMode].length);
    return {
        roomId,
        startTime: Math.floor(Date.now() / 1000),
        endTime: Math.floor(Date.now() / 1000) + 30,
        roomMembers: [{sockId, username}],
        paragraph: sentences[gameMode][ranIndex]
    }
}

const removeExpiredRooms = () => {
    const currentTime = Math.floor(Date.now() / 1000);
    while (rooms.peek() && rooms.peek().endTime <= currentTime) {
        rooms.dequeue();
    }
};

io.on('connection', (socket) => {
    console.log(`New connection: ${socket.id}`);

    socket.on('create-room', ({username, roomId}) => {
        const room = createRoom(roomId, username, id = socket.id);
        // privateRooms.set(roomId, room);
        privateRooms[roomId] = room;
        socket.join(roomId);
        io.in(roomId).emit('roomUpdate', privateRooms[roomId]);
    })

    socket.on('join-room', ({username, roomId}) => {
        const availableRoom = privateRooms[roomId];
        if (availableRoom && availableRoom.roomMembers.length < 3) {
            socket.join(roomId);
            availableRoom.roomMembers.push({sockId: socket.id, username})
            privateRooms[roomId] = availableRoom;
            io.in(roomId).emit('roomUpdate', privateRooms[roomId]);
        }
        else
            io.to(socket.id).emit('no-room', roomId);  
    })

    socket.on('sendStartStatus', (roomId) => {
        const availableRoom = privateRooms[roomId];
        if(availableRoom)
            io.in(roomId).emit('receiveStartStatus');
        else
            io.in(roomId).emit('no-room', roomId);  
    })

    socket.on('startGame', (username, gameMode) => {
        let roomId;
        const availableRoom = rooms.peek();
        if (availableRoom && availableRoom.roomMembers.length < 3) {
            rooms.addUser(username, sockId = socket.id);
            roomId = availableRoom.roomId
        } else {
            roomId = uuidv4();
            const room = createRoom(roomId, username, id = socket.id, gameMode);
            rooms.enqueue(room);
        }

        socket.join(roomId);
        
        io.in(roomId).emit('roomUpdate', rooms.peek());

        if(rooms.peek().roomMembers.length === 3) {
            io.in(roomId).emit('start');
        }
    });

    socket.on('sendProgress', ({username, roomId, progress, wpm}) => {
        io.in(roomId).emit('receiveProgress', { sender: username, progress, wpm }); 
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id}`);
        const updatedRoom = rooms.removeUser(sockId = socket.id)
        if(updatedRoom)
            io.in(updatedRoom.roomId).emit('roomUpdate', { room: updatedRoom });
    });
});

setInterval(() => {
    if (rooms.peek() && rooms.peek().endTime <= Math.floor(Date.now() / 1000)) {
        rooms.removeBack();
    }
}, 1000);

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
