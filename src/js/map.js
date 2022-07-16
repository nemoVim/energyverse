class map {
    constructor(size) {
        this.size = size;
        this.#setMap();
        this.#setMove();
    }

    #setMap() {
        this.map = new Array(2 * size - 1);
        for (let i = 0; i < size - 1; i++) {
            this.map.at(i) = new Array(size + i);
            this.map.at(-i) = new Array(size + i);
        }
        this.map[size] = new Array(2 * size - 1);
    }

    #setMove() {
        this.#moveList = new Array(6);

        this.#moveList[0] = (pos) => {
            let i, j = pos;
            if (this.check(i-1, j)) {
                return [i-1, j];
            }
            return false;
        }

        this.#moveList[1] = (pos) => {
            let i, j = pos;
            if (this.check(i, j+1)) {
                return [i, j+1];
            }
            return false;
        }

        this.#moveList[2] = (pos) => {
            let i, j = pos;
            if (this.check(i+1, j)) {
                return [i+1, j];
            }
            return false;
        }

        this.#moveList[3] = (pos) => {
            let i, j = pos;
            if (this.check(i+1, j-1)) {
                return [i+1, j-1];
            }
            return false;
        }

        this.#moveList[4] = (pos) => {
            let i, j = pos;
            if (this.check(i, j-1)) {
                return [i, j-1];
            }
            return false;
        }

        this.#moveList[5] = (pos) => {
            let i, j = pos;
            if (this.check(i-1, j-1)) {
                return [i-1, j-1];
            }
            return false;
        }

    }

    check(i, j) {
        if (this.map[i][j]) return true;
        return false;
    }

    #move(num, pos, i) {
        let newPos;
        if(newPos = this.#moveList.at(i-num)(pos)) return newPos;
        return false;
    }

    topRight(num, pos) {
        return this.#move(num, pos, 0);
    }

    right(num, pos) {
        return this.#move(num, pos, 1);
    }

    bottomRight(num, pos) {
        return this.#move(num, pos, 2);
    }

    bottomLeft(num, pos) {
        return this.#move(num, pos, 3);
    }

    left(num, pos) {
        return this.#move(num, pos, 4);
    }

    topLeft(num, pos) {
        return this.#move(num, pos, 5);
    }
}
