import { createRes } from '$lib/utils/requests';
import { DEALER_PW } from '$env/static/private';
import {
    findAllRooms,
    findRoomByTitle,
    createRoom,
} from '$lib/server/interactRoom';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    if (title === null) {
        return await findAllRooms();
    } else {
        return await findRoomByTitle(title);
    }
}

export async function POST({ request }) {
    const { title, dealer, password } = await request.json();

    if (password === DEALER_PW) {
        return await createRoom(title, dealer);
    } else {
        return createRes(400, 'Wrong password!');
    }
}
