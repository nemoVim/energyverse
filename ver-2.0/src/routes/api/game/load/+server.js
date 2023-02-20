import { findPreviousGame } from '$lib/server/interactGame';

export async function POST({ request }) {
    const gameInfo = await request.json();
    return await findPreviousGame(gameInfo);
}