import { Entity } from './entity.mjs';

export class Unit extends Entity {
    constructor(unit, pos, team) {
        super(unit, pos, team);
    }
}

export class Probe extends Unit {
    static cost = 10;
    static type = 'probe';

    constructor(team) {
        super(
            Probe,
            null,
            this.moveFunction(pos),
            this.actFunction(pos),
            team
        );
    }
}

export class WindUnit extends Unit {
    static cost = 20;
    static type = 'windUnit';

    constructor(team) {
        super(
            WindUnit,
            null,
            team,
        );
    }
}

export class SolarUnit extends Unit {
    static cost = 20;
    static type = 'solarUnit';

    constructor(team) {
        super(
            SolarUnit,
            null,
            team,
        );
    }
}
export class AtomicUnit extends Unit {
    static cost = 20;
    static type = 'atomicUnit';

    constructor(team) {
        super(
            AtomicUnit,
            null,
            team,
        );
    }
}

export const Units = {
    PROBE: Probe,
    WIND_UNIT: WindUnit,
    SOLAR_UNIT: SolarUnit,
    ATOMIC_UNIT: AtomicUnit,
}