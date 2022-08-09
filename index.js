const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log("[Start Server]");
});

const socketIO = require('socket.io');
const io = socketIO(server);
const otSpace = io.of('/ot');

let nickNameMap = new Map();
let adminMap = new Map();
let playerCnt = 0;

otSpace.on('connection', socket => {

    playerCnt += 1;

    basicSetting(socket);

    socket.on('setNickName', nickName => {
        nickNameMap.set(socket.id, nickName);
        socket.emit('doneNickName');
    });

    socket.on('createRoom', roomId => {
        adminMap.set(roomId, getNickName(socket));
        socket.emit('doneCreate');
    });
    
    socket.on('leaveRoom', roomId => {
        socket.leave(roomId);
        if (checkAdmin(roomId, socket)) {
            // explode room!
            otSpace.in(roomId).emit('exit');
        }
        clearInterval(socket.interval);
        getRoomList(socket);
        setIntervalGetRoomList(socket);
    });

    socket.on('joinRoom', roomId => {
        socket.join(roomId);
        clearInterval(socket.interval);
        getSocketList(socket, roomId);
        setIntervalGetSocketList(socket, roomId);
        socket.emit('doneJoin');
    });

    socket.on('checkAdmin', (roomId) => {
        socket.emit('admin', checkAdmin(roomId, socket));
    });

    socket.on('disconnect', () => {
        nickNameMap.delete(socket.id);
        playerCnt -= 1;
    });
});

function getNickName(socket) {
    return nickNameMap.get(socket.id);
}

function checkAdmin(roomId, socket) {
    console.log(getNickName(socket));
    console.log(roomId);
    console.log(adminMap);
    console.log(adminMap.get(roomId));
    if (adminMap.get(roomId) === getNickName(socket)) {
        return true;
    } else {
        return false;
    }
}

function basicSetting(socket) {

    const req = socket.request;
    // console.log(req.headers.referer);

    socket.leave(socket.id);

    clearInterval(socket.interval);

    getRoomList(socket);
    setIntervalGetRoomList(socket);
}

function getPlayerCnt() {
    return playerCnt;
}

function getRoomList(socket) {
    socket.emit('roomList', JSON.stringify(Array.from(socket.adapter.rooms.keys())));
}

function setIntervalGetRoomList(socket) {
    socket.interval = setInterval(() => {
        getRoomList(socket);
        getPlayerCnt();
    }, 1000);
}

function getSocketList(socket, roomId) {
    if (socket.adapter.rooms.get(roomId) === undefined) return;
    let socketList = Array.from(socket.adapter.rooms.get(roomId));
    socketList = socketList.map(id => {
        return nickNameMap.get(id);
    });
    socket.emit('socketList', JSON.stringify(socketList));
}

function setIntervalGetSocketList(socket, roomId) {
    socket.interval = setInterval(() => {
        getSocketList(socket, roomId);
        getPlayerCnt();
    }, 1000);

}

app.use('/', express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/main/index.html');
});

app.get('/room/[0-9]+', (req, res) => {
    res.sendFile(__dirname + '/room/index.html');
});