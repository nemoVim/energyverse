const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log('[Start Server]');
});

const fs = require('fs');

const socketIO = require('socket.io');
const io = socketIO(server);
const otSpace = io.of('/ot');

var nickNameMap = new Map();
var adminMap = new Map();
var roomMap = new Map(); // [roomId, Map[playerList, connection]] add it when game starts.
var playerCnt = 0;

otSpace.on('connection', (socket) => {
    playerCnt += 1;

    let roomId;

    basicSetting(socket);

    socket.on('setNickName', (nickName) => {
        let isSame = false;
        nickNameMap.forEach(name => {
            if (name === nickName && name !== '딜러') {
                isSame = true;
            }
        });
        if (isSame) {
            socket.emit('returnName', [false, '이미 동일한 이름의 팀이 존재합니다.']);
        } else {
            nickNameMap.set(socket.id, nickName);
            socket.emit('returnName', [true, null]);
        }
    });

    socket.on('leaveRoom', () => {
        socket.leave(roomId);
        // if (checkAdmin(roomId, socket)) {
        //     // explode room!
        //     if (roomMap.has(roomId)) {
        //         roomMap.delete(roomId);
        //     }

        //     otSpace.in(roomId).emit('exit');
        // }
        clearInterval(socket.interval);
        getRoomList(socket);
        setIntervalGetRoomList(socket);
    });

    socket.on('joinRoom', (_roomId) => {
        roomId = _roomId;

        if (roomMap.get(roomId) !== undefined) {

            console.log(roomMap.get(roomId));

            if (
                roomMap.get(roomId).has(getNickName(socket)) &&
                roomMap.get(roomId).get(getNickName(socket)) === false
            ) {

                socket.join(roomId);
                console.log('reconnect');

                if (checkAdmin(roomId, socket, '은정킴')) {
                    loadUsers(socket, roomId);
                } else {
                    loadUsers(socket, roomId);
                }

                roomMap.get(roomId).set(getNickName(socket), true);
                socket.emit('returnJoin', [true, null]);
                addBroadcast(socket, roomId);

            } else if (roomMap.get(roomId).has(getNickName(socket)) && roomMap.get(roomId).get(getNickName(socket)) === true) {
                socket.emit('returnJoin', [false, '이미 해당 이름의 팀이 접속 중입니다.']);
                return;
            } else {
                socket.emit('returnJoin', [false, '게임이 진행 중인 방에는 입장할 수 없습니다.']);
                return;

            }

        } else {
            if (adminMap.has(roomId)) {
                if (checkAdmin(roomId, socket, '은정킴')) {
                    fs.exists(`./${roomId}_info.txt`, (isExist) => {
                        console.log(isExist);
                        if (isExist) {
                            socket.emit('returnJoin', [true, '저장된 데이터를 불러오겠습니까?']);
                            return;
                        } else {
                            socket.join(roomId);
                            socket.emit('returnJoin', [false, null]);
                            addBroadcast(socket, roomId);
                        }
                    });
                } else {
                    socket.join(roomId);
                    socket.emit('returnJoin', [false, null]);
                    addBroadcast(socket, roomId);
                }
            } else {
                socket.emit('returnJoin', [false, '딜러가 없는 방에는 입장할 수 없습니다.']);
                return;
            }
        }
    });

    socket.on('checkAdmin', (msg) => {
        socket.emit('admin', checkAdmin(msg[0], socket, msg[1]));
    });

    socket.on('disconnect', () => {
        if (roomMap.get(roomId) !== undefined && roomMap.get(roomId).has(getNickName(socket))) {
            roomMap.get(roomId).set(getNickName(socket), false);
        }
        nickNameMap.delete(socket.id);
        playerCnt -= 1;
    });

    socket.on('saveUsers', msg => {
        saveFile(`./${roomId}_users.txt`, msg);
    });

    socket.on('loadUsers', () => {
        loadUsers(socket, roomId);
    });

    socket.on('loadInfo', () => {
        loadInfo(socket, roomId);
    });

    socket.on('removeInfo', () => {
        removeInfo(socket, roomId);
    });

    socket.on('saveWorld', msg => {
        saveFile(`./${roomId}_world.txt`, msg);
    });

    socket.on('loadWorld', () => {
        loadWorld(socket, roomId);
    });

    socket.on('startSave', () => {
        saveInfo(`./${roomId}_info.txt`, roomId);
        socket.interval = setInterval(() => {
            socket.emit('save');
        }, 5000);
    });
});


