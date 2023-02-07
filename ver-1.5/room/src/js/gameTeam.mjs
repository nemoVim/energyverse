import {
    Building,
    Buildings,
    ThermalPower,
    AtomicPower,
    PowerPlant,
    WindScore,
    AtomicScore,
    SolarScore,
} from '../../../src/js/buildings.mjs';
import { Unit, Units } from '../../../src/js/units.mjs';
import { Skills } from '../../../src/js/skills.mjs';
import { Status } from '../../../src/js/status.mjs';
import { ClientTeam } from './clientTeam.mjs';
import { Biomes } from '../../../src/js/biomes.mjs';

export class GameTeam extends ClientTeam {
    #buildings = [];
    #units = [];

    #status;

    #manager;
    #world;

    #thermal;
    #atomicCount;

    constructor(name, index, _manager) {
        super(name, index);

        this.#atomicCount = 0;

        this.#manager = _manager;

        this.#world = _manager.getWorld();

        this.#status = new Status();

        this.#units.push(new (Units.probe)(super.getIndex()));
        this.#status.upgradeProbe(1).upgradeFactory(1).upgradeThermalPower(1);
    }

    getAtomicCnt() {
        return this.#atomicCount;
    }

    modifyAtomicCnt(delta) {
        this.#atomicCount += Number(delta);
    }

    getStatus() {
        return this.#status;
    }

    getBuildings() {
        return this.#buildings;
    }

    getUnits() {
        return this.#units;
    }

