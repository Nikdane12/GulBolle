// const networks = require('./networks')
const express = require('express')
const { default: axios } = require('axios')
const path = require("path");

const app = express();
const port = 88;

const GenRoom = () => {
    const seed = Date.now() % 0x80000000; 
    const a = 1103515245;
    const c = 12345;
    const m = 0x80000000;

    const random = (seed) => {
        return (a * seed + c) % m;
    };

    const randomNum = Math.floor(random(seed) / (m / 900000)) + 100000;
    return randomNum;
}

app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const gameRooms = {};

const createGameRoom = (roomId) => {
    gameRooms[roomId] = {
        teams: [],
        wordBank: [],
        usedWords: [],
        currentTeamIndex: 0,
        currentMode: 0,
    };
};

app.get("/play", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "gulbolle.html")); 
});

app.post('/create-room', (req, res) => {
    const roomId = GenRoom(); 
    createGameRoom(roomId);
    console.log("Room created: ",roomId)
    res.json({ roomId });
});

app.get('/play/:roomId', (req, res) => {
    const { roomId } = req.params;

    if (!gameRooms[roomId]) {
        return res.status(404).send('Game room not found');
    }

    res.sendFile(path.join(__dirname, "public", "gulbolle.html")); 
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});