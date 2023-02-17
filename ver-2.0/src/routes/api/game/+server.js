import { findGame, createGame } from '$lib/server/interactGame';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    // await createGame(title);
    return await findGame(title);
}