    #emit(name, config) {
        this.#manager.emit(name, config);
    }

    getCost(entity) {
        if (entity.type === 'atomicPower' && this.#status.hasProbe(32)) {
            return entity.cost - 5;
        } else if (entity.type === 'atomicScore' && this.#status.hasProbe(32)) {
            return entity.cost - 5;
        } else if (entity.type === 'windPower' && this.#status.hasWindPower(2)) {
            return entity.cost - 5;
        } else if (entity.type === 'probe' && this.#status.hasFactory(2)) {
            return entity.cost - 3;
        } else if (entity instanceof Unit && this.#status.hasFactory(4) && entity.type !== 'probe') {
            return entity.cost - 3;
        } else {
            return entity.cost;
        }
    }
    
    isEnough(entity) {
        if (super.getEnergy() >= this.getCost(entity)) {
            return true;
        } else {
            return false;
        }
    }

    canBuy(cost) {
        if (super.getEnergy() >= cost) {
            return true;
        } else {
            return false;
        }
    }

    // ----------------------------------------------

    modify(type, delta) {
        if (type === 'energy') {
            super.modifyEnergy(delta);
        } else if (type === 'score') {
            super.modifyScore(delta);
        }

        this.#emit('modify', [type, delta, super.getIndex()]);
        this.#manager.getUI().refresh();
    }

    build(type, pos, biome) {
        if (
            biome.getType() === 'fuel' ||
            biome.getType() === 'water'
        ) {
            return false;
        }


        if (biome.getType() === 'mountain' && !this.#status.hasProbe(8)) {
            alert('일꾼 산 건설 기술이 필요합니다!');
            return false;
        }

        if (
            type === 'atomicPower' &&
            !AtomicPower.isBuildable(pos, this.#world, this.#atomicCount, this.#status)
        ) {
            alert('원자력 발전소 건설 제한을 충족하지 못했습니다!');
            return false;
        }

        if (type === 'atomicPower') {
            this.#atomicCount += 1;
        }

        if (type === 'solarScore') {
            this.modify('score', SolarScore.earn);
            this.#manager.modifyTemp(-0.05);
        }

        if (this.isEnough(Buildings[type])) {
            const building = new Buildings[type](
                pos,
                super.getIndex(),
                this.#world,
                this.#status
            );

            console.log('--build--');
            console.log(building);

            this.#buildings.push(building);

            this.#world.setEntity(pos, building);

            this.modify('energy', -this.getCost(building.getEntity()));

            this.#emit('saveWorld', this.#manager.makeWorldData());
            this.#emit('saveUsers', this.#manager.makeUsersData());
        
            return true;

        } else {
            alert('에너지가 부족합니다!');
            return false;
        }
    }

    produce(type) {
        if (this.isEnough(Units[type])) {
            const unit = new Units[type](super.getIndex());

            this.#units.push(unit);

            this.modify('energy', -this.getCost(unit.getEntity()));

            this.#emit('saveWorld', this.#manager.makeWorldData());
            this.#emit('saveUsers', this.#manager.makeUsersData());

        } else {
            alert('에너지가 부족합니다!');
        }
    }

    destroy(entity) {
        if (entity.getTeam() === super.getIndex())
            return;

        this.modify('score', +entity.getCost() / 2);
        this.#emit('saveUsers', this.#manager.makeUsersData());
    }

    destroyed(entity) {
        if (entity instanceof Unit) {
            const index = this.#units.indexOf(entity);
            this.#units.splice(index, 1);
        } else if (entity instanceof Building) {
            const index = this.#buildings.indexOf(entity);
            this.#buildings.splice(index, 1);
            this.#world.setEntity(entity.getPos(), null);
        }

        if (entity.getType() === 'windScore') {
            this.modify('score', -entity.getValue());
        } else if (entity.getType() === 'atomicPower') {
            this.#atomicCount -= 1;
        }

        this.modify('score', -entity.getCost() / 2);

        this.#emit('saveWorld', this.#manager.makeWorldData());
        this.#emit('saveUsers', this.#manager.makeUsersData());

        return true;
    }

    changeBiome(type, pos) {

        if (this.canBuy(3)) {
            this.modify('energy', -3);
            this.#world.setBiome(pos, new Biomes[type](pos));
            this.#emit('saveWorld', this.#manager.makeWorldData());
            this.#emit('saveUsers', this.#manager.makeUsersData());
            return true;
        } else {
            alert('에너지가 부족합니다!');
            return false;
        }

    }

    // Override
    research(index) {
        if (this.#manager.getNowTeam() !== this)
            return;

        super.research(index);
        this.#emit('research', [index, super.getIndex()]);
        this.modify('energy', -Skills[index].getCost());
        this.#emit('saveUsers', this.#manager.makeUsersData());
    }

    // Override
    unResearch(index) {
        if (this.#manager.getNowTeam() !== this)
            return;

        super.unResearch(index);
        this.#emit('unResearch', [index, super.getIndex()]);
        this.modify('energy', +Skills[index].getCost());
        this.#emit('saveUsers', this.#manager.makeUsersData());
    }

    // Override
    learn() {
        super.getResearching().forEach((index) => {
            Skills[index].useAbility(this.#status);
        });
        super.learn();
        this.#emit('saveUsers', this.#manager.makeUsersData());
    }

    // ----------------------------------------------

    calcEarn() {
        let _thermal = 0;
        let earn = this.#buildings.reduce((prev, building) => {
            if (!(building instanceof PowerPlant)) return prev;

            if (building.getType() === 'thermalPower') {
                if (building.getEarn() !== 0) {
                    _thermal += 1;
                }
            } else {
                building.setEarn(building.calcEarn());
            }

            return prev + Number(building.generate());
        }, 0);

        earn += ClientTeam.turnEnergy;
        super.setEarn(earn);
        this.#emit('earn', [earn, super.getIndex()]);
        this.#thermal = _thermal;

        return _thermal;
    }

    // fillFuel() {
    //     this.#buildings.forEach(building => {
    //         if (!(building instanceof PowerPlant)) return;
    //         if (plant.getType() === 'thermal') {
    //             plant.getFuel().modifyAmount(+1);
    //         }
    //     });
    // }

    generate() {
        this.calcEarn();
        this.modify('energy', super.getEarn());
        this.modify(
            'score',
            super.getEarn()
        );
        this.modify('score', - (this.#thermal * ThermalPower.earn) * 2 / 3);
        // this.modify('score', - (this.#atomicCount * AtomicPower.earn) / 4);
    }

    scoreSettle() {
        this.#buildings.forEach(building => {
            if (building.getType() === 'windScore') {
                building.settle();
                this.modify('score', WindScore.earn);
                this.#manager.modifyTemp(-0.05);
            } else if (building.getType() === 'atomicScore') {
                this.modify('score', AtomicScore.earn);
                this.#manager.modifyTemp(-0.05);
            }
        });
    }

    settle() {
        this.generate();
        this.scoreSettle();
        this.learn();
        this.#emit('saveUsers', this.#manager.makeUsersData());
        this.#emit('saveWorld', this.#manager.makeWorldData());

        // this.modify('energy', ClientTeam.turnEnergy);
        // this.modify('score', ClientTeam.turnEnergy);
    }

    // ---------------------------------

    start() {
        super.getTimer().setTime(100);
        super.getTimer().setFunc(() => {
            this.#manager.emit('time', [super.getTimer().getTime(), super.getIndex()]);
        });
        super.getTimer().start().then(() => {
            this.stop();
        });
    }

    stop() {
        console.log('--timerStop--');
        super.getTimer().stop();
        super.getTimer().setTime(0);
        this.#manager.emit('wait', super.getIndex());
    }

}
