import { Utils } from './utils.mjs';
import { Biomes } from './biomes.mjs';

export class TileMap {
    #tileMapArray;
    #mapSize;

    constructor(_mapSize, biomeIndex, biomeList) {
        this.#mapSize = _mapSize;
        this.#tileMapArray = Utils.makeMapArray(_mapSize);
        this.#initTileMapArray(biomeIndex, biomeList);
    }

    setTile(pos, tile) {
        this.#tileMapArray[pos[0]][pos[1]] = tile;
    }

    getTile(pos) {
        return this.#tileMapArray[pos[0]][pos[1]];
    }

    getTileMapArray() {
        return this.#tileMapArray;
    }

    #initTile(pos, biomeType, biomeIndex) {
        let biome;
        if (biomeType.length === 1) {
            biome = new Biomes[biomeIndex[biomeType[0]]](pos);
        } else {
            biome = new Biomes[biomeIndex[biomeType[0]]](pos, biomeType[1]);
        }

        this.setTile(pos, new Tile(pos, biome, null, this.#mapSize));
    }

    #initTileMapArray(biomeIndex, biomeList) {
        for (let i in this.#tileMapArray) {
            i = Number(i);
            for (let j = 0; j < this.#tileMapArray[i].length; j++) {
                let pos = [i, j];

                if (i < this.#mapSize) {
                    let biomeType = biomeList[i][j];
                    this.#initTile(pos, biomeType, biomeIndex);
                } else {
                    let biomeType =
                        biomeList[this.#mapSize * 2 - i - 2][
                            this.#tileMapArray[i].length - j - 1
                        ];
                    this.#initTile(pos, biomeType, biomeIndex);
                }
            }
        }
    }
}

class Tile {
    #pos;
    #biome;
    #entity;
    #UI;

    constructor(_pos, _biome, _entity, mapSize) {
        this.#pos = _pos;
        this.#biome = _biome;
        this.#entity = _entity;
        this.#UI = new TileUI(_pos, _biome, _entity, mapSize);
    }

    getPos() {
        return this.#pos;
    }

    getBiome() {
        return this.#biome;
    }

    setBiome(_biome) {
        this.#biome = _biome;
        this.#UI.refresh(this.#biome, this.#entity);
    }

    getEntity() {
        return this.#entity;
    }

    setEntity(_entity) {
        this.#entity = _entity;
        this.#UI.refresh(this.#biome, this.#entity);
    }

    getUI() {
        return this.#UI;
    }
}

class TileUI {
    static width = 2.6;
    static top = (4.5 / 5) * TileUI.width;
    static left = (2.7 / 5) * TileUI.width;

    #div;
    #pos;
    #biome;
    #entity;

    constructor(_pos, _biome, _entity, mapSize) {
        this.#initTileUI(_pos, mapSize);
        this.refresh(_biome, _entity);

        this.#pos = pos;
        this.#biome = _biome;
        this.#entity = _entity;
    }

    #initTileUI(pos, mapSize) {
        let i = pos[0];
        let j = pos[1];

        let _div = document.createElement('div');
        _div.setAttribute('id', 'tile_' + i + '_' + j);
        _div.classList.add('tileDiv');
        _div.style.top = (i - (mapSize - 1) - 1) * TileUI.top + 'rem';

        if (i < mapSize) {
            _div.style.left = (-(i + mapSize) + j * 2) * TileUI.left + 'rem';
        } else {
            _div.style.left =
                (-(mapSize * 3 - i - 2) + j * 2) * TileUI.left + 'rem';
        }

        this.#div = _div;
    }

    getDiv() {
        return this.#div;
    }

    refresh(_biome, _entity) {
        this.#div.innerHTML = '';
        this.#refreshBiome(_biome);
        this.#refreshEntity(_entity);
    }

    #refreshBiome(biome) {
        let biomeImg = Utils.getImgElement(biome.getType());
        biomeImg.classList.add('biomeImg');

        this.#div.append(biomeImg);
    }

    #refreshEntity(entity) {
        if (entity === null) return;

        let entityImg = Utils.getImgElement(entity.getType());
        entityImg.classList.add('entityImg');

        this.#div.append(entityImg);
    }

    setClickFunction(func) {
        this.#div.addEventListener('click', () => {
            func(this.#pos, this.#biome, this.#entity);
        });
    }
}
