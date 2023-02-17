import { getReq } from '$lib/utils/requests';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, locals }) {
    try {
        if (locals?.auth?.isDealer) {
            const resMsg = await getReq(fetch, '/api/room');
            return {
                roomList: resMsg,
            };
        } else {
            redirect(303, '/dealer/login');
        }
    } catch (e) {
        console.error(e);
    }
}
