import { getReq } from '$lib/utils/requests';

export async function load({ fetch, params: { title } }) {
    try {
        const resMsg = await getReq(fetch, `/api/room?title=${title}`);
        return {
            room: resMsg,
        };
    } catch (e) {
        console.error(e);
    }
}
