(function () {
    const socket = io.connect('/ot');

    // addEventCreateRoomBtn();
    reloadRoomList();

    // function addEventCreateRoomBtn() {
    //     const createRoomBtn = document.getElementById('createRoomBtn');
    //     createRoomBtn.addEventListener('click', () => {
    //         // const roomId = Math.floor(Math.random() * 100000);
    //         const roomId = prompt('room name?');
    //         joinRoom(roomId);
    //     });
    // }

    function reloadRoomList() {
        socket.on('roomList', (msg) => {
            let roomList = new Array(JSON.parse(msg))[0];
            refreshRoomListDiv(roomList);
        });
    }

    function joinRoom(roomId) {
        location.href = '/room/' + roomId;
    }

    function refreshRoomListDiv(roomList) {
        const roomListDiv = document.getElementById('roomListDiv');
        roomListDiv.innerHTML = '';

        for (let i = 0; i < roomList.length; i++) {
            roomListDiv.append(makeRoomDiv(roomList[i]));
        }
    }

    function makeRoomDiv(roomId) {
        const roomDiv = document.createElement('div');
        roomDiv.addEventListener('click', () => {
            console.log('click!');
            joinRoom(roomId);
        });

        const roomTitle = document.createElement('h1');
        roomTitle.innerText = '[' + roomId + ']';

        roomDiv.append(roomTitle);

        return roomDiv;
    }
})();
