import Game from '$lib/models/game';
import { interactDB } from '$lib/server/db';
import { createRes } from '$lib/utils/requests';
import { Tilemap } from '$lib/classes/tilemap';

export async function createGame(title) {
    const defaultEnergy = 40;
    const unitList = [];
    let unitPos = [0, 11, -11];
    for (let i = 0; i < 6; i++) {
        unitList.push({
            en: 'probe',
            player: i,
            pos: unitPos,
        });
        unitPos = Tilemap.rotateClock(unitPos);
    }

    await interactDB(async () => {
        const game = new Game({
            title: title,
            energyList: Array.from({ length: 6 }, () => 
                defaultEnergy
            ),
            fuelList: [],
            unitList: unitList,
        });
        await game.save();
    });

    return createRes(200, 'The game is successfully added.');
}

export async function findGame(title) {
    const game = await interactDB(async () => {
        return await Game.findOne({
            title: title,
        });
    });
    console.log(game);
    return createRes(200, game);
}