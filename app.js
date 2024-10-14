const express = require('express');
const path = require('path');
const EventEmitter = require('events');

const app = express();
const port = 88;

const genSeed = () => {
    const seed = Date.now() % 0x80000000; 
    const a = 1103515245;
    const c = 12345;
    const m = 0x80000000;

    const random = (seed) => {
        return (a * seed + c) % m;
    };

    const randomNum = Math.floor(random(seed) / (m / 900000)) + 100000;
    // return randomNum; // Generate a random roomId
    return 1
}

app.use(express.json());
app.use(express.static("public"));

const gameRooms = {}; // To keep track of all game rooms and their data

// Function to create a new game room
const createGameRoom = (roomId) => {
    gameRooms[roomId] = {
        roomId,
        teams: [],
        wordBank: [],
        usedWords: [],
        currentTeamIndex: 0,
        currentMode: 0,
        players: [],
        host: null,
    };
    return gameRooms[roomId];
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint for host to create a new room
app.post('/create-room', (req, res) => {
    const roomId = genSeed(); 
    const roomData = createGameRoom(roomId);
    console.log("Room created: ", roomId);
    res.json({ roomData });
});

// Serve the game page to the player based on room ID
app.get('/play/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (!gameRooms[roomId]) {
        return res.status(404).send('Game room not found');
    }
    res.sendFile(path.join(__dirname, "public", "game.html")); 
    console.log("User joined room: ", roomId);
});

// Serve the host page when the host joins the room
app.get('/host/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (!gameRooms[roomId]) {
        return res.status(404).send('Game room not found');
    }
    res.sendFile(path.join(__dirname, "public", "host.html")); 
});

// SSE endpoint to handle player connections to a specific room
app.get('/events/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (!gameRooms[roomId]) {
        return res.status(404).send('Game room not found');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the new player connection to the specific game room
    gameRooms[roomId].players.push(res);

    // Handle the player disconnecting from the game room
    req.on('close', () => {
        gameRooms[roomId].players = gameRooms[roomId].players.filter(client => client !== res);
    });
});

app.post('/ping/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (!gameRooms[roomId]) {
        return res.status(404).json({ error: 'Game room not found' });
    }

    console.log(`Ping received from host of room ${roomId}`);
    // Broadcast the ping to all players in the specified room
    gameRooms[roomId].players.forEach(player => {
        player.write(`event: ping\ndata: ${JSON.stringify({ message: `Ping received from host of room ${roomId}` })}\n\n`);
    });

    res.setHeader('Content-Type', 'application/json');
    res.json({ message: `Pong! Room ${roomId}` });
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
