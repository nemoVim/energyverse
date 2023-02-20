import { saveGame } from '$lib/server/interactGame';

export async function POST({ request }) {
    const gameObj = await request.json();
    return await saveGame(gameObj);
}