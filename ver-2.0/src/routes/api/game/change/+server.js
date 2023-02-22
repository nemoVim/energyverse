import { createRes } from '$lib/utils/requests';
import Game from '$lib/models/game';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    console.log('watching');
    return await watchChange(title);
}

function watchChange(title) {
    return new Promise((resolve) => {
        const changeStream = Game.watch().on('change', async (data) => {
            console.log(data.operationType);
            if (data.documentKey !== undefined) {
                const game = await Game.findById(data.documentKey._id);
                if (game.title === title) {
                    changeStream.close();
                    resolve(createRes(200, game));
                }
            }
        });
    });
}
