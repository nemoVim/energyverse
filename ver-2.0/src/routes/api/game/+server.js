import { findLatestGame } from '$lib/server/interactGame';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    return await findLatestGame(title);
}