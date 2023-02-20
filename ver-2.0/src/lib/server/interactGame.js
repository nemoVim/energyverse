import Game from '$lib/models/game';
import { createRes } from '$lib/utils/requests';
import createGameObj from '$lib/utils/initialGameObj';

export async function findLatestGame(title) {
    const gameList = await Game.find({
        title: title,
    });
    const game = gameList.reduce(
        (prev, game) => {
            if (game.round > prev.round) {
                return game;
            } else if (game.round === prev.round) {
                if (game.turn > prev.turn) {
                    return game;
                } else if (game.turn === prev.turn) {
                    throw new Error(
                        'Both round and turn of games cannot be the same'
                    );
                } else {
                    return prev;
                }
            } else {
                return prev;
            }
        },
        {
            round: 0,
            turn: 0,
        }
    );

    if (game.title === undefined) {
        return createRes(200, createGameObj(title));
    } else {
        return createRes(200, game);
    }
}

export async function findPreviousGame({ title, round, turn }) {
    const game = await Game.findOne({
        title: title,
        round: round,
        turn: turn,
    });
    return createRes(200, game);
}

export async function saveGame(gameObj) {
    let game = await Game.findOne({
        title: gameObj.title,
        round: gameObj.round,
        turn: gameObj.turn,
    });

    if (game === null) {
        game = new Game(gameObj);
    } else {
        game.energyList = gameObj.energyList;
        game.timeList = gameObj.timeList;
        game.fuelList = gameObj.fuelList;
        game.temp = gameObj.temp;
        game.unitList = gameObj.unitList;
        game.buildingList = gameObj.buildingList;
        game.stop = gameObj.stop;
    }

    await game.save();
    return createRes(200, 'Successfully saved.');
}
