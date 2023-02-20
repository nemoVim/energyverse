import { createRes } from '$lib/utils/requests';
import Game from '$lib/models/game';

export async function GET({ url }) {
    const title = url.searchParams.get('title');
    console.log('watching');
    return await watchChange(title);
}

function watchChange(title) {
    return new Promise((resolve) => {
            const stream = Game.watch({
                title: title,
            }).on('change', async (data) => {
                console.log('what?');
                const game = await Game.findById(data.documentKey._id);
                stream.close();
                resolve(createRes(200, game));
            });
    });
}
