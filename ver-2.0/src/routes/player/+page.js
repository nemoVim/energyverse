import { getReq } from '$lib/utils/requests';

export async function load({ fetch }) {
    try {
        const resMsg = await getReq(fetch, '/api/room');
        return {
            roomList: resMsg,
        };
    } catch (e) {
        console.error(e);
    }
}
