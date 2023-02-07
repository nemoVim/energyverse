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
            let newRoomList = new Array(JSON.parse(msg))[0];

            refreshRoomListDiv(newRoomList);
        });
    }

    function joinRoom(roomId) {
        location.href = '/room/' + roomId;
    }

    function refreshRoomListDiv(roomList) {
        const roomListDiv = document.getElementById('roomListDiv');
        roomListDiv.innerHTML = '';

        for (let i = 0; i < roomList.length; i++) {
            roomListDiv.append(makeRoomP(roomList[i]));
        }
    }

    function makeRoomP(roomId) {
        const roomP = document.createElement('p');
        roomP.classList.add('roomP');
        roomP.classList.add('shadow');
        roomP.innerText = roomId;

        roomP.addEventListener('click', () => {
            joinRoom(roomId);
        });

        return roomP;
    }
})();
