// App.js
import React, { useEffect } from 'react';
import io from 'socket.io-client';

const Page = () => {
    useEffect(() => {
        // Connect to the server
        const socket = io('http://localhost:5000');

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Disconnected from the server');
        });

        return () => {
            // Disconnect when the component unmounts
            socket.disconnect();
        };
    }, []);

    return <div>Socket Connection Example</div>;
};

export default Page;
