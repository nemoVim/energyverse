import {Manager} from './manager.mjs';
import {Team} from './team.mjs';

(function () {
    addEventLeaveRoomBtn();

    const body = document.getElementsByTagName('body')[0];

    let teamCnt = Number(prompt('팀 수?'));
    let manager = new Manager(teamCnt);

    body.append(manager.getUI().getDiv());

    manager.start();
    const socket = io.connect('/ot');

    const team = new Team();
    team.init();
    let isAdmin;

    setConfig();

    async function setConfig() {
        await setNickName();
        await joinRoom();
        checkAdmin();
    }

    reloadSocketList();

    function addEventLeaveRoomBtn() {
        const leaveRoomBtn = document.getElementById('leaveRoomBtn');
        leaveRoomBtn.addEventListener('click', () => {
            leaveRoom();
        });
    }

    function createRoom() {
        socket.emit('createRoom', roomId);
        return roomId;
    }
    function getCookie() {
        return document.cookie;
    }


    function getRoomId() {
        const roomId = Number(location.href.split('/').pop());
        return roomId;
    }

    function leaveRoom() {
        socket.emit('leaveRoom', getRoomId());
        location.href = '/main';
    }

    function joinRoom() {
        return new Promise((resolve, reject) => {
            socket.emit('joinRoom', getRoomId(), getCookie());
            socket.on('doneJoin', () => {
                resolve();
            });
        });
    }

    function checkAdmin() {
        socket.emit('checkAdmin', getRoomId());
        socket.on('admin', (_isAdmin) => {
            isAdmin = _isAdmin;
            console.log(isAdmin);
        });
    }

    function reloadSocketList() {
        socket.on('socketList', (msg) => {
            let socketList = new Array(JSON.parse(msg))[0];
            console.log(socketList);
            refreshSocketListDiv(socketList);
        });
    }

    function refreshSocketListDiv(socketList) {
        const socketListDiv = document.getElementById('socketListDiv');
        socketListDiv.innerHTML = '';

        for (let i = 0; i < socketList.length; i++) {
            socketListDiv.append(makeSocketDiv(socketList[i]));
        }
    }

    function makeSocketDiv(socketId) {
        const socketDiv = document.createElement('div');

        const socketTitle = document.createElement('h1');
        socketTitle.innerText = '[' + socketId + ']';

        socketDiv.append(socketTitle);

        return socketDiv;
    }
})();
