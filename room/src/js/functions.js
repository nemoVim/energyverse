import { AdminManager } from './adminManager.mjs';
import {TeamManager} from './teamManager.mjs';

(function () {
    const socket = io.connect('/ot');

    addEventLeaveRoomBtn();

    setNickname();
    joinRoom();
    checkAdmin();
    reloadSocketList();

    var nickname = '';

    function setNickname() {
        nickname = prompt('name?');
        socket.emit('setNickName', nickname);
    }

    // function checkNickname() {
    //     const cookie = document.cookie;
    //     if (cookie === '') {
    //         return false;
    //     } else {
    //         return true;
    //     }
    // }

    // function setNickname() {
    //     let nickname = '';

    //     if (!checkNickname()) {
    //         while (nickname.match(/[가-힣]{2,4}/) === null) {
    //             nickname = prompt('이름을 입력하세요.');
    //         }
    //         document.cookie = nickname;
    //     } else {
    //         nickname = document.cookie;
    //     }

    //     socket.emit('setNickName', nickname);
    // }

    function getNickname() {
        // return document.cookie;
        return nickname;
    }

    function addEventLeaveRoomBtn() {
        const leaveRoomBtn = document.getElementById('leaveRoomBtn');
        leaveRoomBtn.addEventListener('click', () => {
            leaveRoom();
        });
    }

    function getCookie() {
        return document.cookie;
    }

    function getRoomId() {
        const roomId = Number(location.href.split('/').pop());
        return roomId;
    }

    function leaveRoom() {
        socket.emit('leaveRoom');
        location.href = '/main';
    }

    function joinRoom() {
        socket.emit('joinRoom', getRoomId(), getNickname());
    }

    function checkAdmin() {
        socket.emit('checkAdmin');
        socket.on('admin', (isAdmin) => {
            console.log(isAdmin);
            init(isAdmin)
        });
    }

    function init(isAdmin) {

        let manager;

        if (isAdmin) {
            manager = new AdminManager(socket);
            document.getElementById('roomController').classList.remove('hidden');
        } else {
            manager = new TeamManager(socket, getNickname());
        }
    }

    function reloadSocketList() {
        socket.on('socketList', (msg) => {
            let socketList = new Array(JSON.parse(msg))[0];
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
