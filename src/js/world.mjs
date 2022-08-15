import {TileMap} from './tileMap.mjs';

export class World {

    static worldSize = 17;

    static biomeIndex = ['WATER', 'GROUND', 'MOUNTAIN', 'FUEL'];
    static biomeList = [
        [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
        [[0], [1], [1], [1], [1], [2], [2], [2], [0], [2], [1], [1], [1], [1], [1], [1], [1], [0]],
        [[0], [1], [1], [1], [1], [2], [2], [2], [0], [2], [1], [1], [1], [1], [1], [1], [1], [1], [0]],
        [[0], [1], [1], [1], [1], [1], [2], [2], [0], [2], [2], [1], [1], [1], [3, 7], [1], [1], [1], [1], [0]],
        [[0], [1], [1], [1], [1], [1], [1], [2], [2], [0], [2], [2], [1], [1], [1], [1], [1], [1], [1], [1], [0]],
        [[0], [1], [1], [3, 7], [1], [1], [1], [1], [2], [0], [2], [2], [2], [1], [1], [1], [1], [1], [1], [2], [2], [0]],
        [[0], [1], [1], [1], [1], [1], [1], [1], [1], [0], [2], [2], [1], [1], [1], [1], [1], [1], [1], [2], [2], [2], [0]],
        [[0], [1], [1], [1], [1], [1], [1], [1], [1], [1], [0], [2], [2], [1], [1], [1], [1], [1], [1], [2], [2], [2], [2], [0]],
        [[0], [2], [1], [1], [1], [1], [1], [1], [1], [1], [2], [2], [2], [1], [1], [1], [1], [1], [1], [2], [2], [0], [0], [0], [0]],
        [[0], [0], [2], [2], [2], [2], [1], [1], [1], [1], [1], [2], [2], [2], [1], [1], [1], [1], [1], [0], [0], [0], [2], [2], [2], [0]],
        [[0], [2], [0], [2], [2], [2], [1], [1], [1], [1], [3, 14], [1], [1], [1], [1], [1], [3, 14], [1], [2], [0], [2], [2], [2], [2], [1], [1], [0]],
        [[0], [2], [2], [0], [0], [2], [2], [2], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [2], [2], [2], [2], [2], [2], [1], [1], [1], [0]],
        [[0], [2], [2], [2], [2], [0], [2], [2], [2], [2], [1], [1], [1], [1], [1], [1], [1], [1], [1], [2], [2], [2], [1], [2], [1], [1], [1], [1], [0]],
        [[0], [1], [2], [2], [2], [2], [0], [0], [2], [2], [1], [1], [1], [2], [1], [1], [2], [1], [1], [1], [2], [1], [1], [1], [1], [1], [1], [1], [1], [0]],
        [[0], [1], [1], [1], [1], [1], [1], [1], [2], [2], [1], [1], [1], [1], [2], [2], [2], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [3, 7], [1], [1], [0]],
        [[0], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [2], [2], [2], [2], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [1], [0]],
        [[0], [1], [1], [1], [1], [1], [1], [1], [1], [1], [3, 14], [1], [1], [2], [2], [2], [3, 21], [2], [2], [2], [1], [1], [3, 14], [1], [1], [1], [1], [1], [1], [1], [1], [1], [0]],
    ];
    
    static initialTemp = 1;
    static increseTempDelta = 0.1;
    static decreaseTempDelta = 0.05;

    #tileMap;
    #temp;

    #worldUI;

    constructor() {

        this.#tileMap = new TileMap(World.worldSize, World.biomeIndex, World.biomeList);

        this.#temp = new Temperature(World.initialTemp);

        this.#initUI();
    }

    #initUI() {
        let tilesDiv = document.createElement('div');
        tilesDiv.setAttribute('id', 'tilesDiv');

        this.#tileMap.getTileMapArray().forEach((value, i) => {
            value.forEach((tile, j) => {
                tilesDiv.append(tile.getUI().getDiv());
            });
        });

        let _worldUI = document.createElement('div');
        _worldUI.setAttribute('id', 'worldDiv');
        _worldUI.classList.add('hidden');
        _worldUI.append(tilesDiv);

        let btn = document.createElement('button');
        btn.innerText = '맵 끄기';
        btn.setAttribute('id', 'closeWorld');
        btn.addEventListener('click', () => {
            this.toggleWorldDiv();
        });
        _worldUI.append(btn);

        this.#worldUI = _worldUI;
    }

    getUI() {
        return this.#worldUI;
    }

    getTileMap() {
        return this.#tileMap;
    }

    getTemp() {
        return this.#temp;
    }

    toggleWorldDiv() {
        this.#worldUI.classList.toggle('hidden');
    }

    getBiome(pos) {
        return this.#tileMap.getTile(pos).getBiome();
    }

    getEntity(pos) {
        return this.#tileMap.getTile(pos).getEntity();
    }

    setBiome(pos, biome) {
        this.#tileMap.getTile(pos).setBiome(biome);
    }

    setEntity(pos, entity) {
        this.#tileMap.getTile(pos).setEntity(entity);
    }

    increaseTemp() {
        this.#temp.modifyTemp(World.increseTempDelta);
    }

    decreaseTemp() {
        this.#temp.modifyTemp(-World.decreaseTempDelta);
    }

    // isMovable(pos) {
    //     if (this.#tileMapArray[pos[0]][pos[1]]) return true;
    //     return false;
    // }

    
}


class Temperature {
    #temp;

    constructor(initialTemp) {
        this.#temp = initialTemp;
    }

    getTemp() {
        return this.#temp;
    }

    modifyTemp(delta) {
        this.#temp += delta;
    }

    isEnd() {
        if (this.#temp <= 0 || this.#temp >= 6) {
            return true;
        } else {
            return false;
        }
    }
}