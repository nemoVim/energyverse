import { AdminManager } from './adminManager.mjs';
import { ClientManager } from './clientManager.mjs';

export class RoomManager {
    #socket;
    #name = '';

    constructor(_socket) {

        document.getElementById('roomTitle').innerText = 'ROOM ' + this.getRoomId();
        this.#socket = _socket;

        this.addEventLeaveRoomBtn();

        this.setNickname().then(() => {
            this.checkAdmin().then(() => {
                this.joinRoom().then((isPlaying) => {
                    console.log(isPlaying);
                    if (!isPlaying) {
                        this.reloadSocketList();
                    } else {
                        document.getElementById('loadingDiv').classList.add('hidden');
                    }
                });
            });
        });
    }

    checkNickname() {
        const cookie = document.cookie;
        if (cookie === '') {
            return false;
        } else {
            return true;
        }
    }

    setNickname() {
        return new Promise((resolve, reject) => {

            let nickname = '';

            nickname = prompt('name?');
            // if (!this.checkNickname()) {
            //     while (nickname.length !== 2 || nickname.match(/.{2}/) === null) {
            //         nickname = prompt('팀 이름을 입력하세요.');
            //     }
            //     document.cookie = nickname;
            // } else {
            //     nickname = document.cookie;
            // }

            this.#socket.emit('setNickName', nickname);

            this.#socket.on('returnName', (msg) => {
                if (msg[0]) {
                    this.#name = nickname;
                    resolve();
                } else {
                    alert(msg[1]);
                    this.setNickname();
                }
            });
        });

    }

    addEventLeaveRoomBtn() {
        const leaveRoomBtn = document.getElementById('leaveRoomBtn');
        leaveRoomBtn.addEventListener('click', () => {
            this.leaveRoom();
        });
    }

    getRoomId() {
        const roomId = (location.href.split('/').pop());
        return roomId;
    }

    leaveRoom() {
        this.#socket.emit('leaveRoom');
        location.href = '/main';
    }

    joinRoom() {
        return new Promise((resolve, reject) => {
            this.#socket.emit('joinRoom', this.getRoomId());
            this.#socket.on('returnJoin', msg => {
                if (msg[0]) {
                    if (msg[1] === null) {
                        resolve(true);
                    } else {
                        const answer = confirm(msg[1]);
                        if (answer) {
                            this.#socket.emit('loadInfo');
                            this.#socket.on('loadInfoDone', () => {
                                this.joinRoom().then(() => {
                                    resolve(true);
                                });
                            });
                        } else {
                            this.#socket.emit('removeInfo');
                            this.#socket.on('removeInfoDone', () => {
                                this.joinRoom().then(() => {
                                    resolve(false);
                                });
                            });
                        }
                    }
                } else {
                    if (msg[1] === null) {
                        resolve(false);
                    } else {
                        alert(msg[1]);
                        history.go(-1);
                    }
                }
            });
        });
    }

    checkAdmin() {
        return new Promise((resolve, reject) => {
            if (this.#name === '딜러') {
                const answer = prompt('당신이 딜러라는 것을 증명하시오. (3점)');
                if (answer === null || answer.search(/^[가-힣]+$/) == -1) {
                    alert('비번이 틀렸다 이자식아');
                    history.go(0);
                } else {
                    this.#socket.emit('checkAdmin', [this.getRoomId(), answer]);
                    this.#socket.on('admin', (isAdmin) => {
                        if (isAdmin) {
                            console.log(isAdmin);
                            this.init(isAdmin);
                            resolve();
                        } else {
                            alert('비번이 틀렸다 이자식아');
                            history.go(0);
                        }
                    });
                }
            } else {
                this.init(false);
                resolve();
            }
        });
    }

    init(isAdmin) {
        let manager;

        if (isAdmin) {
            manager = new AdminManager(this.#socket, this.#name);
            document
                .getElementById('roomController')
                .classList.remove('hidden');
        } else {
            manager = new ClientManager(this.#socket, this.#name);
        }
    }

    reloadSocketList() {
        this.#socket.on('socketList', (msg) => {
            let socketList = new Array(JSON.parse(msg))[0];
            this.refreshSocketListDiv(socketList);
            document.getElementById('loadingDiv').classList.add('hidden');
        });
    }

    refreshSocketListDiv(socketList) {
        const socketListDiv = document.getElementById('socketListDiv');
        socketListDiv.innerHTML = '';

        for (let i = 0; i < socketList.length; i++) {
            socketListDiv.append(this.makeSocketP(socketList[i]));
        }
    }

    makeSocketP(socketId) {
        const socketP = document.createElement('p');
        socketP.classList.add('socketP');
        socketP.innerText = socketId;

        return socketP;
    }
}
