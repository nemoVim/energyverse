import { createRes } from '$lib/utils/requests';
import Game from '$lib/models/game';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    console.log('watching');
    return await watchChange(title);
}

function watchChange(title) {
    return new Promise((resolve) => {
            const stream = Game.watch().on('change', async (data) => {
                const game = await Game.findById(data.documentKey._id);

                if (game.title === title) {
                    stream.close();
                    resolve(createRes(200, game));
                }
            });
    });
}
