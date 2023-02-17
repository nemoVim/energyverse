import { createRoom } from '$lib/server/interactRoom';
import { fail, redirect } from '@sveltejs/kit';
import { SESSION_VALUE } from '$env/static/private';

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
            await createRoom(data.get('title'), data.get('dealer'));
            throw redirect(303, `/dealer/game/${data.get('title')}`);
    },
};
