import { getReq } from '$lib/utils/requests';

// export const ssr = false;

export async function load({ fetch, params: { title }, url}) {
    try {
        const resMsg = await getReq(fetch, `/api/game?title=${title}`);
        return {
            game: resMsg,
            player: url.searchParams.get('player'),
        };
    } catch (e) {
        console.error(e);
    }
}