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

    let roomId;

    basicSetting(socket);

    socket.on('setNickName', nickName => {
        nickNameMap.set(socket.id, nickName);
    });

    socket.on('leaveRoom', () => {
        socket.leave(roomId);
        if (checkAdmin(roomId, socket)) {
            // explode room!
            otSpace.in(roomId).emit('exit');
        }
        clearInterval(socket.interval);
        getRoomList(socket);
        setIntervalGetRoomList(socket);
    });

    socket.on('joinRoom', _roomId => {

        roomId = _roomId;
        
        socket.join(roomId);

        if (getSocketList(socket, roomId).length === 1) {
            // This socket is the first member of the room. => It is admin.
            adminMap.set(roomId, getNickName(socket));
        }

        clearInterval(socket.interval);
        socket.emit('socketList', JSON.stringify(getSocketList(socket, roomId)));
        setIntervalGetSocketList(socket, roomId);

        onBroadcast(socket, roomId, 'init');
        onBroadcast(socket, roomId, 'build');
        onBroadcast(socket, roomId, 'destroy');
        onBroadcast(socket, roomId, 'refresh');
        onBroadcast(socket, roomId, 'thermal');
        onBroadcast(socket, roomId, 'modify');
        onBroadcast(socket, roomId, 'research');
        onBroadcast(socket, roomId, 'settle');

    });

    socket.on('checkAdmin', () => {
        socket.emit('admin', checkAdmin(roomId, socket));
    });



    socket.on('disconnect', () => {
        nickNameMap.delete(socket.id);
        playerCnt -= 1;
    });
});

function onBroadcast(socket, roomId, name) {
    socket.on(name, config => {
        console.log(name);
        socket.broadcast.to(roomId).emit(name, config);
    });
}

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
    return socketList;
}

function setIntervalGetSocketList(socket, roomId) {
    socket.interval = setInterval(() => {
        socket.emit('socketList', JSON.stringify(getSocketList(socket, roomId)));
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