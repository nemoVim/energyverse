export class Tilemap {
    static createCubemap(size) {
        const len = 2 * size - 1;
        const cubemap = Array.from({ length: len }, () =>
            Array.from({ length: len }, () =>
                Array.from({ length: len }, () => null)
            )
        );
        return cubemap;
    }

    static rotateClock(pos) {
        return [-pos[1], -pos[2], -pos[0]];
    }

    static directionList = [
        [0, -1, 1],
        [1, -1, 0],
        [1, 0, -1],
        [0, 1, -1],
        [-1, 1, 0],
        [-1, 0, 1],
    ];

    static move(_pos, direction, distance) {
        let pos = [_pos[0], _pos[1], _pos[2]];
        pos[0] += this.directionList[direction][0] * distance;
        pos[1] += this.directionList[direction][1] * distance;
        pos[2] += this.directionList[direction][2] * distance;
        return pos;
    }

    static ring(_pos, radius) {
        let pos = [_pos[0], _pos[1], _pos[2]];
        const posList = [];
        pos = this.move(pos, 4, radius);
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < radius; j++) {
                posList.push([pos[0], pos[1], pos[2]]);
                pos = this.move(pos, i, 1);
            }
        }
        return posList;
    }

    #cubemap;
    #size;

    constructor(size) {
        this.#size = size;
        this.#cubemap = Tilemap.createCubemap(size);
    }

    getTile(pos) {
        return this.#cubemap[pos[0] + this.#size - 1][pos[1] + this.#size - 1][
            pos[2] + this.#size - 1
        ];
    }

    setTile(pos, tile) {
        this.#cubemap[pos[0] + this.#size - 1][pos[1] + this.#size - 1][
            pos[2] + this.#size - 1
        ] = tile;
    }

    get cubemap() {
        return this.#cubemap;
    }
}
