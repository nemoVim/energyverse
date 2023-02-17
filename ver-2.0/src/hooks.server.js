import { SESSION_VALUE } from '$env/static/private';
import { redirect } from '@sveltejs/kit';

export const handle = async({event, resolve}) => {
    const session = event.cookies.get('session');
    const path = event.url.pathname;
    console.log(path);
    // event.cookies.delete('session');
    
    if (session === SESSION_VALUE) {
        event.locals.auth = {
            isDealer: true,
        }
        return resolve(event);
    } else if (path.split('/')[1] === 'dealer' && path.split('/')[2] !== 'login') {
        throw redirect(303, '/dealer/login');
    } else {
        return resolve(event);
    }
}