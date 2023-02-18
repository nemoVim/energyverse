import { findGame } from '$lib/server/interactGame';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    return await findGame(title);
}