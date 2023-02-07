import { Status } from './status.mjs';

export class Skill {
    #serial;
    #tier;
    #highSkillIndexList;
    #name;
    #description;
    #ability;

    constructor(
        _serial,
        _tier,
        _highSkillIndexList,
        _name,
        _description,
        _ability
    ) {
        this.#serial = _serial;
        this.#tier = _tier;
        this.#highSkillIndexList = _highSkillIndexList;
        this.#name = _name;
        this.#description = _description;
        this.#ability = _ability;
    }

    getSerial() {
        return this.#serial;
    }

    getTier() {
        return this.#tier;
    }

    getCost() {
        if (this.#tier === 0) {
            return 0;
        } else {
            return 5 + this.#tier * 5;
        }
    }

    getHighSkills() {
        return this.#highSkillIndexList;
    }

    getName() {
        return this.#name;
    }

    getDescription() {
        return this.#description;
    }

    useAbility(status) {
        this.#ability(status);
    }
}

export const Skills = [
    new Skill(
        0,
        0,
        [],
        '화력발전소 건설',
        '화력발전소를 건설할 수 있습니다.',
        function (status) {
            status.upgradeThermalPower(1);
        }
    ),
    new Skill(1, 0, [], '공장 건설', '공장을 건설할 수 있습니다.', function (status) {
        status.upgradeFactory(1);
    }),
    new Skill(2, 0, [], '일꾼 생산', '일꾼을 생산할 수 있습니다.', function (status) {
        status.upgradeProbe(1);
    }),
    new Skill(
        3,
        1,
        [],
        '일꾼 산 이동',
        '일꾼이 산으로 이동할 수 있습니다.',
        function (status) {
            status.upgradeProbe(2);
        }
    ),
    new Skill(
        4,
        1,
        [],
        '태양광 발전소 건설',
        '태양광 발전소를 건설할 수 있습니다.',
        function (status) {
            status.upgradeSolarPower(1);
        }
    ),
    new Skill(
        5,
        1,
        [],
        '지형 침강',
        '일꾼이 지형을 침강시킬 수 있습니다.',
        function (status) {
            status.upgradeProbe(4);
        }
    ),
    new Skill(
        6,
        1,
        [3],
        '일꾼 산 건설',
        '일꾼이 산에 건설할 수 있습니다.',
        function (status) {
            status.upgradeProbe(8);
        }
    ),
    new Skill(
        7,
        1,
        [4],
        '일꾼 이동 강화',
        '일꾼이 최대 3칸 이동할 수 있습니다.',
        function (status) {
            status.upgradeProbe(16);
        }
    ),
    new Skill(
        8,
        1,
        [4],
        '태양광 유닛 생산',
        '태양광 유닛을 생산할 수 있습니다.',
        function (status) {
            status.upgradeSolarUnit(1);
        }
    ),
    new Skill(
        9,
        1,
        [5],
        '원자력 점수 건물 건설',
        '원자력 점수 건물을 건설할 수 있습니다.',
        function (status) {
            status.upgradeAtomicScore(1);
        }
    ),
    new Skill(
        10,
        1,
        [5],
        '원자력 유닛 생산',
        '원자력 유닛을 생산할 수 있습니다.',
        function (status) {
            status.upgradeAtomicUnit(1);
        }
    ),
    new Skill(
        11,
        1,
        [6],
        '지형 융기',
        '일꾼이 지형을 융기시킬 수 있습니다.',
        function (status) {
            status.upgradeProbe(64);
        }
    ),
    new Skill(
        12,
        1,
        [6],
        '풍력 유닛 생산',
        '풍력 유닛을 생산할 수 있습니다.',
        function (status) {
            status.upgradeWindUnit(1);
        }
    ),
    new Skill(
        13,
        1,
        [7],
        '일꾼 비용 감소',
        '일꾼 생산 비용이 3만큼 감소합니다.',
        function (status) {
            status.upgradeFactory(2);
        }
    ),
    new Skill(
        14,
        2,
        [11],
        '풍력 발전소 건설',
        '풍력 발전소를 건설할 수 있습니다.',
        function (status) {
            status.upgradeWindPower(1);
        }
    ),
    new Skill(
        15,
        2,
        [13],
        '태양광 발전소 강화',
        '태양광 발전소의 발전량이 5만큼 추가됩니다.',
        function (status) {
            status.upgradeSolarPower(2);
        }
    ),
    new Skill(
        16,
        2,
        [9],
        '원자력 건물 비용 감소',
        '원자력 발전소와 원자력 점수 건물의 건설 비용이 5만큼 감소합니다.',
        function (status) {
            status.upgradeProbe(32);
        }
    ),
    new Skill(
        17,
        2,
        [14],
        '풍력 발전소 강화',
        '풍력 발전소의 발전량이 인접한 풍력 발전소 당 1만큼 추가됩니다. 또한, 풍력 발전소의 건설 비용이 5만큼 감소합니다.',
        function (status) {
            status.upgradeWindPower(2);
        }
    ),
    new Skill(
        18,
        2,
        [12],
        '풍력 유닛 산 이동',
        '풍력 유닛이 산으로 이동할 수 있습니다.',
        function (status) {
            status.upgradeWindUnit(2);
        }
    ),
    new Skill(
        19,
        2,
        [12],
        '풍력 유닛 물 이동',
        '풍력 유닛이 물로 이동할 수 있습니다.',
        function (status) {
            status.upgradeWindUnit(4);
        }
    ),
    new Skill(
        20,
        2,
        [15],
        '태양광 점수 건물 건설',
        '태양광 점수 건물을 건설할 수 있습니다.',
        function (status) {
            status.upgradeSolarScore(1);
        }
    ),
    new Skill(
        21,
        2,
        [8, 15],
        '공격 유닛 비용 감소',
        '모든 공격 유닛의 생산 비용이 3만큼 감소합니다.',
        function (status) {
            status.upgradeFactory(4);
        }
    ),
    new Skill(
        22,
        2,
        [8],
        '태양광 유닛 산 이동',
        '태양광 유닛이 산으로 이동할 수 있습니다.',
        function (status) {
            status.upgradeSolarUnit(2);
        }
    ),
    new Skill(
        23,
        2,
        [8],
        '태양광 유닛 물 이동',
        '태양광 유닛이 물로 이동할 수 있습니다.',
        function (status) {
            status.upgradeSolarUnit(4);
        }
    ),
    new Skill(
        24,
        2,
        [16],
        '원자력 발전소 건설',
        '원자력 반전소를 건설할 수 있습니다.',
        function (status) {
            status.upgradeAtomicPower(1);
        }
    ),
    new Skill(
        25,
        2,
        [10],
        '원자력 유닛 산 이동',
        '원자력 유닛이 산으로 이동할 수 있습니다.',
        function (status) {
            status.upgradeAtomicUnit(2);
        }
    ),
    new Skill(
        26,
        2,
        [10],
        '원자력 유닛 물 이동',
        '원자력 유닛이 물로 이동할 수 있습니다.',
        function (status) {
            status.upgradeAtomicUnit(4);
        }
    ),
    new Skill(
        27,
        2,
        [17],
        '풍력 점수 건물 건설',
        '풍력 점수 건물을 건설할 수 있습니다.',
        function (status) {
            status.upgradeWindScore(1);
        }
    ),
    new Skill(
        28,
        2,
        [24],
        '원자력 발전소 강화 1',
        '원자력 발전소의 건설 지형 제한이 사라집니다.',
        function (status) {
            status.upgradeAtomicPower(2);
        }
    ),
    new Skill(
        29,
        2,
        [24],
        '원자력 발전소 강화 2',
        '원자력 발전소의 건설 개수 제한이 6개로 늘어납니다.',
        function (status) {
            status.upgradeAtomicPower(4);
        }
    ),
    new Skill(
        30,
        3,
        [27],
        '유닛 즉시 행동',
        '모든 유닛이 생산 후 즉시 행동이 가능합니다.',
        function (status) {
            status.upgradeUnits(1);
        }
    ),
    new Skill(
        31,
        3,
        [21],
        '유닛 추가 이동',
        '모든 유닛이 이동 후 추가로 1칸 더 이동할 수 있습니다. 단, 유닛/건물이 있는 칸으로는 불가합니다.',
        function (status) {
            status.upgradeUnits(2);
        }
    ),
    new Skill(
        32,
        3,
        [28, 29],
        'ICBM 생산',
        'ICBM을 생산할 수 있습니다.',
        function (status) {
            status.upgradeMissile(1);
        }
    ),
    new Skill(
        33,
        3,
        [32],
        '공장 생산 강화',
        '공장에서 유닛을 최대 2번 생산할 수 있습니다.',
        function (status) {
            status.upgradeFactory(8);
        }
    ),
];
