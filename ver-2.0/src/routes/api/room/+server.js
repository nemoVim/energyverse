import {
    findAllRooms,
    findRoomByTitle,
} from '$lib/server/interactRoom';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    if (title === null) {
        return await findAllRooms();
    } else {
        return await findRoomByTitle(title);
    }
}