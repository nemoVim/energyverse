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

export class ScoreBuilding extends Building {
    constructor(scoreBuilding, pos, team) {
        super(scoreBuilding, pos, team);
    }
}

export class WindScore extends ScoreBuilding {
    static cost = 25;
    static type = 'windScore';
    static name = '풍력 점수 건물';
    static earn = 45;

    #value;

    constructor(pos, team, world, status) {
        super(WindScore, pos, team);

        this.#value = 0;
    }

    settle() {
        this.#value += WindScore.earn;
    }

    setValue(_value) {
        this.#value = _value;
    }

    getValue() {
        return this.#value;
    }
}

export class SolarScore extends ScoreBuilding {
    static cost = 10;
    static type = 'solarScore';
    static name = '태양광 점수 건물';
    static earn = 90;

    constructor(pos, team, world, status) {
        super(SolarScore, pos, team);
    }
}

export class AtomicScore extends ScoreBuilding {
    static cost = 20;
    static type = 'atomicScore';
    static name = '원자력 점수 건물';
    static earn = 30;

    constructor(pos, team, world, status) {
        super(AtomicScore, pos, team);
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
    static cost = 30;
    static type = 'thermalPower';
    static name = '화력 발전소';
    static earn = 15;

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
        if (this.#fuel === null)
            return 0;

        if (this.#fuel.getAmount() > 0) {

            this.#fuel.modifyAmount(-1);

            if (this.#fuel.getAmount() === 0) {
                super.setEarn(0);
                return ThermalPower.earn;
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

export class WindPower extends PowerPlant {
    static cost = 20;
    static type = 'windPower';
    static name = '풍력 발전소';

    #world;
    #status;

    calcEarn() {

        const buildPos = super.getPos();

        return Move.around(buildPos, 1).concat([buildPos]).reduce((prev, pos) => {
            let earn = prev;

            if (this.#status.hasWindPower(2)) {
                let entity = this.#world.getEntity(pos);
                if (entity !== null && pos !== buildPos) {
                    if (entity.getType() === 'windPower') {
                        earn += 1;
                    }
                } 
            }

            let biome = this.#world.getBiome(pos);
            if (biome.getType() === 'mountain') earn += 1;

            return earn;

        }, 0);
    }

    constructor(pos, team, _world, _status) {
        super(WindPower, 0, pos, team);
        this.#world = _world;
        this.#status = _status;
        super.setEarn(this.calcEarn());
    }
}


export class SolarPower extends PowerPlant {
    static cost = 25;
    static type = 'solarPower';
    static name = '태양광 발전소';

    #world;
    #status;

    calcEarn() {
        let buildPos = super.getPos();

        let earn = Move.around(buildPos, 1).concat([buildPos]).reduce((prev, pos) => {

            let biome = this.#world.getBiome(pos);
            if (biome.getType() === 'mountain') return prev;

            let entity = this.#world.getEntity(pos);
            if (entity === null || entity.getType() === 'solarPower') {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0);

        if (this.#status.hasSolarPower(2)) {
            earn += 5;
        }

        return earn;
    }

    constructor(pos, team, _world, _status) {
        super(SolarPower, 0, pos, team);
        this.#world = _world;
        this.#status = _status;
        super.setEarn(this.calcEarn());
    }
}

export class AtomicPower extends PowerPlant {
    static cost = 45;
    static type = 'atomicPower';
    static name = '원자력 발전소';
    static earn = 25;

    static isBuildable(buildPos, world, count, status) {
        if (AtomicPower.#isBulidableMore(count, status) && AtomicPower.#isBuildableHere(buildPos, world, status)) {
            return true;
        } else {
            return false;
        }
    }

    static #isBulidableMore(count, status) {
        if (status.hasAtomicPower(4)) {
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
        if (status.hasAtomicPower(2)) return true;

        return Move.around(buildPos, 1).reduce((prev, pos) => {
            let biome = world.getBiome(pos);
            if (biome.getType() === 'water') return true;
            return prev;
        }, false);
    }

    #world;
    #status;

    calcEarn() {

        const buildPos = super.getPos();

        if (this.#status.hasAtomicPower(2)) return AtomicPower.earn;

        return Move.around(buildPos, 1).reduce((prev, pos) => {
            let biome = this.#world.getBiome(pos);
            if (biome.getType() === 'water') return AtomicPower.earn;
            return prev;
        }, 0);

    }

    constructor(pos, team, _world, _status) {
        super(AtomicPower, AtomicPower.earn, pos, team);
        this.#world = _world;
        this.#status = _status;
    }
}


export const Buildings = {
    factory: Factory,
    thermalPower: ThermalPower,
    windPower: WindPower,
    solarPower: SolarPower,
    atomicPower: AtomicPower,
    windScore: WindScore,
    solarScore: SolarScore,
    atomicScore: AtomicScore,
};
