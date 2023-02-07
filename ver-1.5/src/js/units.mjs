import { Entity } from './entity.mjs';

export class Unit extends Entity {
    constructor(unit, pos, team) {
        super(unit, pos, team);
    }
}

export class Probe extends Unit {
    static cost = 10;
    static type = 'probe';
    static name = '일꾼';

    constructor(team) {
        super(
            Probe,
            null,
            team
        );
    }
}

export class WindUnit extends Unit {
    static cost = 15;
    static type = 'windUnit';
    static name = '풍력 공격 유닛';

    constructor(team) {
        super(
            WindUnit,
            null,
            team,
        );
    }
}

export class SolarUnit extends Unit {
    static cost = 15;
    static type = 'solarUnit';
    static name = '태양광 공격 유닛';

    constructor(team) {
        super(
            SolarUnit,
            null,
            team,
        );
    }
}
export class AtomicUnit extends Unit {
    static cost = 15;
    static type = 'atomicUnit';
    static name = '원자력 공격 유닛';

    constructor(team) {
        super(
            AtomicUnit,
            null,
            team,
        );
    }
}

export class Missile extends Unit {
    static cost = 15;
    static type = 'missile';
    static name = '미사일';

    constructor(team) {
        super(
            Missile,
            null,
            team,
        );
    }
}

export const Units = {
    probe: Probe,
    windUnit: WindUnit,
    solarUnit: SolarUnit,
    atomicUnit: AtomicUnit,
    missile: Missile,
}