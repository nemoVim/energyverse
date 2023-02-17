import { createBiome } from '$lib/classes/biomes';
import { Building, createBuilding } from '$lib/classes/buildings';
import { Tilemap } from '$lib/classes/tilemap';
import { createUnit, Unit } from '$lib/classes/units';
import { Tile } from '$lib/classes/tile';

export class World {
    static worldSize = 13;

    static seaPerTemp = 1;

    static biomeIndex = ['water', 'ground', 'mountain', 'fuel'];

    static initialBiomeList = [[[0,0,0],[3,15]],[[-1,2,-1],[2]],[[0,1,-1],[2]],[[-2,4,-2],[1]],[[-1,3,-2],[1]],[[0,2,-2],[1]],[[-3,6,-3],[2]],[[-2,5,-3],[1]],[[-1,4,-3],[3,10]],[[0,3,-3],[1]],[[1,2,-3],[1]],[[-4,8,-4],[2]],[[-3,7,-4],[2],],[[-2,6,-4],[1]],[[-1,5,-4],[1]],[[0,4,-4],[1]],[[1,3,-4],[1]],[[-5,10,-5],[2]],[[-4,9,-5],[2]],[[-3,8,-5],[2]],[[-2,7,-5],[1]],[[-1,6,-5],[1]],[[0,5,-5],[1]],[[1,4,-5],[1]],[[2,3,-5],[1]],[[-6,12,-6],[0]],[[-5,11,-6],[2]],[[-4,10,-6],[2]],[[-3,9,-6],[1]],[[-2,8,-6],[1]],[[-1,7,-6],[1]],[[0,6,-6],[1]],[[1,5,-6],[2]],[[2,4,-6],[2]],[[-5,12,-7],[0]],[[-4,11,-7],[1]],[[-3,10,-7],[1]],[[-2,9,-7],[3,5]],[[-1,8,-7],[1]],[[0,7,-7],[1]],[[1,6,-7],[0]],[[2,5,-7],[0]],[[3,4,-7],[2]],[[-4,12,-8],[0]],[[-3,11,-8],[1]],[[-2,10,-8],[1]],[[-1,9,-8],[1]],[[0,8,-8],[1]],[[1,7,-8],[1]],[[2,6,-8],[2]],[[3,5,-8],[0]],[[-3,12,-9],[0]],[[-2,11,-9],[1]],[[-1,10,-9],[1]],[[0,9,-9],[1]],[[1,8,-9],[1]],[[2,7,-9],[2]],[[3,6,-9],[0]],[[4,5,-9],[2]],[[-2,12,-10],[0]],[[-1,11,-10],[1]],[[0,10,-10],[1]],[[1,9,-10],[1]],[[2,8,-10],[2]],[[3,7,-10],[0]],[[4,6,-10],[2]],[[-1,12,-11],[0]],[[0,11,-11],[1]],[[1,10,-11],[1]],[[2,9,-11],[1]],[[3,8,-11],[2]],[[4,7,-11],[0]],[[5,6,-11],[2]],[[0,12,-12],[0]],[[1,11,-12],[0]],[[2,10,-12],[0]],[[3,9,-12],[0]],[[4,8,-12],[0]],[[5,7,-12],[0]]];

    #tilemap;
    #temp;

    constructor() {
        this.#tilemap = new Tilemap(World.worldSize);
        this.initBiomes();
    }

    initBiomes() {
        World.initialBiomeList.forEach((biome) => {
            let biomePos = biome[0];
            const biomeIndex = biome[1];
            for (let i = 0; i < 6; i++) {
                const biomeObj = {
                    en: World.biomeIndex[biomeIndex[0]],
                    pos: biomePos,
                    amount: biomeIndex[1] || 0,
                };

                this.#tilemap.setTile(
                    biomePos,
                    new Tile(biomeObj.pos, createBiome(biomeObj), null)
                );
                biomePos = Tilemap.rotateClock(biomePos);
            }
        });
    }

    initFuels(fuelList) {
        fuelList.forEach((fuel) => {
            this.#tilemap.getBiome(fuel.pos).amount = fuel.amount;
        });
    }

    initSea(temp) {
        this.#temp = temp;
        for (let i = 0; i < temp * this.seaPerTemp; i++) {
            Tilemap.ring([0, 0, 0], World.worldSize - i).forEach((pos) => {
                if (this.getBiome(pos).en === 'ground') {
                    this.setBiome(
                        pos,
                        createBiome({
                            pos: pos,
                            en: 'water',
                        })
                    );
                }
            });
        }
    }

    initEntities(unitList, buildingList) {
        unitList.forEach((unit) => {
            this.setEntity(unit.pos, unit);
        });
        buildingList.forEach((building) => {
            this.setEntity(building.pos, building);
        });
    }

    getFuelList() {
        return [];
    }

    // getEntities() {
    //     const unitList = [];
    //     const buildingList = [];
    //     this.#tilemap.cubemap.forEach((yList, x) => {
    //         yList.forEach((zList, y) => {
    //             zList.forEach((tile, z) => {
    //                 if (tile !== null && tile.entity !== null) {
    //                     const entity = tile.entity;
    //                     const entityObj = {
    //                             en: entity.en,
    //                             player: entity.player,
    //                             pos: entity.pos,
    //                     }
    //                     if (entity instanceof Unit) {
    //                         unitList.push(entityObj);
    //                     } else if (entity instanceof Building) {
    //                         buildingList.push(entityObj);
    //                     }
    //                 }
    //             });
    //         });
    //     });
    // 
    //     return {
    //         unitList: unitList,
    //         buildingList: buildingList,
    //     };
    // }

    get tilemap() {
        return this.#tilemap;
    }

    get size() {
        return World.worldSize;
    }

    get temp() {
        return this.#temp;
    }

    getBiome(pos) {
        return this.#tilemap.getTile(pos).biome;
    }

    getEntity(pos) {
        return this.#tilemap.getTile(pos).entity;
    }

    setBiome(pos, _biome) {
        this.#tilemap.getTile(pos).biome = _biome;
    }

    setEntity(pos, _entity) {
        this.#tilemap.getTile(pos).entity = _entity;
    }
}
