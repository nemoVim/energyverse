import { Entity } from '$lib/classes/entity';
import { Tilemap } from '$lib/classes/tilemap';

export class Building extends Entity {
    constructor(buildingObj) {
        super(buildingObj);
    }
}

export class Factory extends Building {
    static cost = 30;
    static en = 'factory';
    static kr = '공장';

    constructor({ pos, player }) {
        super({
            pos: pos,
            player: player,
        });
    }
}

export class PowerPlant extends Building {
    constructor(buildingObj) {
        super(buildingObj);
    }
}

export class ThermalPower extends PowerPlant {
    static cost = 30;
    static en = 'thermalPower';
    static kr = '화력 발전소';
    static basicEarn = 15;

    constructor({ pos, player }) {
        super({
            pos: pos,
            player: player,
        });
    }

    getEarn(tilemap, status) {
        const aroundList = Tilemap.ring(super.pos, 1);

        aroundList.forEach((pos) => {
            const biome = tilemap.getBiome(pos);
            if (biome.en === 'fuel') {
                if (biome.amount !== 0) {
                    biome.amount -= 1;
                    return ThermalPower.basicEarn;
                }
            }
        });

        return 0;
    }
}

export class WindPower extends PowerPlant {
    static cost = 20;
    static en = 'windPower';
    static kr = '풍력 발전소';

    getEarn(tilemap, status) {
        return Tilemap.ring(super.pos, 1)
            .concat([super.pos])
            .reduce((prev, pos) => {
                let biome = tilemap.getBiome(pos);
                if (biome.en === 'mountain' || biome.en === 'water') {
                    return prev + 1;
                } else {
                    return prev;
                }
            }, 0);
    }

    constructor({ pos, player }) {
        super({
            pos: pos,
            player: player,
        });
    }
}

export class SolarPower extends PowerPlant {
    static cost = 25;
    static en = 'solarPower';
    static kr = '태양광 발전소';

    getEarn(tilemap, status) {
        return Tilemap.ring(super.pos, 1)
            .concat([super.pos])
            .reduce((prev, pos) => {
                let biome = tilemap.getBiome(pos);
                let entity = tilempa.getEntity(pos);
                if (
                    biome.en === 'ground' ||
                    biome.en === 'water' ||
                    biome.en === 'fuel'
                ) {
                    if (entity !== null && entity.en !== 'solarPower') {
                        return prev;
                    } else {
                        return prev + 1;
                    }
                } else {
                    return prev;
                }
            }, 0);
    }

    constructor({ pos, player }) {
        super({
            pos: pos,
            player: player,
        });
    }
}

export class AtomicPower extends PowerPlant {
    static cost = 45;
    static en = 'atomicPower';
    static kr = '원자력 발전소';
    static basicEarn = 25;
    static enhancedEarn = 35;

    static isBuildable(buildPos, tilemap) {
        return Tilemap.ring(buildPos, 1).reduce((prev, pos) => {
            let biome = tilemap.getBiome(pos);
            if (biome.en === 'water') {
                return true;
            }
        }, false);
    }

    getEarn(tilemap, status) {
        return AtomicPower.basicEarn;
    }

    constructor({ pos, player }) {
        super({
            pos: pos,
            player: player,
        });
    }
}

export class Lab extends Building {
    static cost = 10;
    static floorCost = 10;
    static en = 'lab';
    static kr = '연구소';

    #floor;
    #track;

    constructor({ floor, track, pos, player }) {
        super({
            pos: pos,
            plapyer: player,
        });
        this.#floor = floor;
        this.#track = track;
    }

    get floor() {
        return this.#floor;
    }

    set floor(_floor) {
        this.#floor = _floor;
    }

    get track() {
        return this.#track;
    }

    get cost() {
        return Lab.cost * this.#floor + (Lab.floorCost * this.#floor * (this.#floor - 1)) / 2;
    }

    getUpgradeCost() {
        return Lab.cost + Lab.floorCost * this.#floor;
    }

}

export const Buildings = {
    factory: Factory,
    thermalPower: ThermalPower,
    windPower: WindPower,
    solarPower: SolarPower,
    atomicPower: AtomicPower,
    lab: Lab,
};

export function createBuilding(buildingObj) {
    const building = new Buildings[buildingObj.en](buildingObj);
    return building;
}
