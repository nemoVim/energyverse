import { Tilemap } from '$lib/classes/tilemap';

export default function createGameObj(title) {
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

    const nowTime = new Date().getTime();

    return {
        title: title,
        energyList: Array.from({ length: 6 }, () => defaultEnergy),
        timeList: Array.from({ length: 6 }, () => nowTime),
        fuelList: [
            [[0, 0, 0], 30],
            [[-1, 4, -3], 5],
            [[-4, 3, 1], 5],
            [[-3, -1, 4], 5],
            [[1, -4, 3], 5],
            [[4, -3, -1], 5],
            [[3, 1, -4], 5],
            [[-2, 9, -7], 5],
            [[-9, 7, 2], 5],
            [[-7, -2, 9], 5],
            [[2, -9, 7], 5],
            [[9, -7, -2], 5],
            [[7, 2, -9], 5],
        ],
        unitList: unitList,
        buildingList: [],
        temp: 0,
        round: 1,
        turn: 0,
        first: 0,
        stop: nowTime,
    };
}
