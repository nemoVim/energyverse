import { fail, redirect } from '@sveltejs/kit';
import { DEALER_PW, SESSION_VALUE } from '$env/static/private';

export async function load({ locals }) {
    if (locals?.auth?.isDealer) {
        throw redirect(303, '/dealer');
    }
}

export const actions = {
    default: async ({ cookies, request }) => {
        const data = await request.formData();
        if (data.get('password') === DEALER_PW) {
            cookies.set('session', SESSION_VALUE, {
                path: '/'
            });
            throw redirect(303, `/dealer`);
        } else {
            return fail(400, 'Wrong password!');
        }
    },
};
