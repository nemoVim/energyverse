import { Entity } from './entity.mjs';
import { Move } from './move.mjs';

export class Building extends Entity {
    constructor(building, pos, team) {
        super(building, pos, team);
    }
}

export class Factory extends Building {
    static cost = 20;
    static type = 'factory';
    static name = '공장';

    constructor(pos, team) {
        super(Factory, pos, team);
    }
}

export class PowerPlant extends Building {
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

export class ThermalPower extends PowerPlant {
    static cost = 0;
    static type = 'thermalPower';
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
    #world;

    constructor(pos, team, _world, status) {
        let fuel = ThermalPower.findFuel(pos, _world);
        let earn;

        if (fuel === null) {
            earn = 0;
        } else {
            earn = ThermalPower.earn;
        }

        super(ThermalPower, earn, pos, team);

        this.#fuel = fuel;
        this.#world = _world;
    }

    getFuel() {
        return this.#fuel;
    }

    // Override
    generate() {
        if (this.#fuel.getAmount() > 0) {

            this.#world.increaseTemp();

            this.#fuel.modifyAmount(-1);

            if (this.#fuel.getAmount() === 0) {
                super.setEarn(0);
                return Thermal.earn;
            } else {
                return super.getEarn();
            }

        } else if (super.getEarn() === ThermalPower.earn) {
            super.setEarn(0);
            return 0;
        } else {
            return 0;
        }
    }
}

export class SolarPower extends PowerPlant {
    static cost = 0;
    static type = 'solarPower';
    static name = '태양광 발전소';

    static calcEarn(buildPos, world, status) {
        return Move.around(buildPos, 1).concat([buildPos]).reduce((prev, pos) => {

            let biome = world.getBiome(pos);
            if (biome.getType() === 'mountain') return prev;

            let entity = world.getEntity(pos);
            if (entity === null || entity.getType() === 'solarPower') {
                if (status.hasSolarPower(2)) {
                    return prev + 2;
                } else {
                    return prev + 1;
                }
            } else {
                return prev;
            }
        }, 0);
    }

    constructor(pos, team, world, status) {
        let earn = SolarPower.calcEarn(pos, world, status);

        super(SolarPower, earn, pos, team);
    }
}

export class WindPower extends PowerPlant {
    static cost = 7.6;
    static type = 'windPower';
    static name = '풍력 발전소';

    static calcEarn(buildPos, world, status) {
        return Move.around(buildPos, 1).concat([buildPos]).reduce((prev, pos) => {
            let earn = prev;

            if (status.hasWindPower(2)) {
                let entity = world.getEntity(pos);
                if (entity.getType() === 'windPower') {
                    earn += 2;
                }
            }

            let biome = world.getBiome(pos);
            if (biome.getType() === 'mountain') earn += 1;

            return earn;

        }, 0);
    }

    constructor(pos, team, world, status) {
        let earn = WindPower.calcEarn(pos, world, status);

        super(WindPower, earn, pos, team);
    }
}

export class AtomicPower extends PowerPlant {
    static cost = 0;
    static type = 'atomicPower';
    static name = '원자력 발전소';
    static earn = 21;

    static isBuildable(buildPos, world, count, status) {
        if (AtomicPower.#isBulidableMore(count, status) && AtomicPower.#isBuildableHere(buildPos, world, status)) {
            return true;
        } else {
            return false;
        }
    }

    static #isBulidableMore(count, status) {
        if (status.hasAtomicPower(28)) {
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

    static #isBuildableHere(buildPos, world, status) {
        if (status.hasAtomicPower(27)) return true;

        return Move.around(buildPos, 1).reduce((prev, pos) => {
            let biome = world.getBiome(pos);
            if (biome.getType() === 'water') return true;
            return prev;
        }, false);
    }

    constructor(pos, team, world, status) {
        super(AtomicPower, AtomicPower.earn, pos, team);
    }
}

export const Buildings = {
    FACTORY: Factory,
    THERMAL_POWER: ThermalPower,
    SOLAR_POWER: SolarPower,
    WIND_POWER: WindPower,
    ATOMIC_POWER: AtomicPower,
};
