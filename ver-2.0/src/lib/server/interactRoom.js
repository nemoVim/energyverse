import { interactDB } from '$lib/server/db';
import Room from '$lib/models/room';
import { createRes } from '$lib/utils/requests';

export async function findAllRooms() {
    const roomList = await interactDB(async () => await Room.find({}));

    let parsedRoomList = [];

    roomList.forEach((value) => {
        parsedRoomList.push({
            title: value.title,
            dealer: value.dealer,
            playerList: value.playerList,
        });
    });

    return createRes(200, parsedRoomList);
}

export async function findRoomByTitle(title) {
    const room = await interactDB(
        async () =>
            await Room.findOne({
                title: title,
            })
    );

    const roomMsg = {
        title: title,
        dealer: room.dealer,
        playerList: room.playerList,
    };

    return createRes(200, roomMsg);
}

export async function createRoom(title, dealer) {
    await interactDB(async () => {
        const room = new Room({
            title: title,
            dealer: dealer,
            playerList: createPlayerList(title),
        });
        return await room.save();
    });
    return createRes(200, 'The room is successfully added!');
}

function createPlayerList(title) {
    const playerList = [];
    for (let i = 1; i < 7; i++) {
        playerList.push(title + i);
    }
    return playerList;
}
