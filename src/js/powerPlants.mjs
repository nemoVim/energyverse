import {Move} from './move.mjs';
import { Entity } from './entity.mjs';

export class PowerPlant extends Entity {
    #earn = 0;

    constructor(_powerPlant, _earn, pos, team) {
        super(_powerPlant, pos, team);
        this.#earn = _earn;
    }

    getEarn() {
        return this.#earn;
    }

    setEarn(value) {
        this.#earn = value;
    }

    generate() {
        return this.#earn;
    }
}

export class Thermal extends PowerPlant {
    static cost = 0;
    static type = 'thermal';
    static name = '화력 발전소';
    static earn = 14;

    static findFuel(buildPos, world) {
        return Move.around(buildPos, 1).reduce((prev, pos) => {
            let biome = world.getBiome(pos);
            if (biome.getType() === 'fuel') {
                return biome;
            } else {
                return prev;
            }
        }, null);
    }

    #fuel;

    constructor(pos, team, world) {
        let fuel = Thermal.findFuel(pos, world);
        let earn;

        if (fuel === null) {
            earn = 0;
        } else {
            earn = Thermal.earn;
        }

        super(Thermal, earn, pos, team);

        this.#fuel = fuel;
    }

    generate() {
        console.log('thermal power plant working!');
        console.log(this.#fuel);
        if (this.#fuel.getAmount() > 0) {
            this.#fuel.modifyAmount(-1);
            if (this.#fuel.getAmount() === 0) {
                super.setEarn(0);
                return Thermal.earn;
            } else {
                return super.getEarn();
            }
        } else if (super.getEarn() === Thermal.earn) {
            super.setEarn(0);
            return 0;
        } else {
            return 0;
        }
    }
}

export class Solar extends PowerPlant {
    static cost = 0;
    static type = 'solar';
    static name = '태양광 발전소';

    static calcEarn(buildPos, world, level) {
        return Move.around(buildPos, 1).concat([buildPos]).reduce((prev, pos) => {

            let biome = world.getBiome(pos);
            if (biome.getType() === 'mountain') return prev;

            let entity = world.getEntity(pos);
            if (entity.getType() === null || entity.getType() === 'solar') {
                if (level === 0) {
                    return prev + 1;
                } else {
                    return prev + 2;
                }
            } else {
                return prev;
            }
        }, 0);
    }

    constructor(pos, team, world, level) {
        let earn = Solar.calcEarn(pos, world, level);

        super(Solar, earn, pos, team);
    }
}

export class Wind extends PowerPlant {
    static cost = 7.6;
    static type = 'wind';
    static name = '풍력 발전소';

    static calcEarn(buildPos, world, level) {
        return Move.around(buildPos, 1).concat([buildPos]).reduce((prev, pos) => {
            let earn = prev;

            if (level === 1) {
                let entity = world.getEntity(pos);
                if (entity.getType() === 'wind') {
                    earn += 2;
                }
            }

            let biome = world.getBiome(pos);
            if (biome.getType() === 'mountain') earn += 1;

            return earn;

        }, 0);
    }

    constructor(pos, team, world, level) {
        let earn = Wind.calcEarn(pos, world, level);

        super(Wind, earn, pos, team);
    }
}

export class Atomic extends PowerPlant {
    static cost = 0;
    static type = 'atomic';
    static name = '원자력 발전소';
    static earn = 21;

    static isBuildable(buildPos, world, count, level) {
        if (Atomic.isBulidableMore(count, level) && Atomic.isBuildableHere(buildPos, world, level)) {
            return true;
        } else {
            return false;
        }
    }

    static isBulidableMore(count, level) {
        if (level === 2 || level === 3) {
            if (count < 6) {
                return true;
            } else {
                return false;
            }
        } else {
            if (count < 3) {
                return true;
            } else {
                return false;
            }
        }
    }

    static isBuildableHere(buildPos, world, level) {
        if (level === 1 || level === 3) return true;

        return Move.around(buildPos, 1).reduce((prev, pos) => {
            let biome = world.getBiome(pos);
            if (biome.getType() === 'water') return true;
            return prev;
        }, false);
    }

    constructor(pos, team, world, level) {
        super(Atomic, Atomic.earn, pos, team);
    }
}

export const PowerPlants = {
    THERMAL: Thermal,
    SOLAR: Solar,
    WIND: Wind,
    ATOMIC: Atomic,
};
