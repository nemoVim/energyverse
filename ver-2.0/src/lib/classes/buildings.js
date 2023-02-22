import { Entity } from '$lib/classes/entity';
import { Tilemap } from '$lib/classes/tilemap';
import { checkTech } from './tech';

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
    static kr = '화력';
    static basicEarn = 15;

    constructor({ pos, player }) {
        super({
            pos: pos,
            player: player,
        });
    }

    getEarn(world, tech) {
        const aroundList = Tilemap.ring(super.pos, 1);

        let earn = 0;

        aroundList.forEach((pos) => {
            const biome = world.getBiome(pos);

            if (biome === null) return;

            if (biome.en === 'fuel') {
                if (biome.amount !== 0) {
                    biome.amount -= 1;
                    earn = ThermalPower.basicEarn;
                }
            }
        });

        return earn;
    }
}

export class WindPower extends PowerPlant {
    static cost = 20;
    static en = 'windPower';
    static kr = '풍력';

    getEarn(world, tech) {
        return Tilemap.ring(super.pos, 1)
            .concat([super.pos])
            .reduce((prev, pos) => {
                let biome = world.getBiome(pos);
                if (biome.en === 'mountain' || biome.en === 'water') {
                    if (checkTech(tech, 8)) {
                        return prev + 2;
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

export class SolarPower extends PowerPlant {
    static cost = 15;
    static en = 'solarPower';
    static kr = '태양광';

    getEarn(world, tech) {
        let earn = Tilemap.ring(super.pos, 1)
            .concat([super.pos])
            .reduce((prev, pos) => {
                let biome = world.getBiome(pos);
                let entity = world.getEntity(pos);
                if (
                    biome.en === 'ground' ||
                    biome.en === 'water' ||
                    biome.en === 'fuel'
                ) {
                    if (
                        entity instanceof Building &&
                        entity.en !== 'solarPower'
                    ) {
                        return prev;
                    } else {
                        return prev + 1;
                    }
                } else {
                    return prev;
                }
            }, 0);
        if (checkTech(tech, 12)) {
            return earn + 5;
        } else {
            return earn;
        }
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
    static kr = '원자력';
    static basicEarn = 25;
    static enhancedEarn = 35;

    static isBuildable(buildPos, world) {
        return Tilemap.ring(buildPos, 1).reduce((prev, pos) => {
            let biome = world.getBiome(pos);
            if (biome.en === 'water') {
                return true;
            } else {
                return prev;
            }
        }, false);
    }

    getEarn(world, tech) {
        if (checkTech(tech, 16)) {
            return AtomicPower.enhancedEarn;
        } else {
            return AtomicPower.basicEarn;
        }
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

    constructor({ floor = 1, track, pos, player }) {
        super({
            pos: pos,
            player: player,
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
        return (
            Lab.cost * this.#floor +
            (Lab.floorCost * this.#floor * (this.#floor - 1)) / 2
        );
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