function addBroadcast(socket, roomId) {
    clearInterval(socket.interval);
    socket.emit(
        'socketList',
        JSON.stringify(getSocketList(socket, roomId))
    );
    setIntervalGetSocketList(socket, roomId);

    onBroadcast(socket, roomId, 'ready');
    onBroadcast(socket, roomId, 'init');
    onBroadcast(socket, roomId, 'start');
    onBroadcast(socket, roomId, 'turn');
    onBroadcast(socket, roomId, 'wait');
    onBroadcast(socket, roomId, 'time');
    onBroadcast(socket, roomId, 'endGame');

    onBroadcast(socket, roomId, 'modify');
    onBroadcast(socket, roomId, 'earn');
    onBroadcast(socket, roomId, 'temperature');
    onBroadcast(socket, roomId, 'round');
    onBroadcast(socket, roomId, 'research');
    onBroadcast(socket, roomId, 'researchClient');
    onBroadcast(socket, roomId, 'unResearch');
    onBroadcast(socket, roomId, 'unResearchClient');
    onBroadcast(socket, roomId, 'learn');
}

function loadInfo(socket, roomId) {
    fs.readFile(`./${roomId}_info.txt`, 'utf8', (err, data) => {
        const names = JSON.parse(data);

        const connectionMap = new Map();

        names.forEach(name => {
            connectionMap.set(name, false);
        });

        roomMap.set(roomId, connectionMap);

        socket.emit('loadInfoDone');
    });
}

function removeInfo(socket, roomId) {
    fs.unlink(`./${roomId}_info.txt`, () => {
        socket.emit('removeInfoDone');
    });
}

function saveInfo(path, roomId) {
    let names = [];
    roomMap.get(roomId).forEach((val, name) => {
        names.push(name);
    });

    saveFile(path, names);

}

function loadUsers(socket, roomId) {
    console.log(roomId);
    fs.readFile(`./${roomId}_users.txt`, 'utf8', (err, data) => {
        socket.emit('usersData', data);
    });
}

function loadWorld(socket, roomId) {
    fs.readFile(`./${roomId}_world.txt`, 'utf8', (err, data) => {
        socket.emit('worldData', data);
    });
}

function saveFile(path, msg) {
    fs.open(path, 'w', () => {
        fs.writeFile(path, JSON.stringify(msg), () => {
        });
    });
}

function onBroadcast(socket, roomId, name) {
    socket.on(name, (config) => {
        if (name === 'ready') {
            gameStart(socket, roomId);
        } else if (name === 'endGame') {
            gameEnd(roomId);
        }
        socket.broadcast.to(roomId).emit(name, config);
    });
}

function gameStart(socket, roomId) {
    let connectionMap = new Map();
    getSocketList(socket, roomId).forEach(name => {
        connectionMap.set(name, true);
    });
    roomMap.set(roomId, connectionMap);
}

function gameEnd(roomId) {
    fs.readFile(`./${roomId}_users.txt`, 'utf8', (err, data) => {
        console.log(data);
        saveFile(`./${roomId}_users_end.txt`, JSON.parse(data));
    });
    fs.readFile(`./${roomId}_world.txt`, 'utf8', (err, data) => {
        console.log(data);
        saveFile(`./${roomId}_world_end.txt`, JSON.parse(data));
    });
    fs.readFile(`./${roomId}_info.txt`, 'utf8', (err, data) => {
        console.log(data);
        saveFile(`./${roomId}_info_end.txt`, JSON.parse(data));
    });

    roomMap.delete(roomId);
    adminMap.delete(roomId);
}

function getNickName(socket) {
    return nickNameMap.get(socket.id);
}

function checkAdmin(roomId, socket, answer) {
    if (getNickName(socket) === '딜러' && answer === '은정킴') {
        adminMap.set(roomId, getNickName(socket));
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
    socket.emit(
        'roomList',
        JSON.stringify(Array.from(socket.adapter.rooms.keys()))
    );
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
    socketList = socketList.map((id) => {
        return nickNameMap.get(id);
    });
    return socketList;
}

function setIntervalGetSocketList(socket, roomId) {
    socket.interval = setInterval(() => {
        socket.emit(
            'socketList',
            JSON.stringify(getSocketList(socket, roomId))
        );
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
