import { getReq } from '$lib/utils/requests';

export async function load({ fetch, params: { title }}) {
    try {
        const resMsg = await getReq(fetch, `/api/game?title=${title}`);
        return {
            game: resMsg,
        };
    } catch (e) {
        console.error(e);
    }
}